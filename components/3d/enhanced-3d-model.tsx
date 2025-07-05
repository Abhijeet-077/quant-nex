"use client"

import React, { Suspense, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text, Sphere, Box, Cylinder, Environment, PerspectiveCamera } from "@react-three/drei"
import * as THREE from "three"
import { Button } from "@/components/ui/button"
import { ErrorBoundary } from "@/components/error-boundary"
import { RotateCcw, ZoomIn, ZoomOut, Move3D } from "lucide-react"

interface Enhanced3DModelProps {
  modelType: "brain" | "heart" | "lung" | "liver" | "kidney" | "spine" | "tumor"
  title: string
  showControls?: boolean
  autoRotate?: boolean
  className?: string
}

// Anatomical Brain Model Component
function BrainModel({ color = "#ff6b6b", opacity = 0.8 }: { color?: string; opacity?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group ref={meshRef}>
      {/* Main brain hemispheres */}
      <Sphere ref={meshRef} args={[1.2, 32, 32]} position={[0, 0, 0]}>
        <meshPhongMaterial 
          color={color} 
          transparent 
          opacity={opacity}
          shininess={100}
        />
      </Sphere>
      
      {/* Brain stem */}
      <Cylinder args={[0.3, 0.4, 1.5, 16]} position={[0, -1.5, 0]}>
        <meshPhongMaterial 
          color="#ff8a80" 
          transparent 
          opacity={opacity}
          shininess={100}
        />
      </Cylinder>
      
      {/* Cerebellum */}
      <Sphere args={[0.6, 16, 16]} position={[0, -0.8, -0.8]}>
        <meshPhongMaterial 
          color="#ffab91" 
          transparent 
          opacity={opacity}
          shininess={100}
        />
      </Sphere>
    </group>
  )
}

// Anatomical Heart Model Component
function HeartModel({ color = "#e91e63", opacity = 0.8 }: { color?: string; opacity?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
      meshRef.current.scale.setScalar(scale)
    }
  })

  return (
    <group ref={meshRef}>
      {/* Heart chambers */}
      <Sphere args={[0.8, 16, 16]} position={[-0.3, 0.2, 0]}>
        <meshPhongMaterial color={color} transparent opacity={opacity} shininess={100} />
      </Sphere>
      <Sphere args={[0.7, 16, 16]} position={[0.3, 0.2, 0]}>
        <meshPhongMaterial color={color} transparent opacity={opacity} shininess={100} />
      </Sphere>
      <Sphere args={[0.6, 16, 16]} position={[-0.2, -0.5, 0]}>
        <meshPhongMaterial color="#f06292" transparent opacity={opacity} shininess={100} />
      </Sphere>
      <Sphere args={[0.5, 16, 16]} position={[0.2, -0.5, 0]}>
        <meshPhongMaterial color="#f06292" transparent opacity={opacity} shininess={100} />
      </Sphere>
    </group>
  )
}

// Tumor Model Component
function TumorModel({ color = "#ff5722", opacity = 0.9 }: { color?: string; opacity?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <group>
      {/* Main tumor mass */}
      <Sphere ref={meshRef} args={[1, 20, 20]} position={[0, 0, 0]}>
        <meshPhongMaterial 
          color={color} 
          transparent 
          opacity={opacity}
          shininess={50}
          wireframe={false}
        />
      </Sphere>
      
      {/* Tumor extensions */}
      {[...Array(6)].map((_, i) => (
        <Sphere 
          key={i} 
          args={[0.3, 8, 8]} 
          position={[
            Math.cos(i * Math.PI / 3) * 1.5,
            Math.sin(i * Math.PI / 3) * 1.5,
            Math.sin(i * 0.5) * 0.5
          ]}
        >
          <meshPhongMaterial 
            color="#ff7043" 
            transparent 
            opacity={opacity * 0.7}
            shininess={50}
          />
        </Sphere>
      ))}
    </group>
  )
}

