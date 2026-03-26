"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import { BarChart2 } from "lucide-react";
import { formatNumber } from "@/lib/metrics";
import type { VideoStats } from "@/types";

interface ChartsProps {
  videos: VideoStats[];
}

const truncate = (text: string, max = 28): string =>
  text.length > max ? `${text.slice(0, max)}…` : text;

const tooltipStyle = {
  backgroundColor: "#16161F",
  border:          "1px solid #1E1E2E",
  borderRadius:    "12px",
  color:           "#F0F0FF",
  fontSize:        "12px",
};

function ViewsChart({ data }: { data: VideoStats[] }) {
  return (
    <div className="card p-5 flex flex-col gap-4">
      <h3 className="section-title text-sm">Top 10 by Views</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
          <XAxis
            type="number"
            tickFormatter={(value: number) => formatNumber(value)}
            tick={{ fontSize: 11, fill: "#8888AA" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="title"
            tickFormatter={(value: string) => truncate(value)}
            tick={{ fontSize: 11, fill: "#8888AA" }}
            width={140}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value: any) => [formatNumber(value || 0), "Views"]}
            cursor={{ fill: "#1E1E2E", opacity: 0.4 }}
          />
          <Bar dataKey="views" radius={[0, 6, 6, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={entry.id}
                fill={index === 0 ? "#0A7227" : index < 3 ? "#6CAA7D" : "#2A2A3E"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function EngagementChart({ data }: { data: VideoStats[] }) {
  return (
    <div className="card p-5 flex flex-col gap-4">
      <h3 className="section-title text-sm">Top 10 by Engagement Rate</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
          <XAxis
            type="number"
            tickFormatter={(value: number) => `${value.toFixed(1)}%`}
            tick={{ fontSize: 11, fill: "#8888AA" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="title"
            tickFormatter={(value: string) => truncate(value)}
            tick={{ fontSize: 11, fill: "#8888AA" }}
            width={140}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value: any) => [`${(value || 0).toFixed(2)}%`, "Engagement"]}
            cursor={{ fill: "#1E1E2E", opacity: 0.4 }}
          />
          <Bar dataKey="engagementRate" radius={[0, 6, 6, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={entry.id}
                fill={index === 0 ? "#6EE7B7" : index < 3 ? "#6CAA7D" : "#2A2A3E"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function Charts({ videos }: ChartsProps) {
  const byViews      = [...videos].sort((videoA, videoB) => videoB.views - videoA.views).slice(0, 10);
  const byEngagement = [...videos].sort((videoA, videoB) => videoB.engagementRate - videoA.engagementRate).slice(0, 10);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <BarChart2 size={16} className="text-forest dark:text-grove" strokeWidth={2} />
        <h2 className="section-title">Performance Charts</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ViewsChart data={byViews} />
        <EngagementChart data={byEngagement} />
      </div>
    </section>
  );
}