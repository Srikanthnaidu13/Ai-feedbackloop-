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

  useEffect(() => {
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

    fetchFeedback();

    const eventSource = new EventSource("/api/live");

    eventSource.onmessage = () => {
      fetchFeedback();
    };

    return () => eventSource.close();
  }, []);

  const filteredFeedback = useMemo(() => {
    return feedback.filter((item) => {
      const matchesSearch =
        item.content
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
      <div className="flex h-full items-center justify-center">
        Loading feedback...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <section>
        <h1 className="text-4xl font-bold">
          Feedback Management
        </h1>

        <p className="mt-2 text-gray-400">
          Search, filter, and monitor customer feedback.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">

        <input
          type="text"
          placeholder="Search feedback..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
            rounded-2xl
            border border-white/10
            bg-black/20
            px-5 py-4
            outline-none
          "
        />

       <select
  value={sentimentFilter}
  onChange={(e) =>
    setSentimentFilter(e.target.value)
  }
  className="
    w-full
    appearance-none
    rounded-2xl
    border border-white/10
    bg-slate-900
    px-5 py-4
    text-white
    outline-none
    transition
    focus:border-blue-500
    focus:ring-2
    focus:ring-blue-500/20
    cursor-pointer
  "
>
  <option value="ALL" className="bg-slate-900 text-white">
    All Sentiments
  </option>

  <option value="POSITIVE" className="bg-slate-900 text-white">
    Positive
  </option>

  <option value="NEGATIVE" className="bg-slate-900 text-white">
    Negative
  </option>

  <option value="NEUTRAL" className="bg-slate-900 text-white">
    Neutral
  </option>

  <option value="PENDING" className="bg-slate-900 text-white">
    Pending
  </option>
</select>

      </section>

      <section className="space-y-4">

        {filteredFeedback.length > 0 ? (
          filteredFeedback.map((item) => (
            <div
              key={item.id}
              className="
                rounded-3xl
                border border-white/10
                bg-white/5
                p-6
              "
            >
              <p>{item.content}</p>

              <div className="mt-4 flex flex-wrap gap-3 text-xs">

                <span className="rounded-full border px-3 py-1">
                  {item.channel}
                </span>

                <span className="rounded-full border px-3 py-1">
                  {item.sentiment}
                </span>

                <span className="rounded-full border px-3 py-1">
                  {item.theme}
                </span>

                <span className="rounded-full border px-3 py-1">
                  {new Date(
                    item.createdAt
                  ).toLocaleString()}
                </span>

              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">
            No feedback found.
          </p>
        )}

      </section>

    </div>
  );
}