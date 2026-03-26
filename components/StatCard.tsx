import { LucideIcon } from "lucide-react";
import { formatNumber } from "@/lib/metrics";

interface StatCardProps {
  label:      string;
  value:      number;
  icon:       LucideIcon;
  format?:    "number" | "percent" | "raw";
  sub?:       string;
}

function renderValue(value: number, format: StatCardProps["format"]): string {
  if (format === "percent") return `${value.toFixed(1)}%`;
  if (format === "raw")     return String(value);
  return formatNumber(value);
}

export default function StatCard({ label, value, icon: Icon, format = "number", sub }: StatCardProps) {
  return (
    <div className="card p-5 flex flex-col gap-3 animate-fade-up">
      <div className="flex items-center justify-between">
        <span className="label-caps">{label}</span>
        <div className="w-8 h-8 rounded-xl bg-mint dark:bg-muted flex items-center justify-center">
          <Icon size={15} className="text-forest dark:text-sky" strokeWidth={2} />
        </div>
      </div>

      <div>
        <p className="font-display text-2xl font-bold text-ink dark:text-chalk">
          {renderValue(value, format)}
        </p>
        {sub && <p className="text-xs text-fog mt-1">{sub}</p>}
      </div>
    </div>
  );
}