import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createPollAction,
  getPollsAction,
  getPollDetailsAction,
  submitVoteAction,
  FormState,
} from "./polls";
import { getAuthenticatedUser } from "@/lib/auth-utils";
import {
  createPollTransaction,
  getPollsWithVoteCounts,
  getPollDetails,
  castVote,
} from "@/lib/poll-service";
import { revalidatePath } from "next/cache";

vi.mock("@/lib/auth-utils", () => ({
  getAuthenticatedUser: vi.fn(),
}));


// Mock dependencies
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/poll-service", () => ({
  createPollTransaction: vi.fn(),
  getPollsWithVoteCounts: vi.fn(),
  getPollDetails: vi.fn(),
  castVote: vi.fn(),
}));

const initialState: FormState = {
  success: false,
  message: "",
};

describe("Poll Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createPollAction", () => {
    beforeEach(() => {
      (getAuthenticatedUser as vi.Mock).mockResolvedValue({ id: "user-1" });
    });

    it("should return an unauthorized error if the user is not logged in", async () => {
      (getAuthenticatedUser as vi.Mock).mockResolvedValue(null);
      const formData = new FormData();
      formData.append("title", "Favorite Language?");
      formData.append("options", "TypeScript");
      formData.append("options", "Python");

      const result = await createPollAction(initialState, formData);

      expect(result.success).toBe(false);
      expect(result.message).toContain("Unauthorized");
    });
    
    it("should create a poll successfully with valid data", async () => {
      const formData = new FormData();
      formData.append("title", "Favorite Language?");
      formData.append("options", "TypeScript");
      formData.append("options", "Python");

      const mockPoll = { id: "poll-1", title: "Favorite Language?" };
      const mockPoll = { id: "poll-1", title: "Favorite Language?" };
      (createPollTransaction as vi.Mock).mockResolvedValue({
        success: true,
        poll: mockPoll,
      });

      const result = await createPollAction(initialState, formData);
      console.log(result);

      expect(result.success).toBe(true);
      expect(result.message).toBe("Poll created successfully!");
      expect(result.pollId).toBe("poll-1");
      expect(revalidatePath).toHaveBeenCalledWith("/polls");
      expect(revalidatePath).toHaveBeenCalledWith("/dashboard");
    });

    it("should return a validation error for invalid data", async () => {
      const formData = new FormData();
      formData.append("title", ""); // Invalid title
      formData.append("options", "TypeScript");

      const result = await createPollAction(initialState, formData);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Validation failed.");
      expect(result.errors?.title).toBeDefined();
    });

    it("should handle errors from the poll service", async () => {
      const formData = new FormData();
      formData.append("title", "Test Poll");
      formData.append("options", "Option 1");
      formData.append("options", "Option 2");

      (createPollTransaction as vi.Mock).mockResolvedValue({
        success: false,
        error: "Database error",
      });

      const result = await createPollAction(initialState, formData);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Database error");
    });
  });

  describe("getPollsAction", () => {
    it("should fetch polls successfully", async () => {
      const mockPolls = [{ id: "poll-1", title: "Poll 1" }];
      (getPollsWithVoteCounts as vi.Mock).mockResolvedValue({
        polls: mockPolls,
        error: null,
      });

      const result = await getPollsAction();

      expect(result.polls).toEqual(mockPolls);
    });
  });

  describe("getPollDetailsAction", () => {
    it("should fetch poll details successfully", async () => {
      const mockPoll = { id: "poll-1", title: "Poll 1" };
      (getPollDetails as vi.Mock).mockResolvedValue({
        poll: mockPoll,
        error: null,
      });

      const result = await getPollDetailsAction("poll-1");

      expect(result.poll).toEqual(mockPoll);
    });
  });

  describe("submitVoteAction", () => {
    beforeEach(() => {
      (getAuthenticatedUser as vi.Mock).mockResolvedValue({ id: "user-1" });
    });

    it("should return an unauthorized error if the user is not logged in", async () => {
      (getAuthenticatedUser as vi.Mock).mockResolvedValue(null);
      const result = await submitVoteAction("poll-1", "option-1");

      expect(result.success).toBe(false);
      expect(result.message).toContain("Unauthorized");
    });

    it("should submit a vote successfully", async () => {
      (castVote as vi.Mock).mockResolvedValue({ error: null });

      const result = await submitVoteAction("poll-1", "option-1");

      expect(result.success).toBe(true);
      expect(result.message).toBe("Vote submitted successfully!");
      expect(revalidatePath).toHaveBeenCalledWith("/polls/poll-1");
    });

    it("should return an error if no option is selected", async () => {
      const result = await submitVoteAction("poll-1", "");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Please select an option to vote.");
    });

    it("should handle errors from the vote service", async () => {
      (castVote as vi.Mock).mockResolvedValue({
        error: { message: "Voting failed" },
      });

      const result = await submitVoteAction("poll-1", "option-1");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Voting failed");
    });
  });
});
