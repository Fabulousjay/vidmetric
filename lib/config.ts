export const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY ?? '';
export const RAPIDAPI_HOST = 'youtube-data-api-v33.p.rapidapi.com';
export const RAPIDAPI_BASE = `https://${RAPIDAPI_HOST}`;

export const DEFAULT_VIDEO_LIMIT = 50;
export const MAX_VIDEO_LIMIT = 200;

export const SCORE_WEIGHTS = {
  views: 0.5,
  engagement: 0.3,
  velocity: 0.2,
};

export const SPIKE_THRESHOLD = 2.5;
export const TRENDING_THRESHOLD = 1.8;

export const PERFORMANCE_THRESHOLDS = {
  excellent: 75,
  good: 50,
  average: 25,
};

export const FEATURES = {
  charts: true,
  export: true,
  insights: true,
  topVideos: true,
  comparison: true,
  pdfReport: true,
};
