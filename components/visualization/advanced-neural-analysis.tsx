"use client"

import { useRef, useState, Suspense, useCallback } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Html } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Eye, EyeOff, Zap, Target, Activity, Layers, RotateCcw, Play, Pause, Settings } from "lucide-react"
import * as THREE from "three"

interface AnalysisData {
  tumorVolume: number
  tumorLocation: string
  riskLevel: "low" | "medium" | "high" | "critical"
  affectedRegions: string[]
  treatmentRecommendation: string
}

interface DosePoint {
  position: [number, number, number]
  intensity: number
  type: "target" | "critical" | "safe"
}

interface OrganRisk {
  name: string
  position: [number, number, number]
  riskLevel: number
  criticalDistance: number
}

export function AdvancedNeuralAnalysis() {
  const [viewMode, setViewMode] = useState<"analysis" | "dosemap" | "organs">("analysis")
  const [brainOpacity, setBrainOpacity] = useState(0.6)
  const [tumorOpacity, setTumorOpacity] = useState(0.95)
  const [showLabels, setShowLabels] = useState(true)
  const [isAnimating, setIsAnimating] = useState(true)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [analysisData] = useState<AnalysisData>({
    tumorVolume: 12.7,
    tumorLocation: "Right Frontal Lobe",
    riskLevel: "high",
    affectedRegions: ["Motor Cortex", "Broca's Area", "Prefrontal Cortex"],
    treatmentRecommendation: "Surgical resection with adjuvant radiotherapy",
  })

  const dosePoints: DosePoint[] = [
    { position: [0.4, 0.6, 0.2], intensity: 95, type: "target" },
    { position: [0.3, 0.5, 0.3], intensity: 75, type: "target" },
    { position: [0.5, 0.7, 0.1], intensity: 50, type: "safe" },
    { position: [0.2, 0.4, 0.4], intensity: 30, type: "safe" },
    { position: [0.6, 0.8, 0.0], intensity: 85, type: "critical" },
  ]

  const organsAtRisk: OrganRisk[] = [
    { name: "Optic Chiasm", position: [0, -0.3, 0.8], riskLevel: 0.3, criticalDistance: 2.5 },
    { name: "Brain Stem", position: [0, -0.8, 0], riskLevel: 0.8, criticalDistance: 1.0 },
    { name: "Motor Cortex", position: [0.3, 0.4, 0.3], riskLevel: 0.9, criticalDistance: 0.5 },
    { name: "Speech Center", position: [0.6, 0.2, 0.1], riskLevel: 0.6, criticalDistance: 1.5 },
  ]

  const resetView = useCallback(() => {
    setViewMode("analysis")
    setBrainOpacity(0.6)
    setTumorOpacity(0.95)
    setSelectedRegion(null)
  }, [])

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-xl overflow-hidden relative">
      {/* Main Control Panel */}
      <div className="absolute top-4 left-4 z-20">
        <Card className="bg-slate-900/95 backdrop-blur-xl border-slate-700/50 w-80">
          <CardHeader className="pb-3">
            <CardTitle className="text-cyan-400 flex items-center text-lg">
              <Brain className="h-5 w-5 mr-2" />
              Advanced Neural Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* View Mode Selector */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={viewMode === "analysis" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("analysis")}
                className={`${
                  viewMode === "analysis"
                    ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                    : "bg-slate-800/50 border-slate-600/50 text-slate-300"
                }`}
              >
                <Brain className="h-4 w-4 mr-1" />
                Analysis
              </Button>
              <Button
                variant={viewMode === "dosemap" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("dosemap")}
                className={`${
                  viewMode === "dosemap"
                    ? "bg-green-500/20 border-green-500/50 text-green-300"
                    : "bg-slate-800/50 border-slate-600/50 text-slate-300"
                }`}
              >
                <Zap className="h-4 w-4 mr-1" />
                Dose Map
              </Button>
              <Button
                variant={viewMode === "organs" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("organs")}
                className={`${
                  viewMode === "organs"
                    ? "bg-orange-500/20 border-orange-500/50 text-orange-300"
                    : "bg-slate-800/50 border-slate-600/50 text-slate-300"
                }`}
              >
                <Target className="h-4 w-4 mr-1" />
                Organs
              </Button>
            </div>

            {/* Opacity Controls */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-slate-300">Brain Opacity</label>
                  <span className="text-xs text-slate-400">{Math.round(brainOpacity * 100)}%</span>
                </div>
                <Slider
                  value={[brainOpacity]}
                  min={0.1}
                  max={1}
                  step={0.05}
                  onValueChange={(value) => setBrainOpacity(value[0])}
                  className="w-full"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-slate-300">Tumor Opacity</label>
                  <span className="text-xs text-slate-400">{Math.round(tumorOpacity * 100)}%</span>
                </div>
                <Slider
                  value={[tumorOpacity]}
                  min={0.3}
                  max={1}
                  step={0.05}
                  onValueChange={(value) => setTumorOpacity(value[0])}
                  className="w-full"
                />
              </div>
            </div>

            {/* Quick Controls */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLabels(!showLabels)}
                className="bg-slate-800/50 border-slate-600/50 text-slate-300"
              >
                {showLabels ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAnimating(!isAnimating)}
                className="bg-slate-800/50 border-slate-600/50 text-slate-300"
              >
                {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetView}
                className="bg-slate-800/50 border-slate-600/50 text-slate-300"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Panel */}
      <div className="absolute top-4 right-4 z-20">
        <Card className="bg-slate-900/95 backdrop-blur-xl border-slate-700/50 w-72">
          <CardHeader className="pb-3">
            <CardTitle className="text-cyan-400 flex items-center text-lg">
              <Activity className="h-5 w-5 mr-2" />
              {viewMode === "analysis" && "Tumor Analysis"}
              {viewMode === "dosemap" && "Dose Distribution"}
              {viewMode === "organs" && "Risk Assessment"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {viewMode === "analysis" && <TumorAnalysisPanel data={analysisData} />}
            {viewMode === "dosemap" && <DoseMapPanel dosePoints={dosePoints} />}
            {viewMode === "organs" && <OrgansRiskPanel organs={organsAtRisk} />}
          </CardContent>
        </Card>
      </div>

      {/* Status Bar */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <Card className="bg-slate-900/95 backdrop-blur-xl border-slate-700/50">
          <CardContent className="p-3">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-slate-300">Real-time Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <Layers className="h-4 w-4 text-cyan-400" />
                <span className="text-slate-300">High Resolution</span>
              </div>
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4 text-purple-400" />
                <span className="text-slate-300">WebGL Accelerated</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3D Canvas */}
      <div className="w-full h-full">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            stencil: false,
            depth: true,
            logarithmicDepthBuffer: true,
          }}
          shadows="soft"
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <ProfessionalLighting />
            <Environment preset="studio" />
            <MedicalBrainModel
              brainOpacity={brainOpacity}
              tumorOpacity={tumorOpacity}
              showLabels={showLabels}
              isAnimating={isAnimating}
              viewMode={viewMode}
              dosePoints={dosePoints}
              organsAtRisk={organsAtRisk}
              onRegionSelect={setSelectedRegion}
            />
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              autoRotate={false}
              minDistance={3}
              maxDistance={10}
              enableDamping
              dampingFactor={0.05}
              maxPolarAngle={Math.PI}
              minPolarAngle={0}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  )
}

