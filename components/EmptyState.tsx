import { TrendingUp, Video } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-6 animate-fade-up">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl bg-mint dark:bg-muted flex items-center justify-center">
          <Video
            size={36}
            className="text-forest dark:text-grove"
            strokeWidth={1.5}
          />
        </div>
        <div className="absolute -top-1 -right-1 w-7 h-7 rounded-xl bg-gold/20 flex items-center justify-center">
          <TrendingUp size={14} className="text-gold" strokeWidth={2} />
        </div>
      </div>

      <h2 className="font-display text-2xl font-bold text-ink dark:text-chalk mb-3">
        Analyze any YouTube channel
      </h2>

      <p className="text-fog text-sm max-w-sm leading-relaxed">
        Paste a competitor channel URL above to instantly see their top
        performing videos, engagement trends, and performance scores.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {[
          'Performance Scoring',
          'Trend Detection',
          'Channel Comparison',
          'CSV & PDF Export',
        ].map((feature) => (
          <span
            key={feature}
            className="badge bg-mint dark:bg-muted text-forest dark:text-sky">
            {feature}
          </span>
        ))}
      </div>
    </div>
  );
}
