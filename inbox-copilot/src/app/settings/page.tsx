"use client";
import { useState } from "react";

export default function SettingsPage() {
  const [writeScope, setWriteScope] = useState(false);
  const [autoLabel, setAutoLabel] = useState(false);
  const [tone, setTone] = useState("friendly");
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <div className="mt-6 grid gap-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={writeScope} onChange={(e) => setWriteScope(e.target.checked)} />
          Allow draft insertion (Gmail modify scope)
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={autoLabel} onChange={(e) => setAutoLabel(e.target.checked)} />
          Auto-label incoming threads
        </label>
        <div>
          <label className="block text-sm">Default tone</label>
          <select value={tone} onChange={(e) => setTone(e.target.value)} className="mt-1 rounded border p-2">
            <option value="friendly">Friendly</option>
            <option value="direct">Direct</option>
            <option value="polite">Polite</option>
            <option value="firm">Firm</option>
          </select>
        </div>
      </div>
    </main>
  );
}


