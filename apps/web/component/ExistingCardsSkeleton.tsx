import { Skeleton } from "@repo/ui"; 

export const CanvasCardSkeleton = () => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-4">
      <Skeleton className="h-2 w-32 bg-white" />
      <Skeleton className="h-4 w-28 bg-gray-500" />
      <Skeleton className="h-10 w-24 rounded-md bg-[#9B8EFF]" />
    </div>
  );
};

export const CanvasListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <CanvasCardSkeleton key={index} />
      ))}
    </div>
  );
};