"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

type Props = {
  themeCounts: Record<string, number>;
};

export default function ThemeChart({
  themeCounts,
}: Props) {
  const labels = Object.keys(themeCounts);

  const values = Object.values(themeCounts);

  const data = {
    labels,

    datasets: [
      {
        label: "Feedback Count",

        data: values,

        backgroundColor: [
          "#3b82f6",
          "#8b5cf6",
          "#06b6d4",
          "#22c55e",
          "#f59e0b",
          "#ec4899",
          "#14b8a6",
        ],

        borderRadius: 12,

        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        backgroundColor: "#0f172a",

        titleColor: "#ffffff",

        bodyColor: "#cbd5e1",

        borderColor: "#334155",

        borderWidth: 1,
      },
    },

    scales: {
      x: {
        ticks: {
          color: "#cbd5e1",
        },

        grid: {
          display: false,
        },
      },

      y: {
        beginAtZero: true,

        ticks: {
          color: "#cbd5e1",

          stepSize: 1,
        },

        grid: {
          color: "rgba(255,255,255,0.06)",
        },
      },
    },
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">
            Theme Distribution
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            AI detected customer topics
          </p>
        </div>

        <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs text-blue-300">
          AI Generated
        </span>
      </div>

      <div className="h-[320px]">
        {labels.length > 0 ? (
          <Bar
            data={data}
            options={options}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            No theme data available
          </div>
        )}
      </div>
    </div>
  );
}