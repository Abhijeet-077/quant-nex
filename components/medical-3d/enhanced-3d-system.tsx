"use client"

import React, { Suspense, useRef, useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
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
  CheckCircle,
  Loader2
} from 'lucide-react'

// Import React Three Fiber components dynamically to prevent SSR issues
const Canvas = dynamic(() => import('@react-three/fiber').then(mod => ({ default: mod.Canvas })), { ssr: false })
const useFrame = dynamic(() => import('@react-three/fiber').then(mod => ({ default: mod.useFrame })), { ssr: false })

// Enhanced 3D system props
interface Enhanced3DSystemProps {
  modelType: "brain" | "heart" | "tumor" | "liver" | "kidney" | "lung" | "spine"
  title: string
  showControls?: boolean
  autoRotate?: boolean
  className?: string
  interactive?: boolean
  showAnalysis?: boolean
  onModelClick?: (part: string) => void
}

// Safe WebGL detection
function useWebGLCapabilities() {
  const [capabilities, setCapabilities] = useState<{
    supported: boolean
    webgl2: boolean
    error: string | null
    performance: 'high' | 'medium' | 'low'
  }>({
    supported: false,
    webgl2: false,
    error: null,
    performance: 'low'
  })

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      
      if (!gl) {
        setCapabilities(prev => ({ 
          ...prev, 
          supported: false, 
          error: 'WebGL not supported by this browser' 
        }))
        return
      }

      const isWebGL2 = !!canvas.getContext('webgl2')
      const renderer = gl.getParameter(gl.RENDERER) || 'Unknown'
      
      // Simple performance assessment
      let performance: 'high' | 'medium' | 'low' = 'low'
      const rendererLower = renderer.toLowerCase()
      if (rendererLower.includes('nvidia') || rendererLower.includes('amd')) {
        performance = 'high'
      } else if (rendererLower.includes('intel')) {
        performance = 'medium'
      }

      setCapabilities({
        supported: true,
        webgl2: isWebGL2,
        error: null,
        performance
      })

      canvas.remove()
    } catch (error) {
      setCapabilities(prev => ({ 
        ...prev, 
        supported: false, 
        error: error instanceof Error ? error.message : 'WebGL detection failed' 
      }))
    }
  }, [])

  return capabilities
}

// Simple 3D Brain Model
function Simple3DBrainModel({ onClick }: { onClick?: (part: string) => void }) {
  const meshRef = useRef<any>(null)
  
  // Safe useFrame hook
  const [rotation, setRotation] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => prev + 0.01)
    }, 16)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <group>
      {/* Main brain sphere */}
      <mesh 
        ref={meshRef}
        position={[0, 0, 0]}
        rotation={[0, rotation, 0]}
        onClick={() => onClick?.('brain-cortex')}
      >
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial color="#3b82f6" transparent opacity={0.8} />
      </mesh>
      
      {/* Left hemisphere */}
      <mesh 
        position={[-0.4, 0, 0]}
        rotation={[0, rotation * 0.8, 0]}
        onClick={() => onClick?.('left-hemisphere')}
      >
        <sphereGeometry args={[0.8, 24, 24]} />
        <meshStandardMaterial color="#60a5fa" transparent opacity={0.7} />
      </mesh>
      
      {/* Right hemisphere */}
      <mesh 
        position={[0.4, 0, 0]}
        rotation={[0, rotation * 0.8, 0]}
        onClick={() => onClick?.('right-hemisphere')}
      >
        <sphereGeometry args={[0.8, 24, 24]} />
        <meshStandardMaterial color="#60a5fa" transparent opacity={0.7} />
      </mesh>
    </group>
  )
}

// Simple 3D Heart Model
function Simple3DHeartModel({ onClick }: { onClick?: (part: string) => void }) {
  const [scale, setScale] = useState(1)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setScale(prev => {
        const newScale = Math.sin(Date.now() * 0.003) * 0.1 + 1
        return newScale
      })
    }, 16)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <group scale={[scale, scale, scale]}>
      {/* Main heart */}
      <mesh position={[0, 0, 0]} onClick={() => onClick?.('heart-main')}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshStandardMaterial color="#ef4444" transparent opacity={0.8} />
      </mesh>
      
      {/* Left atrium */}
      <mesh position={[-0.4, 0.3, 0]} onClick={() => onClick?.('left-atrium')}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#dc2626" transparent opacity={0.9} />
      </mesh>
      
      {/* Right atrium */}
      <mesh position={[0.4, 0.3, 0]} onClick={() => onClick?.('right-atrium')}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#dc2626" transparent opacity={0.9} />
      </mesh>
    </group>
  )
}

