"use client"

import React, { Suspense, useRef, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Text, Sphere, Box, Environment, PerspectiveCamera, Stars, Html } from "@react-three/drei"
import * as THREE from "three"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Heart, Users, RotateCcw, ZoomIn, ZoomOut, Play, Pause, Settings } from "lucide-react"
import { Enhanced3DModel } from "./enhanced-3d-model"

interface Immersive4DSpaceProps {
  className?: string
  onModelSelect?: (modelType: string) => void
}

interface FloatingModel {
  id: string
  type: "anatomy" | "brain" | "organs"
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
  title: string
  description: string
}

// Floating 4D space environment component
function SpaceEnvironment() {
  const starsRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0005
      starsRef.current.rotation.x += 0.0002
    }
  })

  return (
    <group ref={starsRef}>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Ambient space particles */}
      {Array.from({ length: 200 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100,
          ]}
        >
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color={new THREE.Color().setHSL(Math.random(), 0.7, 0.5)} />
        </mesh>
      ))}
      
      {/* Glowing energy rings */}
      <group>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[15, 0.1, 16, 100]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.3} />
        </mesh>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[20, 0.1, 16, 100]} />
          <meshBasicMaterial color="#ff00ff" transparent opacity={0.2} />
        </mesh>
        <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
          <torusGeometry args={[25, 0.1, 16, 100]} />
          <meshBasicMaterial color="#ffff00" transparent opacity={0.1} />
        </mesh>
      </group>
    </group>
  )
}

// Floating model component with 360-degree rotation
function FloatingModelNode({ model, isSelected, onClick }: { 
  model: FloatingModel
  isSelected: boolean
  onClick: () => void 
}) {
  const meshRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  
  useFrame((state) => {
    if (meshRef.current) {
      // Continuous 360-degree rotation
      meshRef.current.rotation.y += 0.01
      meshRef.current.rotation.x += 0.005
      
      // Floating animation
      meshRef.current.position.y = model.position[1] + Math.sin(state.clock.elapsedTime + model.position[0]) * 0.5
      
      // Scale animation on hover/selection
      const targetScale = (hovered || isSelected) ? model.scale * 1.2 : model.scale
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  const getModelColor = () => {
    switch (model.type) {
      case "anatomy": return "#00aaff"
      case "brain": return "#aa00ff"
      case "organs": return "#ff0055"
      default: return "#ffffff"
    }
  }

  const getModelIcon = () => {
    switch (model.type) {
      case "anatomy": return <Users className="h-4 w-4" />
      case "brain": return <Brain className="h-4 w-4" />
      case "organs": return <Heart className="h-4 w-4" />
      default: return <Users className="h-4 w-4" />
    }
  }

  return (
    <group
      ref={meshRef}
      position={model.position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Glowing sphere container */}
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial
          color={getModelColor()}
          transparent
          opacity={0.3}
          emissive={getModelColor()}
          emissiveIntensity={hovered || isSelected ? 0.5 : 0.2}
        />
      </mesh>
      
      {/* Inner rotating model representation */}
      <mesh>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial
          color={getModelColor()}
          transparent
          opacity={0.8}
          emissive={getModelColor()}
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Floating label */}
      {(hovered || isSelected) && (
        <Html position={[0, 3, 0]} center>
          <div className="bg-black/80 backdrop-blur-sm border border-blue-500/50 rounded-lg p-3 text-white min-w-[200px]">
            <div className="flex items-center space-x-2 mb-2">
              {getModelIcon()}
              <h3 className="font-semibold">{model.title}</h3>
            </div>
            <p className="text-xs text-gray-300">{model.description}</p>
            <Badge variant="secondary" className="mt-2 bg-blue-500/20 text-blue-300">
              Click to Explore
            </Badge>
          </div>
        </Html>
      )}
      
      {/* Selection ring */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3, 0.1, 16, 100]} />
          <meshBasicMaterial color={getModelColor()} transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  )
}

export function Immersive4DSpace({ className = "", onModelSelect }: Immersive4DSpaceProps) {
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [isAutoRotating, setIsAutoRotating] = useState(true)
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 0, 15])

  const models: FloatingModel[] = [
    {
      id: "anatomy",
      type: "anatomy",
      position: [-8, 0, 0],
      rotation: [0, 0, 0],
      scale: 1,
      title: "Layered Anatomy",
      description: "Interactive 3D model showing multiple anatomical systems including skin, muscles, skeleton, and organs."
    },
    {
      id: "brain",
      type: "brain", 
      position: [0, 6, -5],
      rotation: [0, 0, 0],
      scale: 1,
      title: "Brain Tumor Analysis",
      description: "Detailed neural visualization with tumor mapping, showing affected pathways and tissue damage."
    },
    {
      id: "organs",
      type: "organs",
      position: [8, -3, 2],
      rotation: [0, 0, 0],
      scale: 1,
      title: "Radiation Effects",
      description: "Visualization of radiation impact on organs, highlighting damage patterns and risk assessment."
    }
  ]

  const handleModelClick = (modelId: string) => {
    setSelectedModel(modelId)
    onModelSelect?.(modelId)
  }

  const handleReset = () => {
    setSelectedModel(null)
    setCameraPosition([0, 0, 15])
  }

  return (
    <div className={`relative w-full h-[600px] bg-black rounded-xl overflow-hidden border border-blue-500/30 ${className}`}>
      {/* Control Panel */}
      <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
        <div className="bg-black/80 backdrop-blur-sm border border-blue-500/50 rounded-lg p-3">
          <h3 className="text-white font-semibold mb-2 flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            4D Space Controls
          </h3>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className="bg-black/50 border-blue-500/30 text-white hover:bg-blue-500/20"
            >
              {isAutoRotating ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
              className="bg-black/50 border-blue-500/30 text-white hover:bg-blue-500/20"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Model Info Panel */}
      {selectedModel && (
        <div className="absolute top-4 right-4 z-10 bg-black/80 backdrop-blur-sm border border-blue-500/50 rounded-lg p-4 max-w-xs">
          <h3 className="text-white font-semibold mb-2">
            {models.find(m => m.id === selectedModel)?.title}
          </h3>
          <p className="text-gray-300 text-sm mb-3">
            {models.find(m => m.id === selectedModel)?.description}
          </p>
          <Button
            size="sm"
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500"
            onClick={() => onModelSelect?.(selectedModel)}
          >
            Open Detailed View
          </Button>
        </div>
      )}

      {/* 4D Canvas */}
      <Canvas
        className="w-full h-full"
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <PerspectiveCamera makeDefault position={cameraPosition} fov={60} />
        
        {/* Enhanced lighting for 4D space */}
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} />
        <pointLight position={[-10, -10, -5]} intensity={0.3} color="#00aaff" />
        <pointLight position={[10, -10, 5]} intensity={0.3} color="#aa00ff" />
        <pointLight position={[-10, 10, -5]} intensity={0.3} color="#ff0055" />
        
        {/* Environment */}
        <Environment preset="night" />
        
        {/* 4D Space Environment */}
        <Suspense fallback={null}>
          <SpaceEnvironment />
          
          {/* Floating 3D Models */}
          {models.map((model) => (
            <FloatingModelNode
              key={model.id}
              model={model}
              isSelected={selectedModel === model.id}
              onClick={() => handleModelClick(model.id)}
            />
          ))}
        </Suspense>
        
        {/* Interactive Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={isAutoRotating}
          autoRotateSpeed={0.5}
          minDistance={5}
          maxDistance={50}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  )
}
