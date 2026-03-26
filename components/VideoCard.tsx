import Image from "next/image";
import { Medal, Flame, Zap, Eye, ThumbsUp, MessageCircle, Clock } from "lucide-react";
import { formatNumber } from "@/lib/metrics";
import type { VideoStats, Badge } from "@/types";

interface VideoCardProps {
  video:        VideoStats;
  searchQuery:  string;
}

const badgeConfig: Record<Badge, { icon: React.ReactNode; className: string }> = {
  top1:     { icon: <Medal size={10} strokeWidth={2} />,  className: "bg-gold/20 text-gold" },
  top2:     { icon: <Medal size={10} strokeWidth={2} />,  className: "bg-fog/20 text-fog" },
  top3:     { icon: <Medal size={10} strokeWidth={2} />,  className: "bg-grove/20 text-grove" },
  trending: { icon: <Flame size={10} strokeWidth={2} />,  className: "bg-gold/20 text-gold" },
  spiked:   { icon: <Zap size={10} strokeWidth={2} />,    className: "bg-sky/20 text-sky" },
};

const labelColors: Record<VideoStats["performanceLabel"], string> = {
  Excellent: "bg-forest/10 text-forest dark:text-grove",
  Good:      "bg-grove/20 text-grove",
  Average:   "bg-gold/20 text-gold",
  Poor:      "bg-rose/20 text-rose",
};

function HighlightedTitle({ title, query }: { title: string; query: string }) {
  if (!query.trim()) return <span>{title}</span>;

  const regex  = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts  = title.split(regex);

  return (
    <span>
      {parts.map((part, index) =>
        regex.test(part)
          ? <mark key={index} className="bg-gold/40 text-ink dark:text-ink rounded px-0.5">{part}</mark>
          : <span key={index}>{part}</span>
      )}
    </span>
  );
}

export default function VideoCard({ video, searchQuery }: VideoCardProps) {
  return (
    <div className="flex items-start gap-4 p-4 border-b border-gray-100 dark:border-fence hover:bg-mint/30 dark:hover:bg-muted/30 transition-colors duration-150">
      <div className="relative w-28 h-16 rounded-xl overflow-hidden shrink-0">
        <Image src={video.thumbnail} alt={video.title} fill className="object-cover" />
        {video.isShort && (
          <span className="absolute bottom-1 left-1 badge bg-rose/80 text-white text-[9px] py-0.5">Short</span>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <p className="text-sm font-medium text-ink dark:text-chalk line-clamp-2 leading-snug">
          <HighlightedTitle title={video.title} query={searchQuery} />
        </p>

        <div className="flex flex-wrap gap-1">
          {video.badges.map((badge: Badge) => (
            <span key={badge} className={`badge ${badgeConfig[badge].className}`}>
              {badgeConfig[badge].icon}
              {badge.charAt(0).toUpperCase() + badge.slice(1)}
            </span>
          ))}
          <span className={`badge ${labelColors[video.performanceLabel]}`}>
            {video.performanceLabel}
          </span>
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-fog">
          <span className="flex items-center gap-1"><Eye size={11} strokeWidth={2} />{formatNumber(video.views)}</span>
          <span className="flex items-center gap-1"><ThumbsUp size={11} strokeWidth={2} />{formatNumber(video.likes)}</span>
          <span className="flex items-center gap-1"><MessageCircle size={11} strokeWidth={2} />{formatNumber(video.comments)}</span>
          <span className="flex items-center gap-1"><Clock size={11} strokeWidth={2} />{video.daysSince}d ago</span>
        </div>
      </div>

      <div className="shrink-0 flex flex-col items-end gap-1.5">
        <span className="font-display text-xl font-bold text-forest dark:text-grove">
          {video.performanceScore}
        </span>
        <span className="label-caps text-[10px]">score</span>
        <span className="text-xs text-fog">{formatNumber(Math.round(video.velocity))}/day</span>
      </div>
    </div>
  );
}