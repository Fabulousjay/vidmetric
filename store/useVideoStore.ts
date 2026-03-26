import { create } from 'zustand';
import type {
  ChannelStats,
  VideoStats,
  CompareEntry,
  FilterState,
  SortKey,
} from '@/types';

interface VideoStore {
  channel: ChannelStats | null;
  videos: VideoStats[];
  compare: CompareEntry[];
  compareLoading: boolean;
  channelLoading: boolean;
  videosLoading: boolean;
  error: string | null;
  filters: FilterState;
  reset: () => void;
  setChannel: (channel: ChannelStats) => void;
  setVideos: (videos: VideoStats[]) => void;
  setCompare: (compare: CompareEntry[]) => void;
  setCompareLoading: (loading: boolean) => void;
  setChannelLoading: (loading: boolean) => void;
  setVideosLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  addToCompare: (entry: CompareEntry) => void;
  removeFromCompare: (id: string) => void;
}

const initialFilters: FilterState = {
  search: '',
  sortBy: 'publishedAt',
  sortOrder: 'desc',
  dateRange: 'all',
  minViews: 0,
  minEngagement: 0,
  contentType: 'all',
  sortKey: 'publishedAt',
  sortDir: 'desc',
};

export const useVideoStore = create<VideoStore>((set, get) => ({
  channel: null,
  videos: [],
  compare: [],
  compareLoading: false,
  channelLoading: false,
  videosLoading: false,
  error: null,
  filters: initialFilters,

  reset: () =>
    set({
      channel: null,
      videos: [],
      compare: [],
      compareLoading: false,
      channelLoading: false,
      videosLoading: false,
      error: null,
      filters: initialFilters,
    }),

  setChannel: (channel) => set({ channel }),
  setVideos: (videos) => set({ videos }),
  setCompare: (compare) => set({ compare }),
  setCompareLoading: (compareLoading) => set({ compareLoading }),
  setChannelLoading: (channelLoading) => set({ channelLoading }),
  setVideosLoading: (videosLoading) => set({ videosLoading }),
  setError: (error) => set({ error }),
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  addToCompare: (entry) =>
    set((state) => ({
      compare: [...state.compare, entry],
    })),

  removeFromCompare: (id) =>
    set((state) => ({
      compare: state.compare.filter((entry) => entry.id !== id),
    })),
}));
