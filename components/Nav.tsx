"use client";

import Link from "next/link";
import { BarChart2 } from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 dark:border-fence bg-snow/80 dark:bg-surface/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-forest flex items-center justify-center group-hover:bg-grove transition-colors duration-200">
            <BarChart2 size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-lg text-ink dark:text-chalk tracking-tight">
            VidMetrics
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <span className="label-caps hidden sm:block">YouTube Competitor Analysis</span>
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
}