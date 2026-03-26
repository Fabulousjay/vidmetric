'use client';

import Image from 'next/image';
import { Download, FileText } from 'lucide-react';
import { FEATURES } from '@/lib/flags';
import { exportToCSV } from '@/lib/export';
import { generatePDFReport } from '@/lib/pdf';
import type { ChannelStats, VideoStats } from '@/types';

interface ChannelHeaderProps {
  channel: ChannelStats;
  videos: VideoStats[];
}

export default function ChannelHeader({ channel, videos }: ChannelHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-up">
      <div className="flex items-center gap-4">
        <Image
          src={channel.avatar || '/fallback-avatar.png'}
          alt={channel.title || 'Channel'}
          width={56}
          height={56}
          className="rounded-2xl"
        />
        <div className="flex flex-col gap-0.5">
          <h1 className="font-display text-xl font-bold text-ink dark:text-chalk">
            {channel.title || 'Unknown channel'}
          </h1>
          <p className="text-fog text-sm">{channel.handle || '@unknown'}</p>
        </div>
      </div>

      {FEATURES.EXPORT_CSV && videos.length > 0 && (
        <div className="flex gap-2">
          <button
            onClick={() => exportToCSV(videos)}
            className="btn-ghost flex items-center gap-2">
            <Download size={14} strokeWidth={2} />
            CSV
          </button>
          <button
            onClick={() => generatePDFReport(channel, videos)}
            className="btn-ghost flex items-center gap-2">
            <FileText size={14} strokeWidth={2} />
            PDF
          </button>
        </div>
      )}
    </div>
  );
}
