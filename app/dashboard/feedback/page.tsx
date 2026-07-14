"use client";

import { useEffect, useMemo, useState } from "react";

type Feedback = {
  id: string;
  content: string;
  channel: string | null;
  sentiment: string | null;
  theme: string | null;
  createdAt: string;
};

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState("ALL");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function fetchFeedback() {
    try {
      const res = await fetch("/api/feedback");
      const data = await res.json();
      setFeedback(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFeedback();

    const eventSource = new EventSource("/api/live");

    eventSource.onmessage = () => {
      fetchFeedback();
    };

    return () => eventSource.close();
  }, []);

  async function deleteFeedback() {
    if (!deleteId) return;

    try {
      setDeleting(true);

      const res = await fetch("/api/feedback", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: deleteId,
        }),
      });

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      setDeleteId(null);
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(false);
    }
  }

  const filteredFeedback = useMemo(() => {
    return feedback.filter((item) => {
      const matchesSearch = item.content
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesSentiment =
        sentimentFilter === "ALL" ||
        item.sentiment === sentimentFilter;

      return matchesSearch && matchesSentiment;
    });
  }, [feedback, search, sentimentFilter]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-xl">
        Loading feedback...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}

      <section>
        <h1 className="text-4xl font-bold">
          Feedback Management
        </h1>

        <p className="mt-2 text-gray-400">
          Search, filter and manage customer feedback.
        </p>
      </section>

      {/* Search + Filter */}

      <section className="grid gap-4 md:grid-cols-2">

        <input
          type="text"
          placeholder="Search feedback..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 outline-none"
        />

        <select
          value={sentimentFilter}
          onChange={(e) => setSentimentFilter(e.target.value)}
          className="rounded-2xl border border-white/10 bg-slate-900 px-5 py-4 text-white outline-none"
        >
          <option value="ALL">All Sentiments</option>
          <option value="POSITIVE">Positive</option>
          <option value="NEGATIVE">Negative</option>
          <option value="NEUTRAL">Neutral</option>
          <option value="PENDING">Pending</option>
        </select>

      </section>

      {/* Feedback List */}

      <section className="space-y-5">

        {filteredFeedback.length > 0 ? (

          filteredFeedback.map((item) => (

            <div
              key={item.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >

              <div className="flex items-start justify-between gap-6">

                <div className="flex-1">

                  <p className="text-lg leading-7">
                    {item.content}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3 text-xs">

                    <span className="rounded-full border border-white/10 bg-slate-800 px-3 py-1">
                      {item.channel}
                    </span>

                    <span className="rounded-full border border-white/10 bg-slate-800 px-3 py-1">
                      {item.sentiment}
                    </span>

                    <span className="rounded-full border border-white/10 bg-slate-800 px-3 py-1">
                      {item.theme}
                    </span>

                    <span className="rounded-full border border-white/10 bg-slate-800 px-3 py-1">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>

                  </div>

                </div>

                <button
                  onClick={() => setDeleteId(item.id)}
                  className="
                    rounded-xl
                    border
                    border-red-500/20
                    bg-red-500/10
                    px-5
                    py-2
                    text-sm
                    font-medium
                    text-red-300
                    transition
                    hover:bg-red-500/20
                    hover:text-red-200
                  "
                >
                  Delete
                </button>

              </div>

            </div>

          ))

        ) : (

          <div className="rounded-2xl border border-white/10 p-10 text-center text-gray-400">
            No feedback found.
          </div>

        )}

      </section>

      {/* Delete Confirmation Modal */}

      {deleteId && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl">

            <h2 className="text-2xl font-bold">
              Delete Feedback
            </h2>

            <p className="mt-4 text-gray-400">
              This action cannot be undone.
              <br />
              Are you sure you want to permanently delete this feedback?
            </p>

            <div className="mt-8 flex justify-end gap-4">

              <button
                onClick={() => setDeleteId(null)}
                className="
                  rounded-xl
                  border
                  border-white/10
                  px-5
                  py-2
                  text-gray-300
                  transition
                  hover:bg-white/10
                "
              >
                Cancel
              </button>

              <button
                onClick={deleteFeedback}
                disabled={deleting}
                className="
                  rounded-xl
                  bg-red-600
                  px-5
                  py-2
                  font-medium
                  text-white
                  transition
                  hover:bg-red-500
                  disabled:opacity-50
                "
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}