function ProfessionalLighting() {
  return (
    <>
      <ambientLight intensity={0.2} color="#1e293b" />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.5}
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
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#0ea5e9" />
      <pointLight position={[10, -5, 10]} intensity={0.6} color="#06b6d4" />
      <spotLight position={[0, 8, 0]} intensity={1.2} angle={0.4} penumbra={0.5} color="#ffffff" castShadow />
    </>
  )
}

function MedicalBrainModel({
  brainOpacity,
  tumorOpacity,
  showLabels,
  isAnimating,
  viewMode,
  dosePoints,
  organsAtRisk,
  onRegionSelect,
}: {
  brainOpacity: number
  tumorOpacity: number
  showLabels: boolean
  isAnimating: boolean
  viewMode: string
  dosePoints: DosePoint[]
  organsAtRisk: OrganRisk[]
  onRegionSelect: (region: string) => void
}) {
  const brainRef = useRef<THREE.Group>(null)
  const tumorRef = useRef<THREE.Mesh>(null)
  const [time, setTime] = useState(0)

  useFrame((state, delta) => {
    setTime(time + delta)
    if (brainRef.current) {
      const breathe = 1 + Math.sin(time * 2) * 0.002
      brainRef.current.scale.setScalar(breathe)
    }
    if (tumorRef.current && isAnimating) {
      const pulse = 1 + Math.sin(time * 4) * 0.05
      tumorRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <group ref={brainRef}>
      {/* Brain Structure */}
      <mesh receiveShadow castShadow onClick={() => onRegionSelect("brain")}>
        <sphereGeometry args={[1.8, 128, 128]} />
        <meshPhysicalMaterial
          color={new THREE.Color(0.2, 0.6, 1.0)}
          transparent
          opacity={brainOpacity}
          roughness={0.1}
          metalness={0.02}
          clearcoat={0.9}
          clearcoatRoughness={0.05}
          transmission={0.4}
          thickness={1.0}
          ior={1.4}
          emissive={new THREE.Color(0.05, 0.15, 0.3)}
          emissiveIntensity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Tumor */}
      <mesh ref={tumorRef} position={[0.4, 0.6, 0.2]} receiveShadow castShadow onClick={() => onRegionSelect("tumor")}>
        <sphereGeometry args={[0.25, 64, 64]} />
        <meshPhysicalMaterial
          color={new THREE.Color(1.0, 0.2, 0.3)}
          transparent
          opacity={tumorOpacity}
          emissive={new THREE.Color(1.0, 0.1, 0.2)}
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.05}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
        />
      </mesh>

      {/* Tumor Glow */}
      <mesh position={[0.4, 0.6, 0.2]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshBasicMaterial
          color={new THREE.Color(1.0, 0.3, 0.4)}
          transparent
          opacity={0.1 + Math.sin(time * 3) * 0.05}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Dose Map Visualization */}
      {viewMode === "dosemap" && (
        <group>
          {dosePoints.map((point, index) => (
            <DoseVisualization key={index} point={point} time={time} />
          ))}
        </group>
      )}

      {/* Organs at Risk Visualization */}
      {viewMode === "organs" && (
        <group>
          {organsAtRisk.map((organ, index) => (
            <OrganRiskVisualization key={index} organ={organ} time={time} />
          ))}
        </group>
      )}

      {/* Labels */}
      {showLabels && (
        <>
          <Html position={[0.7, 0.9, 0.2]} center>
            <div className="bg-red-500/90 text-white text-xs px-3 py-2 rounded-lg border border-red-400 shadow-xl backdrop-blur-sm pointer-events-none">
              <div className="font-bold">Glioblastoma</div>
              <div className="text-red-200 text-xs">Grade IV • 12.7 cm³</div>
            </div>
          </Html>
          <Html position={[0, -2.2, 0]} center>
            <div className="bg-cyan-500/90 text-white text-xs px-3 py-2 rounded-lg border border-cyan-400 shadow-xl backdrop-blur-sm pointer-events-none">
              <div className="font-bold">Brain Tissue</div>
              <div className="text-cyan-200 text-xs">Healthy • Translucent View</div>
            </div>
          </Html>
        </>
      )}
    </group>
  )
}

