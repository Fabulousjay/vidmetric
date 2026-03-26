import { SkeletonCard, SkeletonVideoRow } from '@/components/SkeletonLoader';

export default function AnalyzeLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-10">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>

      <div className="card overflow-hidden">
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonVideoRow key={index} />
        ))}
      </div>
    </div>
  );
}
