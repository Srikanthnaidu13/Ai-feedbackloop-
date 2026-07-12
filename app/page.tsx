"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type DashboardStats = {
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
};

export default function Home() {
  const [username, setUsername] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<DashboardStats>({
    totalFeedback: 0,
    pendingCount: 0,
    activeThemes: 0,

    sentimentCounts: {
      positive: 0,
      negative: 0,
      neutral: 0,
      pending: 0,
    },

    themeCounts: {},
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("loopUser");

    if (storedUser) {
      queueMicrotask(() => {
        setUsername(storedUser);
      });
    }
  }, []);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch("/api/dashboard?page=1&limit=5");

        if (!res.ok) return;

        const json = await res.json();

        setStats({
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
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();

    const interval = setInterval(loadDashboard, 30000);

    return () => clearInterval(interval);
  }, []);

  function logout() {
    localStorage.removeItem("loopUser");
    window.location.replace("/login");
  }

  const topTheme =
    Object.entries(stats.themeCounts).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] ?? "No Data";

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-white">

      {/* Background */}

      <div className="fixed inset-0 -z-10">

        <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[160px]" />

        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[160px]" />

      </div>

      {/* ===================== NAVBAR ===================== */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">

          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-blue-500 hover:text-blue-400"
          >
            Project LOOP
          </Link>

          <div className="hidden items-center gap-6 md:flex">

            <nav className="flex items-center gap-8 text-sm text-gray-300">

              <a
                href="#overview"
                className="transition hover:text-white"
              >
                Overview
              </a>

              <a
                href="#features"
                className="transition hover:text-white"
              >
                Features
              </a>

              <a
                href="#analytics"
                className="transition hover:text-white"
              >
                Analytics
              </a>

              <a
                href="#technology"
                className="transition hover:text-white"
              >
                Technology
              </a>

            </nav>

          </div>

          <div className="flex items-center gap-4">

            {username ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-xl border border-white/10 px-5 py-2.5 text-sm hover:bg-white/10"
                >
                  Dashboard
                </Link>

                <div className="relative">

                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 transition hover:bg-white/10"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-semibold uppercase">
                      {username.charAt(0)}
                    </div>

                    <div className="text-left">
                      <p className="text-sm font-medium">
                        {username}
                      </p>

                      <p className="text-xs text-green-400">
                        Online
                      </p>
                    </div>

                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 top-14 w-56 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">

                      <Link
                        href="/dashboard"
                        className="block px-4 py-3 text-sm hover:bg-white/5"
                      >
                        Dashboard
                      </Link>

                      <button
                        onClick={logout}
                        className="w-full border-t border-white/10 px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10"
                      >
                        Logout
                      </button>

                    </div>
                  )}

                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium transition hover:bg-blue-500"
              >
                Sign In
              </Link>
            )}

          </div>

        </div>

      </header>

      {/* ===================== HERO ===================== */}

      <section
        id="overview"
        className="mx-auto flex min-h-[85vh] max-w-7xl items-center px-8"
      >

        <div className="max-w-4xl">

          <div className="mb-6 inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 text-sm text-blue-300">

            AI-Powered Customer Feedback Intelligence Platform

          </div>

          <h1 className="text-6xl font-bold leading-tight tracking-tight">

            Transform Customer Feedback

            <br />

            Into Actionable Business Intelligence

          </h1>

          <p className="mt-8 max-w-3xl text-lg leading-9 text-gray-400">

            Project LOOP centralizes customer feedback from multiple
            channels, automatically classifies sentiment and themes,
            identifies emerging trends, detects spikes in customer
            issues, and enables organizations to make faster,
            data-driven business decisions using artificial
            intelligence.

          </p>

          <div className="mt-12 flex flex-wrap gap-5">

            <Link
              href="/dashboard"
              className="rounded-2xl bg-blue-600 px-8 py-4 font-medium transition hover:bg-blue-500"
            >
              Open Dashboard
            </Link>

            <a
              href="#analytics"
              className="rounded-2xl border border-white/10 px-8 py-4 font-medium transition hover:bg-white/5"
            >
              View Live Analytics
            </a>

          </div>

        </div>

      </section>
            {/* ===================== LIVE ANALYTICS ===================== */}

      <section
        id="analytics"
        className="mx-auto max-w-7xl px-8 pb-28"
      >

        <div className="mb-12">

          <span className="rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm text-green-300">
            Live Dashboard Metrics
          </span>

          <h2 className="mt-6 text-4xl font-bold">
            Real-Time Customer Intelligence
          </h2>

          <p className="mt-4 max-w-3xl text-gray-400">
            These analytics are fetched directly from the Project LOOP
            dashboard API and automatically refresh every few seconds.
          </p>

        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          {/* Total Feedback */}

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

            <p className="text-sm text-gray-400">
              Total Feedback
            </p>

            <h3 className="mt-5 text-5xl font-bold">

              {loading ? "--" : stats.totalFeedback}

            </h3>

            <div className="mt-8 h-2 rounded-full bg-white/10">

              <div className="h-2 w-full rounded-full bg-blue-500" />

            </div>

            <p className="mt-5 text-sm text-blue-300">
              Customer responses collected
            </p>

          </div>

          {/* Pending */}

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

            <p className="text-sm text-gray-400">
              Pending Analysis
            </p>

            <h3 className="mt-5 text-5xl font-bold">

              {loading ? "--" : stats.pendingCount}

            </h3>

            <div className="mt-8 h-2 rounded-full bg-white/10">

              <div className="h-2 w-2/3 rounded-full bg-yellow-500" />

            </div>

            <p className="mt-5 text-sm text-yellow-300">
              Awaiting AI classification
            </p>

          </div>

          {/* Themes */}

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

            <p className="text-sm text-gray-400">
              Active Themes
            </p>

            <h3 className="mt-5 text-5xl font-bold">

              {loading ? "--" : stats.activeThemes}

            </h3>

            <div className="mt-8 h-2 rounded-full bg-white/10">

              <div className="h-2 w-3/4 rounded-full bg-purple-500" />

            </div>

            <p className="mt-5 text-sm text-purple-300">
              Automatically discovered topics
            </p>

          </div>

          {/* Top Theme */}

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

            <p className="text-sm text-gray-400">
              Top Theme
            </p>

            <h3 className="mt-5 text-3xl font-bold break-words">

              {loading ? "--" : topTheme}

            </h3>

            <div className="mt-8 h-2 rounded-full bg-white/10">

              <div className="h-2 w-full rounded-full bg-green-500" />

            </div>

            <p className="mt-5 text-sm text-green-300">
              Most discussed topic
            </p>

          </div>

        </div>

      </section>

      {/* ===================== SENTIMENT OVERVIEW ===================== */}

      <section className="mx-auto max-w-7xl px-8 pb-28">

        <div className="mb-12">

          <h2 className="text-4xl font-bold">
            Sentiment Distribution
          </h2>

          <p className="mt-4 max-w-3xl text-gray-400">

            Project LOOP automatically classifies every customer
            response into Positive, Neutral, Negative or Pending
            categories using AI-powered sentiment analysis.

          </p>

        </div>

        <div className="grid gap-6 lg:grid-cols-4">

          <div className="rounded-3xl border border-green-500/20 bg-green-500/5 p-8">

            <p className="text-sm text-green-300">
              Positive
            </p>

            <h2 className="mt-4 text-5xl font-bold">

              {loading
                ? "--"
                : stats.sentimentCounts.positive}

            </h2>

          </div>

          <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8">

            <p className="text-sm text-red-300">
              Negative
            </p>

            <h2 className="mt-4 text-5xl font-bold">

              {loading
                ? "--"
                : stats.sentimentCounts.negative}

            </h2>

          </div>

          <div className="rounded-3xl border border-blue-500/20 bg-blue-500/5 p-8">

            <p className="text-sm text-blue-300">
              Neutral
            </p>

            <h2 className="mt-4 text-5xl font-bold">

              {loading
                ? "--"
                : stats.sentimentCounts.neutral}

            </h2>

          </div>

          <div className="rounded-3xl border border-yellow-500/20 bg-yellow-500/5 p-8">

            <p className="text-sm text-yellow-300">
              Pending
            </p>

            <h2 className="mt-4 text-5xl font-bold">

              {loading
                ? "--"
                : stats.sentimentCounts.pending}

            </h2>

          </div>

        </div>

      </section>

      {/* ===================== PLATFORM CAPABILITIES ===================== */}

      <section
        id="features"
        className="mx-auto max-w-7xl px-8 pb-32"
      >

        <div className="mb-14">

          <h2 className="text-4xl font-bold">
            Platform Capabilities
          </h2>

          <p className="mt-4 max-w-3xl text-gray-400">

            Project LOOP combines artificial intelligence,
            analytics, automation and real-time monitoring into a
            unified customer feedback intelligence platform.

          </p>

        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {/* Feature 1 */}

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:border-blue-500/30 hover:bg-white/10">

            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/20 text-2xl">
              📊
            </div>

            <h3 className="text-xl font-semibold">
              Real-Time Analytics
            </h3>

            <p className="mt-4 leading-7 text-gray-400">
              Monitor incoming customer feedback instantly with live
              dashboard updates, trend analysis and operational metrics.
            </p>

          </div>

          {/* Feature 2 */}

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:border-purple-500/30 hover:bg-white/10">

            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-600/20 text-2xl">
              🤖
            </div>

            <h3 className="text-xl font-semibold">
              AI Classification
            </h3>

            <p className="mt-4 leading-7 text-gray-400">
              Automatically classify customer feedback into sentiment
              categories and business themes using artificial intelligence.
            </p>

          </div>

          {/* Feature 3 */}

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:border-green-500/30 hover:bg-white/10">

            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600/20 text-2xl">
              💬
            </div>

            <h3 className="text-xl font-semibold">
              Ask LOOP
            </h3>

            <p className="mt-4 leading-7 text-gray-400">
              Query customer feedback using natural language and receive
              AI-generated business insights grounded in real data.
            </p>

          </div>

          {/* Feature 4 */}

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:border-cyan-500/30 hover:bg-white/10">

            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-600/20 text-2xl">
              📈
            </div>

            <h3 className="text-xl font-semibold">
              Theme Trends
            </h3>

            <p className="mt-4 leading-7 text-gray-400">
              Discover emerging discussion topics, recurring issues,
              and evolving customer concerns over time.
            </p>

          </div>

          {/* Feature 5 */}

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:border-yellow-500/30 hover:bg-white/10">

            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-600/20 text-2xl">
              ⚡
            </div>

            <h3 className="text-xl font-semibold">
              Spike Detection
            </h3>

            <p className="mt-4 leading-7 text-gray-400">
              Detect sudden increases in customer complaints before
              they become larger business issues.
            </p>

          </div>

          {/* Feature 6 */}

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:border-red-500/30 hover:bg-white/10">

            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600/20 text-2xl">
              📄
            </div>

            <h3 className="text-xl font-semibold">
              Executive Reporting
            </h3>

            <p className="mt-4 leading-7 text-gray-400">
              Generate Voice of Customer reports and executive summaries
              suitable for management review and strategic planning.
            </p>

          </div>

        </div>

      </section>

      {/* ===================== SYSTEM ARCHITECTURE ===================== */}

      <section
        id="technology"
        className="mx-auto max-w-7xl px-8 pb-28"
      >

        <div className="mb-12">

          <h2 className="text-4xl font-bold">
            Platform Architecture
          </h2>

          <p className="mt-4 max-w-3xl text-gray-400">

            Project LOOP is designed as a modern full-stack SaaS
            application using scalable technologies.

          </p>

        </div>

        <div className="grid gap-8 lg:grid-cols-2">

          <div className="rounded-3xl border border-white/10 bg-white/5 p-10">

            <h3 className="mb-8 text-2xl font-semibold">
              Technology Stack
            </h3>

            <div className="space-y-5">

              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-gray-400">Frontend</span>
                <span>Next.js 16 + TypeScript</span>
              </div>

              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-gray-400">Styling</span>
                <span>Tailwind CSS</span>
              </div>

              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-gray-400">Backend</span>
                <span>Next.js API Routes</span>
              </div>

              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-gray-400">Database</span>
                <span>PostgreSQL + Prisma ORM</span>
              </div>

              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-gray-400">Authentication</span>
                <span>Session Based Login</span>
              </div>

              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-gray-400">Artificial Intelligence</span>
                <span>Ask LOOP Assistant</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Deployment</span>
                <span>Vercel</span>
              </div>

            </div>

          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-10">

            <h3 className="mb-8 text-2xl font-semibold">
              Processing Workflow
            </h3>

            <div className="space-y-6">

              <div className="rounded-2xl bg-slate-900 p-5">
                Customer Feedback Collection
              </div>

              <div className="text-center text-blue-400">
                ↓
              </div>

              <div className="rounded-2xl bg-slate-900 p-5">
                AI Sentiment & Theme Classification
              </div>

              <div className="text-center text-blue-400">
                ↓
              </div>

              <div className="rounded-2xl bg-slate-900 p-5">
                Dashboard Analytics & Trend Detection
              </div>

              <div className="text-center text-blue-400">
                ↓
              </div>

              <div className="rounded-2xl bg-slate-900 p-5">
                Voice of Customer Reports
              </div>

              <div className="text-center text-blue-400">
                ↓
              </div>

              <div className="rounded-2xl bg-slate-900 p-5">
                Business Decision Support
              </div>

            </div>

          </div>

        </div>

      </section>
            {/* ===================== WHY PROJECT LOOP ===================== */}

      <section className="mx-auto max-w-7xl px-8 pb-28">

        <div className="rounded-[36px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/30 p-12">

          <div className="grid gap-12 lg:grid-cols-2">

            <div>

              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
                Business Value
              </span>

              <h2 className="mt-8 text-5xl font-bold leading-tight">

                Turn Customer Feedback
                <br />
                Into Better Decisions

              </h2>

              <p className="mt-8 text-lg leading-9 text-gray-400">

                Project LOOP enables organizations to continuously
                monitor customer experiences, discover emerging issues,
                understand customer sentiment, and prioritize business
                improvements using data-driven insights.

              </p>

              <div className="mt-10 flex flex-wrap gap-4">

                <Link
                  href="/dashboard"
                  className="rounded-2xl bg-blue-600 px-8 py-4 font-medium transition hover:bg-blue-500"
                >
                  Launch Dashboard
                </Link>

                <Link
                  href="/login"
                  className="rounded-2xl border border-white/10 px-8 py-4 font-medium transition hover:bg-white/5"
                >
                  Sign In
                </Link>

              </div>

            </div>

            <div className="space-y-6">

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

                <h3 className="text-xl font-semibold">
                  Customer Feedback Management
                </h3>

                <p className="mt-3 leading-7 text-gray-400">
                  Collect, organize and manage customer feedback
                  from multiple communication channels.
                </p>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

                <h3 className="text-xl font-semibold">
                  AI Assisted Analysis
                </h3>

                <p className="mt-3 leading-7 text-gray-400">
                  Automatically classify sentiment,
                  identify business themes and
                  generate actionable insights.
                </p>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

                <h3 className="text-xl font-semibold">
                  Executive Reporting
                </h3>

                <p className="mt-3 leading-7 text-gray-400">
                  Produce Voice of Customer reports,
                  trend analysis and management
                  summaries from live feedback.
                </p>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

                <h3 className="text-xl font-semibold">
                  Real-Time Monitoring
                </h3>

                <p className="mt-3 leading-7 text-gray-400">
                  Live dashboard updates,
                  spike detection,
                  trend monitoring
                  and operational visibility.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ===================== FINAL CTA ===================== */}

      <section className="mx-auto max-w-7xl px-8 pb-24">

        <div className="rounded-[36px] border border-blue-500/20 bg-blue-600/10 p-12 text-center">

          <h2 className="text-4xl font-bold">

            Experience Project LOOP

          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-300">

            Explore real-time customer intelligence,
            AI-powered analytics,
            Voice of Customer reporting,
            trend detection,
            and interactive dashboards
            built for modern organizations.

          </p>

          <div className="mt-10 flex justify-center gap-5">

            <Link
              href="/dashboard"
              className="rounded-2xl bg-blue-600 px-8 py-4 font-medium transition hover:bg-blue-500"
            >
              Open Dashboard
            </Link>

            {!username && (
              <Link
                href="/login"
                className="rounded-2xl border border-white/10 px-8 py-4 font-medium transition hover:bg-white/5"
              >
                Login
              </Link>
            )}

          </div>

        </div>

      </section>

      {/* ===================== FOOTER ===================== */}

      <footer className="border-t border-white/10">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-8 py-10 md:flex-row">

          <div>

            <h3 className="text-2xl font-bold text-blue-500">
              Project LOOP
            </h3>

            <p className="mt-2 text-sm text-gray-500">

              AI-Powered Customer Feedback Intelligence Platform

            </p>

          </div>

          <div className="flex gap-8 text-sm text-gray-400">

            <a href="#overview" className="hover:text-white">
              Overview
            </a>

            <a href="#features" className="hover:text-white">
              Features
            </a>

            <a href="#analytics" className="hover:text-white">
              Analytics
            </a>

            <a href="#technology" className="hover:text-white">
              Technology
            </a>

          </div>

          <div className="text-right text-sm text-gray-500">

            <p>

              © {new Date().getFullYear()} Project LOOP

            </p>

            <p className="mt-2">

              Built with Next.js • Prisma • PostgreSQL • TypeScript • Tailwind CSS

            </p>

          </div>

        </div>

      </footer>

    </main>
  );
}