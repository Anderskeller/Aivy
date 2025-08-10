"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = { params: { id: string } };

export default function ThreadPage({ params }: Props) {
  const [draft, setDraft] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [inserted, setInserted] = useState<string | null>(null);

  const draftWithCopilot = async () => {
    setLoading(true);
    setInserted(null);
    try {
      const res = await fetch("/api/draft/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          thread: {
            subject: `Thread ${params.id}`,
            lastMessages: [],
          },
          options: { tone: "friendly", format: "paragraph" },
        }),
      });
      setDraft(await res.json());
    } finally {
      setLoading(false);
    }
  };

  const insertAsGmailDraft = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/draft/insert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadId: params.id, draft }),
      });
      const json = await res.json();
      setInserted(json.inserted ? "Draft inserted" : "Insert blocked (dev mode)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-2xl font-semibold">Thread {params.id}</h1>
      <div className="mt-4 flex items-center gap-3">
        <button onClick={draftWithCopilot} disabled={loading} className="rounded bg-black px-3 py-2 text-white disabled:opacity-60">Draft with Copilot</button>
        <button onClick={insertAsGmailDraft} disabled={loading || !draft} className="rounded border px-3 py-2 disabled:opacity-60">Insert as Gmail draft</button>
      </div>
      {inserted && <div className="mt-3 text-sm text-slate-600">{inserted}</div>}
      <div className="mt-6 grid gap-4">
        <div className="rounded border bg-white p-4">Thread context...</div>
        <div className="rounded border bg-white p-4">
          {!draft ? (
            <div className="text-sm text-slate-500">No draft yet.</div>
          ) : (
            <div className="prose max-w-none">
              <h2 className="mb-2 text-lg font-medium">{draft.subject}</h2>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{draft.body_markdown}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}


