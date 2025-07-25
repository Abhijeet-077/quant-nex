"use client"

import React, { useRef, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { Sphere, Cylinder, Box } from "@react-three/drei"
import * as THREE from "three"
import { Stable3DSystem } from "@/components/medical-viz/stable-3d-system"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

// WebGL compatibility check
function useWebGLCheck() {
  const [webGLAvailable, setWebGLAvailable] = useState(false)
  
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      setWebGLAvailable(!!gl)
    } catch (e) {
      setWebGLAvailable(false)
    }
  }, [])

  return webGLAvailable
}

function ModelErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-red-900/20 rounded-lg">
      <div className="text-center space-y-2">
        <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />
        <h3 className="text-lg font-medium text-white">3D Model Error</h3>
        <p className="text-red-300 text-sm">{error.message}</p>
        <Button 
          onClick={resetErrorBoundary}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white"
        >
          Retry
        </Button>
      </div>
    </div>
  )
}

interface Enhanced3DModelProps {
  modelType: "brain" | "heart" | "lung" | "liver" | "kidney" | "spine" | "tumor"
  title: string
  showControls?: boolean
  autoRotate?: boolean
  className?: string
}

// Anatomical Brain Model Component
function BrainModel({ color = "#ff6b6b", opacity = 0.8 }: { color?: string; opacity?: number }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Main brain hemispheres */}
      <Sphere args={[1.2, 32, 32]} position={[0, 0, 0]}>
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
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
      groupRef.current.scale.setScalar(scale)
    }
  })

  return (
    <group ref={groupRef}>
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
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5
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
          <Box args={[2, 1.2, 0.8]}>
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
          <Sphere args={[1, 20, 20]}>
            <meshPhongMaterial color={color} transparent opacity={opacity} shininess={100} />
          </Sphere>
        )
    }
  }

  return <group ref={groupRef}>{getModelGeometry()}</group>
}

export function Enhanced3DModel({
  modelType,
  title,
  showControls = true,
  autoRotate = true,
  className = ""
}: Enhanced3DModelProps) {
  return (
    <div className={`relative w-full h-full bg-black/20 rounded-lg overflow-hidden ${className}`}>
      <Stable3DSystem
        modelType={modelType}
        title={title}
        showControls={showControls}
        autoRotate={autoRotate}
        className="w-full h-full"
      />
    </div>
  )
}
