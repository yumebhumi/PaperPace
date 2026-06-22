"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function GenrePaceChart({
  data,
}: {
  data: { genre: string; pace: number }[];
}) {
  if (data.length < 2) {
    return (
      <div className="grid h-72 place-items-center rounded-[1.5rem] border-2 border-dashed border-[rgba(45,45,45,0.22)] bg-[rgba(255,255,255,0.45)] px-6 text-center">
        <p className="max-w-xs text-sm leading-6 text-[var(--muted)]">
          Read across more genres to compare your pace.
        </p>
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 8 }}>
          <CartesianGrid stroke="rgba(45,45,45,0.18)" horizontal={true} vertical={false} strokeDasharray="6 6" />
          <XAxis
            type="number"
            stroke="#7b746a"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}s`}
          />
          <YAxis
            type="category"
            dataKey="genre"
            stroke="#7b746a"
            tickLine={false}
            axisLine={false}
            width={88}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,249,196,0.45)" }}
            formatter={(value: number) => [`${Math.round(value)} sec/page`, "Average pace"]}
            contentStyle={{
              borderRadius: "24px 80px 20px 60px / 20px 24px 80px 24px",
              border: "3px solid #2d2d2d",
              background: "#fff9c4",
              boxShadow: "4px 4px 0px 0px #2d2d2d",
            }}
          />
          <Bar dataKey="pace" fill="#ff4d4d" radius={[10, 10, 10, 10]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
