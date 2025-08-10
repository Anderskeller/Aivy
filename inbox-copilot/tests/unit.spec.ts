import { describe, it, expect } from "vitest";
import { stripSignaturesAndQuotes } from "@/lib/clean";
import { buildDraftPrompt } from "@/lib/ai";

describe("cleaner", () => {
  it("removes signature and quoted text", () => {
    const input = "Hello\n--\nSig here\nOn Tue wrote:\n> quoted";
    const out = stripSignaturesAndQuotes(input);
    expect(out).toBe("Hello");
  });
});

describe("prompt builder", () => {
  it("includes examples and thread context", () => {
    const p = buildDraftPrompt({
      thread: { subject: "Test", lastMessages: [{ from: "a", text: "b", date: "now" }] },
      options: { tone: "friendly", format: "paragraph" },
      examples: [{ subject: "Hi", cleanedBody: "Thanks!" }],
    });
    expect(p).toContain("Thread Subject: Test");
    expect(p).toContain("Style Examples");
    expect(p).toContain("Tone: friendly");
  });
});

