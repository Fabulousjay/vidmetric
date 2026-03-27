import {
  RAPIDAPI_KEY,
  RAPIDAPI_HOST,
  RAPIDAPI_BASE,
  DEFAULT_VIDEO_LIMIT,
} from './config';
import {
  calcDaysSince,
  calcEngagementRate,
  calcVelocity,
  calcPerformanceScore,
  getPerformanceLabel,
  detectSpike,
  assignBadges,
} from './metrics';
import type { ChannelStats, VideoStats } from '@/types';

const rapidHeaders = {
  'x-rapidapi-key': RAPIDAPI_KEY,
  'x-rapidapi-host': RAPIDAPI_HOST,
};

type RawVideo = {
  id: string;
  snippet: {
    title: string;
    thumbnails: { medium?: { url: string }; default: { url: string } };
    publishedAt: string;
  };
  statistics: { viewCount?: string; likeCount?: string; commentCount?: string };
  contentDetails: { duration: string };
};

async function ytFetch(endpoint: string, attempt = 1): Promise<Response> {
  const response = await fetch(`${RAPIDAPI_BASE}${endpoint}`, {
    headers: rapidHeaders,
  });

  if (response.status === 429 && attempt < 3) {
    await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    return ytFetch(endpoint, attempt + 1);
  }

  if (response.status === 403) {
    throw new Error('Invalid RapidAPI key — check your RAPIDAPI_KEY env var');
  }

  return response;
}

export async function resolveChannelId(channelUrl: string): Promise<string> {
  const cleaned = channelUrl.trim().replace(/\/$/, '');

  const directMatch = cleaned.match(/youtube\.com\/channel\/(UC[\w-]{22})/);
  if (directMatch) return directMatch[1];

  const handleMatch = cleaned.match(/youtube\.com\/@([^/?&#]+)/);
  if (handleMatch) {
    const response = await ytFetch(
      `/channels?part=id&forHandle=${encodeURIComponent('@' + handleMatch[1])}`,
    );
    const data = await response.json();
    const channelId = data.items?.[0]?.id;
    if (channelId) return channelId;
  }

  const customMatch = cleaned.match(/youtube\.com\/c\/([^/?&#]+)/);
  if (customMatch) {
    const response = await ytFetch(
      `/channels?part=id&forUsername=${encodeURIComponent(customMatch[1])}`,
    );
    const data = await response.json();
    const channelId = data.items?.[0]?.id;
    if (channelId) return channelId;
  }

  const userMatch = cleaned.match(/youtube\.com\/user\/([^/?&#]+)/);
  if (userMatch) {
    const response = await ytFetch(
      `/channels?part=id&forUsername=${encodeURIComponent(userMatch[1])}`,
    );
    const data = await response.json();
    const channelId = data.items?.[0]?.id;
    if (channelId) return channelId;
  }

  throw new Error('Invalid YouTube channel URL');
}

export async function fetchChannelStats(
  channelId: string,
): Promise<ChannelStats> {
  const response = await ytFetch(
    `/channels?part=snippet,statistics&id=${channelId}`,
  );
  if (!response.ok) throw new Error('Failed to fetch channel data');

  const data = await response.json();
  const channel = data.items?.[0];
  if (!channel) throw new Error('Channel not found');

  const { snippet, statistics, id } = channel;

  return {
    id,
    title: snippet.title,
    description: snippet.description,
    thumbnail: snippet.thumbnails?.default?.url ?? '',
    avatar: snippet.thumbnails?.default?.url ?? '',
    handle:
      snippet.customUrl ?? snippet.title.toLowerCase().replace(/\s+/g, ''),
    subscriberCount: parseInt(statistics.subscriberCount ?? '0'),
    subscribers: parseInt(statistics.subscriberCount ?? '0'),
    videoCount: parseInt(statistics.videoCount ?? '0'),
    viewCount: parseInt(statistics.viewCount ?? '0'),
    totalViews: parseInt(statistics.viewCount ?? '0'),
    publishedAt: snippet.publishedAt,
  };
}

function parseDuration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const hours = parseInt(match?.[1] ?? '0');
  const minutes = parseInt(match?.[2] ?? '0');
  const seconds = parseInt(match?.[3] ?? '0');
  return hours * 3600 + minutes * 60 + seconds;
}

function parseVideo(video: RawVideo): VideoStats {
  const { snippet, statistics, contentDetails } = video;

  const views = parseInt(statistics.viewCount ?? '0');
  const likes = parseInt(statistics.likeCount ?? '0');
  const comments = parseInt(statistics.commentCount ?? '0');
  const duration = parseDuration(contentDetails.duration);
  const daysSince = calcDaysSince(snippet.publishedAt);
  const engagementRate = calcEngagementRate(views, likes, comments);
  const velocity = calcVelocity(views, daysSince);

  return {
    id: video.id,
    title: snippet.title,
    thumbnail: snippet.thumbnails.medium?.url ?? snippet.thumbnails.default.url,
    publishedAt: snippet.publishedAt,
    views,
    likes,
    comments,
    duration,
    isShort: duration <= 60,
    engagementRate,
    velocity,
    daysSince,
    spiked: false,
    performanceScore: 0,
    performanceLabel: 'Average' as const,
    badges: [],
  };
}

function scoreAndBadge(raw: VideoStats[]): VideoStats[] {
  const maxViews = Math.max(...raw.map((video) => video.views));
  const maxVelocity = Math.max(...raw.map((video) => video.velocity));
  const avgVelocity =
    raw.reduce((sum, video) => sum + video.velocity, 0) / raw.length;

  const scored = raw.map((video) => {
    const score = calcPerformanceScore(
      video.views,
      maxViews,
      video.engagementRate,
      video.velocity,
      maxVelocity,
    );
    return {
      ...video,
      spiked: detectSpike(video.velocity, avgVelocity),
      performanceScore: score,
      performanceLabel: getPerformanceLabel(score),
    };
  });

  const sorted = [...scored].sort(
    (videoA, videoB) => videoB.performanceScore - videoA.performanceScore,
  );
  return assignBadges(sorted, avgVelocity);
}

export async function fetchChannelVideos(
  channelId: string,
  limit: number = DEFAULT_VIDEO_LIMIT,
): Promise<VideoStats[]> {
  const searchRes = await ytFetch(
    `/search?part=id&channelId=${channelId}&order=date&type=video&maxResults=${Math.min(limit, 50)}`,
  );
  if (!searchRes.ok) throw new Error('Failed to fetch video list');

  const searchData = await searchRes.json();
  const videoIds: string[] = (searchData.items ?? [])
    .map((item: { id: { videoId: string } }) => item.id.videoId)
    .filter(Boolean);

  if (videoIds.length === 0) return [];

  const videosRes = await ytFetch(
    `/videos?part=snippet,statistics,contentDetails&id=${videoIds.join(',')}`,
  );
  if (!videosRes.ok) throw new Error('Failed to fetch video details');

  const videosData = await videosRes.json();
  const raw = (videosData.items ?? []).map((video: RawVideo) =>
    parseVideo(video),
  );

  return scoreAndBadge(raw);
}
