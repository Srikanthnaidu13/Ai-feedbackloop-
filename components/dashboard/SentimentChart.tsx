"use client";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

type Props = {
  sentimentCounts: {
    positive: number;
    negative: number;
    neutral: number;
    pending: number;
  };
};

export default function SentimentChart({
  sentimentCounts,
}: Props) {
  const {
    positive,
    negative,
    neutral,
    pending,
  } = sentimentCounts;

  const data = {
    labels: [
      "Positive",
      "Negative",
      "Neutral",
      "Pending",
    ],

    datasets: [
      {
        data: [
          positive,
          negative,
          neutral,
          pending,
        ],

        backgroundColor: [
          "#22c55e", // green
          "#ef4444", // red
          "#64748b", // gray
          "#facc15", // yellow
        ],

        borderWidth: 0,
        hoverOffset: 20,
      },
    ],
  };

  const options = {
    responsive: true,

    maintainAspectRatio: true,

    plugins: {
      legend: {
        position: "bottom" as const,

        labels: {
          color: "#cbd5e1",
          padding: 20,

          font: {
            size: 13,
          },
        },
      },
    },

    cutout: "70%",
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 backdrop-blur-xl">

      <div className="mb-6 flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-semibold">
            Sentiment Analysis
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Customer emotion distribution
          </p>
        </div>

        <span className="rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-xs text-green-300">
          Live AI
        </span>

      </div>

      <div className="mx-auto max-w-[320px]">
        <Doughnut
          data={data}
          options={options}
        />
      </div>

    </div>
  );
}