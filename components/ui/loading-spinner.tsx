import { Loader2 } from "lucide-react"

export function LoadingSpinner({
  size = "default",
  text = "Loading...",
}: { size?: "sm" | "default" | "lg"; text?: string }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-8 w-8",
    lg: "h-12 w-12",
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-purple-500`} />
      {text && <p className="mt-4 text-gray-400">{text}</p>}
    </div>
  )
}
