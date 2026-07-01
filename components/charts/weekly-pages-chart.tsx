"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const PALETTE = ["#2d5da1", "#fff9c4", "#d6f5e3", "#ffe0ec", "#9457c4"];

const tickStyle = { fill: "#2d2d2d", fontFamily: "var(--font-nunito), Nunito, sans-serif", fontWeight: 800, fontSize: 12 };

export function WeeklyPagesChart({
  data,
}: {
  data: { day: string; pages: number }[];
}) {
  const max = Math.max(...data.map((d) => d.pages), 1);

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid stroke="rgba(45,45,45,0.18)" vertical={false} strokeDasharray="6 6" />
          <XAxis dataKey="day" tick={tickStyle} tickLine={false} axisLine={{ stroke: "#2d2d2d", strokeWidth: 2 }} />
          <YAxis tick={tickStyle} tickLine={false} axisLine={{ stroke: "#2d2d2d", strokeWidth: 2 }} />
          <Tooltip
            cursor={{ fill: "rgba(255,249,196,0.45)" }}
            contentStyle={{
              borderRadius: "24px 80px 20px 60px / 20px 24px 80px 24px",
              border: "3px solid #2d2d2d",
              background: "#fff9c4",
              boxShadow: "4px 4px 0px 0px #2d2d2d",
              fontFamily: "var(--font-nunito), Nunito, sans-serif",
              fontWeight: 800,
            }}
          />
          <Bar dataKey="pages" radius={[14, 14, 6, 6]} stroke="#2d2d2d" strokeWidth={2}>
            {data.map((d, i) => (
              <Cell key={d.day} fill={d.pages === max && d.pages > 0 ? "#ff4d4d" : PALETTE[i % PALETTE.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
