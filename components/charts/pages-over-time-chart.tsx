"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function PagesOverTimeChart({
  data,
}: {
  data: { date: string; pages: number }[];
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="rgba(45,45,45,0.18)" vertical={false} strokeDasharray="6 6" />
          <XAxis dataKey="date" stroke="#7b746a" tickLine={false} axisLine={false} />
          <YAxis stroke="#7b746a" tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ stroke: "rgba(45,45,45,0.24)", strokeDasharray: "4 4" }}
            formatter={(value: number) => [`${Math.round(value)} pages`, "Pages read"]}
            contentStyle={{
              borderRadius: "24px 80px 20px 60px / 20px 24px 80px 24px",
              border: "3px solid #2d2d2d",
              background: "#fff9c4",
              boxShadow: "4px 4px 0px 0px #2d2d2d",
            }}
          />
          <Line
            type="monotone"
            dataKey="pages"
            stroke="#c96f4a"
            strokeWidth={3}
            dot={{ r: 4, fill: "#c96f4a", stroke: "#2d2d2d", strokeWidth: 2 }}
            activeDot={{ r: 5, fill: "#ff4d4d", stroke: "#2d2d2d", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
