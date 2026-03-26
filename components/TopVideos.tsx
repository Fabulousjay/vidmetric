import Image from "next/image";
import { Medal, Flame, Zap, TrendingUp } from "lucide-react";
import { formatNumber } from "@/lib/metrics";
import type { VideoStats, Badge } from "@/types";

interface TopVideosProps {
  videos: VideoStats[];
}

const medalColors: Record<string, string> = {
  top1: "text-gold",
  top2: "text-fog",
  top3: "text-grove",
};

const badgeConfig: Record<Badge, { icon: React.ReactNode; className: string }> = {
  top1:     { icon: <Medal size={11} strokeWidth={2} />,    className: "bg-gold/20 text-gold" },
  top2:     { icon: <Medal size={11} strokeWidth={2} />,    className: "bg-fog/20 text-fog" },
  top3:     { icon: <Medal size={11} strokeWidth={2} />,    className: "bg-grove/20 text-grove" },
  trending: { icon: <Flame size={11} strokeWidth={2} />,    className: "bg-gold/20 text-gold" },
  spiked:   { icon: <Zap size={11} strokeWidth={2} />,      className: "bg-sky/20 text-sky" },
};

function BadgeChip({ badge }: { badge: Badge }) {
  const config = badgeConfig[badge];
  return (
    <span className={`badge ${config.className}`}>
      {config.icon}
      {badge.charAt(0).toUpperCase() + badge.slice(1)}
    </span>
  );
}

function TopVideoCard({ video, rank }: { video: VideoStats; rank: number }) {
  const medalBadge = (["top1", "top2", "top3"] as Badge[])[rank];
  const medalClass = medalColors[medalBadge] ?? "text-fog";

  return (
    <div className="card p-4 flex flex-col gap-4 animate-fade-up">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 left-2">
          <Medal size={20} className={medalClass} strokeWidth={2.5} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-display text-sm font-semibold text-ink dark:text-chalk line-clamp-2 leading-snug">
          {video.title}
        </p>

        <div className="flex flex-wrap gap-1">
          {video.badges.map((badge: Badge) => (
            <BadgeChip key={badge} badge={badge} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 dark:border-fence">
        {[
          { label: "Views",      value: formatNumber(video.views) },
          { label: "Velocity",   value: `${formatNumber(Math.round(video.velocity))}/d` },
          { label: "Score",      value: String(video.performanceScore) },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-0.5">
            <span className="label-caps text-[10px]">{label}</span>
            <span className="font-display text-sm font-bold text-ink dark:text-chalk">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TopVideos({ videos }: TopVideosProps) {
  const topThree = videos.slice(0, 3);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <TrendingUp size={16} className="text-forest dark:text-grove" strokeWidth={2} />
        <h2 className="section-title">Top Performing Videos</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {topThree.map((video, index) => (
          <TopVideoCard key={video.id} video={video} rank={index} />
        ))}
      </div>
    </section>
  );
}