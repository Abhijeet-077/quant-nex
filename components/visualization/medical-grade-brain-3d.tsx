"use client"

import { useRef, useState, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Html } from "@react-three/drei"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Zap, Search, Ruler, AlertTriangle, Info, Target } from "lucide-react"
import * as THREE from "three"

interface TumorData {
  id: string
  position: [number, number, number]
  size: number
  type: "malignant" | "benign" | "metastatic"
  stage: "I" | "II" | "III" | "IV"
  affectedRegions: string[]
  volume: number
  growth: number
}

interface BrainRegion {
  name: string
  position: [number, number, number]
  size: number
  color: string
  function: string
  affected: boolean
}

export function MedicalGradeBrain3D() {
  const [opacity, setOpacity] = useState(0.7)
  const [showLabels, setShowLabels] = useState(true)
  const [activeView, setActiveView] = useState("diagnostic")
  const [isAnimating, setIsAnimating] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [selectedTumor, setSelectedTumor] = useState<TumorData | null>(null)
  const [measurementMode, setMeasurementMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showTumorImpact, setShowTumorImpact] = useState(true)
  const [detailLevel, setDetailLevel] = useState(0.8)

  const tumorData: TumorData = {
    id: "tumor-001",
    position: [0.4, 0.6, 0.2],
    size: 0.25,
    type: "malignant",
    stage: "II",
    affectedRegions: ["Frontal Lobe", "Motor Cortex"],
    volume: 12.5,
    growth: 15.2,
  }

  const brainRegions: BrainRegion[] = [
    {
      name: "Frontal Lobe",
      position: [0, 0.8, 0.5],
      size: 0.4,
      color: "#ff6b6b",
      function: "Executive functions, personality",
      affected: true,
    },
    {
      name: "Parietal Lobe",
      position: [-0.6, 0.3, -0.2],
      size: 0.35,
      color: "#4ecdc4",
      function: "Sensory processing",
      affected: false,
    },
    {
      name: "Temporal Lobe",
      position: [0.7, -0.2, 0.1],
      size: 0.3,
      color: "#45b7d1",
      function: "Memory, language",
      affected: false,
    },
    {
      name: "Occipital Lobe",
      position: [0, 0.1, -0.8],
      size: 0.25,
      color: "#96ceb4",
      function: "Visual processing",
      affected: false,
    },
    {
      name: "Cerebellum",
      position: [0, -0.7, -0.3],
      size: 0.3,
      color: "#feca57",
      function: "Balance, coordination",
      affected: false,
    },
    {
      name: "Brain Stem",
      position: [0, -0.9, 0],
      size: 0.15,
      color: "#ff9ff3",
      function: "Vital functions",
      affected: false,
    },
    {
      name: "Motor Cortex",
      position: [0.2, 0.5, 0.3],
      size: 0.2,
      color: "#e74c3c",
      function: "Motor control",
      affected: true,
    },
  ]

  return (
    <div className="w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="relative w-full h-full">
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: true, alpha: true }} shadows>
          <Suspense fallback={null}>
            <ambientLight intensity={0.3} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={1.2}
              color="#ffffff"
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <pointLight position={[-10, -10, -10]} intensity={0.6} color="#4f46e5" />
            <spotLight position={[0, 5, 0]} intensity={0.8} angle={0.3} penumbra={0.5} color="#00d4ff" />

            <Environment preset="studio" />

            <RealisticBrainModel
              opacity={opacity}
              showLabels={showLabels}
              activeView={activeView}
              isAnimating={isAnimating}
              onRegionSelect={setSelectedRegion}
              onTumorSelect={setSelectedTumor}
              tumorData={tumorData}
              brainRegions={brainRegions}
              showTumorImpact={showTumorImpact}
              detailLevel={detailLevel}
              measurementMode={measurementMode}
            />

            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              autoRotate={isAnimating}
              autoRotateSpeed={0.3}
              minDistance={3}
              maxDistance={12}
              enableDamping
              dampingFactor={0.05}
            />
          </Suspense>
        </Canvas>

        {/* Advanced Control Panel */}
        <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-xl rounded-xl p-4 border border-white/20">
          <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
            <TabsList className="grid grid-cols-4 bg-white/10 mb-4">
              <TabsTrigger value="diagnostic" className="text-white">
                Diagnostic
              </TabsTrigger>
              <TabsTrigger value="anatomical" className="text-white">
                Anatomical
              </TabsTrigger>
              <TabsTrigger value="pathology" className="text-white">
                Pathology
              </TabsTrigger>
              <TabsTrigger value="measurement" className="text-white">
                Measurement
              </TabsTrigger>
            </TabsList>

            <TabsContent value="diagnostic" className="space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-300">Brain Opacity</label>
                  <Slider
                    value={[opacity]}
                    min={0.1}
                    max={1}
                    step={0.05}
                    onValueChange={(value) => setOpacity(value[0])}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-300">Detail Level</label>
                  <Slider
                    value={[detailLevel]}
                    min={0.3}
                    max={1}
                    step={0.1}
                    onValueChange={(value) => setDetailLevel(value[0])}
                    className="w-full"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTumorImpact(!showTumorImpact)}
                  className="bg-white/10 border-white/20 text-white"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Impact Zone
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLabels(!showLabels)}
                  className="bg-white/10 border-white/20 text-white"
                >
                  {showLabels ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  Labels
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="measurement" className="space-y-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant={measurementMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMeasurementMode(!measurementMode)}
                  className="bg-white/10 border-white/20 text-white"
                >
                  <Ruler className="h-4 w-4 mr-2" />
                  Measure Tool
                </Button>
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search brain regions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Tumor Information Panel */}
        {selectedTumor && (
          <div className="absolute top-4 right-4 w-80 bg-black/80 backdrop-blur-xl rounded-xl p-4 border border-red-500/30">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
                Tumor Analysis
              </h3>
              <Badge variant="destructive" className="bg-red-500/20 text-red-300">
                {selectedTumor.type}
              </Badge>
            </div>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-400">Stage:</span>
                  <span className="text-white ml-2">{selectedTumor.stage}</span>
                </div>
                <div>
                  <span className="text-gray-400">Volume:</span>
                  <span className="text-white ml-2">{selectedTumor.volume} cm³</span>
                </div>
              </div>
              <div>
                <span className="text-gray-400">Growth Rate:</span>
                <span className="text-red-300 ml-2">+{selectedTumor.growth}%</span>
              </div>
              <div>
                <span className="text-gray-400">Affected Regions:</span>
                <div className="mt-1 space-y-1">
                  {selectedTumor.affectedRegions.map((region) => (
                    <Badge key={region} variant="outline" className="text-xs mr-1 border-orange-500/30 text-orange-300">
                      {region}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Region Information Panel */}
        {selectedRegion && (
          <div className="absolute top-4 left-4 w-72 bg-black/80 backdrop-blur-xl rounded-xl p-4 border border-blue-500/30">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold flex items-center">
                <Info className="h-5 w-5 mr-2 text-blue-400" />
                {selectedRegion}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedRegion(null)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </Button>
            </div>
            {brainRegions.find((r) => r.name === selectedRegion) && (
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">{brainRegions.find((r) => r.name === selectedRegion)?.function}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Status:</span>
                  <Badge
                    variant={
                      brainRegions.find((r) => r.name === selectedRegion)?.affected ? "destructive" : "secondary"
                    }
                    className={
                      brainRegions.find((r) => r.name === selectedRegion)?.affected
                        ? "bg-red-500/20 text-red-300"
                        : "bg-green-500/20 text-green-300"
                    }
                  >
                    {brainRegions.find((r) => r.name === selectedRegion)?.affected ? "Affected" : "Normal"}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Neural Activity Monitor */}
        <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-xl rounded-lg p-3 border border-white/10">
          <div className="flex items-center space-x-3">
            <Zap className="h-4 w-4 text-yellow-400" />
            <div>
              <div className="text-white text-sm font-medium">Neural Activity</div>
              <div className="flex items-center space-x-2">
                <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full animate-pulse"
                    style={{ width: "73%" }}
                  />
                </div>
                <span className="text-xs text-gray-300">73%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function RealisticBrainModel({
  opacity,
  showLabels,
  activeView,
  isAnimating,
  onRegionSelect,
  onTumorSelect,
  tumorData,
  brainRegions,
  showTumorImpact,
  detailLevel,
  measurementMode,
}: {
  opacity: number
  showLabels: boolean
  activeView: string
  isAnimating: boolean
  onRegionSelect: (region: string | null) => void
  onTumorSelect: (tumor: TumorData | null) => void
  tumorData: TumorData
  brainRegions: BrainRegion[]
  showTumorImpact: boolean
  detailLevel: number
  measurementMode: boolean
}) {
  const brainRef = useRef<THREE.Group>(null)
  const [time, setTime] = useState(0)

  useFrame((state, delta) => {
    setTime(time + delta)
    if (brainRef.current) {
      // Subtle pulsing animation for neural activity
      const pulse = 1 + Math.sin(time * 3) * 0.01
      brainRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <group ref={brainRef}>
      {/* Main Brain Structure - Highly Detailed */}
      <group>
        {/* Outer Brain Surface */}
        <mesh position={[0, 0, 0]} receiveShadow castShadow>
          <sphereGeometry args={[1.8, 128, 128]} />
          <meshPhysicalMaterial
            color="#e8b4cb"
            transparent
            opacity={opacity}
            roughness={0.3}
            metalness={0.1}
            clearcoat={0.3}
            clearcoatRoughness={0.1}
            transmission={0.1}
            thickness={0.5}
            emissive="#ff6b9d"
            emissiveIntensity={0.05}
          />
        </mesh>

        {/* Inner Brain Tissue */}
        <mesh position={[0, 0, 0]} scale={[0.95, 0.95, 0.95]}>
          <sphereGeometry args={[1.8, 64, 64]} />
          <meshPhysicalMaterial
            color="#ffb3d1"
            transparent
            opacity={opacity * 0.6}
            roughness={0.4}
            metalness={0.05}
            transmission={0.2}
            thickness={0.3}
          />
        </mesh>

        {/* Brain Surface Details and Sulci */}
        {Array.from({ length: 20 }).map((_, i) => (
          <mesh key={i} position={[Math.cos(i * 0.314) * 1.7, Math.sin(i * 0.628) * 1.5, Math.sin(i * 0.314) * 1.7]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#d4a5c7" transparent opacity={opacity * 0.8} />
          </mesh>
        ))}

        {/* Cerebellum - Detailed Structure */}
        <mesh position={[0, -1.2, -0.8]} scale={[0.6, 0.4, 0.6]}>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshPhysicalMaterial color="#f0c6d1" transparent opacity={opacity} roughness={0.4} metalness={0.1} />
        </mesh>

        {/* Brain Stem */}
        <mesh position={[0, -1.5, 0]} scale={[0.2, 0.6, 0.2]}>
          <cylinderGeometry args={[0.3, 0.4, 1.2, 16]} />
          <meshPhysicalMaterial color="#e8a5c7" transparent opacity={opacity} roughness={0.3} />
        </mesh>

        {/* Tumor Visualization - High Detail */}
        <group>
          <mesh
            position={tumorData.position}
            onClick={() => onTumorSelect(tumorData)}
            onPointerOver={(e) => {
              e.stopPropagation()
              document.body.style.cursor = "pointer"
            }}
            onPointerOut={() => {
              document.body.style.cursor = "default"
            }}
          >
            <sphereGeometry args={[tumorData.size, 32, 32]} />
            <meshPhysicalMaterial
              color="#ff1744"
              transparent
              opacity={0.9}
              emissive="#ff1744"
              emissiveIntensity={0.4}
              roughness={0.2}
              metalness={0.1}
              clearcoat={0.5}
            />
          </mesh>

          {/* Tumor Impact Zone */}
          {showTumorImpact && (
            <mesh position={tumorData.position}>
              <sphereGeometry args={[tumorData.size * 2, 32, 32]} />
              <meshBasicMaterial color="#ff6b6b" transparent opacity={0.15} wireframe />
            </mesh>
          )}

          {/* Tumor Glow Effect */}
          <mesh position={tumorData.position}>
            <sphereGeometry args={[tumorData.size * 1.5, 16, 16]} />
            <meshBasicMaterial color="#ff4569" transparent opacity={0.3} side={THREE.BackSide} />
          </mesh>

          {showLabels && (
            <Html position={[tumorData.position[0] + 0.4, tumorData.position[1], tumorData.position[2]]} center>
              <div className="bg-red-500/90 text-white text-xs px-3 py-2 rounded-lg border border-red-400 shadow-lg">
                <div className="font-semibold">Malignant Tumor</div>
                <div className="text-red-200">
                  Stage {tumorData.stage} • {tumorData.volume} cm³
                </div>
              </div>
            </Html>
          )}
        </group>

        {/* Brain Regions - Interactive */}
        {activeView === "anatomical" &&
          brainRegions.map((region, index) => (
            <group key={region.name}>
              <mesh
                position={region.position as [number, number, number]}
                onClick={() => onRegionSelect(region.name)}
                onPointerOver={(e) => {
                  e.stopPropagation()
                  document.body.style.cursor = "pointer"
                }}
                onPointerOut={() => {
                  document.body.style.cursor = "default"
                }}
              >
                <sphereGeometry args={[region.size * detailLevel, 24, 24]} />
                <meshPhysicalMaterial
                  color={region.color}
                  transparent
                  opacity={region.affected ? 0.8 : 0.5}
                  emissive={region.affected ? region.color : "#000000"}
                  emissiveIntensity={region.affected ? 0.2 : 0}
                  roughness={0.3}
                  metalness={0.1}
                />
              </mesh>

              {showLabels && (
                <Html
                  position={[region.position[0], region.position[1] + region.size + 0.2, region.position[2]]}
                  center
                >
                  <div
                    className={`text-white text-xs px-2 py-1 rounded-md whitespace-nowrap border ${
                      region.affected ? "bg-red-500/80 border-red-400" : "bg-black/70 border-gray-600"
                    }`}
                  >
                    <div className="font-medium">{region.name}</div>
                    {region.affected && <div className="text-red-200 text-xs">⚠ Affected</div>}
                  </div>
                </Html>
              )}
            </group>
          ))}

        {/* Neural Pathways */}
        {activeView === "pathology" && (
          <group>
            {Array.from({ length: 50 }).map((_, i) => (
              <NeuralPathway key={i} index={i} time={time} />
            ))}
          </group>
        )}

        {/* Measurement Grid */}
        {measurementMode && (
          <group>
            <gridHelper args={[4, 20, "#4a90e2", "#4a90e2"]} />
            <axesHelper args={[2]} />
          </group>
        )}

        {/* Ventricles */}
        <mesh position={[0, 0, 0]} scale={[0.3, 0.6, 0.3]}>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshPhysicalMaterial color="#00d4ff" transparent opacity={0.3} transmission={0.8} thickness={0.1} />
        </mesh>
      </group>
    </group>
  )
}

function NeuralPathway({ index, time }: { index: number; time: number }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (ref.current) {
      const speed = 0.3 + index * 0.05
      const radius = 1.2 + Math.sin(time * speed + index) * 0.3
      const angle = time * speed + index * 0.3

      ref.current.position.x = Math.cos(angle) * radius
      ref.current.position.y = Math.sin(angle * 0.8) * radius * 0.6
      ref.current.position.z = Math.sin(angle) * radius

      ref.current.material.opacity = 0.4 + Math.sin(time * 3 + index) * 0.3
    }
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.015, 8, 8]} />
      <meshStandardMaterial color="#00ff88" transparent emissive="#00ff88" emissiveIntensity={0.6} />
    </mesh>
  )
}
