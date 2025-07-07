"use client"

import React from "react"

import { useRef, useState, useEffect, Suspense, useCallback } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Environment, Html } from "@react-three/drei"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Eye,
  EyeOff,
  Brain,
  Skull,
  Activity,
  Layers,
  RotateCcw,
  ZoomIn,
  Target,
  AlertTriangle,
  Database,
  LineChartIcon as ChartLine,
  Crosshair,
  Info,
  Play,
  Pause,
} from "lucide-react"
import * as THREE from "three"

interface LayerState {
  visible: boolean
  opacity: number
}

interface RegionData {
  name: string
  function: string
  status: string
  statusType: "healthy" | "warning" | "abnormal"
  coordinates?: THREE.Vector3
}

interface TumorData {
  location: string
  size: string
  volume: string
  type: string
  status: string
  pressure: string
}

export function CompleteSkullBrain3D() {
  const [layerStates, setLayerStates] = useState<Record<string, LayerState>>({
    skull: { visible: true, opacity: 0.3 },
    brain: { visible: true, opacity: 0.85 },
    meninges: { visible: false, opacity: 0.2 },
    ventricles: { visible: true, opacity: 0.6 },
    tumor: { visible: true, opacity: 0.9 },
    whiteMatter: { visible: true, opacity: 0.7 },
  })

  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null)
  const [viewMode, setViewMode] = useState("anatomical")
  const [crossSection, setCrossSection] = useState({ x: 0, y: 0, z: 0 })
  const [cameraStats, setCameraStats] = useState({
    zoom: 1.0,
    rotationX: 0,
    rotationY: 0,
    distance: 100,
  })
  const [isAnimating, setIsAnimating] = useState(true)
  const [tumorData, setTumorData] = useState<TumorData>({
    location: "Right Frontal Lobe",
    size: "2.3 × 1.8 × 1.5 cm",
    volume: "6.21 cm³",
    type: "Glioblastoma (Grade IV)",
    status: "Malignant",
    pressure: "High",
  })

  const controlsRef = useRef<any>(null)

  const toggleLayer = useCallback((layerName: string) => {
    setLayerStates((prev) => ({
      ...prev,
      [layerName]: {
        ...prev[layerName],
        visible: !prev[layerName].visible,
      },
    }))
  }, [])

  const setLayerOpacity = useCallback((layerName: string, opacity: number) => {
    setLayerStates((prev) => ({
      ...prev,
      [layerName]: {
        ...prev[layerName],
        opacity: opacity / 100,
      },
    }))
  }, [])

  const setPresetView = useCallback((preset: string) => {
    const presets = {
      anatomical: { skull: true, brain: true, meninges: false, ventricles: true, tumor: false },
      pathological: { skull: false, brain: true, meninges: false, ventricles: true, tumor: true },
      surgical: { skull: true, brain: true, meninges: true, ventricles: true, tumor: true },
      xray: { skull: true, brain: false, meninges: false, ventricles: false, tumor: true },
    }

    const settings = presets[preset as keyof typeof presets]
    if (settings) {
      setLayerStates((prev) => {
        const newStates = { ...prev }
        Object.entries(settings).forEach(([layer, visible]) => {
          if (newStates[layer]) {
            newStates[layer].visible = visible
          }
        })
        return newStates
      })
      setViewMode(preset)
    }
  }, [])

  const focusOnRegion = useCallback((regionName: string) => {
    const positions = {
      frontal: new THREE.Vector3(0, 20, 80),
      parietal: new THREE.Vector3(0, 40, 80),
      temporal: new THREE.Vector3(60, 0, 60),
      occipital: new THREE.Vector3(0, 10, -80),
      cerebellum: new THREE.Vector3(0, -40, -60),
      brainstem: new THREE.Vector3(0, -50, 40),
      tumor: new THREE.Vector3(40, 30, 70),
    }

    // This would be handled by the camera animation in the 3D scene
    console.log(`Focusing on ${regionName}`)
  }, [])

  const resetView = useCallback(() => {
    setCrossSection({ x: 0, y: 0, z: 0 })
    setPresetView("anatomical")
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
  }, [setPresetView])

  // Simulate real-time tumor data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const sizes = ["2.3 × 1.8 × 1.5 cm", "2.4 × 1.9 × 1.6 cm", "2.2 × 1.7 × 1.4 cm"]
      const volumes = ["6.21 cm³", "6.84 cm³", "5.95 cm³"]
      const pressures = ["High", "Very High", "Moderate"]

      const randomIndex = Math.floor(Math.random() * 3)
      setTumorData((prev) => ({
        ...prev,
        size: sizes[randomIndex],
        volume: volumes[randomIndex],
        pressure: pressures[randomIndex],
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-xl overflow-hidden">
      {/* Left Control Panel */}
      <div className="absolute top-4 left-4 w-80 max-h-[calc(100vh-2rem)] overflow-y-auto bg-black/90 backdrop-blur-xl rounded-xl p-4 border border-cyan-500/40 z-20">
        <div className="flex items-center justify-center mb-6">
          <Brain className="h-6 w-6 mr-2 text-cyan-400" />
          <h2 className="text-xl font-bold text-cyan-400">Brain Controls</h2>
        </div>

        <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
          <TabsList className="grid grid-cols-2 bg-slate-800/50 mb-4">
            <TabsTrigger value="layers" className="text-white data-[state=active]:bg-cyan-500/20">
              <Layers className="h-4 w-4 mr-2" />
              Layers
            </TabsTrigger>
            <TabsTrigger value="presets" className="text-white data-[state=active]:bg-blue-500/20">
              <Target className="h-4 w-4 mr-2" />
              Presets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="layers" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-cyan-300">Anatomical Layers</h3>
              {Object.entries(layerStates).map(([layerName, state]) => (
                <div key={layerName} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant={state.visible ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleLayer(layerName)}
                      className={`w-10 h-10 p-0 ${
                        state.visible
                          ? "bg-cyan-500/20 border-cyan-500/30 text-cyan-300"
                          : "bg-slate-700/50 border-slate-600/30 text-gray-400"
                      }`}
                    >
                      {state.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <span className="text-sm text-white capitalize">{layerName}</span>
                  </div>
                  <div className="w-20">
                    <Slider
                      value={[state.opacity * 100]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(value) => setLayerOpacity(layerName, value[0])}
                      className="w-full"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Cross-Section Controls */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-cyan-300">Cross-Section</h3>
              <div className="space-y-3">
                {["x", "y", "z"].map((axis) => (
                  <div key={axis} className="space-y-2">
                    <label className="text-sm text-gray-300">
                      {axis.toUpperCase()}-Axis: {crossSection[axis as keyof typeof crossSection]}
                    </label>
                    <Slider
                      value={[crossSection[axis as keyof typeof crossSection]]}
                      min={-50}
                      max={50}
                      step={1}
                      onValueChange={(value) => setCrossSection((prev) => ({ ...prev, [axis]: value[0] }))}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="presets" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={viewMode === "anatomical" ? "default" : "outline"}
                onClick={() => setPresetView("anatomical")}
                className="bg-blue-500/20 border-blue-500/30 text-blue-300 hover:bg-blue-500/30"
              >
                <Activity className="h-4 w-4 mr-2" />
                Anatomical
              </Button>
              <Button
                variant={viewMode === "pathological" ? "default" : "outline"}
                onClick={() => setPresetView("pathological")}
                className="bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Pathological
              </Button>
              <Button
                variant={viewMode === "surgical" ? "default" : "outline"}
                onClick={() => setPresetView("surgical")}
                className="bg-green-500/20 border-green-500/30 text-green-300 hover:bg-green-500/30"
              >
                <Target className="h-4 w-4 mr-2" />
                Surgical
              </Button>
              <Button
                variant={viewMode === "xray" ? "default" : "outline"}
                onClick={() => setPresetView("xray")}
                className="bg-purple-500/20 border-purple-500/30 text-purple-300 hover:bg-purple-500/30"
              >
                <Skull className="h-4 w-4 mr-2" />
                X-Ray
              </Button>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-cyan-300">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="outline"
                  onClick={resetView}
                  className="bg-orange-500/20 border-orange-500/30 text-orange-300 hover:bg-orange-500/30"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset View
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAnimating(!isAnimating)}
                  className="bg-pink-500/20 border-pink-500/30 text-pink-300 hover:bg-pink-500/30"
                >
                  {isAnimating ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isAnimating ? "Pause" : "Play"} Animation
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Information Panel */}
      <div className="absolute top-4 right-4 w-80 max-h-[calc(100vh-2rem)] overflow-y-auto bg-black/90 backdrop-blur-xl rounded-xl p-4 border border-cyan-500/40 z-20">
        <div className="flex items-center justify-center mb-6">
          <Info className="h-6 w-6 mr-2 text-cyan-400" />
          <h2 className="text-xl font-bold text-cyan-400">Medical Analysis</h2>
        </div>

        {/* Tumor Alert */}
        <Card className="mb-4 bg-red-500/10 border-red-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-red-400 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Tumor Detected
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-gray-400">Location:</span>
                <div className="text-white font-medium">{tumorData.location}</div>
              </div>
              <div>
                <span className="text-gray-400">Size:</span>
                <div className="text-white font-medium">{tumorData.size}</div>
              </div>
              <div>
                <span className="text-gray-400">Volume:</span>
                <div className="text-white font-medium">{tumorData.volume}</div>
              </div>
              <div>
                <span className="text-gray-400">Type:</span>
                <div className="text-white font-medium">{tumorData.type}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-300 font-medium">{tumorData.status}</span>
            </div>
          </CardContent>
        </Card>

        {/* Selected Region Info */}
        {selectedRegion && (
          <Card className="mb-4 bg-cyan-500/10 border-cyan-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-cyan-400 flex items-center">
                <Crosshair className="h-5 w-5 mr-2" />
                Selected Region
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="text-gray-400">Region:</span>
                <div className="text-white font-medium">{selectedRegion.name}</div>
              </div>
              <div>
                <span className="text-gray-400">Function:</span>
                <div className="text-white">{selectedRegion.function}</div>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    selectedRegion.statusType === "healthy"
                      ? "bg-green-500"
                      : selectedRegion.statusType === "warning"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                ></div>
                <span className="text-white">{selectedRegion.status}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Brain Metrics */}
        <Card className="mb-4 bg-blue-500/10 border-blue-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-400 flex items-center">
              <ChartLine className="h-5 w-5 mr-2" />
              Brain Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Brain Volume", value: "1,350 cm³", progress: 92 },
              { label: "Gray Matter", value: "640 cm³", progress: 85 },
              { label: "White Matter", value: "710 cm³", progress: 88 },
              { label: "CSF Volume", value: "150 ml", progress: 75 },
            ].map((metric, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">{metric.label}</span>
                  <span className="text-white">{metric.value}</span>
                </div>
                <Progress value={metric.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Anatomical Database */}
        <Card className="bg-purple-500/10 border-purple-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-purple-400 flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Anatomical Reference
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { name: "Frontal Lobe", key: "frontal" },
              { name: "Parietal Lobe", key: "parietal" },
              { name: "Temporal Lobe", key: "temporal" },
              { name: "Occipital Lobe", key: "occipital" },
              { name: "Cerebellum", key: "cerebellum" },
              { name: "Brainstem", key: "brainstem" },
              { name: "Tumor", key: "tumor" },
            ].map((region) => (
              <button
                key={region.key}
                onClick={() => focusOnRegion(region.key)}
                className="w-full text-left p-2 rounded-lg hover:bg-white/10 transition-colors text-sm text-gray-300 hover:text-white flex items-center"
              >
                <Brain className="h-4 w-4 mr-2" />
                {region.name}
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Status Panel */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-xl rounded-xl p-4 border border-cyan-500/40 z-20">
        <div className="grid grid-cols-6 gap-6">
          {[
            { label: "Zoom Level", value: `${cameraStats.zoom.toFixed(1)}x`, icon: ZoomIn, color: "cyan" },
            { label: "Rotation X", value: `${cameraStats.rotationX}°`, icon: RotateCcw, color: "green" },
            { label: "Rotation Y", value: `${cameraStats.rotationY}°`, icon: RotateCcw, color: "green" },
            {
              label: "Active Layers",
              value: Object.values(layerStates)
                .filter((s) => s.visible)
                .length.toString(),
              icon: Layers,
              color: "yellow",
            },
            { label: "Tumor Pressure", value: tumorData.pressure, icon: AlertTriangle, color: "red" },
            { label: "Analysis Mode", value: "Real-time", icon: Activity, color: "purple" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</div>
              <div className="text-xs text-gray-300 flex items-center justify-center">
                <stat.icon className="h-3 w-3 mr-1" />
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="w-full h-full">
        <Canvas
          camera={{ position: [0, 0, 100], fov: 75 }}
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
            <Environment preset="studio" />
            <AdvancedLighting />
            <SkullBrainModel
              layerStates={layerStates}
              isAnimating={isAnimating}
              onRegionSelect={setSelectedRegion}
              onCameraUpdate={setCameraStats}
              controlsRef={controlsRef}
            />
            <OrbitControls
              ref={controlsRef}
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              autoRotate={false}
              minDistance={50}
              maxDistance={200}
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

function AdvancedLighting() {
  return (
    <>
      <ambientLight intensity={0.4} color="#404040" />
      <directionalLight
        position={[50, 50, 50]}
        intensity={0.8}
        color="#00d4ff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={200}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <directionalLight position={[-50, -50, 50]} intensity={0.3} color="#ff6b6b" />
      <directionalLight position={[0, 50, -50]} intensity={0.3} color="#4ecdc4" />
      <pointLight position={[0, 30, 30]} intensity={0.5} color="#00ffff" distance={100} />
    </>
  )
}

function SkullBrainModel({
  layerStates,
  isAnimating,
  onRegionSelect,
  onCameraUpdate,
  controlsRef,
}: {
  layerStates: Record<string, LayerState>
  isAnimating: boolean
  onRegionSelect: (region: RegionData) => void
  onCameraUpdate: (stats: any) => void
  controlsRef: any
}) {
  const groupRef = useRef<THREE.Group>(null)
  const tumorRef = useRef<THREE.Mesh>(null)
  const { camera } = useThree()

  useFrame((state, delta) => {
    if (isAnimating && tumorRef.current) {
      tumorRef.current.rotation.y += delta * 0.5
      const time = state.clock.getElapsedTime()
      const pulseFactor = Math.sin(time * 3) * 0.1 + 1
      tumorRef.current.scale.setScalar(pulseFactor)
    }

    // Update camera stats
    if (controlsRef.current) {
      const distance = camera.position.distanceTo(controlsRef.current.target)
      const zoom = 200 / distance
      const rotationX = Math.round((controlsRef.current.getAzimuthalAngle() * 180) / Math.PI)
      const rotationY = Math.round((controlsRef.current.getPolarAngle() * 180) / Math.PI)

      onCameraUpdate({
        zoom,
        rotationX,
        rotationY,
        distance,
      })
    }
  })

  const handleClick = useCallback(
    (event: any, regionName: string) => {
      event.stopPropagation()
      const regionData = getRegionData(regionName)
      onRegionSelect(regionData)
    },
    [onRegionSelect],
  )

  return (
    <group ref={groupRef}>
      {/* Skull */}
      {layerStates.skull?.visible && (
        <SkullGeometry opacity={layerStates.skull.opacity} onClick={(e) => handleClick(e, "skull")} />
      )}

      {/* Brain */}
      {layerStates.brain?.visible && (
        <BrainGeometry opacity={layerStates.brain.opacity} onClick={(e) => handleClick(e, "brain")} />
      )}

      {/* White Matter */}
      {layerStates.whiteMatter?.visible && (
        <WhiteMatterGeometry opacity={layerStates.whiteMatter.opacity} onClick={(e) => handleClick(e, "whiteMatter")} />
      )}

      {/* Meninges */}
      {layerStates.meninges?.visible && (
        <MeningesGeometry opacity={layerStates.meninges.opacity} onClick={(e) => handleClick(e, "meninges")} />
      )}

      {/* Ventricles */}
      {layerStates.ventricles?.visible && (
        <VentriclesGeometry opacity={layerStates.ventricles.opacity} onClick={(e) => handleClick(e, "ventricles")} />
      )}

      {/* Tumor */}
      {layerStates.tumor?.visible && (
        <TumorGeometry ref={tumorRef} opacity={layerStates.tumor.opacity} onClick={(e) => handleClick(e, "tumor")} />
      )}
    </group>
  )
}

function SkullGeometry({ opacity, onClick }: { opacity: number; onClick: (e: any) => void }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useEffect(() => {
    if (meshRef.current) {
      const geometry = meshRef.current.geometry as THREE.SphereGeometry
      const positions = geometry.attributes.position.array as Float32Array

      // Modify skull shape
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i]
        const y = positions[i + 1]
        const z = positions[i + 2]

        // Flatten bottom for skull base
        if (y < -20) {
          positions[i + 1] = -20 + (y + 20) * 0.3
        }

        // Create eye socket indentations
        if (z > 20 && Math.abs(x) > 10 && Math.abs(x) < 25 && y > -5 && y < 15) {
          positions[i + 2] = z - 8
        }

        // Create temporal indentations
        if (Math.abs(x) > 25 && y > -10 && y < 20 && z > -10 && z < 30) {
          const factor = 1 - (Math.abs(x) - 25) / 15
          positions[i] = x * (0.8 + factor * 0.2)
        }
      }

      geometry.attributes.position.needsUpdate = true
      geometry.computeVertexNormals()
    }
  }, [])

  return (
    <mesh ref={meshRef} onClick={onClick} receiveShadow castShadow>
      <sphereGeometry args={[45, 64, 64]} />
      <meshPhongMaterial color="#f5f5dc" transparent opacity={opacity} side={THREE.DoubleSide} shininess={30} />
    </mesh>
  )
}

function BrainGeometry({ opacity, onClick }: { opacity: number; onClick: (e: any) => void }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useEffect(() => {
    if (meshRef.current) {
      const geometry = meshRef.current.geometry as THREE.SphereGeometry
      const positions = geometry.attributes.position.array as Float32Array

      // Modify brain shape
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i]
        const y = positions[i + 1]
        const z = positions[i + 2]

        // Flatten bottom and create brain stem
        if (y < -25) {
          positions[i + 1] = -25
          positions[i] *= 0.7
          positions[i + 2] *= 0.7
        }

        // Create longitudinal fissure
        if (Math.abs(x) < 2 && z > -20) {
          positions[i + 2] = z - 3
        }

        // Add brain surface irregularities
        const noise = (Math.sin(x * 0.3) + Math.cos(y * 0.4) + Math.sin(z * 0.2)) * 1.5
        positions[i] += noise * 0.5
        positions[i + 1] += noise * 0.3
        positions[i + 2] += noise * 0.4
      }

      geometry.attributes.position.needsUpdate = true
      geometry.computeVertexNormals()
    }
  }, [])

  return (
    <mesh ref={meshRef} onClick={onClick} receiveShadow castShadow>
      <sphereGeometry args={[38, 64, 64]} />
      <meshPhongMaterial color="#8a8a8a" transparent opacity={opacity} shininess={20} />
    </mesh>
  )
}

function WhiteMatterGeometry({ opacity, onClick }: { opacity: number; onClick: (e: any) => void }) {
  return (
    <mesh onClick={onClick} receiveShadow castShadow>
      <sphereGeometry args={[32, 32, 32]} />
      <meshPhongMaterial color="#e0e0e0" transparent opacity={opacity} shininess={30} />
    </mesh>
  )
}

function MeningesGeometry({ opacity, onClick }: { opacity: number; onClick: (e: any) => void }) {
  return (
    <mesh onClick={onClick} receiveShadow castShadow>
      <sphereGeometry args={[42, 32, 32]} />
      <meshPhongMaterial color="#404040" transparent opacity={opacity} side={THREE.DoubleSide} />
    </mesh>
  )
}

function VentriclesGeometry({ opacity, onClick }: { opacity: number; onClick: (e: any) => void }) {
  return (
    <group onClick={onClick}>
      {/* Left lateral ventricle */}
      <mesh position={[-15, 5, 0]} receiveShadow castShadow>
        <sphereGeometry args={[8, 16, 16]} />
        <meshPhongMaterial color="#00aaff" transparent opacity={opacity} emissive="#002244" />
      </mesh>

      {/* Right lateral ventricle */}
      <mesh position={[15, 5, 0]} receiveShadow castShadow>
        <sphereGeometry args={[8, 16, 16]} />
        <meshPhongMaterial color="#00aaff" transparent opacity={opacity} emissive="#002244" />
      </mesh>

      {/* Third ventricle */}
      <mesh position={[0, -5, 0]} receiveShadow castShadow>
        <sphereGeometry args={[3, 12, 12]} />
        <meshPhongMaterial color="#00aaff" transparent opacity={opacity} emissive="#002244" />
      </mesh>

      {/* Fourth ventricle */}
      <mesh position={[0, -15, -10]} receiveShadow castShadow>
        <sphereGeometry args={[3, 12, 12]} />
        <meshPhongMaterial color="#00aaff" transparent opacity={opacity} emissive="#002244" />
      </mesh>
    </group>
  )
}

const TumorGeometry = React.forwardRef<THREE.Mesh, { opacity: number; onClick: (e: any) => void }>(
  ({ opacity, onClick }, ref) => {
    const glowRef = useRef<THREE.Mesh>(null)

    useFrame((state) => {
      if (glowRef.current) {
        const time = state.clock.getElapsedTime()
        glowRef.current.material.opacity = 0.2 + Math.sin(time * 2) * 0.1
      }
    })

    return (
      <group>
        {/* Main tumor */}
        <mesh ref={ref} position={[18, 10, 5]} onClick={onClick} receiveShadow castShadow>
          <sphereGeometry args={[6, 16, 16]} />
          <meshPhongMaterial color="#ff0040" transparent opacity={opacity} emissive="#440010" shininess={60} />
        </mesh>

        {/* Tumor glow */}
        <mesh ref={glowRef} position={[18, 10, 5]}>
          <sphereGeometry args={[8, 16, 16]} />
          <meshBasicMaterial color="#ff0040" transparent opacity={0.2} side={THREE.BackSide} />
        </mesh>

        {/* Tumor label */}
        <Html position={[25, 15, 5]} center>
          <div className="bg-red-500/95 text-white text-xs px-3 py-2 rounded-lg border border-red-400 shadow-xl backdrop-blur-sm pointer-events-none">
            <div className="font-bold">Glioblastoma</div>
            <div className="text-red-200 text-xs">Grade IV • 6.21 cm³</div>
          </div>
        </Html>
      </group>
    )
  },
)

TumorGeometry.displayName = "TumorGeometry"

function getRegionData(regionName: string): RegionData {
  const regions: Record<string, RegionData> = {
    skull: {
      name: "Skull (Cranium)",
      function: "Protective casing for the brain, provides structure and protection",
      status: "Normal",
      statusType: "healthy",
    },
    brain: {
      name: "Cerebral Cortex",
      function: "Higher cognitive functions, consciousness, sensory processing",
      status: "Compressed by tumor",
      statusType: "warning",
    },
    tumor: {
      name: "Tumor Mass",
      function: "Abnormal tissue growth - Glioblastoma Grade IV",
      status: "Malignant",
      statusType: "abnormal",
    },
    ventricles: {
      name: "Ventricular System",
      function: "CSF production and circulation",
      status: "Slightly enlarged",
      statusType: "warning",
    },
    whiteMatter: {
      name: "White Matter",
      function: "Neural pathways, connects different brain regions",
      status: "Normal",
      statusType: "healthy",
    },
    meninges: {
      name: "Meninges",
      function: "Protective membranes covering the brain",
      status: "Normal",
      statusType: "healthy",
    },
  }

  return (
    regions[regionName] || {
      name: "Unknown Region",
      function: "No data available",
      status: "Unknown",
      statusType: "warning",
    }
  )
}
