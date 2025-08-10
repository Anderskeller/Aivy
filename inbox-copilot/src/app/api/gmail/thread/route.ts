import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getGmailClient } from "@/lib/gmail";

export async function GET(req: NextRequest) {
  const session = await requireAuth();
  const accessToken = (session as any).access_token as string | undefined;
  if (!accessToken) return Response.json({ error: "No access token" }, { status: 401 });
  const gmail = getGmailClient(accessToken);
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  const thread = await gmail.users.threads.get({ userId: "me", id });
  return Response.json(thread.data);
}


