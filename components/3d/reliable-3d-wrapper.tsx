"use client"

import React, { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei'
import { Medical3DErrorBoundary, use3DCapability } from './3d-error-boundary'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, AlertTriangle, Eye, EyeOff, RotateCcw, Maximize, Settings } from 'lucide-react'

interface Reliable3DWrapperProps {
  children: React.ReactNode
  modelType?: "brain" | "heart" | "tumor" | "organs"
  title?: string
  showControls?: boolean
  autoRotate?: boolean
  className?: string
  fallbackImage?: string
  onError?: (error: Error) => void
}

// 3D Loading Component
function ThreeDLoading({ modelType, title }: { modelType?: string, title?: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900/50 to-blue-900/50 rounded-lg">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-blue-300/30 rounded-full animate-pulse"></div>
      </div>
      <div className="mt-4 text-center space-y-2">
        <p className="text-blue-300 font-medium">Loading 3D Model</p>
        <p className="text-gray-400 text-sm">{title || `${modelType || 'Medical'} visualization`}</p>
        <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
          <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  )
}

// Fallback 2D Image Component
function Fallback2DImage({ modelType, title, fallbackImage }: { 
  modelType?: string, 
  title?: string, 
  fallbackImage?: string 
}) {
  const getDefaultImage = () => {
    switch (modelType) {
      case "brain":
        return "/images/brain-fallback.png"
      case "heart":
        return "/images/heart-fallback.png"
      case "tumor":
        return "/images/tumor-fallback.png"
      default:
        return "/images/medical-fallback.png"
    }
  }

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-gray-900/50 to-blue-900/50 rounded-lg overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{
          backgroundImage: `url(${fallbackImage || getDefaultImage()})`,
          filter: 'hue-rotate(180deg) contrast(1.2) brightness(0.8)'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3">
          <h3 className="text-white font-medium text-sm">{title || `${modelType || 'Medical'} Model`}</h3>
          <p className="text-gray-300 text-xs mt-1">2D visualization mode</p>
          <div className="flex items-center mt-2 text-xs text-yellow-400">
            <AlertTriangle className="w-3 h-3 mr-1" />
            3D mode unavailable
          </div>
        </div>
      </div>
    </div>
  )
}

// WebGL Compatibility Check
function WebGLCompatibilityCheck({ children, fallback }: { 
  children: React.ReactNode, 
  fallback: React.ReactNode 
}) {
  const { isSupported, error } = use3DCapability()

  if (isSupported === null) {
    return <ThreeDLoading />
  }

  if (!isSupported) {
    console.warn('WebGL not supported:', error)
    return <>{fallback}</>
  }

  return <>{children}</>
}

export function Reliable3DWrapper({
  children,
  modelType,
  title,
  showControls = true,
  autoRotate = false,
  className = "",
  fallbackImage,
  onError
}: Reliable3DWrapperProps) {
  const [resetKey, setResetKey] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [controlsEnabled, setControlsEnabled] = useState(true)

  const handleReset = () => {
    setResetKey(prev => prev + 1)
  }

  const handleError = (error: Error) => {
    console.error('3D Wrapper Error:', error)
    if (onError) {
      onError(error)
    }
  }

  const fallbackComponent = (
    <Fallback2DImage 
      modelType={modelType} 
      title={title} 
      fallbackImage={fallbackImage} 
    />
  )

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Medical3DErrorBoundary
        modelType={modelType}
        title={title}
        onError={handleError}
      >
        <WebGLCompatibilityCheck fallback={fallbackComponent}>
          <div className="w-full h-full relative">
            <Canvas
              key={resetKey}
              className="w-full h-full"
              gl={{
                antialias: true,
                alpha: true,
                powerPreference: "high-performance",
                failIfMajorPerformanceCaveat: false,
                preserveDrawingBuffer: true
              }}
              camera={{ position: [0, 0, 5], fov: 50 }}
              onCreated={({ gl }) => {
                gl.setClearColor(0x000000, 0)
              }}
              onError={handleError}
            >
              <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
              
              {/* Lighting Setup */}
              <ambientLight intensity={0.4} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <pointLight position={[-10, -10, -5]} intensity={0.5} />
              
              {/* Environment */}
              <Environment preset="studio" />
              
              {/* 3D Content */}
              <Suspense fallback={null}>
                {children}
              </Suspense>
              
              {/* Controls */}
              {controlsEnabled && (
                <OrbitControls
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  autoRotate={autoRotate}
                  autoRotateSpeed={1}
                  minDistance={2}
                  maxDistance={10}
                  enableDamping
                  dampingFactor={0.05}
                />
              )}
            </Canvas>

            {/* Control Panel */}
            {showControls && (
              <div className="absolute bottom-4 left-4 flex space-x-2 z-10">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleReset}
                  className="bg-black/50 border-blue-500/30 text-white hover:bg-black/70 backdrop-blur-sm"
                  title="Reset View"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsVisible(!isVisible)}
                  className="bg-black/50 border-blue-500/30 text-white hover:bg-black/70 backdrop-blur-sm"
                  title={isVisible ? "Hide Model" : "Show Model"}
                >
                  {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setControlsEnabled(!controlsEnabled)}
                  className="bg-black/50 border-blue-500/30 text-white hover:bg-black/70 backdrop-blur-sm"
                  title={controlsEnabled ? "Lock Controls" : "Unlock Controls"}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Status Indicator */}
            <div className="absolute top-4 right-4 z-10">
              <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-300">3D Active</span>
              </div>
            </div>
          </div>
        </WebGLCompatibilityCheck>
      </Medical3DErrorBoundary>
    </div>
  )
}

export default Reliable3DWrapper
