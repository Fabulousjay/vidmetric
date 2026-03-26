"use client";

import { useVideoStore } from "@/store/useVideoStore";
import FilterBar from "./FilterBar";
import VideoCard from "./VideoCard";
import { List } from "lucide-react";
import type { VideoStats } from "@/types";

function applyFilters(videos: VideoStats[], filters: ReturnType<typeof useVideoStore.getState>["filters"]): VideoStats[] {
  let result = [...videos];

  if (filters.dateRange !== "all") {
    const cutoff = Date.now() - parseInt(filters.dateRange) * 86_400_000;
    result = result.filter((video) => new Date(video.publishedAt).getTime() >= cutoff);
  }

  if (filters.minViews > 0) {
    result = result.filter((video) => video.views >= filters.minViews);
  }

  if (filters.minEngagement > 0) {
    result = result.filter((video) => video.engagementRate >= filters.minEngagement);
  }

  if (filters.contentType !== "all") {
    result = result.filter((video) =>
      filters.contentType === "short" ? video.isShort : !video.isShort
    );
  }

  if (filters.search.trim()) {
    const query = filters.search.toLowerCase();
    result = result.filter((video) => video.title.toLowerCase().includes(query));
  }

  result.sort((videoA, videoB) => {
    const valueA = videoA[filters.sortKey];
    const valueB = videoB[filters.sortKey];
    if (typeof valueA === "string" && typeof valueB === "string") {
      return filters.sortDir === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
    return filters.sortDir === "asc"
      ? (valueA as number) - (valueB as number)
      : (valueB as number) - (valueA as number);
  });

  return result;
}

export default function VideoTable({ videos }: { videos: VideoStats[] }) {
  const { filters } = useVideoStore();
  const filtered    = applyFilters(videos, filters);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <List size={16} className="text-forest dark:text-grove" strokeWidth={2} />
          <h2 className="section-title">All Videos</h2>
        </div>
        <span className="label-caps">{filtered.length} results</span>
      </div>

      <FilterBar />

      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-fog gap-2">
            <List size={28} strokeWidth={1.5} />
            <p className="text-sm">No videos match your filters</p>
          </div>
        ) : (
          filtered.map((video) => (
            <VideoCard key={video.id} video={video} searchQuery={filters.search} />
          ))
        )}
      </div>
    </section>
  );
}