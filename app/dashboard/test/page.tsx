"use client";

import { useState } from "react";

export default function FeedbackSubmissionPage() {
  const [content, setContent] = useState("");
  const [channel, setChannel] = useState("Web");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function submitFeedback() {
    if (!content.trim()) {
      setSuccess(false);
      setMessage("Please enter your feedback before submitting.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          channel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to submit feedback.");
      }

      setSuccess(true);
      setMessage(
        "Thank you for your feedback. Your response has been submitted successfully."
      );

      setContent("");
      setChannel("Web");
    } catch (error: unknown) {
      console.error(error);

      setSuccess(false);

      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#070A12] px-8 py-10 text-white">

      <div className="mx-auto max-w-5xl">

        <div className="mb-10">

          <h1 className="text-4xl font-bold tracking-tight">
            Submit Your Feedback
          </h1>

          <p className="mt-3 max-w-3xl text-gray-400 leading-7">
            Your feedback helps us improve our products and services.
            Share your experience, report an issue, or suggest an
            improvement. Every submission is analyzed by our AI
            intelligence engine to help identify customer sentiment
            and recurring themes.
          </p>

        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

          <div className="grid gap-8">

            <div>

              <label className="mb-3 block text-sm font-medium text-gray-300">
                Feedback or Complaint
              </label>

              <textarea
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Describe your experience, issue, suggestion, or feedback..."
                className="
                  w-full
                  rounded-2xl
                  border
                  border-white/10
                  bg-[#0B1220]
                  px-5
                  py-4
                  text-white
                  placeholder:text-gray-500
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/20
                "
              />

              <div className="mt-2 flex justify-between text-sm text-gray-500">

                <span>
                  Please avoid sharing sensitive personal information.
                </span>

                <span>
                  {content.length} Characters
                </span>

              </div>

            </div>

            <div>

              <label className="mb-3 block text-sm font-medium text-gray-300">
                Feedback Source
              </label>

              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="
                  w-full
                  rounded-2xl
                  border
                  border-white/10
                  bg-[#0B1220]
                  px-5
                  py-4
                  text-white
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/20
                "
              >
                <option>Web</option>
                <option>Mobile App</option>
                <option>Email</option>
                <option>Support Ticket</option>
                <option>Social Media</option>
              </select>

            </div>

                        {message && (
              <div
                className={`rounded-2xl border px-5 py-4 ${
                  success
                    ? "border-green-500/30 bg-green-500/10 text-green-300"
                    : "border-red-500/30 bg-red-500/10 text-red-300"
                }`}
              >
                {message}
              </div>
            )}

            <div className="flex items-center justify-between">

              <div>

                <h3 className="text-lg font-semibold">
                  We Value Your Opinion
                </h3>

                <p className="mt-1 max-w-xl text-sm leading-6 text-gray-400">
                  Your submission will be securely stored and analyzed
                  using AI to identify customer sentiment, recurring
                  issues, and improvement opportunities.
                </p>

              </div>

              <button
                onClick={submitFeedback}
                disabled={loading}
                className="
                  rounded-2xl
                  bg-blue-600
                  px-8
                  py-4
                  font-medium
                  transition
                  hover:bg-blue-500
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {loading ? "Submitting..." : "Submit Feedback"}
              </button>

            </div>

          </div>

        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

            <h3 className="text-lg font-semibold">
              Every Voice Matters
            </h3>

            <p className="mt-3 text-sm leading-7 text-gray-400">
              Whether your experience was positive or negative,
              your feedback helps us understand customer needs
              and improve future experiences.
            </p>

          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

            <h3 className="text-lg font-semibold">
              AI-Powered Analysis
            </h3>

            <p className="mt-3 text-sm leading-7 text-gray-400">
              Submitted feedback is automatically analyzed for
              sentiment, themes, and business insights to help
              our team respond more effectively.
            </p>

          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

            <h3 className="text-lg font-semibold">
              Secure & Confidential
            </h3>

            <p className="mt-3 text-sm leading-7 text-gray-400">
              All responses are securely stored and used only
              for product and service improvement purposes.
            </p>

          </div>

        </div>
              </div>

    </main>
  );
}