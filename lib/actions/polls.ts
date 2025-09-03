"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// Types for better type safety and performance
interface PollFormData {
  title: string;
  description: string | null;
  options: string[];
  expiresAt: string | null;
}

interface PollResult {
  success: boolean;
  poll?: any;
  error?: string;
}

// Extract and validate form data in one step
function extractAndValidateFormData(formData: FormData): {
  data?: PollFormData;
  error?: string;
} {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const options = formData.getAll("options") as string[];
  const expiresAt = formData.get("expiresAt") as string;

  // Early validation - fail fast
  if (!title?.trim()) {
    return { error: "Poll title is required" };
  }

  // Filter and validate options in one pass
  const validOptions = options.filter((opt) => opt?.trim());
  if (validOptions.length < 2) {
    return { error: "At least 2 poll options are required" };
  }

  return {
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      options: validOptions.map((opt) => opt.trim()),
      expiresAt: expiresAt || null,
    },
  };
}

// Optimized poll creation with transaction-like behavior
export async function createPoll(formData: FormData): Promise<PollResult> {
  try {
    // Initialize Supabase client once
    const supabase = createServerComponentClient({ cookies });

    // Fast validation - early return on failure
    const validation = extractAndValidateFormData(formData);
    if (validation.error) {
      return { success: false, error: validation.error };
    }

    const { title, description, options, expiresAt } = validation.data!;

    // TODO: Re-enable auth when authentication is set up
    const testUserId = "00000000-0000-0000-0000-000000000001";

    // Create poll with optimized data structure
    const pollData = {
      title,
      description,
      created_by: testUserId,
      expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
      is_active: true,
    };

    const { data: poll, error: pollError } = await supabase
      .from("polls")
      .insert(pollData)
      .select()
      .single();

    if (pollError) {
      return { success: false, error: pollError.message };
    }

    // Batch create poll options for better performance
    const pollOptions = options.map((text) => ({
      poll_id: poll.id,
      text,
      votes: 0,
    }));

    const { error: optionsError } = await supabase
      .from("poll_options")
      .insert(pollOptions);

    if (optionsError) {
      // TODO: In production, implement rollback of poll creation
      return { success: false, error: optionsError.message };
    }

    // Batch revalidation
    revalidatePath("/polls");
    revalidatePath("/dashboard");

    return { success: true, poll };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function getPolls() {
  try {
    const supabase = createServerComponentClient({ cookies });

    // First fetch all active polls
    const { data: polls, error: pollsError } = await supabase
      .from("polls")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (pollsError) {
      console.error("Error fetching polls:", pollsError);
      return { success: false, error: pollsError.message, polls: [] };
    }

    if (!polls || polls.length === 0) {
      return { success: true, polls: [] };
    }

    // Then fetch options for each poll
    const pollsWithOptions = await Promise.all(
      polls.map(async (poll) => {
        const { data: options, error: optionsError } = await supabase
          .from("poll_options")
          .select("*")
          .eq("poll_id", poll.id);

        if (optionsError) {
          console.error(
            `Error fetching options for poll ${poll.id}:`,
            optionsError
          );
          return { ...poll, options: [] };
        }

        return { ...poll, options: options || [] };
      })
    );

    return { success: true, polls: pollsWithOptions };
  } catch (error) {
    console.error("Unexpected error fetching polls:", error);
    return { success: false, error: "An unexpected error occurred", polls: [] };
  }
}
