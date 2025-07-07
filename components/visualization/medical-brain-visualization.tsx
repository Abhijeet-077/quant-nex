"use client"

import { useState, useRef, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Brain, Zap } from "lucide-react"
import * as THREE from "three"

export function MedicalBrainVisualization() {
  const [opacity, setOpacity] = useState(0.7)
  const [showTumor, setShowTumor] = useState(true)
  const [showNeuralPaths, setShowNeuralPaths] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="w-full h-full bg-gradient-to-b from-blue-900 to-black rounded-xl overflow-hidden flex items-center justify-center">
        <div className="text-white">Loading Brain Visualization...</div>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-gradient-to-b from-blue-900 to-black rounded-xl overflow-hidden relative">
      {/* Controls */}
      <div className="absolute top-4 left-4 z-20 bg-black/90 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Button
              variant={showTumor ? "default" : "outline"}
              size="sm"
              onClick={() => setShowTumor(!showTumor)}
              className="bg-red-500/20 border-red-500/50 text-red-300 text-xs"
            >
              <Brain className="h-3 w-3 mr-1" />
              Tumor
            </Button>
            <Button
              variant={showNeuralPaths ? "default" : "outline"}
              size="sm"
              onClick={() => setShowNeuralPaths(!showNeuralPaths)}
              className="bg-yellow-500/20 border-yellow-500/50 text-yellow-300 text-xs"
            >
              <Zap className="h-3 w-3 mr-1" />
              Neural
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-white">Transparency</span>
            <Slider
              value={[opacity]}
              min={0.1}
              max={1}
              step={0.05}
              onValueChange={(value) => setOpacity(value[0])}
              className="w-20"
            />
            <span className="text-xs text-white">{Math.round(opacity * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="absolute bottom-4 left-4 z-20">
        <Badge variant="secondary" className="bg-red-500/20 text-red-300">
          Glioblastoma Stage IV
        </Badge>
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [2, 2, 4], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <pointLight position={[-10, -10, -5]} intensity={0.6} color="#4A90E2" />

        <BrainModel opacity={opacity} showTumor={showTumor} showNeuralPaths={showNeuralPaths} />

        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={2} maxDistance={8} />
        <Environment preset="studio" />
      </Canvas>
    </div>
  )
}

function BrainModel({
  opacity,
  showTumor,
  showNeuralPaths,
}: {
  opacity: number
  showTumor: boolean
  showNeuralPaths: boolean
}) {
  const headRef = useRef<THREE.Mesh>(null)
  const brainRef = useRef<THREE.Mesh>(null)
  const tumorRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (tumorRef.current && showTumor) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1
      tumorRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Translucent Head */}
      <mesh ref={headRef} position={[0, 0, 0]} rotation={[0, Math.PI / 4, 0]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshPhysicalMaterial
          color={new THREE.Color(0.3, 0.7, 1.0)}
          transparent
          opacity={opacity * 0.15}
          roughness={0.1}
          metalness={0.05}
          transmission={0.95}
          thickness={0.8}
          ior={1.4}
        />
      </mesh>

      {/* Pink Brain */}
      <mesh ref={brainRef} position={[0, 0.1, 0]} rotation={[0, Math.PI / 4, 0]}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshStandardMaterial color={new THREE.Color(1.0, 0.7, 0.8)} transparent opacity={0.8} roughness={0.6} />
      </mesh>

      {/* Brain Hemispheres Detail */}
      <mesh position={[-0.1, 0.1, 0]} rotation={[0, Math.PI / 4, 0]}>
        <sphereGeometry args={[0.85, 32, 32, 0, Math.PI]} />
        <meshStandardMaterial color={new THREE.Color(1.0, 0.6, 0.7)} transparent opacity={0.9} roughness={0.7} />
      </mesh>
      <mesh position={[0.1, 0.1, 0]} rotation={[0, Math.PI / 4, 0]}>
        <sphereGeometry args={[0.85, 32, 32, 0, Math.PI]} />
        <meshStandardMaterial color={new THREE.Color(1.0, 0.6, 0.7)} transparent opacity={0.9} roughness={0.7} />
      </mesh>

      {/* Glowing Tumor */}
      {showTumor && (
        <mesh ref={tumorRef} position={[0.2, 0.3, 0.1]} rotation={[0, Math.PI / 4, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color={new THREE.Color(1.0, 0.3, 0.0)}
            transparent
            opacity={0.9}
            emissive={new THREE.Color(1.0, 0.2, 0.0)}
            emissiveIntensity={0.5}
          />
        </mesh>
      )}

      {/* Neural Pathways */}
      {showNeuralPaths && (
        <group>
          {/* Spinal Cord */}
          <mesh position={[0, -1.5, 0]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 2, 8]} />
            <meshStandardMaterial
              color={new THREE.Color(1.0, 0.8, 0.4)}
              transparent
              opacity={0.8}
              emissive={new THREE.Color(0.2, 0.15, 0.05)}
            />
          </mesh>

          {/* Neural Networks */}
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (i / 8) * Math.PI * 2
            const x = Math.cos(angle) * 0.6
            const z = Math.sin(angle) * 0.6
            return (
              <mesh key={i} position={[x, -0.5 - i * 0.1, z]} rotation={[Math.PI / 2, 0, angle]}>
                <cylinderGeometry args={[0.02, 0.02, 0.8, 6]} />
                <meshStandardMaterial
                  color={new THREE.Color(1.0, 0.8, 0.4)}
                  transparent
                  opacity={0.7}
                  emissive={new THREE.Color(0.2, 0.15, 0.05)}
                />
              </mesh>
            )
          })}
        </group>
      )}
    </group>
  )
}
