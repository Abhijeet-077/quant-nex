"use client"

import { useRef, useState, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Html } from "@react-three/drei"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Eye,
  EyeOff,
  Zap,
  Search,
  Ruler,
  AlertTriangle,
  Info,
  Target,
  Brain,
  Activity,
  Layers,
  Download,
  Share2,
  RotateCcw,
  Microscope,
} from "lucide-react"
import * as THREE from "three"

interface TumorData {
  id: string
  position: [number, number, number]
  size: number
  type: "glioblastoma" | "meningioma" | "metastatic" | "benign"
  grade: "I" | "II" | "III" | "IV"
  volume: number
  density: number
  vascularization: number
  edema: number
  necrosis: number
  enhancement: boolean
}

interface BrainRegion {
  name: string
  position: [number, number, number]
  size: number
  color: string
  function: string
  affected: boolean
  criticalityScore: number
  bloodFlow: number
}

interface DosePoint {
  position: [number, number, number]
  dose: number
  isoCurve: number
}

export function ClinicalBrain3D() {
  const [brainOpacity, setBrainOpacity] = useState(0.6)
  const [tumorOpacity, setTumorOpacity] = useState(0.95)
  const [showLabels, setShowLabels] = useState(true)
  const [showVasculature, setShowVasculature] = useState(false)
  const [showDoseMap, setShowDoseMap] = useState(false)
  const [showOrgansAtRisk, setShowOrgansAtRisk] = useState(false)
  const [activeView, setActiveView] = useState("clinical")
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [selectedTumor, setSelectedTumor] = useState<TumorData | null>(null)
  const [measurementMode, setMeasurementMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [rotationSpeed, setRotationSpeed] = useState(0)
  const [lightingIntensity, setLightingIntensity] = useState(1.2)
  const [contrastLevel, setContrastLevel] = useState(1.0)

  const tumorData: TumorData = {
    id: "glioblastoma-001",
    position: [0.4, 0.6, 0.2],
    size: 0.28,
    type: "glioblastoma",
    grade: "IV",
    volume: 15.7,
    density: 0.85,
    vascularization: 0.7,
    edema: 0.6,
    necrosis: 0.3,
    enhancement: true,
  }

  const brainRegions: BrainRegion[] = [
    {
      name: "Frontal Cortex",
      position: [0.2, 0.8, 0.4],
      size: 0.35,
      color: "#ff6b6b",
      function: "Executive functions, motor planning",
      affected: true,
      criticalityScore: 9,
      bloodFlow: 0.65,
    },
    {
      name: "Motor Cortex",
      position: [0.3, 0.5, 0.3],
      size: 0.25,
      color: "#e74c3c",
      function: "Primary motor control",
      affected: true,
      criticalityScore: 10,
      bloodFlow: 0.45,
    },
    {
      name: "Broca's Area",
      position: [0.6, 0.4, 0.2],
      size: 0.15,
      color: "#f39c12",
      function: "Speech production",
      affected: false,
      criticalityScore: 8,
      bloodFlow: 0.8,
    },
    {
      name: "Parietal Lobe",
      position: [-0.4, 0.3, -0.1],
      size: 0.3,
      color: "#3498db",
      function: "Sensory integration",
      affected: false,
      criticalityScore: 7,
      bloodFlow: 0.75,
    },
    {
      name: "Temporal Lobe",
      position: [0.7, -0.1, 0.1],
      size: 0.28,
      color: "#9b59b6",
      function: "Memory, language comprehension",
      affected: false,
      criticalityScore: 8,
      bloodFlow: 0.82,
    },
    {
      name: "Occipital Lobe",
      position: [0, 0.2, -0.8],
      size: 0.22,
      color: "#2ecc71",
      function: "Visual processing",
      affected: false,
      criticalityScore: 6,
      bloodFlow: 0.9,
    },
    {
      name: "Cerebellum",
      position: [0, -0.7, -0.4],
      size: 0.32,
      color: "#f1c40f",
      function: "Balance, coordination, motor learning",
      affected: false,
      criticalityScore: 9,
      bloodFlow: 0.88,
    },
    {
      name: "Brain Stem",
      position: [0, -0.9, 0],
      size: 0.18,
      color: "#e67e22",
      function: "Vital functions, consciousness",
      affected: false,
      criticalityScore: 10,
      bloodFlow: 0.95,
    },
  ]

  const dosePoints: DosePoint[] = [
    { position: [0.4, 0.6, 0.2], dose: 60, isoCurve: 95 },
    { position: [0.3, 0.5, 0.3], dose: 45, isoCurve: 75 },
    { position: [0.5, 0.7, 0.1], dose: 30, isoCurve: 50 },
    { position: [0.2, 0.4, 0.4], dose: 20, isoCurve: 30 },
    { position: [0.6, 0.8, 0.0], dose: 15, isoCurve: 20 },
  ]

  return (
    <div className="w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative">
      {/* Advanced Control Panel */}
      <div className="absolute top-4 left-4 right-4 bg-black/90 backdrop-blur-xl rounded-xl p-4 border border-cyan-500/30 z-10">
        <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
          <TabsList className="grid grid-cols-5 bg-slate-800/50 mb-4">
            <TabsTrigger value="clinical" className="text-white data-[state=active]:bg-cyan-500/20">
              <Brain className="h-4 w-4 mr-2" />
              Clinical
            </TabsTrigger>
            <TabsTrigger value="anatomical" className="text-white data-[state=active]:bg-blue-500/20">
              <Layers className="h-4 w-4 mr-2" />
              Anatomical
            </TabsTrigger>
            <TabsTrigger value="pathology" className="text-white data-[state=active]:bg-red-500/20">
              <Microscope className="h-4 w-4 mr-2" />
              Pathology
            </TabsTrigger>
            <TabsTrigger value="treatment" className="text-white data-[state=active]:bg-green-500/20">
              <Target className="h-4 w-4 mr-2" />
              Treatment
            </TabsTrigger>
            <TabsTrigger value="measurement" className="text-white data-[state=active]:bg-purple-500/20">
              <Ruler className="h-4 w-4 mr-2" />
              Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clinical" className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-cyan-300 font-medium">Brain Opacity</label>
                <Slider
                  value={[brainOpacity]}
                  min={0.1}
                  max={1}
                  step={0.05}
                  onValueChange={(value) => setBrainOpacity(value[0])}
                  className="w-full"
                />
                <span className="text-xs text-gray-400">{Math.round(brainOpacity * 100)}%</span>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-red-300 font-medium">Tumor Opacity</label>
                <Slider
                  value={[tumorOpacity]}
                  min={0.3}
                  max={1}
                  step={0.05}
                  onValueChange={(value) => setTumorOpacity(value[0])}
                  className="w-full"
                />
                <span className="text-xs text-gray-400">{Math.round(tumorOpacity * 100)}%</span>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-yellow-300 font-medium">Lighting</label>
                <Slider
                  value={[lightingIntensity]}
                  min={0.5}
                  max={2}
                  step={0.1}
                  onValueChange={(value) => setLightingIntensity(value[0])}
                  className="w-full"
                />
                <span className="text-xs text-gray-400">{lightingIntensity.toFixed(1)}x</span>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-purple-300 font-medium">Contrast</label>
                <Slider
                  value={[contrastLevel]}
                  min={0.5}
                  max={2}
                  step={0.1}
                  onValueChange={(value) => setContrastLevel(value[0])}
                  className="w-full"
                />
                <span className="text-xs text-gray-400">{contrastLevel.toFixed(1)}x</span>
              </div>
              <Button
                variant={showVasculature ? "default" : "outline"}
                size="sm"
                onClick={() => setShowVasculature(!showVasculature)}
                className="bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30"
              >
                <Activity className="h-4 w-4 mr-2" />
                Vessels
              </Button>
              <Button
                variant={showLabels ? "default" : "outline"}
                size="sm"
                onClick={() => setShowLabels(!showLabels)}
                className="bg-blue-500/20 border-blue-500/30 text-blue-300 hover:bg-blue-500/30"
              >
                {showLabels ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                Labels
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="treatment" className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant={showDoseMap ? "default" : "outline"}
                size="sm"
                onClick={() => setShowDoseMap(!showDoseMap)}
                className="bg-green-500/20 border-green-500/30 text-green-300 hover:bg-green-500/30"
              >
                <Zap className="h-4 w-4 mr-2" />
                Dose Map
              </Button>
              <Button
                variant={showOrgansAtRisk ? "default" : "outline"}
                size="sm"
                onClick={() => setShowOrgansAtRisk(!showOrgansAtRisk)}
                className="bg-orange-500/20 border-orange-500/30 text-orange-300 hover:bg-orange-500/30"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Organs at Risk
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-purple-500/20 border-purple-500/30 text-purple-300 hover:bg-purple-500/30"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Plan
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-cyan-500/20 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/30"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="measurement" className="space-y-4">
            <div className="flex items-center space-x-4">
              <Button
                variant={measurementMode ? "default" : "outline"}
                size="sm"
                onClick={() => setMeasurementMode(!measurementMode)}
                className="bg-purple-500/20 border-purple-500/30 text-purple-300 hover:bg-purple-500/30"
              >
                <Ruler className="h-4 w-4 mr-2" />
                Measure Tool
              </Button>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search brain regions, pathologies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800/50 border-slate-600/50 text-white placeholder:text-gray-400"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRotationSpeed(rotationSpeed > 0 ? 0 : 0.5)}
                className="bg-blue-500/20 border-blue-500/30 text-blue-300 hover:bg-blue-500/30"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                {rotationSpeed > 0 ? "Stop" : "Rotate"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* 3D Brain Canvas */}
      <div className="w-full h-full">
        <Canvas
          camera={{ position: [0, 0, 6], fov: 45 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            stencil: false,
            depth: true,
          }}
          shadows="soft"
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            {/* Advanced Lighting Setup */}
            <ambientLight intensity={0.2 * lightingIntensity} color="#4a90e2" />
            <directionalLight
              position={[10, 10, 5]}
              intensity={1.5 * lightingIntensity}
              color="#ffffff"
              castShadow
              shadow-mapSize-width={4096}
              shadow-mapSize-height={4096}
              shadow-camera-far={50}
              shadow-camera-left={-10}
              shadow-camera-right={10}
              shadow-camera-top={10}
              shadow-camera-bottom={-10}
            />
            <pointLight position={[-10, -10, -10]} intensity={0.8 * lightingIntensity} color="#00d4ff" />
            <pointLight position={[10, -5, 10]} intensity={0.6 * lightingIntensity} color="#ff6b9d" />
            <spotLight
              position={[0, 8, 0]}
              intensity={1.2 * lightingIntensity}
              angle={0.4}
              penumbra={0.5}
              color="#ffffff"
              castShadow
            />

            <Environment preset="studio" />

            <MedicalBrainModel
              brainOpacity={brainOpacity}
              tumorOpacity={tumorOpacity}
              showLabels={showLabels}
              showVasculature={showVasculature}
              showDoseMap={showDoseMap}
              showOrgansAtRisk={showOrgansAtRisk}
              activeView={activeView}
              onRegionSelect={setSelectedRegion}
              onTumorSelect={setSelectedTumor}
              tumorData={tumorData}
              brainRegions={brainRegions}
              dosePoints={dosePoints}
              measurementMode={measurementMode}
              rotationSpeed={rotationSpeed}
              contrastLevel={contrastLevel}
            />

            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              autoRotate={rotationSpeed > 0}
              autoRotateSpeed={rotationSpeed}
              minDistance={3}
              maxDistance={15}
              enableDamping
              dampingFactor={0.05}
              maxPolarAngle={Math.PI}
              minPolarAngle={0}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Tumor Analysis Panel */}
      {selectedTumor && (
        <div className="absolute top-20 right-4 w-80 bg-black/95 backdrop-blur-xl rounded-xl p-4 border border-red-500/40 z-20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
              Tumor Analysis
            </h3>
            <div className="flex space-x-2">
              <Badge variant="destructive" className="bg-red-500/20 text-red-300 border-red-500/30">
                Grade {selectedTumor.grade}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTumor(null)}
                className="text-gray-400 hover:text-white h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <div className="text-gray-400 text-xs mb-1">Volume</div>
                <div className="text-white font-semibold">{selectedTumor.volume} cm³</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <div className="text-gray-400 text-xs mb-1">Density</div>
                <div className="text-white font-semibold">{Math.round(selectedTumor.density * 100)}%</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Vascularization</span>
                <span className="text-red-300">{Math.round(selectedTumor.vascularization * 100)}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-red-500 to-red-300 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${selectedTumor.vascularization * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Edema</span>
                <span className="text-yellow-300">{Math.round(selectedTumor.edema * 100)}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-yellow-500 to-yellow-300 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${selectedTumor.edema * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Necrosis</span>
                <span className="text-purple-300">{Math.round(selectedTumor.necrosis * 100)}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-purple-300 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${selectedTumor.necrosis * 100}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
              <span className="text-gray-400">Enhancement</span>
              <Badge
                variant={selectedTumor.enhancement ? "default" : "secondary"}
                className={
                  selectedTumor.enhancement ? "bg-green-500/20 text-green-300" : "bg-gray-500/20 text-gray-300"
                }
              >
                {selectedTumor.enhancement ? "Present" : "Absent"}
              </Badge>
            </div>

            <div className="pt-2 border-t border-slate-700">
              <div className="text-gray-400 text-xs mb-2">Pathology Type</div>
              <Badge variant="outline" className="text-red-300 border-red-500/30 bg-red-500/10">
                {selectedTumor.type.charAt(0).toUpperCase() + selectedTumor.type.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Region Information Panel */}
      {selectedRegion && (
        <div className="absolute top-20 left-4 w-72 bg-black/95 backdrop-blur-xl rounded-xl p-4 border border-blue-500/40 z-20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold flex items-center">
              <Info className="h-5 w-5 mr-2 text-blue-400" />
              {selectedRegion}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedRegion(null)}
              className="text-gray-400 hover:text-white h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>

          {brainRegions.find((r) => r.name === selectedRegion) && (
            <div className="space-y-3 text-sm">
              <p className="text-gray-300 leading-relaxed">
                {brainRegions.find((r) => r.name === selectedRegion)?.function}
              </p>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-800/50 rounded-lg p-2">
                  <div className="text-gray-400 text-xs">Criticality</div>
                  <div className="text-white font-semibold">
                    {brainRegions.find((r) => r.name === selectedRegion)?.criticalityScore}/10
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-2">
                  <div className="text-gray-400 text-xs">Blood Flow</div>
                  <div className="text-white font-semibold">
                    {Math.round((brainRegions.find((r) => r.name === selectedRegion)?.bloodFlow || 0) * 100)}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400">Status</span>
                <Badge
                  variant={brainRegions.find((r) => r.name === selectedRegion)?.affected ? "destructive" : "secondary"}
                  className={
                    brainRegions.find((r) => r.name === selectedRegion)?.affected
                      ? "bg-red-500/20 text-red-300 border-red-500/30"
                      : "bg-green-500/20 text-green-300 border-green-500/30"
                  }
                >
                  {brainRegions.find((r) => r.name === selectedRegion)?.affected ? "Affected" : "Normal"}
                </Badge>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Treatment Planning Panel */}
      {showDoseMap && (
        <div className="absolute bottom-4 left-4 w-80 bg-black/95 backdrop-blur-xl rounded-xl p-4 border border-green-500/40 z-20">
          <h3 className="text-white font-semibold flex items-center mb-3">
            <Zap className="h-5 w-5 mr-2 text-green-400" />
            Dose Distribution
          </h3>

          <div className="space-y-3">
            {dosePoints.map((point, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: `hsl(${120 - (point.dose / 60) * 120}, 70%, 50%)`,
                    }}
                  />
                  <span className="text-white text-sm">{point.dose} Gy</span>
                </div>
                <Badge variant="outline" className="text-xs border-green-500/30 text-green-300">
                  {point.isoCurve}% isodose
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Monitor */}
      <div className="absolute bottom-4 right-4 bg-black/90 backdrop-blur-xl rounded-lg p-3 border border-cyan-500/30 z-10">
        <div className="flex items-center space-x-3">
          <Activity className="h-4 w-4 text-cyan-400" />
          <div>
            <div className="text-white text-sm font-medium">Rendering Performance</div>
            <div className="flex items-center space-x-2">
              <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-cyan-400 rounded-full animate-pulse"
                  style={{ width: "85%" }}
                />
              </div>
              <span className="text-xs text-gray-300">85 FPS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MedicalBrainModel({
  brainOpacity,
  tumorOpacity,
  showLabels,
  showVasculature,
  showDoseMap,
  showOrgansAtRisk,
  activeView,
  onRegionSelect,
  onTumorSelect,
  tumorData,
  brainRegions,
  dosePoints,
  measurementMode,
  rotationSpeed,
  contrastLevel,
}: {
  brainOpacity: number
  tumorOpacity: number
  showLabels: boolean
  showVasculature: boolean
  showDoseMap: boolean
  showOrgansAtRisk: boolean
  activeView: string
  onRegionSelect: (region: string | null) => void
  onTumorSelect: (tumor: TumorData | null) => void
  tumorData: TumorData
  brainRegions: BrainRegion[]
  dosePoints: DosePoint[]
  measurementMode: boolean
  rotationSpeed: number
  contrastLevel: number
}) {
  const brainRef = useRef<THREE.Group>(null)
  const [time, setTime] = useState(0)

  useFrame((state, delta) => {
    setTime(time + delta)
    if (brainRef.current) {
      // Subtle breathing animation
      const breathe = 1 + Math.sin(time * 2) * 0.005
      brainRef.current.scale.setScalar(breathe)
    }
  })

  return (
    <group ref={brainRef}>
      {/* Main Brain Structure - Medical Grade */}
      <group>
        {/* Outer Cortex - Translucent Blue */}
        <mesh position={[0, 0, 0]} receiveShadow castShadow>
          <sphereGeometry args={[1.8, 256, 256]} />
          <meshPhysicalMaterial
            color={new THREE.Color(0.3, 0.6, 1.0).multiplyScalar(contrastLevel)}
            transparent
            opacity={brainOpacity}
            roughness={0.2}
            metalness={0.05}
            clearcoat={0.8}
            clearcoatRoughness={0.1}
            transmission={0.3}
            thickness={0.8}
            ior={1.4}
            emissive={new THREE.Color(0.1, 0.3, 0.6)}
            emissiveIntensity={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Inner Brain Matter */}
        <mesh position={[0, 0, 0]} scale={[0.92, 0.92, 0.92]}>
          <sphereGeometry args={[1.8, 128, 128]} />
          <meshPhysicalMaterial
            color={new THREE.Color(0.8, 0.6, 0.9).multiplyScalar(contrastLevel)}
            transparent
            opacity={brainOpacity * 0.4}
            roughness={0.4}
            metalness={0.02}
            transmission={0.6}
            thickness={0.5}
            ior={1.3}
          />
        </mesh>

        {/* Brain Surface Texture Details */}
        {Array.from({ length: 40 }).map((_, i) => {
          const phi = Math.acos(-1 + (2 * i) / 40)
          const theta = Math.sqrt(40 * Math.PI) * phi
          return (
            <mesh
              key={i}
              position={[
                1.75 * Math.cos(theta) * Math.sin(phi),
                1.75 * Math.cos(phi),
                1.75 * Math.sin(theta) * Math.sin(phi),
              ]}
            >
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshStandardMaterial
                color={new THREE.Color(0.4, 0.7, 1.0).multiplyScalar(contrastLevel)}
                transparent
                opacity={brainOpacity * 0.6}
              />
            </mesh>
          )
        })}

        {/* Cerebellum - Detailed */}
        <mesh position={[0, -1.3, -0.9]} scale={[0.7, 0.5, 0.7]}>
          <sphereGeometry args={[0.8, 64, 64]} />
          <meshPhysicalMaterial
            color={new THREE.Color(0.5, 0.7, 1.0).multiplyScalar(contrastLevel)}
            transparent
            opacity={brainOpacity}
            roughness={0.3}
            metalness={0.1}
            clearcoat={0.5}
          />
        </mesh>

        {/* Brain Stem */}
        <mesh position={[0, -1.6, 0]} scale={[0.25, 0.8, 0.25]}>
          <cylinderGeometry args={[0.3, 0.4, 1.4, 32]} />
          <meshPhysicalMaterial
            color={new THREE.Color(0.6, 0.8, 1.0).multiplyScalar(contrastLevel)}
            transparent
            opacity={brainOpacity}
            roughness={0.2}
          />
        </mesh>

        {/* Tumor - High Fidelity Glioblastoma */}
        <group>
          {/* Main Tumor Mass */}
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
            <sphereGeometry args={[tumorData.size, 64, 64]} />
            <meshPhysicalMaterial
              color={new THREE.Color(1.0, 0.1, 0.2).multiplyScalar(contrastLevel)}
              transparent
              opacity={tumorOpacity}
              emissive={new THREE.Color(1.0, 0.2, 0.3)}
              emissiveIntensity={0.6}
              roughness={0.1}
              metalness={0.05}
              clearcoat={0.8}
              clearcoatRoughness={0.2}
            />
          </mesh>

          {/* Tumor Core - Necrotic Center */}
          <mesh position={tumorData.position}>
            <sphereGeometry args={[tumorData.size * 0.4, 32, 32]} />
            <meshPhysicalMaterial
              color={new THREE.Color(0.8, 0.1, 0.1).multiplyScalar(contrastLevel)}
              transparent
              opacity={tumorOpacity * 0.8}
              emissive={new THREE.Color(0.6, 0.0, 0.0)}
              emissiveIntensity={0.3}
            />
          </mesh>

          {/* Tumor Glow Effect */}
          <mesh position={tumorData.position}>
            <sphereGeometry args={[tumorData.size * 1.8, 32, 32]} />
            <meshBasicMaterial
              color={new THREE.Color(1.0, 0.3, 0.4).multiplyScalar(contrastLevel)}
              transparent
              opacity={0.15}
              side={THREE.BackSide}
            />
          </mesh>

          {/* Edema Zone */}
          <mesh position={tumorData.position}>
            <sphereGeometry args={[tumorData.size * 2.5, 32, 32]} />
            <meshBasicMaterial
              color={new THREE.Color(1.0, 0.8, 0.2).multiplyScalar(contrastLevel)}
              transparent
              opacity={0.08}
              wireframe
            />
          </mesh>

          {showLabels && (
            <Html position={[tumorData.position[0] + 0.5, tumorData.position[1] + 0.3, tumorData.position[2]]} center>
              <div className="bg-red-500/95 text-white text-xs px-3 py-2 rounded-lg border border-red-400 shadow-xl backdrop-blur-sm">
                <div className="font-bold">Glioblastoma Multiforme</div>
                <div className="text-red-200 text-xs">
                  Grade {tumorData.grade} • {tumorData.volume} cm³
                </div>
                <div className="text-red-200 text-xs">Enhancement: {tumorData.enhancement ? "Present" : "Absent"}</div>
              </div>
            </Html>
          )}
        </group>

        {/* Vascular System */}
        {showVasculature && (
          <group>
            {Array.from({ length: 20 }).map((_, i) => (
              <VascularBranch key={i} index={i} time={time} contrastLevel={contrastLevel} />
            ))}
          </group>
        )}

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
                <sphereGeometry args={[region.size, 32, 32]} />
                <meshPhysicalMaterial
                  color={new THREE.Color(region.color).multiplyScalar(contrastLevel)}
                  transparent
                  opacity={region.affected ? 0.8 : 0.5}
                  emissive={region.affected ? new THREE.Color(region.color) : new THREE.Color(0, 0, 0)}
                  emissiveIntensity={region.affected ? 0.3 : 0}
                  roughness={0.3}
                  metalness={0.1}
                />
              </mesh>

              {showLabels && (
                <Html
                  position={[region.position[0], region.position[1] + region.size + 0.3, region.position[2]]}
                  center
                >
                  <div
                    className={`text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap border backdrop-blur-sm ${
                      region.affected ? "bg-red-500/90 border-red-400" : "bg-black/80 border-gray-600"
                    }`}
                  >
                    <div className="font-semibold">{region.name}</div>
                    <div className="text-xs opacity-80">Criticality: {region.criticalityScore}/10</div>
                    {region.affected && <div className="text-red-200 text-xs">⚠ Tumor Impact</div>}
                  </div>
                </Html>
              )}
            </group>
          ))}

        {/* Dose Distribution Map */}
        {showDoseMap && activeView === "treatment" && (
          <group>
            {dosePoints.map((point, index) => (
              <group key={index}>
                <mesh position={point.position as [number, number, number]}>
                  <sphereGeometry args={[0.1, 16, 16]} />
                  <meshBasicMaterial
                    color={new THREE.Color().setHSL((120 - (point.dose / 60) * 120) / 360, 0.8, 0.6)}
                    transparent
                    opacity={0.8}
                  />
                </mesh>

                {/* Isodose Curves */}
                <mesh position={point.position as [number, number, number]}>
                  <sphereGeometry args={[(point.dose / 60) * 0.5, 16, 16]} />
                  <meshBasicMaterial
                    color={new THREE.Color().setHSL((120 - (point.dose / 60) * 120) / 360, 0.6, 0.5)}
                    transparent
                    opacity={0.2}
                    wireframe
                  />
                </mesh>
              </group>
            ))}
          </group>
        )}

        {/* Organs at Risk Highlighting */}
        {showOrgansAtRisk && activeView === "treatment" && (
          <group>
            {brainRegions
              .filter((region) => region.criticalityScore >= 8)
              .map((region, index) => (
                <mesh key={`risk-${region.name}`} position={region.position as [number, number, number]}>
                  <sphereGeometry args={[region.size * 1.2, 24, 24]} />
                  <meshBasicMaterial color="#ff9500" transparent opacity={0.3} wireframe />
                </mesh>
              ))}
          </group>
        )}

        {/* Measurement Grid */}
        {measurementMode && (
          <group>
            <gridHelper args={[6, 30, "#4a90e2", "#4a90e2"]} />
            <axesHelper args={[3]} />
          </group>
        )}

        {/* Ventricles */}
        <group>
          <mesh position={[0.2, 0.3, 0]} scale={[0.15, 0.4, 0.1]}>
            <sphereGeometry args={[0.6, 16, 16]} />
            <meshPhysicalMaterial
              color={new THREE.Color(0.0, 0.8, 1.0).multiplyScalar(contrastLevel)}
              transparent
              opacity={0.6}
              transmission={0.9}
              thickness={0.1}
            />
          </mesh>
          <mesh position={[-0.2, 0.3, 0]} scale={[0.15, 0.4, 0.1]}>
            <sphereGeometry args={[0.6, 16, 16]} />
            <meshPhysicalMaterial
              color={new THREE.Color(0.0, 0.8, 1.0).multiplyScalar(contrastLevel)}
              transparent
              opacity={0.6}
              transmission={0.9}
              thickness={0.1}
            />
          </mesh>
        </group>
      </group>
    </group>
  )
}

function VascularBranch({ index, time, contrastLevel }: { index: number; time: number; contrastLevel: number }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (ref.current) {
      const pulse = 1 + Math.sin(time * 4 + index * 0.5) * 0.1
      ref.current.scale.setScalar(pulse)
    }
  })

  const angle = (index / 20) * Math.PI * 2
  const radius = 1.2 + Math.sin(index * 0.5) * 0.3

  return (
    <mesh
      ref={ref}
      position={[Math.cos(angle) * radius, Math.sin(angle * 0.7) * radius * 0.8, Math.sin(angle) * radius * 0.6]}
    >
      <cylinderGeometry args={[0.008, 0.015, 0.3, 8]} />
      <meshStandardMaterial
        color={new THREE.Color(1.0, 0.2, 0.2).multiplyScalar(contrastLevel)}
        emissive={new THREE.Color(0.8, 0.1, 0.1)}
        emissiveIntensity={0.4}
        transparent
        opacity={0.8}
      />
    </mesh>
  )
}
