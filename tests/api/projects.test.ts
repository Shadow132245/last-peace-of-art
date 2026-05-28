import { describe, it, expect } from "vitest";

type ProjectInput = {
  title: string;
  description: string;
  tags?: string[];
};

function validateProjectInput(data: unknown): { valid: boolean; error?: string } {
  const input = data as ProjectInput;

  if (!input.title || typeof input.title !== "string" || input.title.trim().length === 0) {
    return { valid: false, error: "Title is required" };
  }

  if (!input.description || typeof input.description !== "string" || input.description.trim().length === 0) {
    return { valid: false, error: "Description is required" };
  }

  return { valid: true };
}

describe("POST /api/projects — validation", () => {
  it("rejects empty title", () => {
    const result = validateProjectInput({ title: "", description: "desc" });
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Title is required");
  });

  it("rejects empty description", () => {
    const result = validateProjectInput({ title: "Title", description: "" });
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Description is required");
  });

  it("accepts valid input", () => {
    const result = validateProjectInput({ title: "My Project", description: "A great project" });
    expect(result.valid).toBe(true);
  });

  it("handles missing fields", () => {
    const result = validateProjectInput({} as ProjectInput);
    expect(result.valid).toBe(false);
  });
});
