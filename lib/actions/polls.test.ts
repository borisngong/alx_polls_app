import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPoll, getPolls } from "./polls";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";

// Mock dependencies
vi.mock("@supabase/auth-helpers-nextjs", () => ({
  createServerComponentClient: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(() =>
    Promise.resolve({
      get: vi.fn(),
      set: vi.fn(),
      delete: vi.fn(),
    })
  ),
}));

describe("Poll Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createPoll", () => {
    it("should create a poll successfully with valid data", async () => {
      const formData = new FormData();
      formData.append("title", "Favorite Programming Language?");
      formData.append(
        "description",
        "Choose your favorite programming language"
      );
      formData.append("options", "TypeScript");
      formData.append("options", "Python");
      formData.append("options", "JavaScript");

      const mockPollData = {
        id: "123",
        title: "Favorite Programming Language?",
        description: "Choose your favorite programming language",
        created_by: "00000000-0000-0000-0000-000000000001",
        expires_at: null,
        is_active: true,
      };

      // Create mock for poll creation chain
      const mockSupabase = {
        from: vi.fn(() => ({
          insert: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn().mockResolvedValueOnce({
                data: mockPollData,
                error: null,
              }),
            })),
          })),
        })),
      };

      // Create separate mock for options creation
      const mockOptionsInsert = {
        insert: vi.fn().mockResolvedValueOnce({ error: null }),
      };

      mockSupabase.from
        .mockReturnValueOnce(mockSupabase.from())
        .mockReturnValueOnce(mockOptionsInsert);

      (createServerComponentClient as ReturnType<typeof vi.fn>).mockReturnValue(
        mockSupabase
      );

      const result = await createPoll(formData);

      expect(result.success).toBe(true);
      expect(result.poll).toEqual(mockPollData);
      expect(revalidatePath).toHaveBeenCalledWith("/polls");
      expect(revalidatePath).toHaveBeenCalledWith("/dashboard");
    });

    it("should return an error if the poll title is missing", async () => {
      const formData = new FormData();
      formData.append("options", "Yes");
      formData.append("options", "No");

      const result = await createPoll(formData);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Poll title is required");
    });

    it("should return an error if there are fewer than 2 options", async () => {
      const formData = new FormData();
      formData.append("title", "Test Poll");
      formData.append("options", "Only One Option");

      const result = await createPoll(formData);

      expect(result.success).toBe(false);
      expect(result.error).toBe("At least 2 poll options are required");
    });

    it("should return an error if there are empty options", async () => {
      const formData = new FormData();
      formData.append("title", "Test Poll");
      formData.append("options", "Option 1");
      formData.append("options", "");

      const result = await createPoll(formData);

      expect(result.success).toBe(false);
      expect(result.error).toBe("At least 2 poll options are required");
    });

    it("should handle expires_at date correctly", async () => {
      const formData = new FormData();
      formData.append("title", "Timed Poll");
      formData.append("options", "Option 1");
      formData.append("options", "Option 2");
      formData.append("expiresAt", "2025-12-31T23:59:59");

      const mockPollData = {
        id: "456",
        title: "Timed Poll",
        expires_at: "2025-12-31T23:59:59.000Z",
      };

      // Create mock for poll creation chain
      const mockSupabase = {
        from: vi.fn(() => ({
          insert: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn().mockResolvedValueOnce({
                data: mockPollData,
                error: null,
              }),
            })),
          })),
        })),
      };

      // Create separate mock for options creation
      const mockOptionsInsert = {
        insert: vi.fn().mockResolvedValueOnce({ error: null }),
      };

      mockSupabase.from
        .mockReturnValueOnce(mockSupabase.from())
        .mockReturnValueOnce(mockOptionsInsert);

      (createServerComponentClient as ReturnType<typeof vi.fn>).mockReturnValue(
        mockSupabase
      );

      const result = await createPoll(formData);

      expect(result.success).toBe(true);
      expect(result.poll?.expires_at).toBe("2025-12-31T23:59:59.000Z");
    });
  });

  describe("getPolls", () => {
    it("should fetch polls with options successfully", async () => {
      const mockPolls = [
        {
          id: "1",
          title: "Poll 1",
          description: "First poll",
          is_active: true,
          created_at: "2025-01-01T00:00:00Z",
        },
      ];

      const mockOptions = [
        { id: "1", poll_id: "1", text: "Option A", votes: 5 },
        { id: "2", poll_id: "1", text: "Option B", votes: 3 },
      ];

      const mockSupabase = {
        from: vi
          .fn()
          .mockReturnValueOnce({
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                order: vi.fn().mockResolvedValueOnce({
                  data: mockPolls,
                  error: null,
                }),
              })),
            })),
          })
          .mockReturnValueOnce({
            select: vi.fn(() => ({
              eq: vi.fn().mockResolvedValueOnce({
                data: mockOptions,
                error: null,
              }),
            })),
          }),
      };

      (createServerComponentClient as ReturnType<typeof vi.fn>).mockReturnValue(
        mockSupabase
      );

      const result = await getPolls();

      expect(result.success).toBe(true);
      expect(result.polls).toHaveLength(1);
      expect(result.polls[0]).toEqual({
        ...mockPolls[0],
        options: mockOptions,
      });
    });

    it("should return empty array when no polls exist", async () => {
      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              order: vi.fn().mockResolvedValueOnce({
                data: [],
                error: null,
              }),
            })),
          })),
        })),
      };

      (createServerComponentClient as ReturnType<typeof vi.fn>).mockReturnValue(
        mockSupabase
      );

      const result = await getPolls();

      expect(result.success).toBe(true);
      expect(result.polls).toEqual([]);
    });

    it("should handle database errors gracefully", async () => {
      const mockError = { message: "Connection failed" };

      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              order: vi.fn().mockResolvedValueOnce({
                data: null,
                error: mockError,
              }),
            })),
          })),
        })),
      };

      (createServerComponentClient as ReturnType<typeof vi.fn>).mockReturnValue(
        mockSupabase
      );

      const result = await getPolls();

      expect(result.success).toBe(false);
      expect(result.error).toBe("Connection failed");
      expect(result.polls).toEqual([]);
    });
  });
});
