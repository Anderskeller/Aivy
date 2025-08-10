import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { buildDraftingSystemPrompt, buildDraftPrompt, openai } from "@/lib/ai";
import { embedText } from "@/lib/embeddings";
import { topKSimilarByEmbedding } from "@/lib/retrieval";
import { checkRateLimit } from "@/lib/rate-limit";
import { generateSchedulingSlots } from "@/lib/scheduling";

export async function POST(req: NextRequest) {
  await requireAuth();
  const body = await req.json();
  // Minimal schema check for MVP
  if (!body?.thread || !body?.thread?.subject) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const { thread, options } = body;
  const email = (await (await import("next-auth")).auth())?.user?.email ?? "";
  if (!checkRateLimit(`draft:${email}`)) {
    return Response.json({ error: "Rate limit" }, { status: 429 });
  }

  // Build embedding of the latest message text for retrieval
  const lastText = (thread.lastMessages?.slice(-1)[0]?.text as string) || thread.subject;
  const queryEmbedding = await embedText(lastText);
  // For retrieval, we need the user's email (from session), but requireAuth already ensured it
  // Using an empty email here is safe-guarded by DB constraints, but the UI path ensures auth
  const examples = await topKSimilarByEmbedding({ userEmail: email, embedding: queryEmbedding, k: 8 });

  const system = buildDraftingSystemPrompt();
  const userPrompt = buildDraftPrompt({ thread, options, examples });

  // OpenAI Responses API (compatible with 4.1 / 4o-mini)
  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: [
      { role: "system", content: system },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.5,
  } as any);

  // Try to extract the JSON from the response
  const text = (response as any).output_text ?? "";
  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = {
      subject: thread.subject,
      body_markdown: text || "",
      confidence: 0.5,
      reasons: ["fallback"],
      tone: options?.tone ?? "friendly",
    };
  }
  if (options?.includeScheduling) {
    const slots = generateSchedulingSlots({ timezone: "UTC", title: thread.subject });
    const scheduleText = [
      "Here are a few time options (click to create a Calendar hold):",
      ...slots.map((s) => `- ${s.label}: ${s.url}`),
    ].join("\n");
    parsed.body_markdown = `${parsed.body_markdown}\n\n${scheduleText}`;
  }
  return Response.json(parsed);
}


