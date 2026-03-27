'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { BarChart2 } from 'lucide-react';
import { formatNumber } from '@/lib/metrics';
import type { VideoStats } from '@/types';

interface ChartsProps {
  videos: VideoStats[];
}

const truncate = (text: string, max = 22): string =>
  text.length > max ? `${text.slice(0, max)}…` : text;

const tooltipStyle = {
  backgroundColor: '#16161F',
  border: '1px solid #1E1E2E',
  borderRadius: '12px',
  color: '#F0F0FF',
  fontSize: '12px',
  padding: '10px 14px',
  maxWidth: '260px',
  whiteSpace: 'normal' as const,
};

const COLORS_VIEWS = [
  '#0A7227',
  '#1a8f35',
  '#2d9e45',
  '#6CAA7D',
  '#7db88e',
  '#8ec69f',
  '#9fd4b0',
  '#b0e2c1',
  '#2A2A3E',
  '#2A2A3E',
];
const COLORS_ENGAGEMENT = [
  '#6EE7B7',
  '#5dd4a5',
  '#4cc193',
  '#3bae81',
  '#6CAA7D',
  '#7db88e',
  '#8ec69f',
  '#9fd4b0',
  '#2A2A3E',
  '#2A2A3E',
];

function CustomTooltipViews({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: VideoStats }[];
}) {
  if (!active || !payload?.length) return null;
  const video = payload[0].payload;
  return (
    <div style={tooltipStyle}>
      <p className="text-chalk text-xs font-semibold mb-1 leading-snug">
        {video.title}
      </p>
      <p className="text-grove text-xs">{formatNumber(video.views)} views</p>
    </div>
  );
}

function CustomTooltipEngagement({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: VideoStats }[];
}) {
  if (!active || !payload?.length) return null;
  const video = payload[0].payload;
  return (
    <div style={tooltipStyle}>
      <p className="text-chalk text-xs font-semibold mb-1 leading-snug">
        {video.title}
      </p>
      <p className="text-sky text-xs">
        {video.engagementRate.toFixed(2)}% engagement
      </p>
    </div>
  );
}

function ViewsChart({ data }: { data: VideoStats[] }) {
  return (
    <div className="card p-5 flex flex-col gap-4">
      <h3 className="section-title text-sm">Top 10 by Views</h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          margin={{ top: 4, right: 16, left: 0, bottom: 48 }}
          barCategoryGap="30%">
          <XAxis
            dataKey="title"
            tickFormatter={(value: string) => truncate(value)}
            tick={{ fontSize: 10, fill: '#8888AA' }}
            axisLine={false}
            tickLine={false}
            interval={0}
            angle={-35}
            textAnchor="end"
            height={60}
          />
          <YAxis
            tickFormatter={(value: number) => formatNumber(value)}
            tick={{ fontSize: 10, fill: '#8888AA' }}
            axisLine={false}
            tickLine={false}
            width={48}
          />
          <Tooltip
            content={<CustomTooltipViews />}
            cursor={{ fill: '#1E1E2E', opacity: 0.4 }}
          />
          <Bar dataKey="views" radius={[4, 4, 0, 0]} maxBarSize={40}>
            {data.map((entry, index) => (
              <Cell key={entry.id} fill={COLORS_VIEWS[index] ?? '#2A2A3E'} />
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
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          margin={{ top: 4, right: 16, left: 0, bottom: 48 }}
          barCategoryGap="30%">
          <XAxis
            dataKey="title"
            tickFormatter={(value: string) => truncate(value)}
            tick={{ fontSize: 10, fill: '#8888AA' }}
            axisLine={false}
            tickLine={false}
            interval={0}
            angle={-35}
            textAnchor="end"
            height={60}
          />
          <YAxis
            tickFormatter={(value: number) => `${value.toFixed(1)}%`}
            tick={{ fontSize: 10, fill: '#8888AA' }}
            axisLine={false}
            tickLine={false}
            width={48}
          />
          <Tooltip
            content={<CustomTooltipEngagement />}
            cursor={{ fill: '#1E1E2E', opacity: 0.4 }}
          />
          <Bar dataKey="engagementRate" radius={[4, 4, 0, 0]} maxBarSize={40}>
            {data.map((entry, index) => (
              <Cell
                key={entry.id}
                fill={COLORS_ENGAGEMENT[index] ?? '#2A2A3E'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function Charts({ videos }: ChartsProps) {
  const byViews = [...videos]
    .sort((videoA, videoB) => videoB.views - videoA.views)
    .slice(0, 10);
  const byEngagement = [...videos]
    .sort((videoA, videoB) => videoB.engagementRate - videoA.engagementRate)
    .slice(0, 10);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <BarChart2
          size={16}
          className="text-forest dark:text-grove"
          strokeWidth={2}
        />
        <h2 className="section-title">Performance Charts</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ViewsChart data={byViews} />
        <EngagementChart data={byEngagement} />
      </div>
    </section>
  );
}
