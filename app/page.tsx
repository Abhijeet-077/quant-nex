"use client"

import { Suspense } from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { LandingPage } from "@/components/landing-page"
import { LandingPageFallback } from "@/components/landing-page-fallback"

// Loading component for Suspense
function LandingPageLoading() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Quant-NEX Medical
        </h1>
        <p className="text-xl text-gray-300">Loading interactive medical platform...</p>
      </div>
    </div>
  )
}

export default function Home() {
  // Deployment test - timestamp: 2025-01-06 18:15:00
  return (
    <ErrorBoundary
      fallback={<LandingPageFallback />}
      onError={(error, errorInfo) => {
        console.error('Landing page error:', error, errorInfo)
      }}
    >
      <Suspense fallback={<LandingPageLoading />}>
        <LandingPage />
      </Suspense>
    </ErrorBoundary>
  )
}
