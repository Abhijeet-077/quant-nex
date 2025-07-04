import { LoadingSpinner } from "./loading-spinner"

export function PageLoading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-black/80 p-8 rounded-xl border border-white/10 shadow-xl">
        <LoadingSpinner size="lg" text="Loading page..." />
      </div>
    </div>
  )
}