// Generic Organ Model
function OrganModel({ 
  modelType, 
  color = "#2196f3", 
  opacity = 0.8 
}: { 
  modelType: string; 
  color?: string; 
  opacity?: number 
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })

  const getModelGeometry = () => {
    switch (modelType) {
      case "lung":
        return (
          <group>
            <Sphere args={[0.8, 16, 16]} position={[-0.6, 0, 0]}>
              <meshPhongMaterial color="#81c784" transparent opacity={opacity} shininess={100} />
            </Sphere>
            <Sphere args={[0.8, 16, 16]} position={[0.6, 0, 0]}>
              <meshPhongMaterial color="#81c784" transparent opacity={opacity} shininess={100} />
            </Sphere>
          </group>
        )
      case "liver":
        return (
          <Box ref={meshRef} args={[2, 1.2, 0.8]}>
            <meshPhongMaterial color="#8d6e63" transparent opacity={opacity} shininess={100} />
          </Box>
        )
      case "kidney":
        return (
          <group>
            <Sphere args={[0.6, 16, 16]} position={[-0.8, 0, 0]}>
              <meshPhongMaterial color="#795548" transparent opacity={opacity} shininess={100} />
            </Sphere>
            <Sphere args={[0.6, 16, 16]} position={[0.8, 0, 0]}>
              <meshPhongMaterial color="#795548" transparent opacity={opacity} shininess={100} />
            </Sphere>
          </group>
        )
      case "spine":
        return (
          <group>
            {[...Array(12)].map((_, i) => (
              <Cylinder 
                key={i} 
                args={[0.2, 0.2, 0.3, 8]} 
                position={[0, i * 0.4 - 2, 0]}
              >
                <meshPhongMaterial color="#ffc107" transparent opacity={opacity} shininess={100} />
              </Cylinder>
            ))}
          </group>
        )
      default:
        return (
          <Sphere ref={meshRef} args={[1, 20, 20]}>
            <meshPhongMaterial color={color} transparent opacity={opacity} shininess={100} />
          </Sphere>
        )
    }
  }

  return <group ref={meshRef}>{getModelGeometry()}</group>
}

export function Enhanced3DModel({ 
  modelType, 
  title, 
  showControls = true, 
  autoRotate = true,
  className = ""
}: Enhanced3DModelProps) {
  const [resetTrigger, setResetTrigger] = useState(0)

  const renderModel = () => {
    switch (modelType) {
      case "brain":
        return <BrainModel />
      case "heart":
        return <HeartModel />
      case "tumor":
        return <TumorModel />
      default:
        return <OrganModel modelType={modelType} />
    }
  }

  const handleReset = () => {
    setResetTrigger(prev => prev + 1)
  }

  return (
    <div className={`relative w-full h-full bg-black/20 rounded-lg overflow-hidden ${className}`}>
      {/* 3D Canvas */}
      <ErrorBoundary
        fallback={
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900/50 to-blue-900/50">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                <Move3D className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-blue-300">{title}</p>
              <p className="text-gray-400 text-sm">3D model loading...</p>
            </div>
          </div>
        }
      >
        <Canvas
          key={resetTrigger}
          className="w-full h-full"
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
          }}
        >
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        
        {/* Environment */}
        <Environment preset="studio" />
        
        {/* 3D Model */}
        <Suspense fallback={null}>
          {renderModel()}
        </Suspense>
        
        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={autoRotate}
          autoRotateSpeed={1}
          minDistance={2}
          maxDistance={10}
        />
        
        {/* Title */}
        <Text
          position={[0, 3, 0]}
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {title}
        </Text>
        </Canvas>
      </ErrorBoundary>

      {/* Control Panel */}
      {showControls && (
        <div className="absolute bottom-4 left-4 flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            className="bg-black/50 border-blue-500/30 text-white hover:bg-black/70"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {/* Loading Indicator */}
      <div className="absolute top-4 right-4">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  )
}