function DoseVisualization({ point, time }: { point: DosePoint; time: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      const pulse = 1 + Math.sin(time * 3 + point.intensity * 0.1) * 0.1
      meshRef.current.scale.setScalar(pulse)
    }
  })

  const getColor = () => {
    if (point.type === "target") return new THREE.Color(0, 1, 0)
    if (point.type === "critical") return new THREE.Color(1, 0.5, 0)
    return new THREE.Color(0, 0.5, 1)
  }

  return (
    <group>
      <mesh ref={meshRef} position={point.position}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color={getColor()} transparent opacity={0.8} />
      </mesh>
      <mesh position={point.position}>
        <sphereGeometry args={[(point.intensity / 100) * 0.3, 16, 16]} />
        <meshBasicMaterial color={getColor()} transparent opacity={0.2} wireframe />
      </mesh>
    </group>
  )
}

function OrganRiskVisualization({ organ, time }: { organ: OrganRisk; time: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      const pulse = 1 + Math.sin(time * 4 + organ.riskLevel * 5) * (organ.riskLevel * 0.2)
      meshRef.current.scale.setScalar(pulse)
    }
  })

  const getRiskColor = () => {
    if (organ.riskLevel > 0.7) return new THREE.Color(1, 0, 0)
    if (organ.riskLevel > 0.4) return new THREE.Color(1, 0.5, 0)
    return new THREE.Color(0, 1, 0)
  }

  return (
    <group>
      <mesh ref={meshRef} position={organ.position}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={getRiskColor()} transparent opacity={0.9} />
      </mesh>
      <mesh position={organ.position}>
        <sphereGeometry args={[organ.criticalDistance * 0.1, 16, 16]} />
        <meshBasicMaterial color={getRiskColor()} transparent opacity={0.1} wireframe />
      </mesh>
    </group>
  )
}

