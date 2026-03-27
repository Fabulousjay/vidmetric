export interface VideoStats {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  views: number;
  likes: number;
  comments: number;
  duration: number;
  engagementRate: number;
  velocity: number;
  performanceScore: number;
  performanceLabel: 'Excellent' | 'Good' | 'Average' | 'Poor';
  isShort: boolean;
  spiked:boolean;
  badges: Badge[];
  daysSince: number;
}

export type Badge = 'top1' | 'top2' | 'top3' | 'trending' | 'spiked';

export interface ChannelStats {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
  publishedAt: string;
  avatar: string;
  handle: string;
  subscribers: number;
  totalViews: number;
}

export interface FilterState {
  search: string;
  sortBy: SortKey;
  sortOrder: 'asc' | 'desc';
  dateRange: string;
  minViews: number;
  minEngagement: number;
  contentType: string;
  sortKey: SortKey;
  sortDir: 'asc' | 'desc';
}

export type SortKey =
  | 'publishedAt'
  | 'views'
  | 'likes'
  | 'comments'
  | 'engagementRate'
  | 'velocity'
  | 'performanceScore';

export interface CompareEntry {
  id: string;
  title: string;
  channel: ChannelStats;
  videos: VideoStats[];
}
