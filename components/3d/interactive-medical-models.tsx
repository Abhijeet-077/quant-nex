"use client"

import React, { Suspense, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Html, PerspectiveCamera } from "@react-three/drei"
import * as THREE from "three"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Heart, Zap, Activity, Eye, RotateCcw } from "lucide-react"
import { auditLogger } from "@/lib/hipaa-audit-logger"

interface InteractiveMedicalModelsProps {
  onModelClick: (modelType: "brain" | "heart" | "organs") => void
  className?: string
}

interface ModelCardProps {
  modelType: "brain" | "heart" | "organs"
  title: string
  description: string
  icon: React.ReactNode
  color: string
  onClick: () => void
}

// Brain 3D Model Component
function Brain3DModel({ isHovered }: { isHovered: boolean }) {
  const brainRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (brainRef.current) {
      brainRef.current.rotation.y = state.clock.elapsedTime * 0.3
      const scale = isHovered ? 1.1 : 1
      brainRef.current.scale.setScalar(scale)
    }
  })

  return (
    <group ref={brainRef}>
      {/* Main Brain Structure */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshPhysicalMaterial
          color="#ff6b9d"
          transparent
          opacity={0.8}
          roughness={0.3}
          metalness={0.1}
          clearcoat={0.5}
          emissive="#ff6b9d"
          emissiveIntensity={isHovered ? 0.3 : 0.1}
        />
      </mesh>

      {/* Brain Hemispheres */}
      <mesh position={[-0.3, 0, 0]} scale={[0.9, 1, 0.8]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshPhysicalMaterial
          color="#e91e63"
          transparent
          opacity={0.6}
          roughness={0.4}
          metalness={0.05}
        />
      </mesh>
      <mesh position={[0.3, 0, 0]} scale={[0.9, 1, 0.8]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshPhysicalMaterial
          color="#e91e63"
          transparent
          opacity={0.6}
          roughness={0.4}
          metalness={0.05}
        />
      </mesh>

      {/* Neural Pathways */}
      {[...Array(8)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(i * Math.PI / 4) * 0.8,
            Math.sin(i * Math.PI / 4) * 0.3,
            Math.sin(i * 0.5) * 0.5
          ]}
          rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
        >
          <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
          <meshBasicMaterial
            color="#4fc3f7"
            transparent
            opacity={0.6}
            emissive="#4fc3f7"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}

// Heart 3D Model Component
function Heart3DModel({ isHovered }: { isHovered: boolean }) {
  const heartRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (heartRef.current) {
      heartRef.current.rotation.y = state.clock.elapsedTime * 0.2
      // Heartbeat animation
      const beat = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.1
      const scale = isHovered ? beat * 1.1 : beat
      heartRef.current.scale.setScalar(scale)
    }
  })

  return (
    <group ref={heartRef}>
      {/* Main Heart Shape */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial
          color="#f44336"
          transparent
          opacity={0.9}
          roughness={0.2}
          metalness={0.1}
          clearcoat={0.8}
          emissive="#f44336"
          emissiveIntensity={isHovered ? 0.4 : 0.2}
        />
      </mesh>

      {/* Heart Chambers */}
      <mesh position={[-0.3, 0.2, 0]} scale={[0.6, 0.8, 0.6]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshPhysicalMaterial
          color="#d32f2f"
          transparent
          opacity={0.7}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0.3, 0.2, 0]} scale={[0.6, 0.8, 0.6]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshPhysicalMaterial
          color="#d32f2f"
          transparent
          opacity={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Blood Vessels */}
      {[...Array(6)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(i * Math.PI / 3) * 1.2,
            0.5 + Math.sin(i * 0.5) * 0.3,
            Math.sin(i * Math.PI / 3) * 0.8
          ]}
          rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
        >
          <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
          <meshBasicMaterial
            color="#ff5722"
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  )
}

// Organs 3D Model Component
function Organs3DModel({ isHovered }: { isHovered: boolean }) {
  const organsRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (organsRef.current) {
      organsRef.current.rotation.y = state.clock.elapsedTime * 0.15
      const scale = isHovered ? 1.05 : 1
      organsRef.current.scale.setScalar(scale)
    }
  })

  return (
    <group ref={organsRef}>
      {/* Lungs */}
      <mesh position={[-0.8, 0.5, 0]} scale={[0.6, 1.2, 0.8]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshPhysicalMaterial
          color="#4caf50"
          transparent
          opacity={0.7}
          roughness={0.4}
          emissive="#4caf50"
          emissiveIntensity={isHovered ? 0.2 : 0.1}
        />
      </mesh>
      <mesh position={[0.8, 0.5, 0]} scale={[0.6, 1.2, 0.8]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshPhysicalMaterial
          color="#4caf50"
          transparent
          opacity={0.7}
          roughness={0.4}
          emissive="#4caf50"
          emissiveIntensity={isHovered ? 0.2 : 0.1}
        />
      </mesh>

      {/* Liver */}
      <mesh position={[0.5, -0.5, 0]} scale={[1.2, 0.8, 0.6]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial
          color="#8d6e63"
          transparent
          opacity={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Kidneys */}
      <mesh position={[-1, -0.8, 0]} scale={[0.4, 0.8, 0.3]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshPhysicalMaterial
          color="#795548"
          transparent
          opacity={0.8}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[1, -0.8, 0]} scale={[0.4, 0.8, 0.3]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshPhysicalMaterial
          color="#795548"
          transparent
          opacity={0.8}
          roughness={0.4}
        />
      </mesh>

      {/* Stomach */}
      <mesh position={[-0.3, -0.2, 0]} scale={[0.8, 0.6, 0.5]}>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshPhysicalMaterial
          color="#ff9800"
          transparent
          opacity={0.7}
          roughness={0.3}
        />
      </mesh>
    </group>
  )
}

// Model Card Component
function ModelCard({ modelType, title, description, icon, color, onClick }: ModelCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    auditLogger.log3DModelAccess(modelType, "PT-2024-0156")
    onClick()
  }

  const renderModel = () => {
    switch (modelType) {
      case "brain":
        return <Brain3DModel isHovered={isHovered} />
      case "heart":
        return <Heart3DModel isHovered={isHovered} />
      case "organs":
        return <Organs3DModel isHovered={isHovered} />
      default:
        return null
    }
  }

  return (
    <div
      className={`relative bg-black/40 rounded-xl border border-blue-500/30 overflow-hidden cursor-pointer transition-all duration-300 hover:border-blue-400/60 hover:shadow-lg hover:shadow-blue-500/20 ${color}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* 3D Model Viewer */}
      <div className="h-48 relative">
        <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
          <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-5, -5, -5]} intensity={0.5} color="#4A90E2" />
          <Environment preset="studio" />
          <Suspense fallback={null}>
            {renderModel()}
          </Suspense>
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={2}
          />
        </Canvas>
      </div>

      {/* Model Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {icon}
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
            3D Model
          </Badge>
        </div>
        <p className="text-gray-300 text-sm mb-3">{description}</p>
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-blue-600/20 border-blue-500/50 text-blue-300 hover:bg-blue-600/30"
        >
          <Eye className="h-4 w-4 mr-2" />
          Open Analysis
        </Button>
      </div>

      {/* Hover Effect Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent pointer-events-none" />
      )}
    </div>
  )
}

export function InteractiveMedicalModels({ onModelClick, className = "" }: InteractiveMedicalModelsProps) {
  const models = [
    {
      type: "brain" as const,
      title: "Brain Analysis",
      description: "Comprehensive neurological examination with tumor detection and radiation mapping",
      icon: <Brain className="h-5 w-5 text-pink-400" />,
      color: "hover:bg-pink-500/10"
    },
    {
      type: "heart" as const,
      title: "Cardiac System",
      description: "Cardiovascular assessment with blood flow analysis and chamber visualization",
      icon: <Heart className="h-5 w-5 text-red-400" />,
      color: "hover:bg-red-500/10"
    },
    {
      type: "organs" as const,
      title: "Organ Systems",
      description: "Multi-organ damage assessment with radiation exposure and tissue analysis",
      icon: <Activity className="h-5 w-5 text-green-400" />,
      color: "hover:bg-green-500/10"
    }
  ]

  return (
    <div className={`${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white glow-text mb-2">
          Interactive 3D Medical Models
        </h2>
        <p className="text-gray-300">
          Explore anatomically accurate 3D models with real-time medical analysis and visualization.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <ModelCard
            key={model.type}
            modelType={model.type}
            title={model.title}
            description={model.description}
            icon={model.icon}
            color={model.color}
            onClick={() => onModelClick(model.type)}
          />
        ))}
      </div>
    </div>
  )
}
