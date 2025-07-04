"use client"

import dynamic from "next/dynamic"
import { ComponentType } from "react"

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
export const LayeredAnatomyModel = dynamic(
  () => import("@/components/3d/layered-anatomy-model").then(mod => mod.LayeredAnatomyModel),
  {
    loading: Loading3DModel,
    ssr: false, // 3D models should not be server-side rendered
  }
)

export const DetailedBrainTumor = dynamic(
  () => import("@/components/3d/detailed-brain-tumor").then(mod => mod.DetailedBrainTumor),
  {
    loading: Loading3DModel,
    ssr: false,
  }
)

export const DamagedOrgansModel = dynamic(
  () => import("@/components/3d/damaged-organs-model").then(mod => mod.DamagedOrgansModel),
  {
    loading: Loading3DModel,
    ssr: false,
  }
)

// Chart Components (Heavy - Dynamic Import)
export const AnalyticsCharts = dynamic(
  () => import("@/components/analytics/analytics-charts").then(mod => mod.AnalyticsCharts),
  {
    loading: LoadingChart,
    ssr: true, // Charts can be server-side rendered
  }
)

export const TreatmentProgressChart = dynamic(
  () => import("@/components/charts/treatment-progress-chart").then(mod => mod.TreatmentProgressChart),
  {
    loading: LoadingChart,
    ssr: true,
  }
)

export const PatientDemographicsChart = dynamic(
  () => import("@/components/charts/patient-demographics-chart").then(mod => mod.PatientDemographicsChart),
  {
    loading: LoadingChart,
    ssr: true,
  }
)

// Form Components (Medium Weight - Dynamic Import)
export const PatientRegistrationForm = dynamic(
  () => import("@/components/forms/patient-registration-form").then(mod => mod.PatientRegistrationForm),
  {
    loading: () => <LoadingSkeleton className="h-96" />,
    ssr: true,
  }
)

export const TreatmentPlanForm = dynamic(
  () => import("@/components/forms/treatment-plan-form").then(mod => mod.TreatmentPlanForm),
  {
    loading: () => <LoadingSkeleton className="h-80" />,
    ssr: true,
  }
)

export const MedicalReportEditor = dynamic(
  () => import("@/components/forms/medical-report-editor").then(mod => mod.MedicalReportEditor),
  {
    loading: () => <LoadingSkeleton className="h-64" />,
    ssr: false, // Rich text editor should not be SSR
  }
)

// Video/Telemedicine Components (Heavy - Dynamic Import)
export const VideoConsultationRoom = dynamic(
  () => import("@/components/telemedicine/video-consultation-room").then(mod => mod.VideoConsultationRoom),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8 bg-black rounded-lg">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Initializing Video Call...</p>
        </div>
      </div>
    ),
    ssr: false, // Video components should not be SSR
  }
)

// File Upload Components (Medium Weight - Dynamic Import)
export const MedicalFileUploader = dynamic(
  () => import("@/components/upload/medical-file-uploader").then(mod => mod.MedicalFileUploader),
  {
    loading: () => <LoadingSkeleton className="h-48" />,
    ssr: true,
  }
)

export const DicomViewer = dynamic(
  () => import("@/components/medical/dicom-viewer").then(mod => mod.DicomViewer),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8 bg-gray-900 rounded-lg">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Loading DICOM Viewer...</p>
        </div>
      </div>
    ),
    ssr: false, // DICOM viewer should not be SSR
  }
)

// Calendar/Scheduling Components (Medium Weight - Dynamic Import)
export const AdvancedScheduler = dynamic(
  () => import("@/components/schedule/advanced-scheduler").then(mod => mod.AdvancedScheduler),
  {
    loading: () => <LoadingSkeleton className="h-96" />,
    ssr: true,
  }
)

// Data Visualization Components (Heavy - Dynamic Import)
export const MedicalDataVisualizer = dynamic(
  () => import("@/components/visualization/medical-data-visualizer").then(mod => mod.MedicalDataVisualizer),
  {
    loading: LoadingChart,
    ssr: true,
  }
)

// AI/ML Components (Heavy - Dynamic Import)
export const AIInsightsDashboard = dynamic(
  () => import("@/components/ai/ai-insights-dashboard").then(mod => mod.AIInsightsDashboard),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Loading AI Insights...</p>
        </div>
      </div>
    ),
    ssr: false, // AI components should not be SSR
  }
)

// Utility function to preload components
export function preloadComponent(componentName: keyof typeof componentMap) {
  const component = componentMap[componentName]
  if (component && typeof component.preload === 'function') {
    component.preload()
  }
}

// Component map for programmatic access
const componentMap = {
  LayeredAnatomyModel,
  DetailedBrainTumor,
  DamagedOrgansModel,
  AnalyticsCharts,
  TreatmentProgressChart,
  PatientDemographicsChart,
  PatientRegistrationForm,
  TreatmentPlanForm,
  MedicalReportEditor,
  VideoConsultationRoom,
  MedicalFileUploader,
  DicomViewer,
  AdvancedScheduler,
  MedicalDataVisualizer,
  AIInsightsDashboard,
}

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
