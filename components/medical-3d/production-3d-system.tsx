"use client"

import React, { Suspense, useRef, useState, useEffect, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  OrbitControls, 
  Environment, 
  PerspectiveCamera, 
  Text, 
  Html,
  useGLTF,
  Sphere,
  Box,
  Cylinder,
  Torus,
  Cone
} from '@react-three/drei'
import * as THREE from 'three'
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
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Settings,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react'

interface Production3DSystemProps {
  modelType: "brain" | "heart" | "tumor" | "organs" | "liver" | "kidney" | "spine" | "lung"
  title: string
  showControls?: boolean
  autoRotate?: boolean
  className?: string
  interactive?: boolean
  showAnalysis?: boolean
  onModelClick?: (part: string) => void
}

// Enhanced WebGL detection with detailed capabilities
function useWebGLCapabilities() {
  const [capabilities, setCapabilities] = useState<{
    webgl: boolean
    webgl2: boolean
    maxTextureSize: number
    maxVertexUniforms: number
    renderer: string
    vendor: string
    performance: 'high' | 'medium' | 'low'
    extensions: string[]
    error: string | null
  }>({
    webgl: false,
    webgl2: false,
    maxTextureSize: 0,
    maxVertexUniforms: 0,
    renderer: '',
    vendor: '',
    performance: 'low',
    extensions: [],
    error: null
  })

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      
      if (!gl) {
        setCapabilities(prev => ({ ...prev, error: 'WebGL not supported' }))
        return
      }

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
      const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown'
      const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Unknown'
      
      const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE)
      const maxVertexUniforms = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS)
      
      const extensions = gl.getSupportedExtensions() || []
      
      // Performance assessment
      let performance: 'high' | 'medium' | 'low' = 'low'
      const rendererLower = renderer.toLowerCase()
      if (rendererLower.includes('nvidia') || rendererLower.includes('amd radeon') || rendererLower.includes('intel iris')) {
        performance = 'high'
      } else if (rendererLower.includes('intel') && maxTextureSize >= 4096) {
        performance = 'medium'
      }

      setCapabilities({
        webgl: true,
        webgl2: !!gl.getParameter,
        maxTextureSize,
        maxVertexUniforms,
        renderer,
        vendor,
        performance,
        extensions,
        error: null
      })

      canvas.remove()
    } catch (error) {
      setCapabilities(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'WebGL detection failed' 
      }))
    }
  }, [])

  return capabilities
}

