"use client"

import React, { Suspense, useState, useEffect, useRef, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera, Text, Html } from '@react-three/drei'
import * as THREE from 'three'
import { Card, CardContent } from '@/components/ui/card'
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
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Settings
} from 'lucide-react'

interface Stable3DSystemProps {
  modelType: "brain" | "heart" | "tumor" | "organs" | "liver" | "kidney" | "spine" | "lung"
  title: string
  showControls?: boolean
  autoRotate?: boolean
  className?: string
  onError?: (error: Error) => void
}

// Crash-proof WebGL detection
function useWebGLSupport() {
  const [support, setSupport] = useState<{
    webgl: boolean
    webgl2: boolean
    error: string | null
    performance: 'high' | 'medium' | 'low'
  }>({
    webgl: false,
    webgl2: false,
    error: null,
    performance: 'low'
  })

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      const gl2 = canvas.getContext('webgl2')
      
      if (!gl) {
        setSupport({
          webgl: false,
          webgl2: false,
          error: 'WebGL not supported',
          performance: 'low'
        })
        return
      }

      // Check performance capabilities
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
      const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : ''
      
      let performance: 'high' | 'medium' | 'low' = 'low'
      if (renderer) {
        const rendererLower = renderer.toLowerCase()
        if (rendererLower.includes('nvidia') || rendererLower.includes('amd') || rendererLower.includes('intel iris')) {
          performance = 'high'
        } else if (rendererLower.includes('intel')) {
          performance = 'medium'
        }
      }

      setSupport({
        webgl: true,
        webgl2: !!gl2,
        error: null,
        performance
      })

      // Cleanup
      canvas.remove()
    } catch (error) {
      setSupport({
        webgl: false,
        webgl2: false,
        error: error instanceof Error ? error.message : 'WebGL detection failed',
        performance: 'low'
      })
    }
  }, [])

  return support
}

// Stable 3D Model Components
function StableBrainModel({ opacity = 1 }: { opacity?: number }) {
  const meshRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <group ref={meshRef}>
      {/* Main brain structure */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial 
          color="#3b82f6" 
          transparent 
          opacity={opacity}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      
      {/* Brain hemispheres */}
      <mesh position={[-0.3, 0, 0]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial 
          color="#60a5fa" 
          transparent 
          opacity={opacity * 0.8}
          roughness={0.4}
        />
      </mesh>
      
      <mesh position={[0.3, 0, 0]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial 
          color="#60a5fa" 
          transparent 
          opacity={opacity * 0.8}
          roughness={0.4}
        />
      </mesh>

      {/* Neural pathways */}
      {[...Array(8)].map((_, i) => (
        <mesh key={i} position={[
          Math.cos(i * Math.PI / 4) * 1.5,
          Math.sin(i * Math.PI / 4) * 0.5,
          Math.sin(i * 0.5) * 0.3
        ]}>
          <cylinderGeometry args={[0.02, 0.02, 0.5]} />
          <meshStandardMaterial color="#93c5fd" transparent opacity={opacity * 0.6} />
        </mesh>
      ))}
    </group>
  )
}

function StableHeartModel({ opacity = 1 }: { opacity?: number }) {
  const meshRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1
      meshRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <group ref={meshRef}>
      {/* Main heart shape */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 20, 20]} />
        <meshStandardMaterial 
          color="#ef4444" 
          transparent 
          opacity={opacity}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>
      
      {/* Heart chambers */}
      <mesh position={[-0.3, 0.2, 0]}>
        <sphereGeometry args={[0.4, 12, 12]} />
        <meshStandardMaterial color="#dc2626" transparent opacity={opacity * 0.8} />
      </mesh>
      
      <mesh position={[0.3, 0.2, 0]}>
        <sphereGeometry args={[0.4, 12, 12]} />
        <meshStandardMaterial color="#dc2626" transparent opacity={opacity * 0.8} />
      </mesh>

      {/* Blood vessels */}
      {[...Array(6)].map((_, i) => (
        <mesh key={i} position={[
          Math.cos(i * Math.PI / 3) * 1.2,
          Math.sin(i * Math.PI / 3) * 1.2,
          0
        ]}>
          <cylinderGeometry args={[0.05, 0.05, 0.8]} />
          <meshStandardMaterial color="#f87171" transparent opacity={opacity * 0.7} />
        </mesh>
      ))}
    </group>
  )
}

function StableTumorModel({ opacity = 1 }: { opacity?: number }) {
  const meshRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.15
    }
  })

  return (
    <group ref={meshRef}>
      {/* Main tumor mass */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial 
          color="#8b5cf6" 
          transparent 
          opacity={opacity}
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>
      
      {/* Tumor extensions */}
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[
          Math.cos(i * Math.PI * 2 / 5) * 1.3,
          Math.sin(i * Math.PI * 2 / 5) * 1.3,
          Math.sin(i * 0.8) * 0.4
        ]}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshStandardMaterial 
            color="#a855f7" 
            transparent 
            opacity={opacity * 0.8}
            roughness={0.7}
          />
        </mesh>
      ))}

      {/* Metastasis indicators */}
      {[...Array(3)].map((_, i) => (
        <mesh key={i} position={[
          Math.random() * 2 - 1,
          Math.random() * 2 - 1,
          Math.random() * 2 - 1
        ]}>
          <sphereGeometry args={[0.1, 6, 6]} />
          <meshStandardMaterial color="#c084fc" transparent opacity={opacity * 0.6} />
        </mesh>
      ))}
    </group>
  )
}

