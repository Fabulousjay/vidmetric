'use client';

import { Users, Eye, Video, TrendingUp } from 'lucide-react';
import StatCard from '@/components/StatCard';
import type { ChannelStats, VideoStats } from '@/types';

interface ChannelStatsProps {
  channel: ChannelStats;
  videos: VideoStats[];
}

export default function ChannelStats({ channel, videos }: ChannelStatsProps) {
  const avgEngagement =
    videos.length > 0 ?
      videos.reduce((sum, video) => sum + video.engagementRate, 0) /
      videos.length
    : 0;

  const monthsSinceCreated = Math.max(
    1,
    Math.floor(
      (Date.now() - new Date(channel.publishedAt).getTime()) /
        (1000 * 60 * 60 * 24 * 30),
    ),
  );

  const uploadRate = Math.round(channel.videoCount / monthsSinceCreated);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <StatCard
        label="Subscribers"
        value={channel.subscribers || 0}
        icon={Users}
        format="number"
      />
      <StatCard
        label="Total Views"
        value={channel.totalViews || 0}
        icon={Eye}
        format="number"
      />
      <StatCard
        label="Total Videos"
        value={channel.videoCount || 0}
        icon={Video}
        format="raw"
        sub={`~${uploadRate} videos/month`}
      />
      <StatCard
        label="Avg Engagement"
        value={Number(avgEngagement.toFixed(2))}
        icon={TrendingUp}
        format="percent"
        sub="likes + comments / views"
      />
    </div>
  );
}
