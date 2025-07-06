"use client"

import React, { Suspense, useRef, useState, useEffect, useCallback, ErrorBoundary } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Heart, 
  Target, 
  Eye, 
  AlertTriangle, 
  RefreshCw,
  Play,
  Pause,
  Settings,
  CheckCircle
} from 'lucide-react'

// Safe 3D system that works without external dependencies initially
interface Reliable3DSystemProps {
  modelType: "brain" | "heart" | "tumor" | "liver" | "kidney" | "lung" | "spine"
  title: string
  showControls?: boolean
  autoRotate?: boolean
  className?: string
  interactive?: boolean
  showAnalysis?: boolean
  onModelClick?: (part: string) => void
}

// WebGL detection utility
function useWebGLSupport() {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      
      if (gl) {
        setWebglSupported(true)
        setError(null)
      } else {
        setWebglSupported(false)
        setError('WebGL not supported')
      }
      
      canvas.remove()
    } catch (err) {
      setWebglSupported(false)
      setError(err instanceof Error ? err.message : 'WebGL detection failed')
    }
  }, [])

  return { webglSupported, error }
}

// Fallback 2D visualization component
function Fallback2DVisualization({ 
  modelType, 
  title, 
  onModelClick 
}: { 
  modelType: string
  title: string
  onModelClick?: (part: string) => void 
}) {
  const getModelIcon = () => {
    switch (modelType) {
      case 'brain': return <Brain className="w-24 h-24 text-blue-400" />
      case 'heart': return <Heart className="w-24 h-24 text-red-400" />
      case 'tumor': return <Target className="w-24 h-24 text-purple-400" />
      default: return <Eye className="w-24 h-24 text-green-400" />
    }
  }

  const getModelInfo = () => {
    switch (modelType) {
      case 'brain':
        return {
          parts: ['Cortex', 'Cerebellum', 'Brain Stem', 'Left Hemisphere', 'Right Hemisphere'],
          description: 'Interactive brain anatomy with neural pathways and major structures'
        }
      case 'heart':
        return {
          parts: ['Left Atrium', 'Right Atrium', 'Left Ventricle', 'Right Ventricle', 'Aorta'],
          description: 'Cardiovascular system with chambers and major blood vessels'
        }
      case 'tumor':
        return {
          parts: ['Primary Tumor', 'Metastasis', 'Radiation Zone', 'Healthy Tissue'],
          description: 'Tumor analysis with growth stages and treatment planning'
        }
      default:
        return {
          parts: ['Main Structure', 'Vascular System', 'Functional Areas'],
          description: 'Detailed organ anatomy and physiological systems'
        }
    }
  }

  const modelInfo = getModelInfo()

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-lg p-6">
      <div className="text-center space-y-6">
        <div className="flex flex-col items-center space-y-4">
          {getModelIcon()}
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p className="text-gray-400 text-sm max-w-md text-center">
            {modelInfo.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 max-w-sm">
          {modelInfo.parts.map((part, index) => (
            <Button
              key={index}
              onClick={() => onModelClick?.(part.toLowerCase().replace(' ', '-'))}
              className="bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 border border-gray-600/50"
            >
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  modelType === 'brain' ? 'bg-blue-400' :
                  modelType === 'heart' ? 'bg-red-400' :
                  modelType === 'tumor' ? 'bg-purple-400' : 'bg-green-400'
                }`}></div>
                <span>{part}</span>
              </div>
            </Button>
          ))}
        </div>

        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <CheckCircle className="w-4 h-4" />
          <span>Medical visualization active</span>
        </div>
      </div>
    </div>
  )
}

// Loading component
function Medical3DLoading({ title }: { title: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900/50 to-blue-900/50 rounded-lg">
      <div className="relative mb-6">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-blue-300/30 rounded-full animate-pulse"></div>
      </div>
      
      <div className="text-center space-y-3">
        <h3 className="text-blue-300 font-semibold text-lg">{title}</h3>
        <p className="text-gray-400 text-sm">Initializing medical visualization...</p>
        
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  )
}

// Error boundary component
function Medical3DErrorBoundary({ 
  children, 
  fallback 
}: { 
  children: React.ReactNode
  fallback: React.ReactNode 
}) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('3D System Error:', error)
      setHasError(true)
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  if (hasError) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// Error fallback component
function Medical3DError({ 
  modelType, 
  title, 
  error,
  onRetry 
}: { 
  modelType: string
  title: string
  error: string
  onRetry: () => void 
}) {
  const getModelIcon = () => {
    switch (modelType) {
      case 'brain': return <Brain className="w-16 h-16 text-blue-400" />
      case 'heart': return <Heart className="w-16 h-16 text-red-400" />
      case 'tumor': return <Target className="w-16 h-16 text-purple-400" />
      default: return <Eye className="w-16 h-16 text-green-400" />
    }
  }

  return (
    <Card className="w-full h-full bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700 flex items-center justify-center">
      <CardContent className="text-center space-y-6 p-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-24 h-24 bg-gradient-to-br from-red-900/30 to-orange-900/30 rounded-full flex items-center justify-center border border-red-500/30">
            {getModelIcon()}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <p className="text-gray-400 text-sm max-w-md">
              3D visualization temporarily unavailable
            </p>
          </div>
        </div>

        <div className="p-4 bg-red-900/20 rounded-lg border border-red-500/30 max-w-md">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <span className="text-red-300 font-medium">System Information</span>
          </div>
          <p className="text-gray-300 text-sm">{error}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={onRetry}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Visualization
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Main reliable 3D system component
export function Reliable3DSystem({
  modelType,
  title,
  showControls = true,
  autoRotate = false,
  className = "",
  interactive = false,
  showAnalysis = false,
  onModelClick
}: Reliable3DSystemProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [retryCount, setRetryCount] = useState(0)
  const { webglSupported, error: webglError } = useWebGLSupport()

  const handleError = useCallback((error: string) => {
    console.error('Reliable 3D System Error:', error)
    setHasError(true)
    setIsLoading(false)
    setErrorMessage(error)
  }, [])

  const handleRetry = useCallback(() => {
    setHasError(false)
    setIsLoading(true)
    setRetryCount(prev => prev + 1)
    setErrorMessage('')
    
    // Simulate loading time
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleModelClick = useCallback((part: string) => {
    if (onModelClick) {
      onModelClick(part)
    }
    console.log(`${modelType} part clicked:`, part)
  }, [onModelClick, modelType])

  // Initialize loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [retryCount])

  // Handle WebGL errors
  useEffect(() => {
    if (webglSupported === false && webglError) {
      handleError(webglError)
    }
  }, [webglSupported, webglError, handleError])

  if (isLoading) {
    return (
      <div className={`w-full h-full ${className}`}>
        <Medical3DLoading title={title} />
      </div>
    )
  }

  if (hasError) {
    return (
      <div className={`w-full h-full ${className}`}>
        <Medical3DError
          modelType={modelType}
          title={title}
          error={errorMessage}
          onRetry={handleRetry}
        />
      </div>
    )
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Medical3DErrorBoundary
        fallback={
          <Medical3DError
            modelType={modelType}
            title={title}
            error="Visualization error occurred"
            onRetry={handleRetry}
          />
        }
      >
        <Fallback2DVisualization
          modelType={modelType}
          title={title}
          onModelClick={handleModelClick}
        />
      </Medical3DErrorBoundary>

      {/* Analysis panel */}
      {showAnalysis && (
        <div className="absolute bottom-4 left-4 z-10">
          <Card className="bg-black/80 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-3">
              <div className="text-white text-sm space-y-1">
                <div>Model: {modelType.toUpperCase()}</div>
                <div>Status: {webglSupported ? 'WebGL Ready' : 'Fallback Mode'}</div>
                <div>Interactive: {interactive ? 'Yes' : 'No'}</div>
                <div>Retry Count: {retryCount}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Status indicator */}
      <div className="absolute top-2 right-2 z-10">
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          STABLE
        </Badge>
      </div>
    </div>
  )
}