function TumorAnalysisPanel({ data }: { data: AnalysisData }) {
  return (
    <div className="space-y-4">
      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-red-300">Tumor Detected</span>
          <Badge
            variant="destructive"
            className={`${
              data.riskLevel === "critical"
                ? "bg-red-500/20 text-red-300"
                : data.riskLevel === "high"
                  ? "bg-orange-500/20 text-orange-300"
                  : "bg-yellow-500/20 text-yellow-300"
            }`}
          >
            {data.riskLevel.toUpperCase()}
          </Badge>
        </div>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-slate-400">Location:</span>
            <span className="text-white ml-2">{data.tumorLocation}</span>
          </div>
          <div>
            <span className="text-slate-400">Volume:</span>
            <span className="text-white ml-2">{data.tumorVolume} cm³</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-slate-300">Affected Regions</h4>
        {data.affectedRegions.map((region, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-slate-800/50 rounded">
            <span className="text-sm text-slate-300">{region}</span>
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
        <h4 className="text-sm font-medium text-cyan-300 mb-2">Recommendation</h4>
        <p className="text-xs text-slate-300">{data.treatmentRecommendation}</p>
      </div>
    </div>
  )
}

function DoseMapPanel({ dosePoints }: { dosePoints: DosePoint[] }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-slate-300">Dose Distribution</h4>
        {dosePoints.map((point, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-slate-800/50 rounded">
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  point.type === "target" ? "bg-green-400" : point.type === "critical" ? "bg-orange-400" : "bg-blue-400"
                }`}
              ></div>
              <span className="text-sm text-slate-300">{point.intensity}% Dose</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {point.type}
            </Badge>
          </div>
        ))}
      </div>

      <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
        <h4 className="text-sm font-medium text-green-300 mb-2">Coverage Analysis</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Target Coverage</span>
            <span className="text-green-300">95.2%</span>
          </div>
          <Progress value={95.2} className="h-2" />
        </div>
      </div>
    </div>
  )
}

function OrgansRiskPanel({ organs }: { organs: OrganRisk[] }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-slate-300">Risk Assessment</h4>
        {organs.map((organ, index) => (
          <div key={index} className="p-2 bg-slate-800/50 rounded">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-slate-300">{organ.name}</span>
              <div
                className={`w-2 h-2 rounded-full ${
                  organ.riskLevel > 0.7 ? "bg-red-400" : organ.riskLevel > 0.4 ? "bg-orange-400" : "bg-green-400"
                }`}
              ></div>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Risk Level</span>
              <span className="text-white">{Math.round(organ.riskLevel * 100)}%</span>
            </div>
            <Progress value={organ.riskLevel * 100} className="h-1 mt-1" />
          </div>
        ))}
      </div>

      <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
        <h4 className="text-sm font-medium text-orange-300 mb-2">Safety Margins</h4>
        <p className="text-xs text-slate-300">
          Critical structures within 2.5cm of treatment area require enhanced monitoring.
        </p>
      </div>
    </div>
  )
}
