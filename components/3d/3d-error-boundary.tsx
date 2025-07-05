"use client"

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Brain, Heart, Target, Eye, RotateCcw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  modelType?: "brain" | "heart" | "tumor" | "organs" | "general"
  title?: string
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorId: string | null
}

export class ThreeDErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorId: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorId: null }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorId = `3D-ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    // HIPAA-compliant error logging
    console.error('3D Component Error:', {
      errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      modelType: this.props.modelType,
      title: this.props.title,
    })

    this.setState({ errorId })

    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return <ThreeDFallbackUI 
        modelType={this.props.modelType} 
        title={this.props.title}
        errorId={this.state.errorId}
        onRetry={() => this.setState({ hasError: false, error: null, errorId: null })}
      />
    }

    return this.props.children
  }
}

interface FallbackProps {
  modelType?: "brain" | "heart" | "tumor" | "organs" | "general"
  title?: string
  errorId?: string | null
  onRetry?: () => void
}

function ThreeDFallbackUI({ modelType = "general", title, errorId, onRetry }: FallbackProps) {
  const getModelIcon = () => {
    switch (modelType) {
      case "brain":
        return <Brain className="w-12 h-12 text-blue-400" />
      case "heart":
        return <Heart className="w-12 h-12 text-red-400" />
      case "tumor":
        return <Target className="w-12 h-12 text-purple-400" />
      case "organs":
        return <Eye className="w-12 h-12 text-green-400" />
      default:
        return <RotateCcw className="w-12 h-12 text-gray-400" />
    }
  }

  const getModelTitle = () => {
    if (title) return title
    switch (modelType) {
      case "brain":
        return "3D Brain Model"
      case "heart":
        return "3D Heart Model"
      case "tumor":
        return "3D Tumor Visualization"
      case "organs":
        return "3D Organ Model"
      default:
        return "3D Medical Model"
    }
  }

  const getModelDescription = () => {
    switch (modelType) {
      case "brain":
        return "Interactive brain anatomy with neurological analysis"
      case "heart":
        return "Cardiovascular system with blood flow visualization"
      case "tumor":
        return "Tumor detection and growth analysis"
      case "organs":
        return "Comprehensive organ system visualization"
      default:
        return "Advanced medical visualization"
    }
  }

  return (
    <Card className="w-full h-full bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700 flex items-center justify-center">
      <CardContent className="text-center space-y-6 p-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-full flex items-center justify-center border border-blue-500/30">
            {getModelIcon()}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">{getModelTitle()}</h3>
            <p className="text-gray-400 text-sm max-w-md">{getModelDescription()}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <span className="text-yellow-300 font-medium">3D Model Loading Issue</span>
            </div>
            <p className="text-gray-300 text-sm">
              The 3D visualization is temporarily unavailable. This may be due to:
            </p>
            <ul className="text-gray-400 text-xs mt-2 space-y-1 list-disc list-inside">
              <li>WebGL compatibility issues</li>
              <li>Graphics driver limitations</li>
              <li>Network connectivity problems</li>
              <li>Browser security restrictions</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onRetry && (
              <Button
                onClick={onRetry}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry 3D Model
              </Button>
            )}
            
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Page
            </Button>
          </div>

          {errorId && (
            <div className="text-xs text-gray-500 font-mono">
              Error ID: {errorId}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Specialized 3D Error Boundary for Medical Components
export function Medical3DErrorBoundary({ 
  children, 
  modelType,
  title,
  className = ""
}: { 
  children: ReactNode
  modelType?: "brain" | "heart" | "tumor" | "organs"
  title?: string
  className?: string
}) {
  return (
    <div className={`w-full h-full ${className}`}>
      <ThreeDErrorBoundary
        modelType={modelType}
        title={title}
        onError={(error, errorInfo) => {
          // Enhanced logging for medical 3D components
          console.error('Medical 3D Component Error:', {
            modelType,
            title,
            error: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            timestamp: new Date().toISOString(),
            userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
          })
        }}
      >
        {children}
      </ThreeDErrorBoundary>
    </div>
  )
}

// Hook for 3D capability detection
export function use3DCapability() {
  const [isSupported, setIsSupported] = React.useState<boolean | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      
      if (gl) {
        setIsSupported(true)
      } else {
        setIsSupported(false)
        setError('WebGL not supported')
      }
    } catch (err) {
      setIsSupported(false)
      setError('WebGL detection failed')
    }
  }, [])

  return { isSupported, error }
}

export default ThreeDErrorBoundary