function StableOrganModel({ modelType, opacity = 1 }: { modelType: string, opacity?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  const getColor = () => {
    switch (modelType) {
      case 'liver': return '#10b981'
      case 'kidney': return '#f59e0b'
      case 'lung': return '#06b6d4'
      case 'spine': return '#6b7280'
      default: return '#10b981'
    }
  }

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1.5, 1, 0.8]} />
      <meshStandardMaterial 
        color={getColor()} 
        transparent 
        opacity={opacity}
        roughness={0.4}
        metalness={0.1}
      />
    </mesh>
  )
}

// Crash-proof loading component
function SafeLoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900/50 to-blue-900/50">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
        <p className="text-blue-300 text-sm">Loading 3D Model...</p>
      </div>
    </div>
  )
}

// Error fallback component
function SafeErrorFallback({ 
  modelType, 
  title, 
  onRetry 
}: { 
  modelType: string
  title: string
  onRetry: () => void 
}) {
  const getIcon = () => {
    switch (modelType) {
      case 'brain': return <Brain className="w-12 h-12 text-blue-400" />
      case 'heart': return <Heart className="w-12 h-12 text-red-400" />
      case 'tumor': return <Target className="w-12 h-12 text-purple-400" />
      default: return <Eye className="w-12 h-12 text-green-400" />
    }
  }

  return (
    <Card className="w-full h-full bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700 flex items-center justify-center">
      <CardContent className="text-center space-y-4 p-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-full flex items-center justify-center border border-blue-500/30 mx-auto">
          {getIcon()}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-gray-400 text-sm">3D visualization temporarily unavailable</p>
        </div>
        <Button onClick={onRetry} size="sm" className="bg-blue-600 hover:bg-blue-700">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </CardContent>
    </Card>
  )
}

// Error boundary wrapper for the entire 3D system
class Stable3DErrorBoundary extends React.Component<
  { children: React.ReactNode; onError?: (error: Error) => void },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error('Stable 3D Error Boundary:', error)
    this.props.onError?.(error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <SafeErrorFallback
          modelType="general"
          title="3D System Error"
          onRetry={() => this.setState({ hasError: false })}
        />
      )
    }

    return this.props.children
  }
}

export function Stable3DSystem({
  modelType,
  title,
  showControls = true,
  autoRotate = false,
  className = "",
  onError
}: Stable3DSystemProps) {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [retryCount, setRetryCount] = useState(0)
  const webglSupport = useWebGLSupport()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleError = useCallback((error: Error) => {
    console.error('Stable 3D System Error:', error)
    setHasError(true)
    setIsLoading(false)
    onError?.(error)
  }, [onError])

  const handleRetry = useCallback(() => {
    setHasError(false)
    setIsLoading(true)
    setRetryCount(prev => prev + 1)
  }, [])

  const handleLoadComplete = useCallback(() => {
    setIsLoading(false)
  }, [])

  // Don't render if WebGL is not supported
  if (!webglSupport.webgl) {
    return (
      <div className={`w-full h-full ${className}`}>
        <SafeErrorFallback
          modelType={modelType}
          title={title}
          onRetry={handleRetry}
        />
      </div>
    )
  }

  if (hasError) {
    return (
      <div className={`w-full h-full ${className}`}>
        <SafeErrorFallback
          modelType={modelType}
          title={title}
          onRetry={handleRetry}
        />
      </div>
    )
  }

  const renderModel = () => {
    switch (modelType) {
      case 'brain':
        return <StableBrainModel />
      case 'heart':
        return <StableHeartModel />
      case 'tumor':
        return <StableTumorModel />
      default:
        return <StableOrganModel modelType={modelType} />
    }
  }

  return (
    <Stable3DErrorBoundary onError={handleError}>
      <div className={`relative w-full h-full ${className}`}>
        <Canvas
          ref={canvasRef}
          className="w-full h-full"
          gl={{
            antialias: webglSupport.performance !== 'low',
            alpha: true,
            powerPreference: webglSupport.performance === 'high' ? "high-performance" : "low-power",
            failIfMajorPerformanceCaveat: false,
            preserveDrawingBuffer: false,
            stencil: false,
            depth: true
          }}
          camera={{ position: [0, 0, 5], fov: 50 }}
          onCreated={({ gl }) => {
            try {
              gl.setClearColor(0x000000, 0)
              gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
              handleLoadComplete()
            } catch (error) {
              handleError(error as Error)
            }
          }}
          onError={handleError}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />

          {/* Safe lighting setup */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={0.8} />
          <pointLight position={[-10, -10, -5]} intensity={0.3} />

          {/* Environment with error handling */}
          <Suspense fallback={null}>
            <Environment preset="dawn" />
          </Suspense>

          {/* 3D Model with error boundary */}
          <Suspense fallback={null}>
            {renderModel()}
          </Suspense>

          {/* Safe controls */}
          {showControls && (
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              autoRotate={autoRotate}
              autoRotateSpeed={0.5}
              minDistance={2}
              maxDistance={10}
              enableDamping={webglSupport.performance !== 'low'}
              dampingFactor={0.05}
            />
          )}

          {/* Title */}
          <Suspense fallback={null}>
            <Text
              position={[0, 2.5, 0]}
              fontSize={0.3}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {title}
            </Text>
          </Suspense>
        </Canvas>

        {/* Performance indicator */}
        <div className="absolute top-2 right-2 z-10">
          <Badge
            className={`text-xs ${
              webglSupport.performance === 'high' ? 'bg-green-500/20 text-green-400' :
              webglSupport.performance === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}
          >
            {webglSupport.performance.toUpperCase()}
          </Badge>
        </div>

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
            <SafeLoadingFallback />
          </div>
        )}
      </div>
    </Stable3DErrorBoundary>
  )
}
