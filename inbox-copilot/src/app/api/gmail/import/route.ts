import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getGmailClient } from "@/lib/gmail";
import { stripSignaturesAndQuotes } from "@/lib/clean";
import { embedText } from "@/lib/embeddings";
import { htmlToText } from "html-to-text";

export async function POST(req: NextRequest) {
  const session = await requireAuth();
  const accessToken = (session as any).access_token as string | undefined;
  if (!accessToken) return Response.json({ error: "No access token" }, { status: 401 });

  const gmail = getGmailClient(accessToken);
  let imported = 0;

  // List messages in Sent
  const listResp = await gmail.users.messages.list({
    userId: "me",
    labelIds: ["SENT"],
    maxResults: 300,
  });
  const messages = listResp.data.messages ?? [];

  for (const m of messages) {
    if (!m.id) continue;
    const existing = await prisma.message.findUnique({ where: { id: m.id } });
    if (existing) continue;
    const msg = await gmail.users.messages.get({ userId: "me", id: m.id, format: "full" });
    const payload = msg.data.payload;
    const headers = payload?.headers ?? [];
    const subject = headers.find((h) => h?.name?.toLowerCase() === "subject")?.value;
    const sentAtStr = headers.find((h) => h?.name?.toLowerCase() === "date")?.value;
    const sentAt = sentAtStr ? new Date(sentAtStr) : null;
    let bodyText = "";
    const getParts = (p: any): any[] => (p?.parts ? p.parts.flatMap(getParts) : [p]).filter(Boolean);
    const parts = getParts(payload);
    for (const part of parts) {
      const mime = part?.mimeType ?? "";
      const data = part?.body?.data;
      if (!data) continue;
      const buff = Buffer.from(data, "base64");
      const raw = buff.toString("utf-8");
      if (mime.includes("text/plain")) bodyText += raw + "\n";
      else if (mime.includes("text/html")) bodyText += htmlToText(raw) + "\n";
    }
    const cleaned = stripSignaturesAndQuotes(bodyText).slice(0, 8000);
    if (!cleaned) continue;
    const embedding = await embedText(cleaned);
    await prisma.message.create({
      data: {
        id: m.id,
        user: {
          connectOrCreate: {
            where: { email: session.user!.email! },
            create: { email: session.user!.email! },
          },
        },
        label: null,
        subject: subject ?? null,
        sentAt: sentAt ?? undefined,
        cleanedBody: cleaned,
      },
    });
    const vec = `[${embedding.join(',')}]`;
    await prisma.$executeRawUnsafe(
      'UPDATE "Message" SET embedding = $1::vector WHERE id = $2',
      vec,
      m.id,
    );
    imported++;
  }

  return Response.json({ imported });
}


