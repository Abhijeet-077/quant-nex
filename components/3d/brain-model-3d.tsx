"use client"

import React, { Suspense, useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Html, PerspectiveCamera } from "@react-three/drei"
import * as THREE from "three"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Brain, Zap, Target, Eye, EyeOff, RotateCcw, X } from "lucide-react"
import { auditLogger } from "@/lib/hipaa-audit-logger"

interface BrainModel3DProps {
  isOpen: boolean
  onClose: () => void
  patientData?: {
    name: string
    id: string
    age: number
    condition: string
  }
}

interface TumorData {
  id: string
  position: [number, number, number]
  size: number
  type: string
  malignancy: number
}

interface RadiationBeam {
  position: [number, number, number]
  intensity: number
  angle: number
}

function DetailedBrainModel({ 
  opacity, 
  showTumors, 
  showRadiation, 
  time 
}: { 
  opacity: number
  showTumors: boolean
  showRadiation: boolean
  time: number
}) {
  const brainRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (brainRef.current) {
      brainRef.current.rotation.y = time * 0.1
    }
  })

  const tumors: TumorData[] = [
    {
      id: "primary",
      position: [0.3, 0.2, 0.1],
      size: 0.15,
      type: "Glioblastoma",
      malignancy: 0.95
    },
    {
      id: "secondary",
      position: [-0.2, -0.1, 0.2],
      size: 0.08,
      type: "Metastatic",
      malignancy: 0.7
    }
  ]

  const radiationBeams: RadiationBeam[] = [
    { position: [0.3, 0.2, 0.1], intensity: 0.9, angle: 0 },
    { position: [0.3, 0.2, 0.1], intensity: 0.7, angle: Math.PI / 3 },
    { position: [0.3, 0.2, 0.1], intensity: 0.8, angle: Math.PI * 2 / 3 },
    { position: [0.3, 0.2, 0.1], intensity: 0.6, angle: Math.PI },
  ]

  return (
    <group ref={brainRef}>
      {/* Main Brain Structure */}
      <mesh>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshPhysicalMaterial
          color="#ff6b9d"
          transparent
          opacity={opacity}
          roughness={0.3}
          metalness={0.1}
          clearcoat={0.5}
          emissive="#ff6b9d"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Brain Hemispheres */}
      <mesh position={[-0.4, 0, 0]} scale={[0.9, 1, 0.8]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshPhysicalMaterial
          color="#e91e63"
          transparent
          opacity={opacity * 0.7}
          roughness={0.4}
          wireframe={opacity < 0.3}
        />
      </mesh>
      <mesh position={[0.4, 0, 0]} scale={[0.9, 1, 0.8]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshPhysicalMaterial
          color="#e91e63"
          transparent
          opacity={opacity * 0.7}
          roughness={0.4}
          wireframe={opacity < 0.3}
        />
      </mesh>

      {/* Cerebellum */}
      <mesh position={[0, -0.8, -0.6]} scale={[0.8, 0.6, 0.8]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshPhysicalMaterial
          color="#c2185b"
          transparent
          opacity={opacity * 0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Brain Stem */}
      <mesh position={[0, -1.2, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 0.8, 16]} />
        <meshPhysicalMaterial
          color="#ad1457"
          transparent
          opacity={opacity * 0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Neural Pathways */}
      {[...Array(12)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(i * Math.PI / 6) * 1.2,
            Math.sin(i * Math.PI / 6) * 0.5,
            Math.sin(i * 0.5) * 0.8
          ]}
          rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
        >
          <cylinderGeometry args={[0.02, 0.02, 1.2, 8]} />
          <meshBasicMaterial
            color="#4fc3f7"
            transparent
            opacity={0.6}
            emissive="#4fc3f7"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}

      {/* Tumors */}
      {showTumors && tumors.map((tumor) => (
        <group key={tumor.id}>
          <mesh position={tumor.position}>
            <sphereGeometry args={[tumor.size, 32, 32]} />
            <meshPhysicalMaterial
              color="#ff1744"
              transparent
              opacity={0.9}
              emissive="#ff1744"
              emissiveIntensity={tumor.malignancy * 0.8}
              roughness={0.2}
            />
          </mesh>
          
          {/* Tumor Glow */}
          <mesh position={tumor.position}>
            <sphereGeometry args={[tumor.size * 1.5, 16, 16]} />
            <meshBasicMaterial
              color="#ff6b6b"
              transparent
              opacity={0.3}
              wireframe
            />
          </mesh>

          {/* Tumor Label */}
          <Html position={[tumor.position[0], tumor.position[1] + tumor.size + 0.2, tumor.position[2]]} center>
            <div className="bg-black/80 text-white text-xs px-2 py-1 rounded border border-red-500/30">
              <div className="text-red-300 font-semibold">{tumor.type}</div>
              <div className="text-gray-300">{(tumor.size * 10).toFixed(1)} cm</div>
              <div className="text-gray-300">{(tumor.malignancy * 100).toFixed(0)}% malignant</div>
            </div>
          </Html>
        </group>
      ))}

      {/* Radiation Beams */}
      {showRadiation && radiationBeams.map((beam, index) => (
        <group key={index}>
          {/* Radiation Beam */}
          <mesh
            position={[
              beam.position[0] + Math.cos(beam.angle) * 2,
              beam.position[1],
              beam.position[2] + Math.sin(beam.angle) * 2
            ]}
            rotation={[0, beam.angle, 0]}
          >
            <cylinderGeometry args={[0.05, 0.05, 4, 8]} />
            <meshBasicMaterial
              color="#ffeb3b"
              transparent
              opacity={beam.intensity * 0.6}
              emissive="#ffeb3b"
              emissiveIntensity={beam.intensity * 0.5}
            />
          </mesh>

          {/* Radiation Focus Point */}
          <mesh position={beam.position}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial
              color="#ffc107"
              transparent
              opacity={0.8}
              emissive="#ffc107"
              emissiveIntensity={beam.intensity}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export function BrainModel3D({ 
  isOpen, 
  onClose, 
  patientData = {
    name: "Priya Sharma",
    id: "PT-2024-0156",
    age: 54,
    condition: "Glioblastoma Stage IV"
  }
}: BrainModel3DProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [brainOpacity, setBrainOpacity] = useState(0.4)
  const [showLabels, setShowLabels] = useState(true)
  const [autoRotate, setAutoRotate] = useState(true)
  const [time, setTime] = useState(0)

  useEffect(() => {
    if (isOpen) {
      auditLogger.log3DModelAccess('detailed_brain_model', patientData.id)
    }
  }, [isOpen, patientData.id])

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => prev + 0.016)
    }, 16)
    return () => clearInterval(interval)
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-6xl h-full max-h-[95vh] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-xl overflow-hidden shadow-2xl border border-purple-500/30 relative flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-500/30 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <Brain className="h-6 w-6 text-pink-400" />
            <h2 className="text-xl font-bold text-white">Brain Analysis - {patientData.name}</h2>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
              Neurological
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-purple-500/30 flex-shrink-0">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-300">Brain Opacity:</label>
              <Slider
                value={[brainOpacity]}
                min={0.1}
                max={1}
                step={0.1}
                onValueChange={(value) => setBrainOpacity(value[0])}
                className="w-24"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLabels(!showLabels)}
              className="bg-white/10 border-white/20 text-white"
            >
              {showLabels ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              Labels
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRotate(!autoRotate)}
              className="bg-white/10 border-white/20 text-white"
            >
              <RotateCcw className="h-4 w-4" />
              {autoRotate ? "Stop" : "Rotate"}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* 3D Viewer */}
          <div className="flex-1 relative">
            <Canvas camera={{ position: [3, 2, 5], fov: 50 }}>
              <PerspectiveCamera makeDefault position={[3, 2, 5]} fov={50} />
              <ambientLight intensity={0.4} />
              <directionalLight position={[10, 10, 5]} intensity={1.2} />
              <pointLight position={[-10, -10, -5]} intensity={0.6} color="#9C27B0" />
              <Environment preset="studio" />
              
              <Suspense fallback={null}>
                <DetailedBrainModel
                  opacity={brainOpacity}
                  showTumors={activeTab === "tumors" || activeTab === "overview"}
                  showRadiation={activeTab === "radiation" || activeTab === "overview"}
                  time={time}
                />
              </Suspense>
              
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                autoRotate={autoRotate}
                autoRotateSpeed={0.5}
                minDistance={2}
                maxDistance={10}
              />
            </Canvas>
          </div>

          {/* Analysis Panel */}
          <div className="w-80 bg-black/30 border-l border-purple-500/30 flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-3 bg-black/50">
                <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                <TabsTrigger value="tumors" className="text-xs">
                  <Target className="h-4 w-4 mr-1" />
                  Tumors
                </TabsTrigger>
                <TabsTrigger value="radiation" className="text-xs">
                  <Zap className="h-4 w-4 mr-1" />
                  Radiation
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto p-4">
                <TabsContent value="overview" className="space-y-4 mt-0">
                  <h3 className="text-lg font-semibold text-white">Brain Overview</h3>
                  <div className="space-y-3">
                    <div className="bg-black/40 p-3 rounded-lg">
                      <div className="text-white font-medium">Primary Tumor</div>
                      <div className="text-gray-300 text-sm">Glioblastoma - 1.5cm diameter</div>
                      <div className="text-red-300 text-sm">95% malignancy</div>
                    </div>
                    <div className="bg-black/40 p-3 rounded-lg">
                      <div className="text-white font-medium">Treatment Plan</div>
                      <div className="text-gray-300 text-sm">Stereotactic radiosurgery</div>
                      <div className="text-yellow-300 text-sm">4 beam angles, 45 Gy total</div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="tumors" className="space-y-4 mt-0">
                  <h3 className="text-lg font-semibold text-white">Tumor Analysis</h3>
                  <div className="space-y-3">
                    <div className="bg-black/40 p-3 rounded-lg border border-red-500/20">
                      <div className="text-red-300 font-medium">Primary Glioblastoma</div>
                      <div className="text-gray-300 text-sm">Size: 1.5 cm diameter</div>
                      <div className="text-gray-300 text-sm">Location: Right frontal lobe</div>
                      <div className="text-gray-300 text-sm">Malignancy: 95%</div>
                    </div>
                    <div className="bg-black/40 p-3 rounded-lg border border-orange-500/20">
                      <div className="text-orange-300 font-medium">Secondary Metastatic</div>
                      <div className="text-gray-300 text-sm">Size: 0.8 cm diameter</div>
                      <div className="text-gray-300 text-sm">Location: Left parietal lobe</div>
                      <div className="text-gray-300 text-sm">Malignancy: 70%</div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="radiation" className="space-y-4 mt-0">
                  <h3 className="text-lg font-semibold text-white">Radiation Therapy</h3>
                  <div className="space-y-3">
                    <div className="bg-black/40 p-3 rounded-lg border border-yellow-500/20">
                      <div className="text-yellow-300 font-medium">Beam Configuration</div>
                      <div className="text-gray-300 text-sm">4 beam angles</div>
                      <div className="text-gray-300 text-sm">Total dose: 45 Gy</div>
                      <div className="text-gray-300 text-sm">Fractions: 15 sessions</div>
                    </div>
                    <div className="bg-black/40 p-3 rounded-lg">
                      <div className="text-white font-medium">Treatment Progress</div>
                      <div className="text-gray-300 text-sm">Sessions completed: 8/15</div>
                      <div className="text-green-300 text-sm">Response: Good</div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
