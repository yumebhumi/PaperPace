"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const PALETTE = ["#ff4d4d", "#2d5da1", "#9457c4", "#ffe0ec", "#d6f5e3", "#fff9c4"];

const tickStyle = { fill: "#2d2d2d", fontFamily: "var(--font-nunito), Nunito, sans-serif", fontWeight: 800, fontSize: 12 };

export function GenrePaceChart({
  data,
}: {
  data: { genre: string; pace: number }[];
}) {
  if (data.length < 2) {
    return (
      <div className="grid h-72 place-items-center gap-2 rounded-[26px] border-[3px] border-dashed border-[rgba(45,45,45,0.32)] bg-[rgba(255,249,196,0.3)] px-6 text-center">
        <div className="text-[32px]">🧭</div>
        <p className="max-w-xs font-display text-[18px] font-bold leading-tight">
          Read across more genres to compare your pace.
        </p>
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 8, left: 8, right: 8, bottom: 0 }}>
          <CartesianGrid stroke="rgba(45,45,45,0.18)" horizontal={true} vertical={false} strokeDasharray="6 6" />
          <XAxis
            type="number"
            tick={tickStyle}
            tickLine={false}
            axisLine={{ stroke: "#2d2d2d", strokeWidth: 2 }}
            tickFormatter={(value) => `${value}s`}
          />
          <YAxis
            type="category"
            dataKey="genre"
            tick={tickStyle}
            tickLine={false}
            axisLine={{ stroke: "#2d2d2d", strokeWidth: 2 }}
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
              fontFamily: "var(--font-nunito), Nunito, sans-serif",
              fontWeight: 800,
            }}
          />
          <Bar dataKey="pace" radius={[10, 10, 10, 10]} stroke="#2d2d2d" strokeWidth={2}>
            {data.map((d, i) => (
              <Cell key={d.genre} fill={PALETTE[i % PALETTE.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
