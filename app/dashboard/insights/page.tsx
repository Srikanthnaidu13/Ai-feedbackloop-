"use client";

import { useEffect, useState } from "react";

type InsightData = {
  sentimentCounts: {
    positive: number;
    negative: number;
    neutral: number;
    pending: number;
  };

  themeCounts: Record<string, number>;

  totalFeedback: number;

  recentFeedback: {
    id: string;
    content: string;
    sentiment: string | null;
    theme: string | null;
  }[];

  aiSummary?: string;
  topTheme?: string;
  dominantSentiment?: string;
  insights?: string[];
};

export default function InsightsPage() {
  const [data, setData] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInsights() {
      try {
        const res = await fetch("/api/insights");

        if (!res.ok) throw new Error("Failed to fetch insights");

        const json = await res.json();

        setData({
          sentimentCounts: json.sentimentCounts ?? {
            positive: 0,
            negative: 0,
            neutral: 0,
            pending: 0,
          },
          themeCounts: json.themeCounts ?? {},
          totalFeedback: json.totalFeedback ?? 0,
          recentFeedback: json.recentFeedback ?? [],
          aiSummary: json.aiSummary ?? "No AI summary available.",
          topTheme: json.topTheme ?? "None",
          dominantSentiment: json.dominantSentiment ?? "Neutral",
          insights: json.insights ?? [],
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchInsights();

    const eventSource = new EventSource("/api/live");

    eventSource.onmessage = () => fetchInsights();

    eventSource.onerror = () => {
      console.error("Insights SSE disconnected");
    };

    

    return () => {
      eventSource.close();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-[#070A12]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-blue-500" />
        <p className="text-gray-400">Loading AI insights...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-full items-center justify-center bg-[#070A12] text-red-400">
        Failed to load insights
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-10 bg-[#070A12] text-white p-6">

      {/* HEADER */}
      <section>
        <h1 className="text-4xl font-bold tracking-tight">
          AI Insights
        </h1>

        <p className="mt-2 text-gray-400">
          Real-time understanding of customer sentiment and AI-driven analysis.
        </p>
      </section>

      {/* AI SUMMARY */}
      <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

        <h2 className="text-xl font-semibold">
          AI Summary
        </h2>

        <p className="mt-4 text-gray-300 leading-7">
          {data.aiSummary}
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs text-gray-500 uppercase">Dominant Sentiment</p>
            <p className="mt-2 text-lg text-blue-300 font-semibold">
              {data.dominantSentiment}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs text-gray-500 uppercase">Top Theme</p>
            <p className="mt-2 text-lg text-purple-300 font-semibold">
              {data.topTheme}
            </p>
          </div>

        </div>

        <div className="mt-6 space-y-3">
          {(data.insights ?? []).length > 0 ? (
            data.insights!.map((insight, i) => (
              <div
                key={i}
                className="rounded-2xl border border-blue-500/10 bg-black/20 p-4 text-sm text-gray-300"
              >
                {insight}
              </div>
            ))
          ) : (
            <p className="text-gray-400">No insights generated yet.</p>
          )}
        </div>

      </section>

      {/* SENTIMENT CARDS */}
      <section className="grid gap-6 md:grid-cols-4">

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-gray-400 text-sm">Positive</p>
          <h2 className="mt-2 text-3xl font-bold text-green-400">
            {data.sentimentCounts.positive}
          </h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-gray-400 text-sm">Negative</p>
          <h2 className="mt-2 text-3xl font-bold text-red-400">
            {data.sentimentCounts.negative}
          </h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-gray-400 text-sm">Neutral</p>
          <h2 className="mt-2 text-3xl font-bold text-gray-200">
            {data.sentimentCounts.neutral}
          </h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-gray-400 text-sm">Pending</p>
          <h2 className="mt-2 text-3xl font-bold text-yellow-400">
            {data.sentimentCounts.pending}
          </h2>
        </div>

      </section>

      {/* THEME DISTRIBUTION */}
      <section className="rounded-3xl border border-white/10 bg-white/5 p-8">

        <h2 className="text-xl font-semibold mb-6">
          Theme Distribution
        </h2>

        <div className="space-y-4">

          {Object.entries(data.themeCounts).length > 0 ? (
            Object.entries(data.themeCounts).map(([theme, count]) => (
              <div key={theme}>
                <div className="flex justify-between text-sm text-gray-300">
                  <span>{theme}</span>
                  <span>{count}</span>
                </div>

                <div className="h-2 w-full bg-white/5 rounded-full mt-2">
                  <div
                    className="h-full bg-blue-500/60 rounded-full"
                    style={{ width: `${Math.min(100, count * 10)}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No theme data available</p>
          )}

        </div>

      </section>

      {/* RECENT */}
      <section className="rounded-3xl border border-white/10 bg-white/5 p-8">

        <h2 className="text-xl font-semibold mb-6">
          Recent AI Classifications
        </h2>

        <div className="space-y-4">

          {(data.recentFeedback ?? []).length > 0 ? (
            data.recentFeedback.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-white/10 bg-black/20 p-5 hover:bg-white/5 transition"
              >
                <p className="text-gray-100">{item.content}</p>

                <div className="mt-3 flex gap-3 text-xs text-gray-400">
                  <span className="border border-white/10 px-3 py-1 rounded-full">
                    {item.sentiment}
                  </span>

                  <span className="border border-white/10 px-3 py-1 rounded-full">
                    {item.theme}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No recent feedback available</p>
          )}

        </div>

      </section>

    </div>
  );
}