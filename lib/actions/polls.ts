"use server";

import { getAuthenticatedUser } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import {
  createPollTransaction,
  getPollsWithVoteCounts,
  getPollDetails,
  castVote,
} from "@/lib/poll-service";
import { createPollSchema } from "@/lib/schemas";
import { z } from "zod";

// --- Types ---

export type FormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  pollId?: string;
};

// --- Server Actions ---

export async function createPollAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return {
      success: false,
      message: "Unauthorized: You must be logged in to create a poll.",
    };
  }

  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    options: (formData.getAll("options") as string[]).map((o) => ({
      value: o,
    })),
    expiresAt: formData.get("expiresAt"),
  };

  const validationResult = createPollSchema.safeParse(rawData);

  if (!validationResult.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    const { success, poll, error } = await createPollTransaction(
      validationResult.data,
      user.id
    );

    if (!success) {
      return { success: false, message: error || "An unknown error occurred." };
    }

    revalidatePath("/polls");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Poll created successfully!",
      pollId: poll.id,
    };
  } catch (e) {
    const error = e as Error;
    return {
      success: false,
      message: error.message || "An unexpected error occurred.",
    };
  }
}

export async function getPollsAction() {
  return await getPollsWithVoteCounts();
}

export async function getPollDetailsAction(pollId: string) {
  return await getPollDetails(pollId);
}

export async function submitVoteAction(
  pollId: string,
  selectedOptionId: string
): Promise<FormState> {
  if (!selectedOptionId) {
    return { success: false, message: "Please select an option to vote." };
  }

  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return {
        success: false,
        message: "Unauthorized: You must be logged in to vote.",
      };
    }
    const { error } = await castVote(selectedOptionId, user.id);

    if (error) {
      return { success: false, message: error.message };
    }

    revalidatePath(`/polls/${pollId}`);
    return { success: true, message: "Vote submitted successfully!" };
  } catch (e) {
    const error = e as Error;
    return {
      success: false,
      message: error.message || "An unexpected error occurred.",
    };
  }
}
