import type { VideoStats } from '@/types';

export function exportToCSV(videos: VideoStats[]): void {
  if (videos.length === 0) return;

  const headers = [
    'Title',
    'Published At',
    'Views',
    'Likes',
    'Comments',
    'Engagement Rate',
    'Velocity',
    'Performance Score',
    'Duration',
    'Is Short',
  ];

  const rows = videos.map((video) => [
    video.title,
    video.publishedAt,
    video.views.toString(),
    video.likes.toString(),
    video.comments.toString(),
    video.engagementRate.toString(),
    video.velocity.toString(),
    video.performanceScore.toString(),
    video.duration.toString(),
    video.isShort ? 'Yes' : 'No',
  ]);

  const csvContent = [headers, ...rows]
    .map((row) =>
      row.map((field) => `"${field.replace(/"/g, '""')}"`).join(','),
    )
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'videos.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
