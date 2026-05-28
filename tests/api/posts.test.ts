import { describe, it, expect } from "vitest";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
}

describe("slugify", () => {
  it("converts to lowercase", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("replaces special chars", () => {
    expect(slugify("My Post! @2024")).toBe("my-post-2024");
  });

  it("trims dashes", () => {
    expect(slugify("--hello--")).toBe("hello");
  });

  it("limits to 100 chars", () => {
    const long = "a".repeat(150);
    expect(slugify(long).length).toBeLessThanOrEqual(100);
  });
});
