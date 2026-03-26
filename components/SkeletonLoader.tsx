export function SkeletonCard() {
  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="h-3 w-24 rounded-full shimmer-bg" />
        <div className="w-8 h-8 rounded-xl shimmer-bg" />
      </div>
      <div className="h-8 w-32 rounded-lg shimmer-bg" />
      <div className="h-3 w-20 rounded-full shimmer-bg" />
    </div>
  );
}

export function SkeletonVideoRow() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-100 dark:border-fence">
      <div className="w-28 h-16 rounded-xl shimmer-bg shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-4 w-3/4 rounded-full shimmer-bg" />
        <div className="h-3 w-1/2 rounded-full shimmer-bg" />
      </div>
      <div className="hidden sm:flex flex-col gap-2 items-end">
        <div className="h-4 w-16 rounded-full shimmer-bg" />
        <div className="h-3 w-12 rounded-full shimmer-bg" />
      </div>
    </div>
  );
}