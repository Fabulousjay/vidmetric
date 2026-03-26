"use client";

import { Search, X } from "lucide-react";
import { useVideoStore } from "@/store/useVideoStore";
import type { FilterState, SortKey } from "@/types";

const dateOptions: { label: string; value: FilterState["dateRange"] }[] = [
  { label: "All time", value: "all" },
  { label: "Last 7d",  value: "7" },
  { label: "Last 30d", value: "30" },
  { label: "Last 90d", value: "90" },
];

const viewOptions: { label: string; value: FilterState["minViews"] }[] = [
  { label: "Any views", value: 0 },
  { label: "10K+",      value: 10000 },
  { label: "100K+",     value: 100000 },
];

const typeOptions: { label: string; value: FilterState["contentType"] }[] = [
  { label: "All",    value: "all" },
  { label: "Shorts", value: "short" },
  { label: "Long",   value: "long" },
];

const sortOptions: { label: string; value: SortKey }[] = [
  { label: "Score",       value: "performanceScore" },
  { label: "Views",       value: "views" },
  { label: "Velocity",    value: "velocity" },
  { label: "Engagement",  value: "engagementRate" },
  { label: "Date",        value: "publishedAt" },
];

function PillGroup<T extends string | number>({
  options,
  active,
  onSelect,
}: {
  options: { label: string; value: T }[];
  active:  T;
  onSelect:(value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(({ label, value }) => (
        <button
          key={String(value)}
          onClick={() => onSelect(value)}
          className={`px-3 py-1.5 rounded-pill text-xs font-medium transition-all duration-200
            ${active === value
              ? "bg-forest text-white"
              : "bg-mint dark:bg-muted text-forest dark:text-sky hover:bg-grove/20"
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default function FilterBar() {
  const { filters, setFilters } = useVideoStore();

  const clearSearch = () => setFilters({ search: "" });

  return (
    <div className="card p-4 flex flex-col gap-4">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-fog pointer-events-none" />
        <input
          type="text"
          value={filters.search}
          onChange={(event) => setFilters({ search: event.target.value })}
          placeholder="Search video titles..."
          className="input-base pl-9 pr-9 text-sm py-2"
        />
        {filters.search && (
          <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-fog hover:text-rose transition-colors">
            <X size={14} />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-3">
        <div className="flex flex-col gap-1.5">
          <span className="label-caps text-[10px]">Date range</span>
          <PillGroup options={dateOptions} active={filters.dateRange} onSelect={(value) => setFilters({ dateRange: value })} />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="label-caps text-[10px]">Min views</span>
          <PillGroup options={viewOptions} active={filters.minViews} onSelect={(value) => setFilters({ minViews: value })} />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="label-caps text-[10px]">Content type</span>
          <PillGroup options={typeOptions} active={filters.contentType} onSelect={(value) => setFilters({ contentType: value })} />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="label-caps text-[10px]">Sort by</span>
          <PillGroup options={sortOptions} active={filters.sortKey} onSelect={(value) => setFilters({ sortKey: value })} />
        </div>
      </div>
    </div>
  );
}