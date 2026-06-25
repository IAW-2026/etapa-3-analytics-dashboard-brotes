export default function DashboardLoading() {
  return (
    <div>
      <div className="mb-5">
        <div className="h-6 w-48 bg-[#CDE5C1] rounded animate-pulse mb-2" />
        <div className="h-4 w-72 bg-[#CDE5C1] rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white border border-[#CDE5C1] rounded-xl p-4">
            <div className="h-3 w-20 bg-[#CDE5C1] rounded animate-pulse mb-2" />
            <div className="h-6 w-24 bg-[#CDE5C1] rounded animate-pulse mb-1" />
            <div className="h-3 w-16 bg-[#CDE5C1] rounded animate-pulse" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2 bg-white border border-[#CDE5C1] rounded-xl p-4">
          <div className="h-4 w-40 bg-[#CDE5C1] rounded animate-pulse mb-2" />
          <div className="h-3 w-56 bg-[#CDE5C1] rounded animate-pulse mb-6" />
          <div className="h-48 bg-[#EAF3E6] rounded animate-pulse" />
        </div>
        <div className="bg-white border border-[#CDE5C1] rounded-xl p-4">
          <div className="h-4 w-32 bg-[#CDE5C1] rounded animate-pulse mb-2" />
          <div className="h-3 w-44 bg-[#CDE5C1] rounded animate-pulse mb-6" />
          <div className="h-48 bg-[#EAF3E6] rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
