// ================================================================
// SKELETON LOADER — Suspense Fallback for Lazy-Loaded Routes
// ================================================================
// This component renders while React.lazy() chunks are being
// downloaded. It provides visual feedback that content is loading,
// preventing the jarring "blank space" that occurs during chunk
// fetches on slower networks.
//
// The shimmer animation uses a CSS gradient that slides across
// the skeleton blocks, creating a "loading" effect similar to
// what LinkedIn, Facebook, and YouTube use.
// ================================================================

export default function SkeletonLoader() {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-slate-200 mb-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-slate-200 rounded-xl"></div>
            <div className="flex-1">
              <div className="h-8 bg-slate-200 rounded-lg w-2/3 mb-3"></div>
              <div className="h-4 bg-slate-100 rounded-lg w-1/3"></div>
            </div>
          </div>
          {/* Content skeleton blocks */}
          <div className="space-y-4">
            <div className="h-4 bg-slate-100 rounded-lg w-full"></div>
            <div className="h-4 bg-slate-100 rounded-lg w-5/6"></div>
            <div className="h-4 bg-slate-100 rounded-lg w-4/6"></div>
          </div>
        </div>
        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200"
            >
              <div className="w-12 h-12 bg-slate-200 rounded-xl mb-4"></div>
              <div className="h-6 bg-slate-200 rounded-lg w-1/2 mb-3"></div>
              <div className="h-4 bg-slate-100 rounded-lg w-full mb-2"></div>
              <div className="h-4 bg-slate-100 rounded-lg w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