// Advanced Brain Model with detailed anatomy
function AdvancedBrainModel({ interactive = false, onPartClick }: { 
  interactive?: boolean
  onPartClick?: (part: string) => void 
}) {
  const groupRef = useRef<THREE.Group>(null)
  const [hoveredPart, setHoveredPart] = useState<string | null>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  const handlePartClick = (part: string) => {
    if (interactive && onPartClick) {
      onPartClick(part)
    }
  }

  return (
    <group ref={groupRef}>
      {/* Main brain cortex */}
      <Sphere 
        args={[1.2, 32, 32]} 
        position={[0, 0, 0]}
        onClick={() => handlePartClick('cortex')}
        onPointerOver={() => setHoveredPart('cortex')}
        onPointerOut={() => setHoveredPart(null)}
      >
        <meshStandardMaterial 
          color={hoveredPart === 'cortex' ? '#60a5fa' : '#3b82f6'}
          transparent 
          opacity={0.8}
          roughness={0.3}
          metalness={0.1}
        />
      </Sphere>
      
      {/* Left hemisphere */}
      <Sphere 
        args={[0.8, 24, 24]} 
        position={[-0.4, 0, 0]}
        onClick={() => handlePartClick('left-hemisphere')}
        onPointerOver={() => setHoveredPart('left-hemisphere')}
        onPointerOut={() => setHoveredPart(null)}
      >
        <meshStandardMaterial 
          color={hoveredPart === 'left-hemisphere' ? '#93c5fd' : '#60a5fa'}
          transparent 
          opacity={0.7}
          roughness={0.4}
        />
      </Sphere>
      
      {/* Right hemisphere */}
      <Sphere 
        args={[0.8, 24, 24]} 
        position={[0.4, 0, 0]}
        onClick={() => handlePartClick('right-hemisphere')}
        onPointerOver={() => setHoveredPart('right-hemisphere')}
        onPointerOut={() => setHoveredPart(null)}
      >
        <meshStandardMaterial 
          color={hoveredPart === 'right-hemisphere' ? '#93c5fd' : '#60a5fa'}
          transparent 
          opacity={0.7}
          roughness={0.4}
        />
      </Sphere>

      {/* Cerebellum */}
      <Sphere 
        args={[0.4, 16, 16]} 
        position={[0, -0.8, -0.6]}
        onClick={() => handlePartClick('cerebellum')}
        onPointerOver={() => setHoveredPart('cerebellum')}
        onPointerOut={() => setHoveredPart(null)}
      >
        <meshStandardMaterial 
          color={hoveredPart === 'cerebellum' ? '#fbbf24' : '#f59e0b'}
          transparent 
          opacity={0.8}
          roughness={0.5}
        />
      </Sphere>

      {/* Brain stem */}
      <Cylinder 
        args={[0.15, 0.2, 0.8]} 
        position={[0, -0.8, 0]}
        onClick={() => handlePartClick('brain-stem')}
        onPointerOver={() => setHoveredPart('brain-stem')}
        onPointerOut={() => setHoveredPart(null)}
      >
        <meshStandardMaterial 
          color={hoveredPart === 'brain-stem' ? '#34d399' : '#10b981'}
          transparent 
          opacity={0.9}
          roughness={0.3}
        />
      </Cylinder>

      {/* Neural pathways */}
      {[...Array(12)].map((_, i) => (
        <Cylinder
          key={i}
          args={[0.02, 0.02, 0.6]}
          position={[
            Math.cos(i * Math.PI / 6) * 1.3,
            Math.sin(i * Math.PI / 6) * 0.3,
            Math.sin(i * 0.5) * 0.4
          ]}
          rotation={[Math.PI / 2, i * Math.PI / 6, 0]}
        >
          <meshStandardMaterial 
            color="#a78bfa" 
            transparent 
            opacity={0.6}
            emissive="#8b5cf6"
            emissiveIntensity={0.2}
          />
        </Cylinder>
      ))}

      {/* Hover label */}
      {hoveredPart && (
        <Html position={[0, 2, 0]}>
          <div className="bg-black/80 text-white px-2 py-1 rounded text-sm">
            {hoveredPart.replace('-', ' ').toUpperCase()}
          </div>
        </Html>
      )}
    </group>
  )
}

