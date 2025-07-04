"use client"

import dynamic from "next/dynamic"
import { ComponentType, useState, useEffect, createElement } from "react"

// Loading components for better UX
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
)

const LoadingSkeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-800 rounded-lg ${className}`}>
    <div className="p-6 space-y-4">
      <div className="h-4 bg-gray-700 rounded w-3/4" />
      <div className="h-4 bg-gray-700 rounded w-1/2" />
      <div className="h-32 bg-gray-700 rounded" />
    </div>
  </div>
)

const Loading3DModel = () => (
  <div className="flex flex-col items-center justify-center p-8 bg-black rounded-lg border border-blue-500/20">
    <div className="w-16 h-16 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
    <p className="text-gray-300 text-sm">Loading 3D Model...</p>
    <p className="text-gray-500 text-xs mt-1">This may take a moment</p>
  </div>
)

const LoadingChart = () => (
  <div className="flex flex-col items-center justify-center p-8 bg-gray-900 rounded-lg">
    <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
    <p className="text-gray-300 text-sm">Loading Analytics...</p>
  </div>
)

// 3D Model Components (Heavy - Dynamic Import)
export const Enhanced3DModel = dynamic(
  () => import("@/components/3d/enhanced-3d-model").then(mod => mod.Enhanced3DModel),
  {
    loading: Loading3DModel,
    ssr: false,
  }
)

export const InteractiveMedicalModels = dynamic(
  () => import("@/components/3d/interactive-medical-models").then(mod => mod.InteractiveMedicalModels),
  {
    loading: Loading3DModel,
    ssr: false,
  }
)

export const Immersive4DSpace = dynamic(
  () => import("@/components/3d/immersive-4d-space").then(mod => mod.Immersive4DSpace),
  {
    loading: Loading3DModel,
    ssr: false,
  }
)

export const BrainModel3D = dynamic(
  () => import("@/components/3d/brain-model-3d").then(mod => mod.BrainModel3D),
  {
    loading: Loading3DModel,
    ssr: false,
  }
)

// Visualization Components (Heavy - Dynamic Import)
export const LayeredAnatomyModel = dynamic(
  () => import("@/components/visualization/layered-anatomy-model").then(mod => mod.LayeredAnatomyModel),
  {
    loading: Loading3DModel,
    ssr: false,
  }
)

export const DetailedBrainTumor = dynamic(
  () => import("@/components/visualization/detailed-brain-tumor").then(mod => mod.DetailedBrainTumor),
  {
    loading: Loading3DModel,
    ssr: false,
  }
)

export const DamagedOrgansModel = dynamic(
  () => import("@/components/visualization/damaged-organs-model").then(mod => mod.DamagedOrgansModel),
  {
    loading: Loading3DModel,
    ssr: false,
  }
)

export const TumorVisualization3D = dynamic(
  () => import("@/components/visualization/tumor-model-3d").then(mod => mod.TumorVisualization3D),
  {
    loading: Loading3DModel,
    ssr: false,
  }
)

// Chart Components (Heavy - Dynamic Import)

export const SurvivalCurveChart = dynamic(
  () => import("@/components/visualization/survival-curve-chart").then(mod => mod.SurvivalCurveChart),
  {
    loading: LoadingChart,
    ssr: false,
  }
)

export const TreatmentEfficacyRadar = dynamic(
  () => import("@/components/visualization/treatment-efficacy-radar").then(mod => mod.TreatmentEfficacyRadar),
  {
    loading: LoadingChart,
    ssr: false,
  }
)





// Hook for conditional component loading
export function useConditionalImport<T extends ComponentType<any>>(
  condition: boolean,
  importFn: () => Promise<{ default: T }>,
  fallback?: ComponentType<any>
) {
  const [Component, setComponent] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (condition && !Component) {
      setLoading(true)
      importFn()
        .then(module => {
          setComponent(() => module.default)
          setLoading(false)
        })
        .catch(error => {
          console.error('Failed to load component:', error)
          setLoading(false)
        })
    }
  }, [condition, Component, importFn])

  if (!condition) return null
  if (loading) return fallback ? createElement(fallback) : <LoadingSpinner />
  if (!Component) return null

  return Component
}
