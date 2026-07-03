"use client";

import { useEffect, useState } from "react";

type Feedback = {
  id: string;
  content: string;
  channel: string;
  sentiment: string;
  theme: string;
};

export default function TestPage() {
  const [content, setContent] = useState("");
  const [channel, setChannel] = useState("web");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    async function fetchFeedback() {
      try {
        const res = await fetch("/api/feedback");

        if (!res.ok) {
          throw new Error("Failed to fetch feedback");
        }

        const data = await res.json();

        setFeedbacks(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchFeedback();

    const eventSource = new EventSource("/api/live");

    eventSource.onopen = () => {
      setConnected(true);
    };

    eventSource.onmessage = () => {
      fetchFeedback();
    };

    eventSource.onerror = () => {
      setConnected(false);
      console.error("Live connection lost");
    };

    return () => {
      eventSource.close();
    };
  }, []);

  async function submitFeedback() {
    if (!content.trim()) {
      setMessage("Please enter feedback content.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          channel,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setMessage("Feedback submitted successfully.");

      setContent("");
      setChannel("web");
    } catch (error: unknown) {
  console.error(error);

  setMessage(
    error instanceof Error
      ? error.message
      : "Unable to submit feedback."
  );
} finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-10 bg-[#070A12] text-white min-h-screen p-6">

      {/* HEADER */}
      <section>
        <h1 className="text-4xl font-bold tracking-tight">
          Test Data
        </h1>

        <p className="mt-2 text-gray-400">
          Simulate customer feedback submissions for analytics validation.
        </p>

        <div className="mt-4 flex items-center gap-3">

          <span
            className={`h-3 w-3 rounded-full ${
              connected
                ? "bg-green-500 animate-pulse"
                : "bg-red-500"
            }`}
          />

          <span className="text-sm text-gray-300">
            {connected
              ? "Real-time connection active"
              : "Disconnected"}
          </span>

        </div>
      </section>

      {/* FORM */}
      <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

        <div className="space-y-8">

          <div>
            <label className="mb-3 block text-sm font-medium text-gray-300">
              Feedback Content
            </label>

            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter customer feedback..."
              className="
                w-full
                rounded-2xl
                border border-white/10
                bg-[#0B0F1A]
                p-4
                text-white
                placeholder:text-gray-500
                outline-none
                transition
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-500/20
              "
            />
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-gray-300">
              Source Channel
            </label>

            <div className="relative">

              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="
                  w-full
                  appearance-none
                  rounded-2xl
                  border border-white/10
                  bg-[#0B0F1A]
                  px-5
                  py-4
                  text-white
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/20
                  cursor-pointer
                "
              >
                <option value="web" className="bg-[#0B0F1A]">Web</option>
                <option value="mobile" className="bg-[#0B0F1A]">Mobile Application</option>
                <option value="email" className="bg-[#0B0F1A]">Email</option>
                <option value="support" className="bg-[#0B0F1A]">Support Ticket</option>
                <option value="social" className="bg-[#0B0F1A]">Social Media</option>
              </select>

              <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-gray-400">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

            </div>
          </div>

          <div className="flex items-center gap-5">

            <button
              onClick={submitFeedback}
              disabled={loading}
              className="
                rounded-2xl
                bg-blue-600
                px-8
                py-3
                font-medium
                transition
                hover:bg-blue-500
                disabled:opacity-50
              "
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>

            {message && (
              <span className="text-sm text-gray-300">
                {message}
              </span>
            )}

          </div>

        </div>

      </section>

      {/* INFO PANEL */}
      <section className="rounded-3xl border border-blue-500/20 bg-blue-500/5 p-8">

        <h2 className="text-2xl font-semibold">
          Testing Environment
        </h2>

        <p className="mt-4 leading-7 text-gray-300">
          Feedback submitted here is stored in the database,
          processed through AI sentiment engine,
          and reflected across dashboard in real time.
        </p>

      </section>

      {/* LIVE FEEDBACK */}
      <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-2xl font-semibold">
            Recent Submissions
          </h2>

          <span className="rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-xs text-green-300">
            Live Updates
          </span>

        </div>

        <div className="space-y-4">

          {feedbacks.length > 0 ? (
            feedbacks.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-white/10 bg-[#0B0F1A] p-5 transition hover:bg-white/5"
              >
                <p className="text-gray-100">
                  {item.content}
                </p>

                <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-400">

                  <span className="rounded-full border border-white/10 px-3 py-1">
                    {item.channel}
                  </span>

                  <span className="rounded-full border border-white/10 px-3 py-1">
                    {item.sentiment}
                  </span>

                  <span className="rounded-full border border-white/10 px-3 py-1">
                    {item.theme}
                  </span>

                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">
              No submissions yet.
            </p>
          )}

        </div>

      </section>

    </div>
  );
}