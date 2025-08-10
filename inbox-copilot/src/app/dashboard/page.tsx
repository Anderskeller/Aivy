"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const importSent = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/gmail/import", { method: "POST" });
      const json = await res.json();
      setResult(`Imported ${json.imported ?? 0} messages`);
    } catch (e) {
      setResult("Import failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-sm text-slate-600">Connect and import your recent Sent Mail to learn your style.</p>
      <div className="mt-6 grid gap-4">
        <button onClick={importSent} disabled={loading} className="inline-flex items-center gap-2 rounded bg-black px-4 py-2 text-white disabled:opacity-60">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />} Import Sent (300)
        </button>
        {result && <div className="rounded border bg-white p-4 text-sm">{result}</div>}
        <div className="rounded border bg-white p-4">Recent drafts will appear here.</div>
      </div>
    </main>
  );
}


