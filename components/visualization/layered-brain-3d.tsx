"use client"

import { useRef, useState, Suspense, useCallback } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Html } from "@react-three/drei"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Eye,
  EyeOff,
  Zap,
  Ruler,
  AlertTriangle,
  Target,
  Brain,
  Activity,
  Layers,
  Download,
  Share2,
  Microscope,
  ZoomIn,
  Camera,
  Settings,
  Play,
  Pause,
  Volume2,
} from "lucide-react"
import * as THREE from "three"

interface TumorLayer {
  id: string
  name: string
  depth: number
  cellType: "glioblastoma" | "necrotic" | "edema" | "vascular" | "healthy"
  density: number
  activity: number
  oxygenation: number
  proliferation: number
  apoptosis: number
  angiogenesis: number
}

interface CellularData {
  position: [number, number, number]
  type: "tumor" | "healthy" | "damaged" | "dead"
  size: number
  activity: number
  division: boolean
  oxygenLevel: number
  proteinExpression: number
}

interface DoseDistribution {
  position: [number, number, number]
  dose: number
  isoCurve: number
  biologicalEffect: number
  cellKill: number
  oxygenEnhancement: number
}

export function LayeredBrain3D() {
  const [brainOpacity, setBrainOpacity] = useState(0.7)
  const [tumorOpacity, setTumorOpacity] = useState(0.95)
  const [showLabels, setShowLabels] = useState(true)
  const [showVasculature, setShowVasculature] = useState(false)
  const [showCellular, setShowCellular] = useState(false)
  const [showDoseMap, setShowDoseMap] = useState(false)
  const [showOrgansAtRisk, setShowOrgansAtRisk] = useState(false)
  const [activeView, setActiveView] = useState("clinical")
  const [zoomLevel, setZoomLevel] = useState(1)
  const [selectedTumorLayer, setSelectedTumorLayer] = useState<TumorLayer | null>(null)
  const [animationSpeed, setAnimationSpeed] = useState(1)
  const [isAnimating, setIsAnimating] = useState(true)
  const [lightingIntensity, setLightingIntensity] = useState(1.5)
  const [contrastLevel, setContrastLevel] = useState(1.2)
  const [cellularDetail, setCellularDetail] = useState(0.5)
  const [tumorFocus, setTumorFocus] = useState(false)

  const tumorLayers: TumorLayer[] = [
    {
      id: "outer-layer",
      name: "Tumor Periphery",
      depth: 1.0,
      cellType: "glioblastoma",
      density: 0.85,
      activity: 0.9,
      oxygenation: 0.7,
      proliferation: 0.8,
      apoptosis: 0.2,
      angiogenesis: 0.6,
    },
    {
      id: "active-layer",
      name: "Active Tumor Core",
      depth: 0.7,
      cellType: "glioblastoma",
      density: 0.95,
      activity: 1.0,
      oxygenation: 0.4,
      proliferation: 0.95,
      apoptosis: 0.1,
      angiogenesis: 0.8,
    },
    {
      id: "necrotic-core",
      name: "Necrotic Center",
      depth: 0.4,
      cellType: "necrotic",
      density: 0.3,
      activity: 0.1,
      oxygenation: 0.1,
      proliferation: 0.0,
      apoptosis: 0.9,
      angiogenesis: 0.2,
    },
    {
      id: "edema-zone",
      name: "Peritumoral Edema",
      depth: 1.5,
      cellType: "edema",
      density: 0.4,
      activity: 0.3,
      oxygenation: 0.8,
      proliferation: 0.1,
      apoptosis: 0.3,
      angiogenesis: 0.4,
    },
  ]

  const cellularData: CellularData[] = Array.from({ length: 200 }, (_, i) => ({
    position: [(Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.6] as [
      number,
      number,
      number,
    ],
    type: Math.random() > 0.7 ? "tumor" : Math.random() > 0.5 ? "healthy" : "damaged",
    size: 0.005 + Math.random() * 0.01,
    activity: Math.random(),
    division: Math.random() > 0.8,
    oxygenLevel: Math.random(),
    proteinExpression: Math.random(),
  }))

  const doseDistribution: DoseDistribution[] = [
    {
      position: [0.4, 0.6, 0.2],
      dose: 60,
      isoCurve: 95,
      biologicalEffect: 0.9,
      cellKill: 0.85,
      oxygenEnhancement: 1.3,
    },
    {
      position: [0.3, 0.5, 0.3],
      dose: 45,
      isoCurve: 75,
      biologicalEffect: 0.7,
      cellKill: 0.65,
      oxygenEnhancement: 1.2,
    },
    {
      position: [0.5, 0.7, 0.1],
      dose: 30,
      isoCurve: 50,
      biologicalEffect: 0.5,
      cellKill: 0.45,
      oxygenEnhancement: 1.1,
    },
  ]

  const handleTumorFocus = useCallback(() => {
    setTumorFocus(!tumorFocus)
    setZoomLevel(tumorFocus ? 1 : 3)
  }, [tumorFocus])

  return (
    <div className="w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative">
      {/* Advanced Control Panel */}
      <div className="absolute top-4 left-4 right-4 bg-black/95 backdrop-blur-xl rounded-xl p-4 border border-cyan-500/40 z-10">
        <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
          <TabsList className="grid grid-cols-6 bg-slate-800/50 mb-4">
            <TabsTrigger value="clinical" className="text-white data-[state=active]:bg-cyan-500/20">
              <Brain className="h-4 w-4 mr-2" />
              Clinical
            </TabsTrigger>
            <TabsTrigger value="anatomical" className="text-white data-[state=active]:bg-blue-500/20">
              <Layers className="h-4 w-4 mr-2" />
              Anatomical
            </TabsTrigger>
            <TabsTrigger value="cellular" className="text-white data-[state=active]:bg-purple-500/20">
              <Microscope className="h-4 w-4 mr-2" />
              Cellular
            </TabsTrigger>
            <TabsTrigger value="pathology" className="text-white data-[state=active]:bg-red-500/20">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Pathology
            </TabsTrigger>
            <TabsTrigger value="treatment" className="text-white data-[state=active]:bg-green-500/20">
              <Target className="h-4 w-4 mr-2" />
              Treatment
            </TabsTrigger>
            <TabsTrigger value="analysis" className="text-white data-[state=active]:bg-orange-500/20">
              <Ruler className="h-4 w-4 mr-2" />
              Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clinical" className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-8 gap-4">
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
                  max={3}
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
                  max={2.5}
                  step={0.1}
                  onValueChange={(value) => setContrastLevel(value[0])}
                  className="w-full"
                />
                <span className="text-xs text-gray-400">{contrastLevel.toFixed(1)}x</span>
              </div>
              <Button
                variant={tumorFocus ? "default" : "outline"}
                size="sm"
                onClick={handleTumorFocus}
                className="bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30"
              >
                <ZoomIn className="h-4 w-4 mr-2" />
                Focus Tumor
              </Button>
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
              <Button
                variant={isAnimating ? "default" : "outline"}
                size="sm"
                onClick={() => setIsAnimating(!isAnimating)}
                className="bg-green-500/20 border-green-500/30 text-green-300 hover:bg-green-500/30"
              >
                {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                Animation
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="cellular" className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-purple-300 font-medium">Cellular Detail</label>
                <Slider
                  value={[cellularDetail]}
                  min={0}
                  max={1}
                  step={0.1}
                  onValueChange={(value) => setCellularDetail(value[0])}
                  className="w-full"
                />
                <span className="text-xs text-gray-400">{Math.round(cellularDetail * 100)}%</span>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-orange-300 font-medium">Animation Speed</label>
                <Slider
                  value={[animationSpeed]}
                  min={0.1}
                  max={3}
                  step={0.1}
                  onValueChange={(value) => setAnimationSpeed(value[0])}
                  className="w-full"
                />
                <span className="text-xs text-gray-400">{animationSpeed.toFixed(1)}x</span>
              </div>
              <Button
                variant={showCellular ? "default" : "outline"}
                size="sm"
                onClick={() => setShowCellular(!showCellular)}
                className="bg-purple-500/20 border-purple-500/30 text-purple-300 hover:bg-purple-500/30"
              >
                <Microscope className="h-4 w-4 mr-2" />
                Cells
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-cyan-500/20 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/30"
              >
                <Camera className="h-4 w-4 mr-2" />
                Capture
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-yellow-500/20 border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/30"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-pink-500/20 border-pink-500/30 text-pink-300 hover:bg-pink-500/30"
              >
                <Volume2 className="h-4 w-4 mr-2" />
                Audio
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
        </Tabs>
      </div>

      {/* 3D Brain Canvas */}
      <div className="w-full h-full">
        <Canvas
          camera={{ position: [0, 0, 6 / zoomLevel], fov: 45 }}
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
            {/* Advanced Lighting Setup */}
            <ambientLight intensity={0.3 * lightingIntensity} color="#4a90e2" />
            <directionalLight
              position={[10, 10, 5]}
              intensity={2.0 * lightingIntensity}
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
            <pointLight position={[-10, -10, -10]} intensity={1.2 * lightingIntensity} color="#00d4ff" />
            <pointLight position={[10, -5, 10]} intensity={0.8 * lightingIntensity} color="#ff6b9d" />
            <spotLight
              position={[0, 8, 0]}
              intensity={1.8 * lightingIntensity}
              angle={0.4}
              penumbra={0.5}
              color="#ffffff"
              castShadow
            />
            <spotLight
              position={[5, 5, 5]}
              intensity={1.0 * lightingIntensity}
              angle={0.3}
              penumbra={0.3}
              color="#ff4444"
              target-position={[0.4, 0.6, 0.2]}
            />

            <Environment preset="studio" />

            <LayeredBrainModel
              brainOpacity={brainOpacity}
              tumorOpacity={tumorOpacity}
              showLabels={showLabels}
              showVasculature={showVasculature}
              showCellular={showCellular}
              showDoseMap={showDoseMap}
              showOrgansAtRisk={showOrgansAtRisk}
              activeView={activeView}
              zoomLevel={zoomLevel}
              tumorLayers={tumorLayers}
              cellularData={cellularData}
              doseDistribution={doseDistribution}
              animationSpeed={animationSpeed}
              isAnimating={isAnimating}
              contrastLevel={contrastLevel}
              cellularDetail={cellularDetail}
              tumorFocus={tumorFocus}
              onLayerSelect={setSelectedTumorLayer}
            />

            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              autoRotate={false}
              minDistance={2}
              maxDistance={20}
              enableDamping
              dampingFactor={0.05}
              maxPolarAngle={Math.PI}
              minPolarAngle={0}
              target={tumorFocus ? [0.4, 0.6, 0.2] : [0, 0, 0]}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Tumor Layer Analysis Panel */}
      {selectedTumorLayer && (
        <div className="absolute top-20 right-4 w-80 bg-black/95 backdrop-blur-xl rounded-xl p-4 border border-red-500/40 z-20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold flex items-center">
              <Layers className="h-5 w-5 mr-2 text-red-400" />
              {selectedTumorLayer.name}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTumorLayer(null)}
              className="text-gray-400 hover:text-white h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>

          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <div className="text-gray-400 text-xs mb-1">Depth</div>
                <div className="text-white font-semibold">{selectedTumorLayer.depth.toFixed(1)} mm</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <div className="text-gray-400 text-xs mb-1">Density</div>
                <div className="text-white font-semibold">{Math.round(selectedTumorLayer.density * 100)}%</div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-400 text-xs">Cell Activity</span>
                  <span className="text-red-300 text-xs">{Math.round(selectedTumorLayer.activity * 100)}%</span>
                </div>
                <Progress value={selectedTumorLayer.activity * 100} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-400 text-xs">Oxygenation</span>
                  <span className="text-blue-300 text-xs">{Math.round(selectedTumorLayer.oxygenation * 100)}%</span>
                </div>
                <Progress value={selectedTumorLayer.oxygenation * 100} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-400 text-xs">Proliferation</span>
                  <span className="text-green-300 text-xs">{Math.round(selectedTumorLayer.proliferation * 100)}%</span>
                </div>
                <Progress value={selectedTumorLayer.proliferation * 100} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-400 text-xs">Apoptosis</span>
                  <span className="text-purple-300 text-xs">{Math.round(selectedTumorLayer.apoptosis * 100)}%</span>
                </div>
                <Progress value={selectedTumorLayer.apoptosis * 100} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-400 text-xs">Angiogenesis</span>
                  <span className="text-pink-300 text-xs">{Math.round(selectedTumorLayer.angiogenesis * 100)}%</span>
                </div>
                <Progress value={selectedTumorLayer.angiogenesis * 100} className="h-2" />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-700">
              <div className="text-gray-400 text-xs mb-2">Cell Type</div>
              <Badge
                variant="outline"
                className={`text-xs ${
                  selectedTumorLayer.cellType === "glioblastoma"
                    ? "text-red-300 border-red-500/30 bg-red-500/10"
                    : selectedTumorLayer.cellType === "necrotic"
                      ? "text-purple-300 border-purple-500/30 bg-purple-500/10"
                      : "text-yellow-300 border-yellow-500/30 bg-yellow-500/10"
                }`}
              >
                {selectedTumorLayer.cellType.charAt(0).toUpperCase() + selectedTumorLayer.cellType.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Cellular Analysis Panel */}
      {showCellular && activeView === "cellular" && (
        <div className="absolute bottom-4 left-4 w-80 bg-black/95 backdrop-blur-xl rounded-xl p-4 border border-purple-500/40 z-20">
          <h3 className="text-white font-semibold flex items-center mb-3">
            <Microscope className="h-5 w-5 mr-2 text-purple-400" />
            Cellular Analysis
          </h3>

          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                <div className="text-red-300 font-semibold">
                  {cellularData.filter((c) => c.type === "tumor").length}
                </div>
                <div className="text-gray-400">Tumor</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                <div className="text-green-300 font-semibold">
                  {cellularData.filter((c) => c.type === "healthy").length}
                </div>
                <div className="text-gray-400">Healthy</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                <div className="text-yellow-300 font-semibold">
                  {cellularData.filter((c) => c.type === "damaged").length}
                </div>
                <div className="text-gray-400">Damaged</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                <div className="text-gray-300 font-semibold">
                  {cellularData.filter((c) => c.type === "dead").length}
                </div>
                <div className="text-gray-400">Dead</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-xs">Cell Division Rate</span>
                <span className="text-cyan-300 text-xs">
                  {Math.round((cellularData.filter((c) => c.division).length / cellularData.length) * 100)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-xs">Average Oxygen Level</span>
                <span className="text-blue-300 text-xs">
                  {Math.round((cellularData.reduce((sum, c) => sum + c.oxygenLevel, 0) / cellularData.length) * 100)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-xs">Protein Expression</span>
                <span className="text-purple-300 text-xs">
                  {Math.round(
                    (cellularData.reduce((sum, c) => sum + c.proteinExpression, 0) / cellularData.length) * 100,
                  )}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dose Distribution Panel */}
      {showDoseMap && activeView === "treatment" && (
        <div className="absolute bottom-4 right-4 w-80 bg-black/95 backdrop-blur-xl rounded-xl p-4 border border-green-500/40 z-20">
          <h3 className="text-white font-semibold flex items-center mb-3">
            <Zap className="h-5 w-5 mr-2 text-green-400" />
            Dose Distribution Analysis
          </h3>

          <div className="space-y-3">
            {doseDistribution.map((dose, index) => (
              <div key={index} className="bg-slate-800/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: `hsl(${120 - (dose.dose / 60) * 120}, 70%, 50%)`,
                      }}
                    />
                    <span className="text-white text-sm font-semibold">{dose.dose} Gy</span>
                  </div>
                  <Badge variant="outline" className="text-xs border-green-500/30 text-green-300">
                    {dose.isoCurve}% isodose
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-gray-400">Bio Effect</div>
                    <div className="text-white">{Math.round(dose.biologicalEffect * 100)}%</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Cell Kill</div>
                    <div className="text-white">{Math.round(dose.cellKill * 100)}%</div>
                  </div>
                  <div>
                    <div className="text-gray-400">O₂ Enhancement</div>
                    <div className="text-white">{dose.oxygenEnhancement.toFixed(1)}x</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Monitor */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-xl rounded-lg p-3 border border-cyan-500/30 z-10">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-cyan-400" />
            <div>
              <div className="text-white text-sm font-medium">Rendering: 60 FPS</div>
              <div className="text-xs text-gray-300">Zoom: {zoomLevel.toFixed(1)}x</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Layers className="h-4 w-4 text-purple-400" />
            <div>
              <div className="text-white text-sm font-medium">Layers: {tumorLayers.length}</div>
              <div className="text-xs text-gray-300">Cells: {cellularData.length}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-green-400" />
            <div>
              <div className="text-white text-sm font-medium">WebGL: Active</div>
              <div className="text-xs text-gray-300">Memory: 85%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LayeredBrainModel({
  brainOpacity,
  tumorOpacity,
  showLabels,
  showVasculature,
  showCellular,
  showDoseMap,
  showOrgansAtRisk,
  activeView,
  zoomLevel,
  tumorLayers,
  cellularData,
  doseDistribution,
  animationSpeed,
  isAnimating,
  contrastLevel,
  cellularDetail,
  tumorFocus,
  onLayerSelect,
}: {
  brainOpacity: number
  tumorOpacity: number
  showLabels: boolean
  showVasculature: boolean
  showCellular: boolean
  showDoseMap: boolean
  showOrgansAtRisk: boolean
  activeView: string
  zoomLevel: number
  tumorLayers: TumorLayer[]
  cellularData: CellularData[]
  doseDistribution: DoseDistribution[]
  animationSpeed: number
  isAnimating: boolean
  contrastLevel: number
  cellularDetail: number
  tumorFocus: boolean
  onLayerSelect: (layer: TumorLayer | null) => void
}) {
  const brainRef = useRef<THREE.Group>(null)
  const [time, setTime] = useState(0)

  useFrame((state, delta) => {
    if (isAnimating) {
      setTime(time + delta * animationSpeed)
    }
    if (brainRef.current) {
      // Subtle breathing animation
      const breathe = 1 + Math.sin(time * 2) * 0.003
      brainRef.current.scale.setScalar(breathe)
    }
  })

  return (
    <group ref={brainRef}>
      {/* Main Brain Structure - Ultra High Fidelity */}
      <group>
        {/* Outer Cortex - Translucent Blue with Enhanced Detail */}
        <mesh position={[0, 0, 0]} receiveShadow castShadow>
          <sphereGeometry args={[1.8, 512, 512]} />
          <meshPhysicalMaterial
            color={new THREE.Color(0.2, 0.5, 1.0).multiplyScalar(contrastLevel)}
            transparent
            opacity={brainOpacity}
            roughness={0.15}
            metalness={0.02}
            clearcoat={0.9}
            clearcoatRoughness={0.05}
            transmission={0.4}
            thickness={1.2}
            ior={1.4}
            emissive={new THREE.Color(0.05, 0.2, 0.4)}
            emissiveIntensity={0.15}
            side={THREE.DoubleSide}
            envMapIntensity={1.5}
          />
        </mesh>

        {/* Inner Brain Matter - Multiple Layers */}
        <mesh position={[0, 0, 0]} scale={[0.94, 0.94, 0.94]}>
          <sphereGeometry args={[1.8, 256, 256]} />
          <meshPhysicalMaterial
            color={new THREE.Color(0.6, 0.4, 0.8).multiplyScalar(contrastLevel)}
            transparent
            opacity={brainOpacity * 0.3}
            roughness={0.3}
            metalness={0.01}
            transmission={0.7}
            thickness={0.8}
            ior={1.35}
          />
        </mesh>

        {/* White Matter */}
        <mesh position={[0, 0, 0]} scale={[0.88, 0.88, 0.88]}>
          <sphereGeometry args={[1.8, 128, 128]} />
          <meshPhysicalMaterial
            color={new THREE.Color(0.9, 0.8, 0.9).multiplyScalar(contrastLevel)}
            transparent
            opacity={brainOpacity * 0.2}
            roughness={0.4}
            transmission={0.8}
            thickness={0.6}
          />
        </mesh>

        {/* Brain Surface Texture - Enhanced Detail */}
        {Array.from({ length: 80 }).map((_, i) => {
          const phi = Math.acos(-1 + (2 * i) / 80)
          const theta = Math.sqrt(80 * Math.PI) * phi
          return (
            <mesh
              key={i}
              position={[
                1.78 * Math.cos(theta) * Math.sin(phi),
                1.78 * Math.cos(phi),
                1.78 * Math.sin(theta) * Math.sin(phi),
              ]}
            >
              <sphereGeometry args={[0.015, 12, 12]} />
              <meshStandardMaterial
                color={new THREE.Color(0.3, 0.6, 1.0).multiplyScalar(contrastLevel)}
                transparent
                opacity={brainOpacity * 0.7}
                emissive={new THREE.Color(0.1, 0.2, 0.4)}
                emissiveIntensity={0.1}
              />
            </mesh>
          )
        })}

        {/* Layered Tumor Structure - Medical Grade */}
        <group>
          {tumorLayers.map((layer, index) => (
            <group key={layer.id}>
              {/* Main Tumor Layer */}
              <mesh
                position={[0.4, 0.6, 0.2]}
                scale={[layer.depth, layer.depth, layer.depth]}
                onClick={() => onLayerSelect(layer)}
                onPointerOver={(e) => {
                  e.stopPropagation()
                  document.body.style.cursor = "pointer"
                }}
                onPointerOut={() => {
                  document.body.style.cursor = "default"
                }}
              >
                <sphereGeometry args={[0.28, 64, 64]} />
                <meshPhysicalMaterial
                  color={
                    layer.cellType === "glioblastoma"
                      ? new THREE.Color(1.0, 0.1, 0.2).multiplyScalar(contrastLevel)
                      : layer.cellType === "necrotic"
                        ? new THREE.Color(0.6, 0.1, 0.4).multiplyScalar(contrastLevel)
                        : new THREE.Color(1.0, 0.8, 0.2).multiplyScalar(contrastLevel)
                  }
                  transparent
                  opacity={tumorOpacity * (1 - index * 0.15)}
                  emissive={
                    layer.cellType === "glioblastoma"
                      ? new THREE.Color(1.0, 0.2, 0.3)
                      : layer.cellType === "necrotic"
                        ? new THREE.Color(0.4, 0.0, 0.2)
                        : new THREE.Color(0.8, 0.6, 0.1)
                  }
                  emissiveIntensity={0.4 + layer.activity * 0.4}
                  roughness={0.1}
                  metalness={0.05}
                  clearcoat={0.8}
                  clearcoatRoughness={0.2}
                />
              </mesh>

              {/* Layer Activity Visualization */}
              {isAnimating && (
                <mesh position={[0.4, 0.6, 0.2]} scale={[layer.depth * 1.1, layer.depth * 1.1, layer.depth * 1.1]}>
                  <sphereGeometry args={[0.28, 32, 32]} />
                  <meshBasicMaterial
                    color={
                      layer.cellType === "glioblastoma"
                        ? new THREE.Color(1.0, 0.3, 0.4)
                        : layer.cellType === "necrotic"
                          ? new THREE.Color(0.6, 0.2, 0.4)
                          : new THREE.Color(1.0, 0.8, 0.3)
                    }
                    transparent
                    opacity={0.1 + Math.sin(time * 3 + index) * 0.05}
                    side={THREE.BackSide}
                  />
                </mesh>
              )}

              {showLabels && index === 0 && (
                <Html position={[0.7, 0.9, 0.2]} center>
                  <div className="bg-red-500/95 text-white text-xs px-3 py-2 rounded-lg border border-red-400 shadow-xl backdrop-blur-sm">
                    <div className="font-bold">Glioblastoma Multiforme</div>
                    <div className="text-red-200 text-xs">Grade IV • 15.7 cm³</div>
                    <div className="text-red-200 text-xs">Activity: {Math.round(layer.activity * 100)}%</div>
                  </div>
                </Html>
              )}
            </group>
          ))}

          {/* Enhanced Tumor Glow Effect */}
          <mesh position={[0.4, 0.6, 0.2]}>
            <sphereGeometry args={[0.6, 32, 32]} />
            <meshBasicMaterial
              color={new THREE.Color(1.0, 0.2, 0.3).multiplyScalar(contrastLevel)}
              transparent
              opacity={0.08 + Math.sin(time * 2) * 0.02}
              side={THREE.BackSide}
            />
          </mesh>
        </group>

        {/* Cellular Level Visualization */}
        {showCellular && activeView === "cellular" && zoomLevel > 2 && (
          <group>
            {cellularData
              .filter((_, i) => i < cellularDetail * cellularData.length)
              .map((cell, index) => (
                <CellVisualization
                  key={index}
                  cell={cell}
                  time={time}
                  animationSpeed={animationSpeed}
                  isAnimating={isAnimating}
                />
              ))}
          </group>
        )}

        {/* Enhanced Vascular System */}
        {showVasculature && (
          <group>
            {Array.from({ length: 30 }).map((_, i) => (
              <VascularNetwork key={i} index={i} time={time} contrastLevel={contrastLevel} />
            ))}
          </group>
        )}

        {/* Dose Distribution Visualization */}
        {showDoseMap && activeView === "treatment" && (
          <group>
            {doseDistribution.map((dose, index) => (
              <group key={index}>
                <mesh position={dose.position as [number, number, number]}>
                  <sphereGeometry args={[0.08, 24, 24]} />
                  <meshBasicMaterial
                    color={new THREE.Color().setHSL((120 - (dose.dose / 60) * 120) / 360, 0.8, 0.6)}
                    transparent
                    opacity={0.9}
                  />
                </mesh>

                {/* Enhanced Isodose Curves */}
                <mesh position={dose.position as [number, number, number]}>
                  <sphereGeometry args={[(dose.dose / 60) * 0.8, 32, 32]} />
                  <meshBasicMaterial
                    color={new THREE.Color().setHSL((120 - (dose.dose / 60) * 120) / 360, 0.6, 0.5)}
                    transparent
                    opacity={0.15}
                    wireframe
                  />
                </mesh>

                {/* Biological Effect Visualization */}
                <mesh position={dose.position as [number, number, number]}>
                  <sphereGeometry args={[dose.biologicalEffect * 0.3, 16, 16]} />
                  <meshBasicMaterial color={new THREE.Color(0.8, 0.2, 1.0)} transparent opacity={0.3} />
                </mesh>
              </group>
            ))}
          </group>
        )}

        {/* Anatomical Structures */}
        <AnatomicalStructures
          brainOpacity={brainOpacity}
          contrastLevel={contrastLevel}
          showOrgansAtRisk={showOrgansAtRisk}
          activeView={activeView}
        />
      </group>
    </group>
  )
}

function CellVisualization({
  cell,
  time,
  animationSpeed,
  isAnimating,
}: {
  cell: CellularData
  time: number
  animationSpeed: number
  isAnimating: boolean
}) {
  const cellRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (cellRef.current && isAnimating) {
      const pulse = cell.division ? 1 + Math.sin(time * 4) * 0.3 : 1 + Math.sin(time * 2) * 0.1
      cellRef.current.scale.setScalar(pulse)

      if (cell.division) {
        cellRef.current.rotation.x = time * animationSpeed
        cellRef.current.rotation.y = time * animationSpeed * 0.7
      }
    }
  })

  const getCellColor = () => {
    switch (cell.type) {
      case "tumor":
        return new THREE.Color(1.0, 0.2, 0.2)
      case "healthy":
        return new THREE.Color(0.2, 1.0, 0.2)
      case "damaged":
        return new THREE.Color(1.0, 0.8, 0.2)
      case "dead":
        return new THREE.Color(0.4, 0.4, 0.4)
      default:
        return new THREE.Color(0.5, 0.5, 0.5)
    }
  }

  return (
    <mesh ref={cellRef} position={[0.4 + cell.position[0], 0.6 + cell.position[1], 0.2 + cell.position[2]]}>
      <sphereGeometry args={[cell.size, 8, 8]} />
      <meshPhysicalMaterial
        color={getCellColor()}
        transparent
        opacity={0.8}
        emissive={getCellColor()}
        emissiveIntensity={cell.activity * 0.5}
        roughness={0.3}
      />
    </mesh>
  )
}

function VascularNetwork({
  index,
  time,
  contrastLevel,
}: {
  index: number
  time: number
  contrastLevel: number
}) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (ref.current) {
      const pulse = 1 + Math.sin(time * 6 + index * 0.3) * 0.15
      ref.current.scale.setScalar(pulse)
    }
  })

  const angle = (index / 30) * Math.PI * 2
  const radius = 1.1 + Math.sin(index * 0.3) * 0.4
  const height = Math.sin(index * 0.7) * 0.8

  return (
    <mesh
      ref={ref}
      position={[Math.cos(angle) * radius, height, Math.sin(angle) * radius]}
      rotation={[Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]}
    >
      <cylinderGeometry args={[0.006, 0.012, 0.4, 8]} />
      <meshStandardMaterial
        color={new THREE.Color(1.0, 0.1, 0.1).multiplyScalar(contrastLevel)}
        emissive={new THREE.Color(0.8, 0.0, 0.0)}
        emissiveIntensity={0.6}
        transparent
        opacity={0.9}
      />
    </mesh>
  )
}

function AnatomicalStructures({
  brainOpacity,
  contrastLevel,
  showOrgansAtRisk,
  activeView,
}: {
  brainOpacity: number
  contrastLevel: number
  showOrgansAtRisk: boolean
  activeView: string
}) {
  return (
    <group>
      {/* Cerebellum - Enhanced Detail */}
      <mesh position={[0, -1.3, -0.9]} scale={[0.7, 0.5, 0.7]}>
        <sphereGeometry args={[0.8, 128, 128]} />
        <meshPhysicalMaterial
          color={new THREE.Color(0.4, 0.6, 1.0).multiplyScalar(contrastLevel)}
          transparent
          opacity={brainOpacity}
          roughness={0.25}
          metalness={0.08}
          clearcoat={0.6}
          transmission={0.2}
        />
      </mesh>

      {/* Brain Stem - Critical Structure */}
      <mesh position={[0, -1.6, 0]} scale={[0.25, 0.8, 0.25]}>
        <cylinderGeometry args={[0.3, 0.4, 1.4, 64]} />
        <meshPhysicalMaterial
          color={new THREE.Color(0.5, 0.7, 1.0).multiplyScalar(contrastLevel)}
          transparent
          opacity={brainOpacity}
          roughness={0.2}
          emissive={showOrgansAtRisk ? new THREE.Color(1.0, 0.5, 0.0) : new THREE.Color(0, 0, 0)}
          emissiveIntensity={showOrgansAtRisk ? 0.3 : 0}
        />
      </mesh>

      {/* Ventricles - Fluid Filled */}
      <group>
        <mesh position={[0.2, 0.3, 0]} scale={[0.15, 0.4, 0.1]}>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshPhysicalMaterial
            color={new THREE.Color(0.0, 0.9, 1.0).multiplyScalar(contrastLevel)}
            transparent
            opacity={0.7}
            transmission={0.95}
            thickness={0.1}
            ior={1.33}
            roughness={0.0}
          />
        </mesh>
        <mesh position={[-0.2, 0.3, 0]} scale={[0.15, 0.4, 0.1]}>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshPhysicalMaterial
            color={new THREE.Color(0.0, 0.9, 1.0).multiplyScalar(contrastLevel)}
            transparent
            opacity={0.7}
            transmission={0.95}
            thickness={0.1}
            ior={1.33}
            roughness={0.0}
          />
        </mesh>
      </group>

      {/* Corpus Callosum */}
      <mesh position={[0, 0.2, 0]} scale={[0.8, 0.05, 0.3]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial
          color={new THREE.Color(0.9, 0.9, 0.9).multiplyScalar(contrastLevel)}
          transparent
          opacity={brainOpacity * 0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Organs at Risk Highlighting */}
      {showOrgansAtRisk && activeView === "treatment" && (
        <group>
          {/* Optic Chiasm */}
          <mesh position={[0, -0.5, 0.8]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial color="#ff9500" transparent opacity={0.8} />
          </mesh>

          {/* Pituitary Gland */}
          <mesh position={[0, -0.8, 0.3]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#ff6500" transparent opacity={0.8} />
          </mesh>

          {/* Hippocampus */}
          <mesh position={[0.6, -0.2, -0.3]} scale={[0.3, 0.1, 0.2]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial color="#ff7500" transparent opacity={0.6} />
          </mesh>
          <mesh position={[-0.6, -0.2, -0.3]} scale={[0.3, 0.1, 0.2]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial color="#ff7500" transparent opacity={0.6} />
          </mesh>
        </group>
      )}
    </group>
  )
}
