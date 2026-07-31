import { describe, expect, it } from "bun:test";
import { slugify } from "../lib/slug.ts";

describe("slugify", () => {
  it("lowercases and replaces spaces with hyphens", () => {
    expect(slugify("Hello World Test")).toBe("hello-world-test");
  });

  it("strips special characters", () => {
    expect(slugify("What's AI?")).toBe("what-s-ai");
  });

  it("returns thread for empty result", () => {
    expect(slugify("!!!")).toBe("thread");
  });

  it("truncates long strings", () => {
    const long = "a".repeat(100);
    expect(slugify(long).length).toBeLessThanOrEqual(60);
  });
});
