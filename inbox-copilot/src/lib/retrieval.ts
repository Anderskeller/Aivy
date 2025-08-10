import { prisma } from "@/lib/prisma";

function toVectorLiteral(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}

export type StyleExample = {
  id: string;
  subject: string | null;
  cleanedBody: string;
};

export async function topKSimilarByEmbedding(params: {
  userEmail: string;
  embedding: number[];
  k?: number;
}): Promise<StyleExample[]> {
  const { userEmail, embedding } = params;
  const k = params.k ?? 8;
  const vec = toVectorLiteral(embedding);
  type Row = { id: string; subject: string | null; cleanedBody: string };
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT m.id, m.subject, m."cleanedBody"
    FROM "Message" m
    JOIN "User" u ON u.id = m."userId"
    WHERE u.email = $1
    ORDER BY m.embedding <=> $2::vector
    LIMIT ${k}
  `,
    userEmail,
    vec,
  );
  return rows.map((r) => ({ id: r.id, subject: r.subject ?? null, cleanedBody: r.cleanedBody }));
}


