"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
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

  const themes = Object.keys(data[0]).filter(
    (key) => key !== "date"
  );

  const colors = [
    "#3B82F6",
    "#22C55E",
    "#F59E0B",
    "#EF4444",
    "#A855F7",
    "#06B6D4",
    "#EC4899",
  ];

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 backdrop-blur-xl">

      <div className="mb-8 flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-semibold">
            Theme Trends
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            AI detected theme activity over time
          </p>
        </div>

        <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs text-blue-300">
          Live Analytics
        </span>

      </div>

      <ResponsiveContainer width="100%" height={340}>

        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 20,
            left: 0,
            bottom: 0,
          }}
        >

          <CartesianGrid
            stroke="#334155"
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="date"
            tick={{
              fill: "#CBD5E1",
              fontSize: 12,
            }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            allowDecimals={false}
            tick={{
              fill: "#CBD5E1",
              fontSize: 12,
            }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "12px",
            }}
          />

          {themes.map((theme, index) => (
            <Line
              key={theme}
              dataKey={theme}
              stroke={colors[index % colors.length]}
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 5,
              }}
              type="monotone"
            />
          ))}

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}