import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const supabase = createServerComponentClient({ cookies });

export async function insertPoll(pollData: any) {
  const { data, error } = await supabase
    .from("polls")
    .insert(pollData)
    .select()
    .single();
  return { data, error };
}

export async function insertPollOptions(pollOptions: any[]) {
  const { error } = await supabase.from("poll_options").insert(pollOptions);
  return { error };
}

export async function findPollsWithOutcomes() {
  const { data: polls, error: pollsError } = await supabase
    .from("polls")
    .select(
      `
      *,
      poll_options (
        *,
        votes (
          count
        )
      )
    `
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (pollsError) {
    return { polls: [], error: pollsError.message };
  }

  // Flatten the structure to include vote counts directly in options
  const pollsWithVoteCounts = polls?.map((poll) => ({
    ...poll,
    poll_options: poll.poll_options.map((option: any) => ({
      ...option,
      votes: option.votes?.[0]?.count || 0, // Extract count or default to 0
    })),
  }));

  return { polls: pollsWithVoteCounts || [], error: null };
}

export async function findPollById(pollId: string) {
  const { data: poll, error } = await supabase
    .from("polls")
    .select(
      `
      *,
      poll_options (
        *,
        votes (
          count
        )
      )
    `
    )
    .eq("id", pollId)
    .single();

  if (error) {
    return { poll: null, error: error.message };
  }

  if (!poll) {
    return { poll: null, error: "Poll not found" };
  }

  const pollWithVoteCounts = {
    ...poll,
    poll_options: poll.poll_options.map((option: any) => ({
      ...option,
      votes: option.votes?.[0]?.count || 0,
    })),
  };

  return { poll: pollWithVoteCounts, error: null };
}

export async function recordVote(pollOptionId: string, userId: string) {
  const { data, error } = await supabase.from("votes").insert([
    {
      poll_option_id: pollOptionId,
      user_id: userId,
    },
  ]);
  return { data, error };
}
