import OpenAI from "openai";

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export function buildDraftingSystemPrompt() {
  return [
    "You are Inbox Copilot, drafting professional email replies that match the user’s voice.",
    "Requirements:",
    "• Never invent facts, numbers, or commitments not present in the thread.",
    "• Preserve names, dates, and quoted content.",
    "• Prefer concise replies (4–8 sentences) unless the user asks for detail.",
    "• Offer 1 clear CTA or 3 meeting time options if includeScheduling=true.",
    "• Use the style examples to mirror tone, greeting, sign-off, and typical phrasing.",
    "Output strictly as JSON: {subject, body_markdown, confidence, reasons[], tone}.",
  ].join("\n");
}

export function buildDraftPrompt(params: {
  thread: { subject: string; lastMessages: Array<{ from: string; text: string; date: string }> };
  options?: { tone?: string; format?: "paragraph" | "bullets"; includeScheduling?: boolean };
  examples: Array<{ subject: string | null; cleanedBody: string }>;
}) {
  const { thread, options, examples } = params;
  const tone = options?.tone ?? "friendly";
  const format = options?.format ?? "paragraph";
  const includeScheduling = options?.includeScheduling ?? false;

  const examplePairs = examples
    .slice(0, 8)
    .map((e, i) => `Example ${i + 1}\nSubject: ${e.subject ?? "(none)"}\nBody:\n${e.cleanedBody}`)
    .join("\n\n");

  const lastMessagesText = thread.lastMessages
    .slice(-5)
    .map((m) => `From: ${m.from} | Date: ${m.date}\n${m.text}`)
    .join("\n\n");

  const userInstructions = [
    `Tone: ${tone}`,
    `Format: ${format}`,
    `IncludeScheduling: ${includeScheduling}`,
  ].join("\n");

  return [
    `Thread Subject: ${thread.subject}`,
    `Thread Context:\n${lastMessagesText}`,
    ``,
    `Style Examples:\n${examplePairs}`,
    ``,
    `User Controls:\n${userInstructions}`,
  ].join("\n\n");
}


