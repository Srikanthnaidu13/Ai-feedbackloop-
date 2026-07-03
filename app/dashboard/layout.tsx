"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("loopUser");

    if (!user) {
      router.replace("/login");
    }
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("loopUser");
    router.replace("/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      {/* SIDEBAR */}
      <aside className="sticky top-0 flex h-screen w-72 flex-col border-r border-white/10 bg-black/20 backdrop-blur-xl">

        <div className="border-b border-white/10 px-8 py-7">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-blue-500"
          >
            Project LOOP
          </Link>

          <p className="mt-2 text-xs text-gray-500">
            AI Customer Intelligence Platform
          </p>
        </div>

        <nav className="flex flex-1 flex-col px-5 py-8">

          <div className="mb-3 px-4 text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
            Analytics
          </div>

          <Link
            href="/dashboard"
            className="group mb-2 rounded-2xl px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
          >
            Dashboard
          </Link>

          <Link
            href="/dashboard/insights"
            className="group mb-2 rounded-2xl px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
          >
            Insights
          </Link>

          <Link
            href="/dashboard/test"
            className="group mb-2 rounded-2xl px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
          >
            Test Data
          </Link>

          <Link
            href="/dashboard/feedback"
            className="group mb-2 rounded-2xl px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
          >
            Feedback
          </Link>

          <div className="mt-auto border-t border-white/10 pt-6">
            <button
              onClick={handleLogout}
              className="w-full rounded-2xl px-4 py-3 text-left text-sm text-gray-400 hover:bg-red-500/10 hover:text-red-300"
            >
              Logout
            </button>
          </div>

        </nav>

      </aside>

      <main className="flex-1 overflow-y-auto p-10">
        {children}
      </main>

    </div>
  );
}