// Simple 3D Tumor Model
function Simple3DTumorModel({ onClick }: { onClick?: (part: string) => void }) {
  const [rotation, setRotation] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => prev + 0.005)
    }, 16)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <group rotation={[rotation, rotation * 0.8, rotation * 0.3]}>
      {/* Primary tumor */}
      <mesh position={[0, 0, 0]} onClick={() => onClick?.('primary-tumor')}>
        <sphereGeometry args={[1, 20, 20]} />
        <meshStandardMaterial color="#8b5cf6" transparent opacity={0.8} />
      </mesh>
      
      {/* Metastatic sites */}
      {[...Array(4)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(i * Math.PI / 2) * 1.5,
            Math.sin(i * Math.PI / 2) * 1.5,
            Math.sin(i * 0.8) * 0.5
          ]}
          onClick={() => onClick?.(`metastasis-${i}`)}
        >
          <sphereGeometry args={[0.2, 12, 12]} />
          <meshStandardMaterial color="#a855f7" transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  )
}

// 3D Canvas wrapper with error handling
function Safe3DCanvas({ 
  children, 
  onError 
}: { 
  children: React.ReactNode
  onError: (error: string) => void 
}) {
  const [canvasError, setCanvasError] = useState<string | null>(null)

  const handleCanvasError = useCallback((error: any) => {
    const errorMessage = error instanceof Error ? error.message : 'Canvas rendering error'
    setCanvasError(errorMessage)
    onError(errorMessage)
  }, [onError])

  if (canvasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900/50 rounded-lg">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto" />
          <p className="text-red-300">3D rendering error</p>
          <p className="text-gray-400 text-sm">{canvasError}</p>
        </div>
      </div>
    )
  }

  try {
    return (
      <Canvas
        className="w-full h-full"
        camera={{ position: [0, 0, 5], fov: 50 }}
        onError={handleCanvasError}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "default",
          failIfMajorPerformanceCaveat: false
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <pointLight position={[-10, -10, -5]} intensity={0.3} />
        
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Canvas>
    )
  } catch (error) {
    handleCanvasError(error)
    return null
  }
}

// Loading component
function Enhanced3DLoading({ title }: { title: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900/50 to-blue-900/50 rounded-lg">
      <div className="relative mb-6">
        <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
      </div>
      
      <div className="text-center space-y-3">
        <h3 className="text-blue-300 font-semibold text-lg">{title}</h3>
        <p className="text-gray-400 text-sm">Loading 3D medical visualization...</p>
      </div>
    </div>
  )
}

// Error component
function Enhanced3DError({ 
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
  return (
    <Card className="w-full h-full bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700 flex items-center justify-center">
      <CardContent className="text-center space-y-6 p-8">
        <div className="flex flex-col items-center space-y-4">
          <AlertTriangle className="w-16 h-16 text-red-400" />
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <p className="text-gray-400 text-sm">3D visualization unavailable</p>
          </div>
        </div>

        <div className="p-4 bg-red-900/20 rounded-lg border border-red-500/30">
          <p className="text-gray-300 text-sm">{error}</p>
        </div>

        <Button onClick={onRetry} className="bg-blue-600 hover:bg-blue-700">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </CardContent>
    </Card>
  )
}

// Main enhanced 3D system
export function Enhanced3DSystem({
  modelType,
  title,
  showControls = true,
  autoRotate = false,
  className = "",
  interactive = false,
  showAnalysis = false,
  onModelClick
}: Enhanced3DSystemProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const capabilities = useWebGLCapabilities()

  const handleError = useCallback((error: string) => {
    console.error('Enhanced 3D System Error:', error)
    setHasError(true)
    setIsLoading(false)
    setErrorMessage(error)
  }, [])

  const handleRetry = useCallback(() => {
    setHasError(false)
    setIsLoading(true)
    setErrorMessage('')
    
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

  // Initialize
  useEffect(() => {
    if (!capabilities.supported) {
      handleError(capabilities.error || 'WebGL not supported')
      return
    }

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [capabilities, handleError])

  if (isLoading) {
    return (
      <div className={`w-full h-full ${className}`}>
        <Enhanced3DLoading title={title} />
      </div>
    )
  }

  if (hasError || !capabilities.supported) {
    return (
      <div className={`w-full h-full ${className}`}>
        <Enhanced3DError
          modelType={modelType}
          title={title}
          error={errorMessage || capabilities.error || 'Unknown error'}
          onRetry={handleRetry}
        />
      </div>
    )
  }

  const renderModel = () => {
    switch (modelType) {
      case 'brain':
        return <Simple3DBrainModel onClick={handleModelClick} />
      case 'heart':
        return <Simple3DHeartModel onClick={handleModelClick} />
      case 'tumor':
        return <Simple3DTumorModel onClick={handleModelClick} />
      default:
        return <Simple3DBrainModel onClick={handleModelClick} />
    }
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Safe3DCanvas onError={handleError}>
        {renderModel()}
      </Safe3DCanvas>

      {/* Status indicator */}
      <div className="absolute top-2 right-2 z-10">
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          3D ACTIVE
        </Badge>
      </div>

      {/* Analysis panel */}
      {showAnalysis && (
        <div className="absolute bottom-4 left-4 z-10">
          <Card className="bg-black/80 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-3">
              <div className="text-white text-sm space-y-1">
                <div>Model: {modelType.toUpperCase()}</div>
                <div>WebGL: {capabilities.webgl2 ? '2.0' : '1.0'}</div>
                <div>Performance: {capabilities.performance}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