// Advanced Heart Model with chambers and vessels
function AdvancedHeartModel({ interactive = false, onPartClick }: { 
  interactive?: boolean
  onPartClick?: (part: string) => void 
}) {
  const groupRef = useRef<THREE.Group>(null)
  const [hoveredPart, setHoveredPart] = useState<string | null>(null)
  const [beating, setBeating] = useState(true)
  
  useFrame((state) => {
    if (groupRef.current && beating) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.1 + 1
      groupRef.current.scale.setScalar(pulse)
    }
  })

  const handlePartClick = (part: string) => {
    if (interactive && onPartClick) {
      onPartClick(part)
    }
  }

  return (
    <group ref={groupRef}>
      {/* Main heart shape */}
      <Sphere 
        args={[1, 24, 24]} 
        position={[0, 0, 0]}
        onClick={() => handlePartClick('heart')}
        onPointerOver={() => setHoveredPart('heart')}
        onPointerOut={() => setHoveredPart(null)}
      >
        <meshStandardMaterial 
          color={hoveredPart === 'heart' ? '#f87171' : '#ef4444'}
          transparent 
          opacity={0.8}
          roughness={0.2}
          metalness={0.1}
        />
      </Sphere>
      
      {/* Left atrium */}
      <Sphere 
        args={[0.35, 16, 16]} 
        position={[-0.4, 0.3, 0]}
        onClick={() => handlePartClick('left-atrium')}
        onPointerOver={() => setHoveredPart('left-atrium')}
        onPointerOut={() => setHoveredPart(null)}
      >
        <meshStandardMaterial 
          color={hoveredPart === 'left-atrium' ? '#fca5a5' : '#dc2626'}
          transparent 
          opacity={0.9}
        />
      </Sphere>
      
      {/* Right atrium */}
      <Sphere 
        args={[0.35, 16, 16]} 
        position={[0.4, 0.3, 0]}
        onClick={() => handlePartClick('right-atrium')}
        onPointerOver={() => setHoveredPart('right-atrium')}
        onPointerOut={() => setHoveredPart(null)}
      >
        <meshStandardMaterial 
          color={hoveredPart === 'right-atrium' ? '#fca5a5' : '#dc2626'}
          transparent 
          opacity={0.9}
        />
      </Sphere>

      {/* Left ventricle */}
      <Sphere 
        args={[0.4, 16, 16]} 
        position={[-0.3, -0.4, 0]}
        onClick={() => handlePartClick('left-ventricle')}
        onPointerOver={() => setHoveredPart('left-ventricle')}
        onPointerOut={() => setHoveredPart(null)}
      >
        <meshStandardMaterial 
          color={hoveredPart === 'left-ventricle' ? '#b91c1c' : '#991b1b'}
          transparent 
          opacity={0.9}
        />
      </Sphere>

      {/* Right ventricle */}
      <Sphere 
        args={[0.4, 16, 16]} 
        position={[0.3, -0.4, 0]}
        onClick={() => handlePartClick('right-ventricle')}
        onPointerOver={() => setHoveredPart('right-ventricle')}
        onPointerOut={() => setHoveredPart(null)}
      >
        <meshStandardMaterial 
          color={hoveredPart === 'right-ventricle' ? '#b91c1c' : '#991b1b'}
          transparent 
          opacity={0.9}
        />
      </Sphere>

      {/* Major blood vessels */}
      {[
        { pos: [0, 1.2, 0], rot: [0, 0, 0], name: 'aorta' },
        { pos: [0.6, 0.8, 0], rot: [0, 0, Math.PI / 4], name: 'pulmonary-artery' },
        { pos: [-0.6, 0.8, 0], rot: [0, 0, -Math.PI / 4], name: 'vena-cava' },
        { pos: [0, -1.2, 0], rot: [Math.PI, 0, 0], name: 'inferior-vena-cava' }
      ].map((vessel, i) => (
        <Cylinder
          key={i}
          args={[0.08, 0.12, 0.6]}
          position={vessel.pos as [number, number, number]}
          rotation={vessel.rot as [number, number, number]}
          onClick={() => handlePartClick(vessel.name)}
          onPointerOver={() => setHoveredPart(vessel.name)}
          onPointerOut={() => setHoveredPart(null)}
        >
          <meshStandardMaterial 
            color={hoveredPart === vessel.name ? '#fbbf24' : '#f59e0b'}
            transparent 
            opacity={0.8}
          />
        </Cylinder>
      ))}

      {/* Coronary arteries */}
      {[...Array(8)].map((_, i) => (
        <Torus
          key={i}
          args={[0.8 + i * 0.1, 0.03]}
          position={[0, 0, 0]}
          rotation={[Math.PI / 2, 0, i * Math.PI / 4]}
        >
          <meshStandardMaterial 
            color="#fbbf24" 
            transparent 
            opacity={0.6}
            emissive="#f59e0b"
            emissiveIntensity={0.1}
          />
        </Torus>
      ))}

      {/* Hover label */}
      {hoveredPart && (
        <Html position={[0, 2, 0]}>
          <div className="bg-black/80 text-white px-2 py-1 rounded text-sm">
            {hoveredPart.replace('-', ' ').toUpperCase()}
          </div>
        </Html>
      )}

      {/* Beat control */}
      <Html position={[2, 2, 0]}>
        <Button
          size="sm"
          onClick={() => setBeating(!beating)}
          className="bg-red-600 hover:bg-red-700"
        >
          {beating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
      </Html>
    </group>
  )
}

