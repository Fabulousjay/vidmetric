import {
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Zap,
  BarChart2,
} from 'lucide-react';
import { generateInsights } from '@/lib/insights';
import type { Insight } from '@/lib/insights';
import type { VideoStats } from '@/types';

interface InsightPanelProps {
  videos: VideoStats[];
}

const insightIcons = [Lightbulb, TrendingUp, Zap, BarChart2, AlertTriangle];

const insightColors = [
  'text-gold bg-gold/10',
  'text-grove bg-grove/10',
  'text-sky bg-sky/10',
  'text-forest bg-forest/10 dark:text-grove',
  'text-rose bg-rose/10',
];

export default function InsightPanel({ videos }: InsightPanelProps) {
  const insights = generateInsights(videos);
  if (insights.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Lightbulb
          size={16}
          className="text-forest dark:text-grove"
          strokeWidth={2}
        />
        <h2 className="section-title">AI-Generated Insights</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {insights.map((insight: Insight, index: number) => {
          const Icon = insightIcons[index % insightIcons.length];
          const colorClass = insightColors[index % insightColors.length];

          return (
            <div
              key={index}
              className="card p-4 flex items-start gap-3 animate-fade-up"
              style={{ animationDelay: `${index * 80}ms` }}>
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                <Icon size={14} strokeWidth={2} />
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-semibold text-ink dark:text-chalk">
                  {insight.title}
                </p>
                <p className="text-xs text-fog leading-relaxed">
                  {insight.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
