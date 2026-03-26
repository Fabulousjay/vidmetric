import { TrendingUp, TrendingDown, Minus, Trophy } from 'lucide-react';
import { formatNumber } from '@/lib/metrics';
import type { CompareEntry, VideoStats } from '@/types';

interface ComparePanelProps {
  primary: CompareEntry;
  secondary: CompareEntry;
}

interface Metric {
  label: string;
  primary: number;
  secondary: number;
  format: 'number' | 'percent' | 'raw';
}

function formatMetric(value: number, format: Metric['format']): string {
  if (format === 'percent') return `${value.toFixed(1)}%`;
  if (format === 'raw') return String(Math.round(value));
  return formatNumber(value);
}

function WinnerIcon({ wins }: { wins: boolean | null }) {
  if (wins === null)
    return <Minus size={14} className="text-fog" strokeWidth={2} />;
  if (wins)
    return <TrendingUp size={14} className="text-grove" strokeWidth={2} />;
  return <TrendingDown size={14} className="text-rose" strokeWidth={2} />;
}

function buildMetrics(
  primary: CompareEntry,
  secondary: CompareEntry,
): Metric[] {
  const avgViews = (entry: CompareEntry) =>
    entry.videos.length > 0 ?
      entry.videos.reduce(
        (sum: number, video: VideoStats) => sum + video.views,
        0,
      ) / entry.videos.length
    : 0;

  const avgEngagement = (entry: CompareEntry) =>
    entry.videos.length > 0 ?
      entry.videos.reduce(
        (sum: number, video: VideoStats) => sum + video.engagementRate,
        0,
      ) / entry.videos.length
    : 0;

  const avgVelocity = (entry: CompareEntry) =>
    entry.videos.length > 0 ?
      entry.videos.reduce(
        (sum: number, video: VideoStats) => sum + video.velocity,
        0,
      ) / entry.videos.length
    : 0;

  const topScore = (entry: CompareEntry) =>
    entry.videos.length > 0 ?
      Math.max(
        ...entry.videos.map((video: VideoStats) => video.performanceScore),
      )
    : 0;

  return [
    {
      label: 'Subscribers',
      primary: primary.channel.subscribers,
      secondary: secondary.channel.subscribers,
      format: 'number',
    },
    {
      label: 'Total Views',
      primary: primary.channel.totalViews,
      secondary: secondary.channel.totalViews,
      format: 'number',
    },
    {
      label: 'Avg Views/Video',
      primary: avgViews(primary),
      secondary: avgViews(secondary),
      format: 'number',
    },
    {
      label: 'Avg Engagement',
      primary: avgEngagement(primary),
      secondary: avgEngagement(secondary),
      format: 'percent',
    },
    {
      label: 'Avg Velocity',
      primary: avgVelocity(primary),
      secondary: avgVelocity(secondary),
      format: 'raw',
    },
    {
      label: 'Top Score',
      primary: topScore(primary),
      secondary: topScore(secondary),
      format: 'raw',
    },
  ];
}

export default function ComparePanel({
  primary,
  secondary,
}: ComparePanelProps) {
  const metrics = buildMetrics(primary, secondary);
  const primaryWins = metrics.filter(
    (metric) => metric.primary > metric.secondary,
  ).length;
  const secondaryWins = metrics.filter(
    (metric) => metric.secondary > metric.primary,
  ).length;
  const overallWinner =
    primaryWins > secondaryWins ?
      primary.channel.title
    : secondary.channel.title;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Trophy
          size={16}
          className="text-forest dark:text-grove"
          strokeWidth={2}
        />
        <h2 className="section-title">Channel Comparison</h2>
      </div>

      <div className="card overflow-hidden">
        <div className="grid grid-cols-3 bg-mint/50 dark:bg-muted/50 px-4 py-3 border-b border-gray-100 dark:border-fence">
          <span className="text-sm font-semibold text-ink dark:text-chalk truncate">
            {primary.channel.title}
          </span>
          <span className="label-caps text-center self-center">Metric</span>
          <span className="text-sm font-semibold text-ink dark:text-chalk truncate text-right">
            {secondary.channel.title}
          </span>
        </div>

        {metrics.map((metric) => {
          const primaryWins = metric.primary > metric.secondary;
          const secondaryWins = metric.secondary > metric.primary;
          const tied = metric.primary === metric.secondary;

          return (
            <div
              key={metric.label}
              className="grid grid-cols-3 px-4 py-3 border-b border-gray-100 dark:border-fence last:border-0 hover:bg-snow dark:hover:bg-fence/40 transition-colors">
              <div className="flex items-center gap-1.5">
                <WinnerIcon wins={tied ? null : primaryWins} />
                <span
                  className={`text-sm font-semibold ${primaryWins ? 'text-forest dark:text-grove' : 'text-fog'}`}>
                  {formatMetric(metric.primary, metric.format)}
                </span>
              </div>

              <span className="label-caps text-center self-center">
                {metric.label}
              </span>

              <div className="flex items-center justify-end gap-1.5">
                <span
                  className={`text-sm font-semibold ${secondaryWins ? 'text-forest dark:text-grove' : 'text-fog'}`}>
                  {formatMetric(metric.secondary, metric.format)}
                </span>
                <WinnerIcon wins={tied ? null : secondaryWins} />
              </div>
            </div>
          );
        })}

        <div className="flex items-center justify-center gap-2 px-4 py-3 bg-mint/30 dark:bg-muted/30">
          <Trophy size={14} className="text-gold" strokeWidth={2} />
          <span className="text-sm font-semibold text-ink dark:text-chalk">
            Overall winner:
          </span>
          <span className="text-sm font-bold text-forest dark:text-grove">
            {overallWinner}
          </span>
        </div>
      </div>
    </section>
  );
}
