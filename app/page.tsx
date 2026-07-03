"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
  const storedUser = localStorage.getItem("loopUser");

  if (storedUser) {
    queueMicrotask(() => {
      setUsername(storedUser);
    });
  }
}, []);

  function logout() {
  localStorage.removeItem("loopUser");
  window.location.replace("/login");
}

  return (
    <main className="min-h-screen bg-slate-950 text-white overflow-x-hidden">

      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-20 top-20 h-96 w-96 rounded-full bg-blue-600/10 blur-[140px]" />
        <div className="absolute right-20 bottom-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-[140px]" />
      </div>

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">

          {/* LOGO */}
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-blue-500 hover:text-blue-400"
          >
            Project LOOP
          </Link>

          {/* NAV LINKS */}
         <div className="hidden md:flex items-center gap-6">

  <nav className="flex items-center gap-8 text-sm text-gray-300">

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
      href="#about"
      className="transition hover:text-white"
    >
      About
    </a>

  </nav>

  

</div>

          {/* AUTH */}
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
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-semibold uppercase">
                      {username?.charAt(0) || "U"}
                    </div>

                    <div className="text-left">
                      <p className="text-sm font-medium">{username}</p>
                      <p className="text-xs text-green-400">Online</p>
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
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium hover:bg-blue-500"
              >
                Sign In
              </Link>
            )}

          </div>

        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-8 py-28">

        <div className="max-w-4xl">

          <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            AI Customer Intelligence Platform
          </span>

          <h1 className="mt-8 text-6xl font-bold leading-tight">
            Transform Customer Feedback
            <br />
            Into Actionable Intelligence
          </h1>

          <p className="mt-8 max-w-2xl text-lg text-gray-400">
            Project LOOP combines artificial intelligence, sentiment analysis,
            and real-time dashboards to help organizations understand customer voices at scale.
          </p>

          {/* FIXED CTA */}
          <div className="mt-12 flex gap-4">

            <Link
              href="/dashboard"
              className="rounded-2xl bg-blue-600 px-8 py-4 font-medium hover:bg-blue-500"
            >
              Get Started
            </Link>

          </div>

        </div>

      </section>

      {/* METRICS */}
      <section
        id="analytics"
        className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-8 pb-24 md:grid-cols-3"
      >

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <p className="text-sm text-gray-400">Feedback Processed</p>
          <h2 className="mt-3 text-4xl font-bold">50K+</h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <p className="text-sm text-gray-400">Customer Satisfaction</p>
          <h2 className="mt-3 text-4xl font-bold">94%</h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <p className="text-sm text-gray-400">Platform Uptime</p>
          <h2 className="mt-3 text-4xl font-bold">99.9%</h2>
        </div>

      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-7xl px-8 pb-28">

        <div className="mb-14">
          <h2 className="text-4xl font-bold">
            Built for Modern Customer Intelligence
          </h2>
          <p className="mt-4 text-gray-400">
            Everything your organization needs to understand customer sentiment.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 hover:bg-white/10">
            <h3 className="text-xl font-semibold">Real-Time Analytics</h3>
            <p className="mt-4 text-sm text-gray-400">
              Monitor customer sentiment as feedback arrives.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 hover:bg-white/10">
            <h3 className="text-xl font-semibold">AI Theme Detection</h3>
            <p className="mt-4 text-sm text-gray-400">
              Automatically classify feedback into categories.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 hover:bg-white/10">
            <h3 className="text-xl font-semibold">Executive Reporting</h3>
            <p className="mt-4 text-sm text-gray-400">
              Generate insights for decision-making teams.
            </p>
          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer
        id="about"
        className="border-t border-white/10 py-8 text-center text-sm text-gray-500"
      >
        © {new Date().getFullYear()} Project LOOP. AI-Powered Customer Intelligence Platform.
      </footer>

    </main>
  );
}