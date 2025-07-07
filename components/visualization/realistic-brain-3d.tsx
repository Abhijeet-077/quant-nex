"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Html } from "@react-three/drei"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, RotateCcw, Play, Pause, Zap } from "lucide-react"
import * as THREE from "three"

export function RealisticBrainVisualization() {
  const [opacity, setOpacity] = useState(0.8)
  const [showLabels, setShowLabels] = useState(true)
  const [activeView, setActiveView] = useState("full")
  const [isAnimating, setIsAnimating] = useState(true)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)

  return (
    <div className="w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 to-purple-900">
      <div className="relative w-full h-full">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4f46e5" />
          <Environment preset="city" />

          <RealisticBrain
            opacity={opacity}
            showLabels={showLabels}
            activeView={activeView}
            isAnimating={isAnimating}
            onRegionSelect={setSelectedRegion}
          />

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={isAnimating}
            autoRotateSpeed={0.5}
          />
        </Canvas>

        {/* Control Panel */}
        <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md rounded-xl p-4 border border-white/10">
          <div className="flex flex-col space-y-4">
            {/* View Tabs */}
            <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
              <TabsList className="grid grid-cols-3 bg-white/10">
                <TabsTrigger value="full" className="text-white">
                  Full Brain
                </TabsTrigger>
                <TabsTrigger value="cross-section" className="text-white">
                  Cross Section
                </TabsTrigger>
                <TabsTrigger value="regions" className="text-white">
                  Regions
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Controls Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-300">Opacity</span>
                  <Slider
                    className="w-24"
                    value={[opacity]}
                    min={0.1}
                    max={1}
                    step={0.05}
                    onValueChange={(value) => setOpacity(value[0])}
                  />
                  <span className="text-xs text-gray-300 w-8">{Math.round(opacity * 100)}%</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLabels(!showLabels)}
                  className="bg-white/10 border-white/20 text-white"
                >
                  {showLabels ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAnimating(!isAnimating)}
                  className="bg-white/10 border-white/20 text-white"
                >
                  {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setOpacity(0.8)
                    setActiveView("full")
                    setSelectedRegion(null)
                  }}
                  className="bg-white/10 border-white/20 text-white"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Selected Region Info */}
            {selectedRegion && (
              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">{selectedRegion}</h4>
                    <p className="text-gray-300 text-sm">Neural activity: 87% normal</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                    Healthy
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Neural Activity Indicator */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md rounded-lg p-3 border border-white/10">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span className="text-white text-sm">Neural Activity</span>
            <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-yellow-400 rounded-full animate-pulse"
                style={{ width: "73%" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function RealisticBrain({
  opacity,
  showLabels,
  activeView,
  isAnimating,
  onRegionSelect,
}: {
  opacity: number
  showLabels: boolean
  activeView: string
  isAnimating: boolean
  onRegionSelect: (region: string | null) => void
}) {
  const brainRef = useRef<THREE.Group>(null)
  const [time, setTime] = useState(0)

  useFrame((state, delta) => {
    setTime(time + delta)
    if (brainRef.current && !isAnimating) {
      // Subtle breathing animation when not auto-rotating
      brainRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.02)
    }
  })

  const brainRegions = [
    { name: "Frontal Lobe", position: [0, 0.8, 0.5], color: "#ff6b6b", size: 0.4 },
    { name: "Parietal Lobe", position: [-0.6, 0.3, -0.2], color: "#4ecdc4", size: 0.35 },
    { name: "Temporal Lobe", position: [0.7, -0.2, 0.1], color: "#45b7d1", size: 0.3 },
    { name: "Occipital Lobe", position: [0, 0.1, -0.8], color: "#96ceb4", size: 0.25 },
    { name: "Cerebellum", position: [0, -0.7, -0.3], color: "#feca57", size: 0.3 },
    { name: "Brain Stem", position: [0, -0.9, 0], color: "#ff9ff3", size: 0.15 },
  ]

  return (
    <group ref={brainRef}>
      {/* Main Brain Structure */}
      <group>
        {/* Cerebrum */}
        <mesh position={[0, 0, 0]} scale={[1.2, 1, 1]}>
          <sphereGeometry args={[1.5, 64, 64]} />
          <meshStandardMaterial
            color="#ffb3ba"
            transparent
            opacity={opacity}
            roughness={0.4}
            metalness={0.1}
            emissive="#ff6b6b"
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* Brain Surface Details */}
        <mesh position={[0, 0, 0]} scale={[1.21, 1.01, 1.01]}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshStandardMaterial
            color="#ff9999"
            transparent
            opacity={opacity * 0.3}
            wireframe={activeView === "cross-section"}
            roughness={0.6}
          />
        </mesh>

        {/* Tumor Visualization */}
        <mesh position={[0.4, 0.2, 0.3]}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial
            color="#ff4757"
            transparent
            opacity={opacity * 1.2}
            emissive="#ff4757"
            emissiveIntensity={0.3}
          />
          {showLabels && (
            <Html position={[0.3, 0, 0]} center>
              <div className="bg-red-500/80 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap border border-red-400">
                Tumor (Stage II)
              </div>
            </Html>
          )}
        </mesh>

        {/* Brain Regions */}
        {activeView === "regions" &&
          brainRegions.map((region, index) => (
            <group key={region.name}>
              <mesh position={region.position as [number, number, number]} onClick={() => onRegionSelect(region.name)}>
                <sphereGeometry args={[region.size, 16, 16]} />
                <meshStandardMaterial
                  color={region.color}
                  transparent
                  opacity={0.6}
                  emissive={region.color}
                  emissiveIntensity={0.2}
                />
              </mesh>

              {showLabels && (
                <Html position={[region.position[0], region.position[1] + 0.3, region.position[2]]} center>
                  <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
                    {region.name}
                  </div>
                </Html>
              )}
            </group>
          ))}

        {/* Neural Activity Particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <NeuralParticle key={i} index={i} time={time} />
        ))}

        {/* Cross-section plane */}
        {activeView === "cross-section" && (
          <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <planeGeometry args={[3, 3]} />
            <meshStandardMaterial color="#4a90e2" transparent opacity={0.3} side={THREE.DoubleSide} />
          </mesh>
        )}
      </group>
    </group>
  )
}

function NeuralParticle({ index, time }: { index: number; time: number }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (ref.current) {
      const speed = 0.5 + index * 0.1
      const radius = 1.5 + Math.sin(time * speed + index) * 0.5
      const angle = time * speed + index * 0.5

      ref.current.position.x = Math.cos(angle) * radius
      ref.current.position.y = Math.sin(angle * 0.7) * radius * 0.8
      ref.current.position.z = Math.sin(angle) * radius

      ref.current.material.opacity = 0.3 + Math.sin(time * 2 + index) * 0.2
    }
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshStandardMaterial color="#00d4ff" transparent emissive="#00d4ff" emissiveIntensity={0.5} />
    </mesh>
  )
}
