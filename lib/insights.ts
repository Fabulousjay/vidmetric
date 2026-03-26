import type { VideoStats } from '@/types';

export interface Insight {
  type: 'success' | 'warning' | 'info';
  title: string;
  description: string;
}

export function generateInsights(videos: VideoStats[]): Insight[] {
  const insights: Insight[] = [];

  if (videos.length === 0) return insights;

  // Average engagement
  const avgEngagement =
    videos.reduce((sum, v) => sum + v.engagementRate, 0) / videos.length;

  if (avgEngagement > 5) {
    insights.push({
      type: 'success',
      title: 'High Engagement',
      description: `Your average engagement rate of ${avgEngagement.toFixed(1)}% is excellent!`,
    });
  } else if (avgEngagement < 2) {
    insights.push({
      type: 'warning',
      title: 'Low Engagement',
      description: `Your average engagement rate of ${avgEngagement.toFixed(1)}% could be improved.`,
    });
  }

  // Top performing video
  const topVideo = videos.reduce((prev, current) =>
    prev.performanceScore > current.performanceScore ? prev : current,
  );

  insights.push({
    type: 'info',
    title: 'Top Performer',
    description: `"${topVideo.title}" has the highest performance score.`,
  });

  // Upload frequency
  const sortedVideos = [...videos].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  if (sortedVideos.length >= 2) {
    const timeDiff =
      new Date(sortedVideos[0].publishedAt).getTime() -
      new Date(sortedVideos[1].publishedAt).getTime();
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

    if (daysDiff < 7) {
      insights.push({
        type: 'success',
        title: 'Consistent Uploads',
        description:
          "You're uploading frequently, which helps with algorithm visibility.",
      });
    } else if (daysDiff > 30) {
      insights.push({
        type: 'warning',
        title: 'Upload Frequency',
        description: 'Consider uploading more frequently to maintain momentum.',
      });
    }
  }

  // Shorts performance
  const shorts = videos.filter((v) => v.isShort);
  const regular = videos.filter((v) => !v.isShort);

  if (shorts.length > 0 && regular.length > 0) {
    const shortsAvg =
      shorts.reduce((sum, v) => sum + v.views, 0) / shorts.length;
    const regularAvg =
      regular.reduce((sum, v) => sum + v.views, 0) / regular.length;

    if (shortsAvg > regularAvg) {
      insights.push({
        type: 'success',
        title: 'Shorts Success',
        description: 'Your Shorts are performing better than regular videos!',
      });
    }
  }

  return insights;
}
