"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


import SentimentChart from "@/components/dashboard/SentimentChart";
import ThemeChart from "@/components/dashboard/ThemeChart";
import LogoutButton from "@/components/LogoutButton";

type DashboardData = {
  totalFeedback: number;
  pendingCount: number;
  activeThemes: number;

  sentimentCounts: {
    positive: number;
    negative: number;
    neutral: number;
    pending: number;
  };

  themeCounts: Record<string, number>;

  recentFeedback: {
    id: string;
    content: string;
    channel: string | null;
    sentiment: string | null;
    theme: string | null;
  }[];
};

export default function DashboardPage() {
  const router = useRouter();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const [exporting, setExporting] = useState(false);

  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [selectedSentiment, setSelectedSentiment] = useState("ALL");
  const [selectedTheme, setSelectedTheme] = useState("ALL");
  const [selectedChannel, setSelectedChannel] = useState("ALL");

  // ✅ FIXED: AI hooks INSIDE component
  const [aiSummary, setAiSummary] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [showAISummary, setShowAISummary] = useState(true);

  const filteredFeedback = data?.recentFeedback.filter((item) => {
    const sentimentMatch =
      selectedSentiment === "ALL" ||
      item.sentiment === selectedSentiment;

    const themeMatch =
      selectedTheme === "ALL" ||
      item.theme === selectedTheme;

    const channelMatch =
      selectedChannel === "ALL" ||
      item.channel === selectedChannel;

    return sentimentMatch && themeMatch && channelMatch;
  });
  // Authentication
  useEffect(() => {
    const user = localStorage.getItem("loopUser");

    if (!user) {
      router.push("/login");
    }
  }, [router]);

  // Dashboard data + real-time updates
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/dashboard");

        if (!res.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const json = await res.json();

        setData({
          totalFeedback: json.totalFeedback ?? 0,
          pendingCount: json.pendingCount ?? 0,
          activeThemes: json.activeThemes ?? 0,

          sentimentCounts:
            json.sentimentCounts ?? {
              positive: 0,
              negative: 0,
              neutral: 0,
              pending: 0,
            },

          themeCounts: json.themeCounts ?? {},

          recentFeedback: json.recentFeedback ?? [],
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    const eventSource = new EventSource("/api/live");

    eventSource.onmessage = () => {
      fetchData();
    };

    eventSource.onerror = () => {
      console.error("SSE connection lost");
    };

    return () => {
      eventSource.close();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-blue-500" />

        <p className="text-gray-400">
          Loading dashboard analytics...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-full items-center justify-center text-red-400">
        Failed to load dashboard
      </div>
    );
  }

  async function exportCSV() {
  try {
    setExporting(true);
    setNotification(null);

    const res = await fetch("/api/export");

    if (!res.ok) {
      throw new Error("Export failed");
    }

    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "feedback-export.csv";

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

    setNotification({
      type: "success",
      message: "✅ Export completed successfully.",
    });

    setTimeout(() => {
      setNotification(null);
    }, 5000);
  } catch (error) {
    console.error(error);

    setNotification({
      type: "error",
      message: "❌ Export failed.",
    });
  } finally {
    setExporting(false);
  }
}
async function generateAISummary() {
  try {
    setLoadingAI(true);

    const res = await fetch("/api/ai-summary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  feedbacks: data?.recentFeedback || [],
  mode: "structured_insight",
}),
    });

    const json = await res.json();

    setAiSummary(json.summary);
  } catch (error) {
    console.error(error);
  } finally {
    setLoadingAI(false);
  }
}
  return (
    <div className="space-y-10">
{notification && (
  <div
    className={`
      fixed
      right-6
      top-6
      z-50
      rounded-2xl
      border
      px-6
      py-4
      backdrop-blur-xl
      shadow-2xl
      transition-all
      ${
        notification.type === "success"
          ? "border-green-500/20 bg-green-500/10 text-green-300"
          : "border-red-500/20 bg-red-500/10 text-red-300"
      }
    `}
  >
    {notification.message}
  </div>
)}

     
      {/* HEADER */}
<section>
  <h1 className="text-4xl font-bold tracking-tight">
    Dashboard
  </h1>

  <p className="mt-2 text-gray-400">
    Monitor customer sentiment, themes, and feedback activity in real time.
  </p>

  <button
  onClick={generateAISummary}
  className="rounded-2xl bg-purple-600 px-5 py-3 text-sm font-medium hover:bg-purple-500"
>
  {loadingAI ? "Generating..." : "Generate AI Summary"}
</button>
{aiSummary && showAISummary && (
  <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
    
    <div className="mb-4 flex items-center justify-between">
      
      <h2 className="text-xl font-semibold">
        AI Insights
      </h2>

      <button
        onClick={() => setShowAISummary(false)}
        className="rounded-lg border border-white/10 bg-black/20 px-3 py-1 text-xs text-gray-300 hover:bg-white/10"
      >
        Close
      </button>

    </div>

    <div className="space-y-4 text-gray-300 leading-7">
      {aiSummary.split("\n").map((line, i) => (
        <p key={i}>{line}</p>
      ))}
    </div>
{aiSummary && !showAISummary && (
  <button
    onClick={() => setShowAISummary(true)}
    className="rounded-2xl border border-white/10 bg-white/5 px-5 py-2 text-sm text-gray-300 hover:bg-white/10"
  >
    Show AI Insights
  </button>
)}
{!aiSummary && !loadingAI && (
  <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-gray-400">
    No AI insights generated yet. Click &quot;Generate AI Summary&quot; to analyze feedback.
  </div>
)}
  </section>
)}

  <div className="mt-6 flex items-center justify-between">

    <div className="flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />

        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
      </span>

      <span className="text-xs text-green-300">
        Live updates enabled
      </span>
    </div>
<button
  onClick={exportCSV}
  disabled={exporting}
  className="
    rounded-2xl
    bg-blue-600
    px-5
    py-3
    text-sm
    font-medium
    transition
    hover:bg-blue-500
    disabled:cursor-not-allowed
    disabled:opacity-50
  "
>
  {exporting
    ? "Exporting..."
    : "Export CSV"}
</button>

  </div>

</section>

{/* FILTERS */}
{/* FILTERS */}
<section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

  <div className="mb-6">
    <h2 className="text-2xl font-semibold">
      Filter Feedback
    </h2>

    <p className="mt-1 text-sm text-gray-400">
      Filter recent feedback by sentiment, theme, and channel.
    </p>
  </div>

  <div className="grid gap-4 md:grid-cols-3">

    {/* Sentiment */}
    <select
      value={selectedSentiment}
      onChange={(e) => setSelectedSentiment(e.target.value)}
      className="
        h-14
        w-full
        rounded-2xl
        border border-white/10
        bg-black/20
        px-5
        text-white
        outline-none
        transition
        focus:border-blue-500
        focus:ring-2
        focus:ring-blue-500/20
      "
    >
      <option className="bg-slate-900 text-white" value="ALL">
        All Sentiments
      </option>
      <option className="bg-slate-900 text-white" value="POSITIVE">
        Positive
      </option>
      <option className="bg-slate-900 text-white" value="NEGATIVE">
        Negative
      </option>
      <option className="bg-slate-900 text-white" value="NEUTRAL">
        Neutral
      </option>
      <option className="bg-slate-900 text-white" value="PENDING">
        Pending
      </option>
    </select>

    {/* Theme */}
    <select
      value={selectedTheme}
      onChange={(e) => setSelectedTheme(e.target.value)}
      className="
        h-14
        w-full
        rounded-2xl
        border border-white/10
        bg-black/20
        px-5
        text-white
        outline-none
        transition
        focus:border-purple-500
        focus:ring-2
        focus:ring-purple-500/20
      "
    >
      <option className="bg-slate-900 text-white" value="ALL">
        All Themes
      </option>

      {Object.keys(data.themeCounts)
        .sort()
        .map((theme) => (
          <option
            key={theme}
            value={theme}
            className="bg-slate-900 text-white"
          >
            {theme}
          </option>
        ))}
    </select>

    {/* Channel */}
    <select
      value={selectedChannel}
      onChange={(e) => setSelectedChannel(e.target.value)}
      className="
        h-14
        w-full
        rounded-2xl
        border border-white/10
        bg-black/20
        px-5
        text-white
        outline-none
        transition
        focus:border-green-500
        focus:ring-2
        focus:ring-green-500/20
      "
    >
      <option className="bg-slate-900 text-white" value="ALL">
        All Channels
      </option>
      <option className="bg-slate-900 text-white" value="web">
        Web
      </option>
      <option className="bg-slate-900 text-white" value="mobile">
        Mobile Application
      </option>
      <option className="bg-slate-900 text-white" value="email">
        Email
      </option>
      <option className="bg-slate-900 text-white" value="support">
        Support Ticket
      </option>
      <option className="bg-slate-900 text-white" value="social">
        Social Media
      </option>
    </select>

  </div>

</section>
      {/* METRICS */}
      <section className="grid gap-6 md:grid-cols-3">

        <div className="group overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 backdrop-blur-xl transition hover:-translate-y-1 hover:border-blue-500/30">
          <p className="text-sm text-gray-400">
            Total Feedback
          </p>

          <h2 className="mt-4 text-5xl font-bold">
            {data.totalFeedback}
          </h2>

          <div className="mt-6 h-1 overflow-hidden rounded-full bg-white/5">
            <div className="h-full w-[75%] bg-blue-500/60" />
          </div>

          <p className="mt-3 text-xs text-blue-300">
            Continuously updating
          </p>
        </div>

        <div className="group overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 backdrop-blur-xl transition hover:-translate-y-1 hover:border-yellow-500/30">
          <p className="text-sm text-gray-400">
            Pending Analysis
          </p>

          <h2 className="mt-4 text-5xl font-bold">
            {data.pendingCount}
          </h2>

          <div className="mt-6 h-1 overflow-hidden rounded-full bg-white/5">
            <div className="h-full w-[45%] bg-yellow-500/60" />
          </div>

          <p className="mt-3 text-xs text-yellow-300">
            Needs attention
          </p>
        </div>

        <div className="group overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 backdrop-blur-xl transition hover:-translate-y-1 hover:border-purple-500/30">
          <p className="text-sm text-gray-400">
            Active Themes
          </p>

          <h2 className="mt-4 text-5xl font-bold">
            {data.activeThemes}
          </h2>

          <div className="mt-6 h-1 overflow-hidden rounded-full bg-white/5">
            <div className="h-full w-[60%] bg-purple-500/60" />
          </div>

          <p className="mt-3 text-xs text-purple-300">
            Stable classification
          </p>
        </div>

      </section>

      {/* PREMIUM CHARTS */}
      <section className="grid gap-6 lg:grid-cols-2">
<SentimentChart
  sentimentCounts={data.sentimentCounts}
/>
<ThemeChart
  themeCounts={data.themeCounts}
/>

      </section>

      {/* RECENT FEEDBACK */}
      <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

        <div className="mb-8 flex items-center justify-between">

          <div>
            <h2 className="text-2xl font-semibold">
              Recent Feedback
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Latest customer responses collected by the platform.
            </p>
          </div>

          <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs text-blue-300">
            Real-Time Stream
          </span>

        </div>

        <div className="space-y-4">

          {filteredFeedback && filteredFeedback.length > 0 ? (
  filteredFeedback.map((item) => (
              <div
                key={item.id}
                className="group rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:border-white/20 hover:bg-white/5"
              >

                <p className="leading-7 text-gray-100">
                  {item.content}
                </p>

                <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-400">

                  <span className="rounded-full border border-white/10 px-3 py-1">
                    {item.channel ?? "Unknown"}
                  </span>

                  <span className="rounded-full border border-white/10 px-3 py-1">
                    {item.sentiment ?? "PENDING"}
                  </span>

                  <span className="rounded-full border border-white/10 px-3 py-1">
                    {item.theme ?? "Unclassified"}
                  </span>

                </div>

              </div>
            ))
          ) : (
            <p className="text-gray-400">
              No feedback available yet.
            </p>
          )}

        </div>

      </section>

    </div>
  );
}