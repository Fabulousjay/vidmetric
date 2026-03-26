"use client";

import { FEATURES } from "@/lib/flags";
import { useVideoStore } from "@/store/useVideoStore";
import InsightPanel from "@/components/InsightPanel";
import TopVideos from "@/components/TopVideos";
import Charts from "@/components/Charts";
import VideoTable from "@/components/VideoTable";
import CompareBar from "@/components/CompareBar";
import ComparePanel from "@/components/ComparePanel";
import { SkeletonVideoRow } from "@/components/SkeletonLoader";
import type { VideoStats } from "@/types";

interface ChannelVideosProps {
  videos: VideoStats[];
  videosLoading: boolean;
}

export default function ChannelVideos({ videos, videosLoading }: ChannelVideosProps) {
  const { channel, compare } = useVideoStore();

  if (videosLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <SkeletonVideoRow key={index} />
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="card p-6 text-center text-fog">
        No videos available.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {FEATURES.COMPARE && <CompareBar />}

      {FEATURES.COMPARE && compare?.length > 0 && channel && (
        <ComparePanel
          primary={{ id: channel.id, title: channel.title, channel, videos }}
          secondary={compare[0]}
        />
      )}

      {FEATURES.INSIGHTS && <InsightPanel videos={videos} />}
      {FEATURES.TOP_VIDEOS && <TopVideos videos={videos} />}
      {FEATURES.CHARTS && <Charts videos={videos} />}

      <VideoTable videos={videos} />
    </div>
  );
}
