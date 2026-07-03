"use client";

import Link from "next/link";

export default function Sidebar() {
  function logout() {
    localStorage.removeItem("loopUser");
    window.location.href = "/login";
  }

  return (
    <aside className="w-72 border-r border-white/10 bg-slate-950 p-6">

      <div className="mb-10">
        <h1 className="text-2xl font-bold text-blue-500">
          Project LOOP
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          AI Customer Intelligence Platform
        </p>
      </div>

      <div className="space-y-3">

        <p className="mb-2 text-xs uppercase tracking-wider text-gray-500">
          Analytics
        </p>

        <Link
          href="/dashboard"
          className="block rounded-xl px-4 py-3 hover:bg-white/5"
        >
          Dashboard
        </Link>

        <Link
          href="/insights"
          className="block rounded-xl px-4 py-3 hover:bg-white/5"
        >
          Insights
        </Link>

        <Link
          href="/test"
          className="block rounded-xl px-4 py-3 hover:bg-white/5"
        >
          Test Data
        </Link>

        <Link
          href="/feedback"
          className="block rounded-xl px-4 py-3 hover:bg-white/5"
        >
          Feedback
        </Link>

      </div>

      <div className="mt-12 border-t border-white/10 pt-6">

        <button
          onClick={logout}
          className="w-full rounded-xl px-4 py-3 text-left text-red-400 hover:bg-red-500/10"
        >
          Logout
        </button>

      </div>

    </aside>
  );
}