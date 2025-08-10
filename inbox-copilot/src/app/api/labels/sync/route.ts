import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const KEYWORDS: Record<string, string[]> = {
  Sales: ["pricing", "quote", "demo", "purchase"],
  Admin: ["invoice", "receipt", "policy", "terms"],
  Social: ["catch up", "coffee", "congrats"],
  Scheduling: ["schedule", "meeting", "availability"],
  Receipts: ["payment", "charged", "subscription"],
  Personal: ["family", "dinner", "holiday"],
};

export async function POST(req: NextRequest) {
  await requireAuth();
  const messages = await prisma.message.findMany({ take: 500 });
  let updated = 0;
  for (const m of messages) {
    const text = `${m.subject ?? ""}\n${m.cleanedBody}`.toLowerCase();
    let label: string | null = null;
    for (const [cat, words] of Object.entries(KEYWORDS)) {
      if (words.some((w) => text.includes(w))) {
        label = cat;
        break;
      }
    }
    if (label && label !== m.label) {
      await prisma.message.update({ where: { id: m.id }, data: { label } });
      updated++;
    }
  }
  return Response.json({ updated });
}


