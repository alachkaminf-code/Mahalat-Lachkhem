export default function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
      <div className="aspect-square bg-slate-200 dark:bg-slate-700 animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-20" />
          <div className="h-9 w-9 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
