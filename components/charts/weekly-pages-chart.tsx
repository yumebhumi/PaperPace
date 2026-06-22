"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function WeeklyPagesChart({
  data,
}: {
  data: { day: string; pages: number }[];
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="rgba(45,45,45,0.18)" vertical={false} strokeDasharray="6 6" />
          <XAxis dataKey="day" stroke="#7b746a" tickLine={false} axisLine={false} />
          <YAxis stroke="#7b746a" tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ fill: "rgba(255,249,196,0.45)" }}
            contentStyle={{
              borderRadius: "24px 80px 20px 60px / 20px 24px 80px 24px",
              border: "3px solid #2d2d2d",
              background: "#fff9c4",
              boxShadow: "4px 4px 0px 0px #2d2d2d",
            }}
          />
          <Bar dataKey="pages" fill="#2d5da1" radius={[14, 14, 6, 6]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
