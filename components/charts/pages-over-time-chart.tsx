"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const tickStyle = { fill: "#2d2d2d", fontFamily: "var(--font-nunito), Nunito, sans-serif", fontWeight: 800, fontSize: 12 };

export function PagesOverTimeChart({
  data,
}: {
  data: { date: string; pages: number }[];
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid stroke="rgba(45,45,45,0.18)" vertical={false} strokeDasharray="6 6" />
          <XAxis dataKey="date" tick={tickStyle} tickLine={false} axisLine={{ stroke: "#2d2d2d", strokeWidth: 2 }} />
          <YAxis tick={tickStyle} tickLine={false} axisLine={{ stroke: "#2d2d2d", strokeWidth: 2 }} />
          <Tooltip
            cursor={{ stroke: "rgba(45,45,45,0.4)", strokeDasharray: "4 4" }}
            formatter={(value: number) => [`${Math.round(value)} pages`, "Pages read"]}
            contentStyle={{
              borderRadius: "24px 80px 20px 60px / 20px 24px 80px 24px",
              border: "3px solid #2d2d2d",
              background: "#fff9c4",
              boxShadow: "4px 4px 0px 0px #2d2d2d",
              fontFamily: "var(--font-nunito), Nunito, sans-serif",
              fontWeight: 800,
            }}
          />
          <Line
            type="monotone"
            dataKey="pages"
            stroke="#9457c4"
            strokeWidth={3}
            dot={{ r: 4, fill: "#9457c4", stroke: "#2d2d2d", strokeWidth: 2 }}
            activeDot={{ r: 6, fill: "#ff4d4d", stroke: "#2d2d2d", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
