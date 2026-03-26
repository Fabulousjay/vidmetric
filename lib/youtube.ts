import {
  RAPIDAPI_KEY,
  RAPIDAPI_HOST,
  RAPIDAPI_BASE,
  DEFAULT_VIDEO_LIMIT
} from "./config";
import type { ChannelStats, VideoStats } from "@/types";

const rapidHeaders = {
  "x-rapidapi-key": RAPIDAPI_KEY,
  "x-rapidapi-host": RAPIDAPI_HOST
};

async function ytFetch(endpoint: string, attempt = 1): Promise<Response> {
  const response = await fetch(`${RAPIDAPI_BASE}${endpoint}`, {
    headers: rapidHeaders
  });

  if (response.status === 429 && attempt < 3) {
    await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    return ytFetch(endpoint, attempt + 1);
  }

  if (response.status === 403) {
    throw new Error("Invalid RapidAPI key — check your RAPIDAPI_KEY env var");
  }

  return response;
}

export async function resolveChannelId(channelUrl: string): Promise<string> {
  const patterns: { regex: RegExp; direct: boolean }[] = [
    { regex: /youtube\.com\/channel\/(UC[\w-]{22})/, direct: true },
    { regex: /youtube\.com\/@([^/?]+)/, direct: false },
    { regex: /youtube\.com\/c\/([^/?]+)/, direct: false },
    { regex: /youtube\.com\/user\/([^/?]+)/, direct: false }
  ];

  for (const { regex, direct } of patterns) {
    const match = channelUrl.match(regex);
    if (!match) continue;

    if (direct) return match[1];

    const response = await ytFetch(
      `/search?part=snippet&type=channel&q=${encodeURIComponent(match[1])}&maxResults=1`
    );
    const data = await response.json();
    const channelId = data.items?.[0]?.snippet?.channelId;
    if (channelId) return channelId;
  }

  throw new Error("Invalid YouTube channel URL");
}

export async function fetchChannelStats(
  channelId: string
): Promise<ChannelStats> {
  const response = await ytFetch(
    `/channels?part=snippet,statistics&id=${channelId}`
  );

  if (!response.ok) throw new Error("Failed to fetch channel data");

  const data = await response.json();
  const channel = data.items?.[0];

  if (!channel) throw new Error("Channel not found");

  const { snippet, statistics, id } = channel;

  return {
    id,
    title: snippet.title,
    description: snippet.description,
    thumbnail: snippet.thumbnails?.default?.url ?? "",
    avatar: snippet.thumbnails?.default?.url ?? "",
    handle: snippet.customUrl ?? snippet.title.toLowerCase().replace(/\s+/g, ""),
    subscriberCount: parseInt(statistics.subscriberCount ?? "0"),
    subscribers: parseInt(statistics.subscriberCount ?? "0"),
    videoCount: parseInt(statistics.videoCount ?? "0"),
    viewCount: parseInt(statistics.viewCount ?? "0"),
    totalViews: parseInt(statistics.viewCount ?? "0"),
    publishedAt: snippet.publishedAt
  };
}

export async function fetchChannelVideos(
  channelId: string,
  limit: number = DEFAULT_VIDEO_LIMIT
): Promise<VideoStats[]> {
  const searchResponse = await ytFetch(
    `/search?part=id&channelId=${channelId}&order=date&type=video&maxResults=${Math.min(limit, 50)}`
  );

  if (!searchResponse.ok) throw new Error("Failed to fetch video list");

  const searchData = await searchResponse.json();
  const videoIds: string[] = (searchData.items ?? [])
    .map((item: { id: { videoId: string } }) => item.id.videoId)
    .filter(Boolean);

  if (videoIds.length === 0) return [];

  const videosResponse = await ytFetch(
    `/videos?part=snippet,statistics,contentDetails&id=${videoIds.join(",")}`
  );

  if (!videosResponse.ok) throw new Error("Failed to fetch video details");

  const videosData = await videosResponse.json();

  return (videosData.items ?? []).map(
    (video: {
      id: string;
      snippet: {
        title: string;
        thumbnails: { medium?: { url: string }; default: { url: string } };
        publishedAt: string;
      };
      statistics: {
        viewCount?: string;
        likeCount?: string;
        commentCount?: string;
      };
      contentDetails: { duration: string };
    }) => {
      const { snippet, statistics, contentDetails } = video;

      const views = parseInt(statistics.viewCount ?? "0");
      const likes = parseInt(statistics.likeCount ?? "0");
      const comments = parseInt(statistics.commentCount ?? "0");
      const engagementRate = views > 0 ? ((likes + comments) / views) * 100 : 0;

      const durationMatch = contentDetails.duration.match(
        /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
      );
      const hours = parseInt(durationMatch?.[1] ?? "0");
      const minutes = parseInt(durationMatch?.[2] ?? "0");
      const seconds = parseInt(durationMatch?.[3] ?? "0");
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      const isShort = totalSeconds <= 60;

      const publishedAt = snippet.publishedAt;
      const daysSince = Math.max(
        1,
        Math.floor((Date.now() - new Date(publishedAt).getTime()) / 86400000)
      );
      const velocity = views / daysSince;
      const performanceScore = views / 1000 + engagementRate * 10 + likes / 100;

      const performanceLabel: VideoStats["performanceLabel"] =
        performanceScore > 100
          ? "Excellent"
          : performanceScore > 50
          ? "Good"
          : performanceScore > 20
          ? "Average"
          : "Poor";

      const badges: VideoStats["badges"] = [];
      if (performanceScore > 200) badges.push("top1");

      return {
        id: video.id,
        title: snippet.title,
        thumbnail: snippet.thumbnails.medium?.url ?? snippet.thumbnails.default.url,
        publishedAt,
        views,
        likes,
        comments,
        duration: totalSeconds,
        engagementRate,
        velocity,
        performanceScore,
        performanceLabel,
        isShort,
        badges,
        daysSince
      };
    }
  );
}