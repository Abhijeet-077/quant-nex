"use client"

import React from 'react'
import { cn } from '@/lib/utils'

// Base skeleton component
interface SkeletonProps {
  className?: string
  children?: React.ReactNode
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, children }) => (
  <div
    className={cn(
      "animate-pulse bg-gray-800 rounded-lg",
      className
    )}
    aria-hidden="true"
  >
    {children}
  </div>
)

// Medical data loading skeleton
export const MedicalDataSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("p-4 space-y-3", className)}>
    <div className="flex items-center space-x-3">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-16" />
    </div>
    <Skeleton className="h-8 w-24" />
    <div className="space-y-2">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
    </div>
  </div>
)

// Patient card loading skeleton
export const PatientCardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("card-glow p-6 space-y-4", className)}>
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
    <div className="space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-12" />
      </div>
      <div className="flex justify-between items-center">
        <Skeleton className="h-3 w-24" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-2 w-20" />
          <Skeleton className="h-3 w-8" />
        </div>
      </div>
    </div>
  </div>
)

// Chart loading skeleton
export const ChartSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("p-6 space-y-4", className)}>
    <div className="flex items-center justify-between">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-4 w-20" />
    </div>
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className={`h-4 w-${Math.floor(Math.random() * 40) + 20}`} />
          <Skeleton className="h-4 w-12" />
        </div>
      ))}
    </div>
  </div>
)

// 3D Model loading component
export const Model3DLoading: React.FC<{ 
  progress?: number
  className?: string 
}> = ({ progress = 0, className }) => (
  <div className={cn(
    "flex flex-col items-center justify-center p-8 bg-black rounded-lg border border-blue-500/20",
    className
  )}>
    <div className="relative w-24 h-24 mb-4">
      {/* Spinning 3D cube animation */}
      <div className="absolute inset-0 animate-spin">
        <div className="w-full h-full border-2 border-blue-500 border-t-transparent rounded-lg transform rotate-45" />
      </div>
      <div className="absolute inset-2 animate-spin" style={{ animationDirection: 'reverse' }}>
        <div className="w-full h-full border border-cyan-400 border-b-transparent rounded-lg transform -rotate-45" />
      </div>
    </div>
    
    <p className="text-gray-300 text-sm mb-2">Loading 3D Model...</p>
    
    {progress > 0 && (
      <div className="w-48 bg-gray-700 rounded-full h-2 mb-2">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    )}
    
    <p className="text-gray-500 text-xs text-center">
      {progress > 0 ? `${progress}% loaded` : 'Initializing...'}
    </p>
  </div>
)

// Medical imaging loading
export const MedicalImagingLoading: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn(
    "flex flex-col items-center justify-center p-8 bg-gray-900 rounded-lg",
    className
  )}>
    <div className="relative w-16 h-16 mb-4">
      <div className="absolute inset-0 border-4 border-gray-600 rounded-full" />
      <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
    <p className="text-gray-300 text-sm mb-1">Processing Medical Images...</p>
    <p className="text-gray-500 text-xs">This may take a moment</p>
  </div>
)

// Video consultation loading
export const VideoConsultationLoading: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn(
    "flex flex-col items-center justify-center p-8 bg-black rounded-lg border border-blue-500/30",
    className
  )}>
    <div className="relative w-20 h-20 mb-4">
      <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-pulse" />
      <div className="absolute inset-2 bg-blue-500/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="absolute inset-4 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      <svg className="absolute inset-6 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
      </svg>
    </div>
    <p className="text-gray-300 text-sm mb-1">Connecting to Video Call...</p>
    <p className="text-gray-500 text-xs">Checking camera and microphone</p>
  </div>
)

// Analytics loading
export const AnalyticsLoading: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("space-y-6", className)}>
    {/* KPI Cards */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="card-glow p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-12 w-12 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
    
    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartSkeleton className="card-glow" />
      <ChartSkeleton className="card-glow" />
    </div>
  </div>
)

// Form loading overlay
export const FormLoadingOverlay: React.FC<{ 
  isVisible: boolean
  message?: string
  className?: string 
}> = ({ isVisible, message = "Saving...", className }) => {
  if (!isVisible) return null

  return (
    <div className={cn(
      "absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg",
      className
    )}>
      <div className="bg-gray-900 p-6 rounded-lg border border-blue-500/30 text-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-white text-sm">{message}</p>
      </div>
    </div>
  )
}

// Page loading component
export const PageLoading: React.FC<{ 
  message?: string
  className?: string 
}> = ({ message = "Loading...", className }) => (
  <div className={cn(
    "min-h-screen flex items-center justify-center bg-black",
    className
  )}>
    <div className="text-center">
      <div className="relative w-16 h-16 mx-auto mb-6">
        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full" />
        <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
      <h2 className="text-xl font-semibold text-white mb-2 glow-text">Quant-NEX</h2>
      <p className="text-gray-300">{message}</p>
    </div>
  </div>
)

// Search loading
export const SearchLoading: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("flex items-center space-x-2 p-4", className)}>
    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    <span className="text-gray-300 text-sm">Searching...</span>
  </div>
)

// List loading with multiple items
export const ListLoading: React.FC<{ 
  count?: number
  itemHeight?: string
  className?: string 
}> = ({ count = 5, itemHeight = "h-16", className }) => (
  <div className={cn("space-y-3", className)}>
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton key={i} className={cn("w-full", itemHeight)} />
    ))}
  </div>
)

// Medical device connection loading
export const MedicalDeviceLoading: React.FC<{ 
  deviceName?: string
  className?: string 
}> = ({ deviceName = "Medical Device", className }) => (
  <div className={cn(
    "flex flex-col items-center justify-center p-6 bg-gray-900 rounded-lg border border-green-500/30",
    className
  )}>
    <div className="relative w-12 h-12 mb-4">
      <div className="absolute inset-0 border-2 border-green-500 rounded-full animate-ping" />
      <div className="absolute inset-1 border-2 border-green-400 rounded-full animate-pulse" />
      <div className="absolute inset-2 bg-green-500 rounded-full" />
    </div>
    <p className="text-gray-300 text-sm mb-1">Connecting to {deviceName}...</p>
    <p className="text-gray-500 text-xs">Establishing secure connection</p>
  </div>
)
