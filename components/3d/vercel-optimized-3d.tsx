"use client"

import React, { Suspense, useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei'
import { Medical3DErrorBoundary } from './3d-error-boundary'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Heart, 
  Target, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  Loader2, 
  RefreshCw,
  Monitor,
  Wifi,
  Shield,
  Cpu
} from 'lucide-react'

interface VercelOptimized3DProps {
  modelType: "brain" | "heart" | "tumor" | "organs" | "liver" | "kidney" | "spine" | "lung"
  title: string
  showControls?: boolean
  autoRotate?: boolean
  className?: string
  fallbackContent?: React.ReactNode
}

interface SystemCompatibility {
  webgl: boolean
  webgl2: boolean
  performance: 'high' | 'medium' | 'low'
  mobile: boolean
  browser: string
  gpu: string | null
  errors: string[]
}

// Enhanced WebGL and system compatibility detection
function useSystemCompatibility(): SystemCompatibility {
  const [compatibility, setCompatibility] = useState<SystemCompatibility>({
    webgl: false,
    webgl2: false,
    performance: 'low',
    mobile: false,
    browser: 'unknown',
    gpu: null,
    errors: []
  })

  useEffect(() => {
    const checkCompatibility = () => {
      const errors: string[] = []
      let webgl = false
      let webgl2 = false
      let gpu: string | null = null
      
      try {
        // Create test canvas
        const canvas = document.createElement('canvas')
        
        // Test WebGL 1.0
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        if (gl) {
          webgl = true
          
          // Get GPU info
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
          if (debugInfo) {
            gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
          }
        } else {
          errors.push('WebGL 1.0 not supported')
        }
        
        // Test WebGL 2.0
        const gl2 = canvas.getContext('webgl2')
        if (gl2) {
          webgl2 = true
        } else {
          errors.push('WebGL 2.0 not supported')
        }
        
        // Performance assessment
        let performance: 'high' | 'medium' | 'low' = 'low'
        if (webgl2 && gpu) {
          if (gpu.toLowerCase().includes('nvidia') || gpu.toLowerCase().includes('amd') || gpu.toLowerCase().includes('intel iris')) {
            performance = 'high'
          } else if (gpu.toLowerCase().includes('intel')) {
            performance = 'medium'
          }
        } else if (webgl) {
          performance = 'medium'
        }
        
        // Mobile detection
        const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        
        // Browser detection
        const browser = navigator.userAgent.includes('Chrome') ? 'Chrome' :
                       navigator.userAgent.includes('Firefox') ? 'Firefox' :
                       navigator.userAgent.includes('Safari') ? 'Safari' :
                       navigator.userAgent.includes('Edge') ? 'Edge' : 'Unknown'
        
        setCompatibility({
          webgl,
          webgl2,
          performance,
          mobile,
          browser,
          gpu,
          errors
        })
        
      } catch (error) {
        errors.push(`Compatibility check failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        setCompatibility(prev => ({ ...prev, errors }))
      }
    }
    
    checkCompatibility()
  }, [])
  
  return compatibility
}

// Progressive 3D Model Loader
function Progressive3DLoader({ 
  modelType, 
  title, 
  onLoadComplete 
}: { 
  modelType: string
  title: string
  onLoadComplete: () => void 
}) {
  const [loadingStage, setLoadingStage] = useState(0)
  const stages = ['Initializing...', 'Loading geometry...', 'Applying textures...', 'Optimizing...', 'Complete']
  
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingStage(prev => {
        if (prev < stages.length - 1) {
          return prev + 1
        } else {
          clearInterval(timer)
          setTimeout(onLoadComplete, 500)
          return prev
        }
      })
    }, 800)
    
    return () => clearInterval(timer)
  }, [onLoadComplete])
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900/50 to-blue-900/50 rounded-lg">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-blue-300/30 rounded-full animate-pulse"></div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-blue-300 font-medium">{title}</h3>
          <p className="text-gray-400 text-sm">{stages[loadingStage]}</p>
          
          {/* Progress bar */}
          <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500 ease-out"
              style={{ width: `${((loadingStage + 1) / stages.length) * 100}%` }}
            />
          </div>
          
          <p className="text-xs text-gray-500">
            {Math.round(((loadingStage + 1) / stages.length) * 100)}% complete
          </p>
        </div>
      </div>
    </div>
  )
}

// Enhanced Medical Fallback Content
function MedicalFallbackContent({ 
  modelType, 
  title, 
  compatibility,
  onRetry 
}: { 
  modelType: string
  title: string
  compatibility: SystemCompatibility
  onRetry: () => void 
}) {
  const getModelIcon = () => {
    switch (modelType) {
      case "brain": return <Brain className="w-12 h-12 text-blue-400" />
      case "heart": return <Heart className="w-12 h-12 text-red-400" />
      case "tumor": return <Target className="w-12 h-12 text-purple-400" />
      default: return <Eye className="w-12 h-12 text-green-400" />
    }
  }
  
  const getRecommendations = () => {
    const recommendations = []
    
    if (!compatibility.webgl) {
      recommendations.push("Enable hardware acceleration in browser settings")
      recommendations.push("Update your graphics drivers")
    }
    
    if (compatibility.mobile) {
      recommendations.push("Use a desktop browser for better 3D performance")
    }
    
    if (compatibility.performance === 'low') {
      recommendations.push("Close other browser tabs to free up resources")
      recommendations.push("Try using Chrome or Firefox for better WebGL support")
    }
    
    return recommendations
  }
  
  return (
    <Card className="w-full h-full bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700 flex items-center justify-center">
      <CardContent className="text-center space-y-6 p-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-full flex items-center justify-center border border-blue-500/30">
            {getModelIcon()}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <p className="text-gray-400 text-sm max-w-md">
              3D visualization temporarily unavailable. Using optimized fallback mode.
            </p>
          </div>
        </div>

        {/* System Information */}
        <div className="space-y-3 text-left max-w-md">
          <h4 className="text-sm font-medium text-blue-400 text-center">System Status</h4>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center space-x-2">
              <Monitor className="w-3 h-3 text-gray-400" />
              <span className="text-gray-300">WebGL:</span>
              {compatibility.webgl ? (
                <CheckCircle className="w-3 h-3 text-green-400" />
              ) : (
                <AlertTriangle className="w-3 h-3 text-red-400" />
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Cpu className="w-3 h-3 text-gray-400" />
              <span className="text-gray-300">Performance:</span>
              <Badge 
                className={`text-xs px-1 py-0 ${
                  compatibility.performance === 'high' ? 'bg-green-500/20 text-green-400' :
                  compatibility.performance === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}
              >
                {compatibility.performance}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Wifi className="w-3 h-3 text-gray-400" />
              <span className="text-gray-300">Browser:</span>
              <span className="text-white text-xs">{compatibility.browser}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Shield className="w-3 h-3 text-gray-400" />
              <span className="text-gray-300">Device:</span>
              <span className="text-white text-xs">{compatibility.mobile ? 'Mobile' : 'Desktop'}</span>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {getRecommendations().length > 0 && (
          <div className="space-y-2 max-w-md">
            <h4 className="text-sm font-medium text-yellow-400">Recommendations</h4>
            <ul className="text-xs text-gray-400 space-y-1 text-left">
              {getRecommendations().map((rec, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-yellow-400 mt-0.5">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={onRetry}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry 3D Model
          </Button>
          
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
      </CardContent>
    </Card>
  )
}

export function VercelOptimized3D({
  modelType,
  title,
  showControls = true,
  autoRotate = false,
  className = "",
  fallbackContent
}: VercelOptimized3DProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const compatibility = useSystemCompatibility()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const handleLoadComplete = () => {
    setIsLoading(false)
  }
  
  const handleRetry = () => {
    setHasError(false)
    setIsLoading(true)
    setRetryCount(prev => prev + 1)
  }
  
  const handleError = (error: Error) => {
    console.error('3D Model Error:', error)
    setHasError(true)
    setIsLoading(false)
  }
  
  // Don't attempt 3D rendering if WebGL is not supported
  if (!compatibility.webgl || hasError) {
    return (
      <div className={`w-full h-full ${className}`}>
        {fallbackContent || (
          <MedicalFallbackContent
            modelType={modelType}
            title={title}
            compatibility={compatibility}
            onRetry={handleRetry}
          />
        )}
      </div>
    )
  }
  
  if (isLoading) {
    return (
      <div className={`w-full h-full ${className}`}>
        <Progressive3DLoader
          modelType={modelType}
          title={title}
          onLoadComplete={handleLoadComplete}
        />
      </div>
    )
  }
  
  return (
    <div className={`relative w-full h-full ${className}`}>
      <Medical3DErrorBoundary
        modelType={modelType}
        title={title}
        onError={handleError}
      >
        <Canvas
          ref={canvasRef}
          className="w-full h-full"
          gl={{
            antialias: compatibility.performance !== 'low',
            alpha: true,
            powerPreference: compatibility.mobile ? "low-power" : "high-performance",
            failIfMajorPerformanceCaveat: false,
            preserveDrawingBuffer: true,
            stencil: false,
            depth: true
          }}
          camera={{ position: [0, 0, 5], fov: 50 }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0)
            // Optimize for Vercel serverless
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
          }}
          onError={handleError}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
          
          {/* Optimized lighting for performance */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={0.8} />
          
          {/* Environment with performance consideration */}
          <Environment preset={compatibility.performance === 'high' ? "studio" : "dawn"} />
          
          {/* 3D Content with Suspense */}
          <Suspense fallback={null}>
            {/* Placeholder for actual 3D models */}
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color={
                modelType === 'brain' ? '#3b82f6' :
                modelType === 'heart' ? '#ef4444' :
                modelType === 'tumor' ? '#8b5cf6' : '#10b981'
              } />
            </mesh>
          </Suspense>
          
          {/* Controls with performance optimization */}
          {showControls && (
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              autoRotate={autoRotate}
              autoRotateSpeed={compatibility.mobile ? 0.5 : 1}
              minDistance={2}
              maxDistance={10}
              enableDamping={compatibility.performance !== 'low'}
              dampingFactor={0.05}
            />
          )}
        </Canvas>

        {/* Performance indicator */}
        <div className="absolute top-2 right-2 z-10">
          <Badge 
            className={`text-xs ${
              compatibility.performance === 'high' ? 'bg-green-500/20 text-green-400' :
              compatibility.performance === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}
          >
            {compatibility.performance.toUpperCase()}
          </Badge>
        </div>
      </Medical3DErrorBoundary>
    </div>
  )
}
