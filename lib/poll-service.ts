import {
  insertPoll,
  insertPollOptions,
  findPollsWithOutcomes,
  findPollById,
  recordVote,
} from "./poll-repository";
import { createPollSchema } from "./schemas";
import { z } from "zod";

// --- Validation ---

function validateFormData(
  formData: FormData,
  schema: z.ZodObject<any, any>
) {
  const data = Object.fromEntries(formData.entries());
  return schema.safeParse(data);
}

// --- Poll Creation ---

export async function createPollTransaction(
  validatedData: z.infer<typeof createPollSchema>,
  userId: string
) {
  const { title, description, options, expiresAt } = validatedData;

  const pollData = {
    title,
    description: description || null,
    created_by: userId,
    expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
    is_active: true,
  };

  const { data: poll, error: pollError } = await insertPoll(pollData);

  if (pollError) {
    return { success: false, error: pollError.message };
  }

  const pollOptions = options.map((opt: any) => ({
    poll_id: poll.id,
    text: opt.value,
  }));

  const { error: optionsError } = await insertPollOptions(pollOptions);

  if (optionsError) {
    // TODO: Implement rollback for poll creation
    return { success: false, error: optionsError.message };
  }

  return { success: true, poll };
}

// --- Data Fetching ---

export async function getPollsWithVoteCounts() {
  return await findPollsWithOutcomes();
}

export async function getPollDetails(pollId: string) {
  return await findPollById(pollId);
}

// --- Voting ---

export async function castVote(pollOptionId: string, userId: string) {
  // TODO: Add logic to check if the user has already voted
  return await recordVote(pollOptionId, userId);
}
