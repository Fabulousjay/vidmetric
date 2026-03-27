import {
  SCORE_WEIGHTS,
  SPIKE_THRESHOLD,
  TRENDING_THRESHOLD,
  PERFORMANCE_THRESHOLDS,
} from './config';
import type { VideoStats, Badge } from '@/types';

export function formatNumber(num: number): string {
  if (num >= 1_000_000)
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toString();
}

export function calcDaysSince(iso: string): number {
  const diff = Date.now() - new Date(iso).getTime();
  return Math.max(1, Math.floor(diff / 86_400_000));
}

export function calcEngagementRate(
  views: number,
  likes: number,
  comments: number,
): number {
  if (views === 0) return 0;
  return ((likes + comments) / views) * 100;
}

export function calcVelocity(views: number, days: number): number {
  return views / days;
}

export function calcPerformanceScore(
  views: number,
  maxViews: number,
  engagementRate: number,
  velocity: number,
  maxVelocity: number,
): number {
  const viewScore = maxViews > 0 ? views / maxViews : 0;
  const engScore = Math.min(engagementRate / 10, 1);
  const velocityScore = maxVelocity > 0 ? velocity / maxVelocity : 0;

  const raw =
    viewScore * SCORE_WEIGHTS.views +
    engScore * SCORE_WEIGHTS.engagement +
    velocityScore * SCORE_WEIGHTS.velocity;

  return Math.round(raw * 100);
}

export function getPerformanceLabel(
  score: number,
): VideoStats['performanceLabel'] {
  if (score >= PERFORMANCE_THRESHOLDS.excellent) return 'Excellent';
  if (score >= PERFORMANCE_THRESHOLDS.good) return 'Good';
  if (score >= PERFORMANCE_THRESHOLDS.average) return 'Average';
  return 'Poor';
}

export function detectSpike(velocity: number, avgVelocity: number): boolean {
  return velocity > avgVelocity * SPIKE_THRESHOLD;
}

export function isTrending(velocity: number, avgVelocity: number): boolean {
  return velocity > avgVelocity * TRENDING_THRESHOLD;
}

export function assignBadges(
  videos: VideoStats[],
  avgVelocity: number,
): VideoStats[] {
  return videos.map((video, index) => {
    const badges: Badge[] = [];

    if (index === 0) badges.push('top1');
    if (index === 1) badges.push('top2');
    if (index === 2) badges.push('top3');
    if (detectSpike(video.velocity, avgVelocity)) badges.push('spiked');
    if (isTrending(video.velocity, avgVelocity)) badges.push('trending');

    return { ...video, badges };
  });
}