// Advanced Tumor Model with growth stages and metastasis
function AdvancedTumorModel({ interactive = false, onPartClick }: {
  interactive?: boolean
  onPartClick?: (part: string) => void
}) {
  const groupRef = useRef<THREE.Group>(null)
  const [hoveredPart, setHoveredPart] = useState<string | null>(null)
  const [growthStage, setGrowthStage] = useState(1)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.05
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.08
    }
  })

  const handlePartClick = (part: string) => {
    if (interactive && onPartClick) {
      onPartClick(part)
    }
  }

  const getStageSize = () => growthStage * 0.3 + 0.7

  return (
    <group ref={groupRef}>
      {/* Primary tumor */}
      <Sphere
        args={[getStageSize(), 20, 20]}
        position={[0, 0, 0]}
        onClick={() => handlePartClick('primary-tumor')}
        onPointerOver={() => setHoveredPart('primary-tumor')}
        onPointerOut={() => setHoveredPart(null)}
      >
        <meshStandardMaterial
          color={hoveredPart === 'primary-tumor' ? '#c084fc' : '#8b5cf6'}
          transparent
          opacity={0.8}
          roughness={0.6}
          metalness={0.2}
        />
      </Sphere>

      {/* Tumor extensions/invasions */}
      {[...Array(6)].map((_, i) => (
        <Sphere
          key={i}
          args={[0.2 + Math.random() * 0.2, 12, 12]}
          position={[
            Math.cos(i * Math.PI / 3) * (1.2 + growthStage * 0.3),
            Math.sin(i * Math.PI / 3) * (1.2 + growthStage * 0.3),
            Math.sin(i * 0.8) * 0.5
          ]}
          onClick={() => handlePartClick(`invasion-${i}`)}
          onPointerOver={() => setHoveredPart(`invasion-${i}`)}
          onPointerOut={() => setHoveredPart(null)}
        >
          <meshStandardMaterial
            color={hoveredPart === `invasion-${i}` ? '#d8b4fe' : '#a855f7'}
            transparent
            opacity={0.7}
            roughness={0.7}
          />
        </Sphere>
      ))}

      {/* Metastatic sites */}
      {growthStage > 2 && [...Array(4)].map((_, i) => (
        <Sphere
          key={`meta-${i}`}
          args={[0.15, 8, 8]}
          position={[
            Math.random() * 4 - 2,
            Math.random() * 4 - 2,
            Math.random() * 4 - 2
          ]}
          onClick={() => handlePartClick(`metastasis-${i}`)}
          onPointerOver={() => setHoveredPart(`metastasis-${i}`)}
          onPointerOut={() => setHoveredPart(null)}
        >
          <meshStandardMaterial
            color={hoveredPart === `metastasis-${i}` ? '#fbbf24' : '#f59e0b'}
            transparent
            opacity={0.6}
            emissive="#f59e0b"
            emissiveIntensity={0.3}
          />
        </Sphere>
      ))}

      {/* Blood vessels feeding tumor */}
      {[...Array(8)].map((_, i) => (
        <Cylinder
          key={`vessel-${i}`}
          args={[0.02, 0.02, 1.5]}
          position={[
            Math.cos(i * Math.PI / 4) * 0.8,
            Math.sin(i * Math.PI / 4) * 0.8,
            0
          ]}
          rotation={[Math.PI / 2, i * Math.PI / 4, 0]}
        >
          <meshStandardMaterial
            color="#ef4444"
            transparent
            opacity={0.5}
            emissive="#dc2626"
            emissiveIntensity={0.2}
          />
        </Cylinder>
      ))}

      {/* Radiation treatment zones */}
      {[...Array(3)].map((_, i) => (
        <Torus
          key={`radiation-${i}`}
          args={[1.5 + i * 0.3, 0.05]}
          position={[0, 0, 0]}
          rotation={[Math.PI / 2, 0, i * Math.PI / 3]}
        >
          <meshStandardMaterial
            color="#06b6d4"
            transparent
            opacity={0.3}
            emissive="#0891b2"
            emissiveIntensity={0.4}
          />
        </Torus>
      ))}

      {/* Hover label */}
      {hoveredPart && (
        <Html position={[0, 2.5, 0]}>
          <div className="bg-black/80 text-white px-2 py-1 rounded text-sm">
            {hoveredPart.replace('-', ' ').toUpperCase()}
          </div>
        </Html>
      )}

      {/* Growth stage control */}
      <Html position={[2.5, 2, 0]}>
        <div className="space-y-2">
          <div className="text-white text-xs">Stage {growthStage}</div>
          <div className="flex space-x-1">
            {[1, 2, 3, 4].map(stage => (
              <Button
                key={stage}
                size="sm"
                onClick={() => setGrowthStage(stage)}
                className={`w-8 h-8 p-0 ${
                  growthStage === stage
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {stage}
              </Button>
            ))}
          </div>
        </div>
      </Html>
    </group>
  )
}

// Advanced Organ Model with detailed anatomy
function AdvancedOrganModel({
  organType,
  interactive = false,
  onPartClick
}: {
  organType: string
  interactive?: boolean
  onPartClick?: (part: string) => void
}) {
  const groupRef = useRef<THREE.Group>(null)
  const [hoveredPart, setHoveredPart] = useState<string | null>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  const handlePartClick = (part: string) => {
    if (interactive && onPartClick) {
      onPartClick(part)
    }
  }

  const getOrganColor = () => {
    switch (organType) {
      case 'liver': return '#10b981'
      case 'kidney': return '#f59e0b'
      case 'lung': return '#06b6d4'
      case 'spine': return '#6b7280'
      default: return '#10b981'
    }
  }

  const renderOrgan = () => {
    switch (organType) {
      case 'liver':
        return (
          <>
            <Box
              args={[2, 1.2, 0.8]}
              position={[0, 0, 0]}
              onClick={() => handlePartClick('liver-main')}
              onPointerOver={() => setHoveredPart('liver-main')}
              onPointerOut={() => setHoveredPart(null)}
            >
              <meshStandardMaterial
                color={hoveredPart === 'liver-main' ? '#34d399' : '#10b981'}
                transparent
                opacity={0.8}
              />
            </Box>
            {/* Liver lobes */}
            <Box
              args={[0.8, 0.6, 0.4]}
              position={[0.8, 0.3, 0]}
              onClick={() => handlePartClick('right-lobe')}
              onPointerOver={() => setHoveredPart('right-lobe')}
              onPointerOut={() => setHoveredPart(null)}
            >
              <meshStandardMaterial
                color={hoveredPart === 'right-lobe' ? '#6ee7b7' : '#059669'}
                transparent
                opacity={0.9}
              />
            </Box>
          </>
        )
      case 'kidney':
        return (
          <>
            <Sphere
              args={[0.8, 20, 20]}
              position={[0, 0, 0]}
              onClick={() => handlePartClick('kidney-cortex')}
              onPointerOver={() => setHoveredPart('kidney-cortex')}
              onPointerOut={() => setHoveredPart(null)}
            >
              <meshStandardMaterial
                color={hoveredPart === 'kidney-cortex' ? '#fbbf24' : '#f59e0b'}
                transparent
                opacity={0.8}
              />
            </Sphere>
            <Cylinder
              args={[0.3, 0.3, 1.2]}
              position={[0, 0, 0]}
              onClick={() => handlePartClick('kidney-medulla')}
              onPointerOver={() => setHoveredPart('kidney-medulla')}
              onPointerOut={() => setHoveredPart(null)}
            >
              <meshStandardMaterial
                color={hoveredPart === 'kidney-medulla' ? '#fed7aa' : '#ea580c'}
                transparent
                opacity={0.7}
              />
            </Cylinder>
          </>
        )
      case 'lung':
        return (
          <>
            <Sphere
              args={[1, 24, 24]}
              position={[-0.5, 0, 0]}
              onClick={() => handlePartClick('left-lung')}
              onPointerOver={() => setHoveredPart('left-lung')}
              onPointerOut={() => setHoveredPart(null)}
            >
              <meshStandardMaterial
                color={hoveredPart === 'left-lung' ? '#67e8f9' : '#06b6d4'}
                transparent
                opacity={0.6}
              />
            </Sphere>
            <Sphere
              args={[1, 24, 24]}
              position={[0.5, 0, 0]}
              onClick={() => handlePartClick('right-lung')}
              onPointerOver={() => setHoveredPart('right-lung')}
              onPointerOut={() => setHoveredPart(null)}
            >
              <meshStandardMaterial
                color={hoveredPart === 'right-lung' ? '#67e8f9' : '#06b6d4'}
                transparent
                opacity={0.6}
              />
            </Sphere>
            {/* Bronchi */}
            <Cylinder
              args={[0.1, 0.1, 1.5]}
              position={[0, 0.5, 0]}
              onClick={() => handlePartClick('trachea')}
              onPointerOver={() => setHoveredPart('trachea')}
              onPointerOut={() => setHoveredPart(null)}
            >
              <meshStandardMaterial
                color={hoveredPart === 'trachea' ? '#a7f3d0' : '#059669'}
                transparent
                opacity={0.8}
              />
            </Cylinder>
          </>
        )
      default:
        return (
          <Box args={[1.5, 1, 0.8]}>
            <meshStandardMaterial color={getOrganColor()} transparent opacity={0.8} />
          </Box>
        )
    }
  }

  return (
    <group ref={groupRef}>
      {renderOrgan()}

      {/* Hover label */}
      {hoveredPart && (
        <Html position={[0, 2, 0]}>
          <div className="bg-black/80 text-white px-2 py-1 rounded text-sm">
            {hoveredPart.replace('-', ' ').toUpperCase()}
          </div>
        </Html>
      )}
    </group>
  )
}

// Production-ready loading component
function Production3DLoading({ modelType, title }: { modelType: string, title: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900/50 to-blue-900/50 rounded-lg">
      <div className="relative mb-6">
        <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-20 h-20 border-4 border-blue-300/30 rounded-full animate-pulse"></div>
      </div>

      <div className="text-center space-y-3">
        <h3 className="text-blue-300 font-semibold text-lg">{title}</h3>
        <p className="text-gray-400 text-sm">Initializing advanced medical visualization...</p>

        <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  )
}

// Production error fallback
function Production3DError({
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
              3D medical visualization encountered an error
            </p>
          </div>
        </div>

        <div className="p-4 bg-red-900/20 rounded-lg border border-red-500/30 max-w-md">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <span className="text-red-300 font-medium">Error Details</span>
          </div>
          <p className="text-gray-300 text-sm font-mono">{error}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={onRetry}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry 3D Model
          </Button>

          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Page
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Main Production 3D System Component
export function Production3DSystem({
  modelType,
  title,
  showControls = true,
  autoRotate = false,
  className = "",
  interactive = false,
  showAnalysis = false,
  onModelClick
}: Production3DSystemProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [retryCount, setRetryCount] = useState(0)
  const capabilities = useWebGLCapabilities()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleError = useCallback((error: Error) => {
    console.error('Production 3D System Error:', error)
    setHasError(true)
    setIsLoading(false)
    setErrorMessage(error.message)
  }, [])

  const handleRetry = useCallback(() => {
    setHasError(false)
    setIsLoading(true)
    setRetryCount(prev => prev + 1)
    setErrorMessage('')
  }, [])

  const handleLoadComplete = useCallback(() => {
    setIsLoading(false)
  }, [])

  const handleModelClick = useCallback((part: string) => {
    if (onModelClick) {
      onModelClick(part)
    }
  }, [onModelClick])

  // Don't render if WebGL is not supported
  if (!capabilities.webgl) {
    return (
      <div className={`w-full h-full ${className}`}>
        <Production3DError
          modelType={modelType}
          title={title}
          error={capabilities.error || 'WebGL not supported'}
          onRetry={handleRetry}
        />
      </div>
    )
  }

  if (hasError) {
    return (
      <div className={`w-full h-full ${className}`}>
        <Production3DError
          modelType={modelType}
          title={title}
          error={errorMessage}
          onRetry={handleRetry}
        />
      </div>
    )
  }

  const renderModel = () => {
    switch (modelType) {
      case 'brain':
        return <AdvancedBrainModel interactive={interactive} onPartClick={handleModelClick} />
      case 'heart':
        return <AdvancedHeartModel interactive={interactive} onPartClick={handleModelClick} />
      case 'tumor':
        return <AdvancedTumorModel interactive={interactive} onPartClick={handleModelClick} />
      default:
        return <AdvancedOrganModel organType={modelType} interactive={interactive} onPartClick={handleModelClick} />
    }
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Canvas
        ref={canvasRef}
        className="w-full h-full"
        gl={{
          antialias: capabilities.performance !== 'low',
          alpha: true,
          powerPreference: capabilities.performance === 'high' ? "high-performance" : "low-power",
          failIfMajorPerformanceCaveat: false,
          preserveDrawingBuffer: false,
          stencil: false,
          depth: true
        }}
        camera={{ position: [0, 0, 5], fov: 50 }}
        onCreated={({ gl }) => {
          try {
            gl.setClearColor(0x000000, 0)
            gl.setPixelRatio(Math.min(window.devicePixelRatio, capabilities.performance === 'high' ? 2 : 1))
            handleLoadComplete()
          } catch (error) {
            handleError(error as Error)
          }
        }}
        onError={handleError}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />

        {/* Advanced lighting setup */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
        <pointLight position={[-10, -10, -5]} intensity={0.3} />
        <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.3} penumbra={1} castShadow />

        {/* Environment */}
        <Suspense fallback={null}>
          <Environment preset={capabilities.performance === 'high' ? "studio" : "dawn"} />
        </Suspense>

        {/* 3D Model */}
        <Suspense fallback={null}>
          {renderModel()}
        </Suspense>

        {/* Controls */}
        {showControls && (
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={autoRotate}
            autoRotateSpeed={capabilities.performance === 'high' ? 1 : 0.5}
            minDistance={2}
            maxDistance={10}
            enableDamping={capabilities.performance !== 'low'}
            dampingFactor={0.05}
          />
        )}

        {/* Title */}
        <Suspense fallback={null}>
          <Text
            position={[0, 3, 0]}
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
            capabilities.performance === 'high' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
            capabilities.performance === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
            'bg-red-500/20 text-red-400 border-red-500/30'
          }`}
        >
          {capabilities.performance.toUpperCase()}
        </Badge>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
          <Production3DLoading modelType={modelType} title={title} />
        </div>
      )}

      {/* Analysis panel */}
      {showAnalysis && !isLoading && !hasError && (
        <div className="absolute bottom-4 left-4 z-10">
          <Card className="bg-black/80 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-3">
              <div className="text-white text-sm space-y-1">
                <div>Model: {modelType.toUpperCase()}</div>
                <div>Performance: {capabilities.performance}</div>
                <div>WebGL: {capabilities.webgl2 ? '2.0' : '1.0'}</div>
                <div>Renderer: {capabilities.renderer.split(' ').slice(0, 2).join(' ')}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
