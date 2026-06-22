"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function ReadingPaceTrendsChart({
  data,
}: {
  data: { session: string; pace: number }[];
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="rgba(45,45,45,0.18)" vertical={false} strokeDasharray="6 6" />
          <XAxis dataKey="session" stroke="#7b746a" tickLine={false} axisLine={false} />
          <YAxis
            stroke="#7b746a"
            tickLine={false}
            axisLine={false}
            width={44}
            tickFormatter={(value) => `${value}s`}
          />
          <Tooltip
            cursor={{ stroke: "rgba(45,45,45,0.24)", strokeDasharray: "4 4" }}
            formatter={(value: number) => [`${Math.round(value)} sec/page`, "Pace"]}
            contentStyle={{
              borderRadius: "24px 80px 20px 60px / 20px 24px 80px 24px",
              border: "3px solid #2d2d2d",
              background: "#fff9c4",
              boxShadow: "4px 4px 0px 0px #2d2d2d",
            }}
          />
          <Line
            type="monotone"
            dataKey="pace"
            stroke="#2d5da1"
            strokeWidth={3}
            dot={{ r: 4, fill: "#2d5da1", stroke: "#2d2d2d", strokeWidth: 2 }}
            activeDot={{ r: 5, fill: "#ff4d4d", stroke: "#2d2d2d", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
