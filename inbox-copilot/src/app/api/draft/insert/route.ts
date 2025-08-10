import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getGmailClient } from "@/lib/gmail";

const DRY_RUN = process.env.NODE_ENV !== "production";

export async function POST(req: NextRequest) {
  const session = await requireAuth();
  const accessToken = (session as any).access_token as string | undefined;
  if (!accessToken) return Response.json({ error: "No access token" }, { status: 401 });

  const { threadId, draft } = await req.json();
  if (!threadId || !draft) return Response.json({ error: "Invalid" }, { status: 400 });

  if (DRY_RUN) return Response.json({ inserted: false, dryRun: true });

  const gmail = getGmailClient(accessToken);
  const raw =
    [
      `Subject: ${draft.subject}\r\n`,
      "MIME-Version: 1.0\r\n",
      'Content-Type: text/plain; charset="UTF-8"\r\n',
      `\r\n${draft.body_markdown}`,
    ].join("");
  const base64Raw = Buffer.from(raw).toString("base64").replace(/\+/g, "-").replace(/\//g, "_");
  await gmail.users.drafts.create({
    userId: "me",
    requestBody: {
      message: {
        threadId,
        raw: base64Raw,
      },
    },
  });
  return Response.json({ inserted: true });
}


