import { vi } from "vitest";

// Mock Next.js modules
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

// Global test environment setup
Object.defineProperty(global, "FormData", {
  value: class FormData {
    private data: Map<string, string | string[]> = new Map();

    append(key: string, value: string) {
      const existing = this.data.get(key);
      if (existing) {
        if (Array.isArray(existing)) {
          existing.push(value);
        } else {
          this.data.set(key, [existing, value]);
        }
      } else {
        this.data.set(key, value);
      }
    }

    get(key: string): string | null {
      const value = this.data.get(key);
      if (Array.isArray(value)) {
        return value[0] || null;
      }
      return value || null;
    }

    getAll(key: string): string[] {
      const value = this.data.get(key);
      if (Array.isArray(value)) {
        return value;
      }
      return value ? [value] : [];
    }
  },
});
