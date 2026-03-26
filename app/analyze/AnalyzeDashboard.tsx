"use client";

import { useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useVideoStore } from "@/store/useVideoStore";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { SkeletonCard } from "@/components/SkeletonLoader";
import ChannelHeader from "./ChannelHeader";
import ChannelStats from "./ChannelStats";
import ChannelVideos from "./ChannelVideos";

export default function AnalyzeDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const channelUrl = searchParams.get("url") ?? "";

  const {
    channel,
    videos,
    channelLoading,
    videosLoading,
    error,
    reset,
    setChannel,
    setVideos,
    setChannelLoading,
    setVideosLoading,
    setError
  } = useVideoStore();

  const loadChannel = useCallback(async (url: string) => {
    setChannelLoading(true);
    try {
      const channelRes = await fetch(`/api/channel?url=${encodeURIComponent(url)}`);
      const channelData = await channelRes.json();
      if (!channelRes.ok) throw new Error(channelData.error ?? "Failed to fetch channel");
      setChannel(channelData);
      setChannelLoading(false);

      setVideosLoading(true);
      const videosRes = await fetch(`/api/videos?channelId=${channelData.id}`);
      const videosData = await videosRes.json();
      if (!videosRes.ok) throw new Error(videosData.error ?? "Failed to fetch videos");
      setVideos(videosData);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setChannelLoading(false);
      setVideosLoading(false);
    }
  }, [setChannel, setVideos, setChannelLoading, setVideosLoading, setError]);

  useEffect(() => {
    if (!channelUrl) return;
    reset();
    loadChannel(channelUrl);
  }, [channelUrl, reset, loadChannel]);

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-6 px-6">
        <div className="w-16 h-16 rounded-3xl bg-rose/10 flex items-center justify-center">
          <AlertCircle size={28} className="text-rose" strokeWidth={1.5} />
        </div>
        <div className="text-center flex flex-col gap-2">
          <h2 className="font-display text-xl font-bold text-ink dark:text-chalk">
            Analysis Failed
          </h2>
          <p className="text-fog text-sm max-w-sm">{error}</p>
        </div>
        <button
          onClick={() => router.push("/")}
          className="btn-primary flex items-center gap-2"
        >
          <ArrowLeft size={14} strokeWidth={2} />
          Try another channel
        </button>
      </div>
    );
  }

  if (channelLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="card p-8 text-center">
          <h2 className="text-lg font-semibold text-ink dark:text-chalk">
            Enter a YouTube channel URL to begin analysis.
          </h2>
          <p className="text-sm text-fog mt-2">No channel loaded yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-10">
      <ChannelHeader channel={channel} videos={videos} />
      <ChannelStats channel={channel} videos={videos} />
      <ChannelVideos videos={videos} videosLoading={videosLoading} />
    </div>
  );
}