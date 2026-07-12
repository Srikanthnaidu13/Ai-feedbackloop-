"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

type Props = {
  data: any[];
};

export default function ThemeTrendChart({ data }: Props) {
  if (!data.length) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        No trend data available.
      </div>
    );
  }

  const themeNames = Object.keys(data[0]).filter(
    (key) => key !== "date"
  );

  const colors = [
    "#3b82f6",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#a855f7",
    "#14b8a6",
    "#ec4899",
  ];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h2 className="mb-6 text-xl font-semibold">
        Theme Trends Over Time
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" />

          <YAxis />

          <Tooltip />

          <Legend />

          {themeNames.map((theme, index) => (
            <Line
              key={theme}
              type="monotone"
              dataKey={theme}
              stroke={colors[index % colors.length]}
              strokeWidth={3}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}