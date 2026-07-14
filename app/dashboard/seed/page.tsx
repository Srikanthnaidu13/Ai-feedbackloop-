"use client";

import { useState } from "react";

export default function SeedPage() {
  const [count, setCount] = useState(50);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function generateFeedback() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/seed-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          count,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setMessage(
        `Successfully generated ${data.imported} demo feedback records.`
      );
    } catch {
      setMessage("Failed to generate demo feedback.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">

      <section>
        <h1 className="text-4xl font-bold">
          Demo Feedback Generator
        </h1>

        <p className="mt-2 text-gray-400">
          Generate realistic customer feedback to populate
          Project LOOP for testing dashboards, AI features,
          filters and analytics.
        </p>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-8">

        <label className="block text-lg font-medium">
          Number of feedback records
        </label>

        <select
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="mt-4 w-64 rounded-xl bg-slate-900 border border-white/10 p-3"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>

        <button
          onClick={generateFeedback}
          disabled={loading}
          className="mt-8 rounded-2xl bg-blue-600 px-8 py-3 font-medium hover:bg-blue-500 disabled:opacity-50"
        >
          {loading
            ? "Generating..."
            : "Generate Demo Feedback"}
        </button>

        {message && (
          <div className="mt-6 rounded-2xl border border-green-500/20 bg-green-500/10 p-5 text-green-300">
            {message}
          </div>
        )}

      </section>

    </div>
  );
}