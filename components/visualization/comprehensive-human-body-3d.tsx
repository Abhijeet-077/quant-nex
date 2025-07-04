"use client"

import React, { Suspense, useRef, useState, useEffect, useCallback } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Html, PerspectiveCamera } from "@react-three/drei"
import * as THREE from "three"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
  Zap,
  AlertTriangle,
  Target,
  Eye,
  EyeOff,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Activity,
  Brain,
  Heart
} from "lucide-react"
import { auditLogger } from "@/lib/hipaa-audit-logger"
import { useAccessibility, AccessibilityButton, AccessibilityHeading } from "@/components/accessibility/accessibility-provider"

interface ComprehensiveHumanBody3DProps {
  isOpen: boolean
  onClose: () => void
  patientData?: {
    name: string
    id: string
    age: number
    condition: string
  }
}

interface BodyPartData {
  id: string
  name: string
  position: [number, number, number]
  size: [number, number, number]
  color: string
  opacity: number
  isAffected: boolean
  damageLevel: number
  radiationDose?: number
  tumorPresent?: boolean
}

interface TumorData {
  id: string
  position: [number, number, number]
  size: number
  type: string
  stage: string
  growthRate: number
  malignancy: number
}

interface RadiationData {
  position: [number, number, number]
  intensity: number
  dose: number
  targetArea: string
}

export function ComprehensiveHumanBody3D({ 
  isOpen, 
  onClose, 
  patientData = {
    name: "Priya Sharma",
    id: "PT-2024-0156",
    age: 54,
    condition: "Glioblastoma Stage IV"
  }
}: ComprehensiveHumanBody3DProps) {
  const [activeTab, setActiveTab] = useState("radiation")
  const [bodyOpacity, setBodyOpacity] = useState(0.3)
  const [showLabels, setShowLabels] = useState(true)
  const [autoRotate, setAutoRotate] = useState(true)
  const [zoom, setZoom] = useState(1)
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null)

  // Accessibility and HIPAA compliance
  const { announceToScreenReader, getAriaLabel, settings } = useAccessibility()

  // Memoized handlers to prevent infinite re-renders
  const handleOpacityChange = useCallback((value: number[]) => {
    setBodyOpacity(value[0])
    announceToScreenReader(`Body opacity set to ${Math.round(value[0] * 100)} percent`)
  }, [announceToScreenReader])

  const handleLabelsToggle = useCallback(() => {
    setShowLabels(prev => {
      const newValue = !prev
      announceToScreenReader(newValue ? "Labels shown" : "Labels hidden")
      return newValue
    })
  }, [announceToScreenReader])

  const handleRotationToggle = useCallback(() => {
    setAutoRotate(prev => {
      const newValue = !prev
      announceToScreenReader(newValue ? "Auto rotation started" : "Auto rotation stopped")
      return newValue
    })
  }, [announceToScreenReader])




  // Sample medical data
  const bodyParts: BodyPartData[] = [
    {
      id: "head",
      name: "Head/Brain",
      position: [0, 2.5, 0],
      size: [0.8, 0.8, 0.8],
      color: "#ff6b9d",
      opacity: 0.7,
      isAffected: true,
      damageLevel: 0.8,
      radiationDose: 45,
      tumorPresent: true
    },
    {
      id: "chest",
      name: "Chest/Lungs",
      position: [0, 1, 0],
      size: [1.2, 1.5, 0.8],
      color: "#4ecdc4",
      opacity: 0.5,
      isAffected: false,
      damageLevel: 0.2,
      radiationDose: 12
    },
    {
      id: "abdomen",
      name: "Abdomen",
      position: [0, -0.5, 0],
      size: [1.1, 1.2, 0.7],
      color: "#45b7d1",
      opacity: 0.4,
      isAffected: false,
      damageLevel: 0.1,
      radiationDose: 8
    },
    {
      id: "pelvis",
      name: "Pelvis",
      position: [0, -2, 0],
      size: [1.0, 0.8, 0.6],
      color: "#96ceb4",
      opacity: 0.4,
      isAffected: false,
      damageLevel: 0.05,
      radiationDose: 3
    }
  ]

  const tumors: TumorData[] = [
    {
      id: "primary-tumor",
      position: [0.3, 2.7, 0.2],
      size: 0.25,
      type: "Glioblastoma",
      stage: "IV",
      growthRate: 0.8,
      malignancy: 0.95
    },
    {
      id: "secondary-tumor",
      position: [-0.2, 2.4, -0.1],
      size: 0.15,
      type: "Metastatic",
      stage: "III",
      growthRate: 0.6,
      malignancy: 0.7
    }
  ]

  const radiationPoints: RadiationData[] = [
    { position: [0, 2.5, 0], intensity: 0.9, dose: 45, targetArea: "Primary Tumor" },
    { position: [0.2, 2.6, 0.1], intensity: 0.7, dose: 35, targetArea: "Tumor Margin" },
    { position: [-0.1, 2.4, -0.05], intensity: 0.6, dose: 28, targetArea: "Secondary Site" },
    { position: [0.1, 2.3, 0.15], intensity: 0.4, dose: 20, targetArea: "Preventive Zone" }
  ]

  // HIPAA Audit Logging
  useEffect(() => {
    if (isOpen) {
      auditLogger.log3DModelAccess('comprehensive_human_body', patientData.id)
      announceToScreenReader(`Opened comprehensive 3D medical analysis for patient ${patientData.name}`)
    }
  }, [isOpen, patientData.id, patientData.name, announceToScreenReader])

  useEffect(() => {
    if (isOpen) {
      switch (activeTab) {
        case "radiation":
          auditLogger.logRadiationAnalysis(patientData.id, 'comprehensive_analysis')
          announceToScreenReader('Switched to radiation analysis view')
          break
        case "damage":
          auditLogger.logDamageAssessment(patientData.id, 'full_body')
          announceToScreenReader('Switched to tissue damage assessment view')
          break
        case "tumor":
          auditLogger.logTumorVisualization(patientData.id, 'comprehensive_tumor_analysis')
          announceToScreenReader('Switched to tumor visualization view')
          break
      }
    }
  }, [activeTab, isOpen, patientData.id, announceToScreenReader])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-7xl h-full max-h-[95vh] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-xl overflow-hidden shadow-2xl border border-blue-500/30 relative flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-blue-500/30 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <AccessibilityHeading
              level={1}
              id="medical-analysis-title"
              className="text-xl font-bold text-white"
            >
              3D Medical Analysis - {patientData.name}
            </AccessibilityHeading>
            <Badge
              variant="secondary"
              className="bg-blue-500/20 text-blue-300"
              role="status"
              aria-label={`Patient condition: ${patientData.condition}`}
            >
              {patientData.condition}
            </Badge>
            <Badge
              variant="secondary"
              className="bg-green-500/20 text-green-300"
              role="status"
              aria-label={`Patient age: ${patientData.age} years old`}
            >
              Age: {patientData.age}
            </Badge>
          </div>
          <AccessibilityButton
            ariaLabel="Close 3D medical analysis viewer"
            onClick={onClose}
            className="text-white hover:bg-white/10 p-2 rounded"
          >
            <span aria-hidden="true">×</span>
          </AccessibilityButton>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-blue-500/30 flex-shrink-0" role="toolbar" aria-label="3D model controls">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <label
                htmlFor="body-opacity-slider"
                className="text-sm text-gray-300"
              >
                Body Opacity:
              </label>
              <Slider
                id="body-opacity-slider"
                value={[bodyOpacity]}
                min={0.1}
                max={1}
                step={0.1}
                onValueChange={handleOpacityChange}
                className="w-24"
                aria-label="Adjust body opacity"
              />
            </div>
            <AccessibilityButton
              ariaLabel={showLabels ? "Hide anatomical labels" : "Show anatomical labels"}
              onClick={handleLabelsToggle}
              className="bg-white/10 border-white/20 text-white border rounded px-3 py-1 text-sm flex items-center gap-2"
            >
              {showLabels ? <Eye className="h-4 w-4" aria-hidden="true" /> : <EyeOff className="h-4 w-4" aria-hidden="true" />}
              Labels
            </AccessibilityButton>
            <AccessibilityButton
              ariaLabel={autoRotate ? "Stop automatic rotation" : "Start automatic rotation"}
              onClick={handleRotationToggle}
              className="bg-white/10 border-white/20 text-white border rounded px-3 py-1 text-sm flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              {autoRotate ? "Stop" : "Rotate"}
            </AccessibilityButton>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* 3D Viewer */}
          <div className="flex-1 relative">
            <Canvas
              camera={{ position: [3, 2, 5], fov: 50 }}
              gl={{ antialias: true, alpha: true }}
            >
              <PerspectiveCamera makeDefault position={[3, 2, 5]} fov={50} />
              
              {/* Enhanced Medical Lighting */}
              <ambientLight intensity={0.4} />
              <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
              <pointLight position={[-10, -10, -5]} intensity={0.6} color="#4A90E2" />
              <pointLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
              
              <Environment preset="studio" />
              
              <Suspense fallback={null}>
                <HumanBodyModel
                  bodyParts={bodyParts}
                  tumors={tumors}
                  radiationPoints={radiationPoints}
                  activeTab={activeTab}
                  bodyOpacity={bodyOpacity}
                  showLabels={showLabels}
                  onBodyPartSelect={setSelectedBodyPart}
                />
              </Suspense>
              
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                autoRotate={autoRotate}
                autoRotateSpeed={0.5}
                minDistance={2}
                maxDistance={15}
                enableDamping
                dampingFactor={0.05}
              />
            </Canvas>
          </div>

          {/* Analysis Tabs Panel */}
          <div className="w-80 bg-black/30 border-l border-blue-500/30 flex flex-col">
            <Tabs
              value={activeTab}
              onValueChange={(value) => {
                setActiveTab(value)
                announceToScreenReader(`Switched to ${value} analysis tab`)
              }}
              className="flex-1 flex flex-col"
            >
              <TabsList
                className="grid w-full grid-cols-3 bg-black/50"
                role="tablist"
                aria-label="Medical analysis categories"
              >
                <TabsTrigger
                  value="radiation"
                  className="text-xs"
                  aria-label="Radiation treatment analysis"
                >
                  <Zap className="h-4 w-4 mr-1" aria-hidden="true" />
                  Radiation
                </TabsTrigger>
                <TabsTrigger
                  value="damage"
                  className="text-xs"
                  aria-label="Tissue damage assessment"
                >
                  <AlertTriangle className="h-4 w-4 mr-1" aria-hidden="true" />
                  Damage
                </TabsTrigger>
                <TabsTrigger
                  value="tumor"
                  className="text-xs"
                  aria-label="Tumor visualization and analysis"
                >
                  <Target className="h-4 w-4 mr-1" aria-hidden="true" />
                  Tumor
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto p-4">
                <TabsContent value="radiation" className="space-y-4 mt-0">
                  <h3 className="text-lg font-semibold text-white mb-3">Radiation Analysis</h3>
                  {radiationPoints.map((point, index) => (
                    <div key={index} className="bg-black/40 p-3 rounded-lg border border-blue-500/20">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-medium">{point.targetArea}</span>
                        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
                          {point.dose} Gy
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Intensity:</span>
                          <span className="text-white">{(point.intensity * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-yellow-400 to-red-500 h-2 rounded-full"
                            style={{ width: `${point.intensity * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="damage" className="space-y-4 mt-0">
                  <h3 className="text-lg font-semibold text-white mb-3">Tissue Damage Assessment</h3>
                  {bodyParts.filter(part => part.isAffected || part.damageLevel > 0.1).map((part) => (
                    <div key={part.id} className="bg-black/40 p-3 rounded-lg border border-blue-500/20">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-medium">{part.name}</span>
                        <Badge 
                          variant="secondary" 
                          className={`${part.damageLevel > 0.5 ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'}`}
                        >
                          {part.isAffected ? 'Affected' : 'Monitored'}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Damage Level:</span>
                          <span className="text-white">{(part.damageLevel * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${part.damageLevel > 0.5 ? 'bg-gradient-to-r from-orange-400 to-red-500' : 'bg-gradient-to-r from-green-400 to-yellow-400'}`}
                            style={{ width: `${part.damageLevel * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="tumor" className="space-y-4 mt-0">
                  <h3 className="text-lg font-semibold text-white mb-3">Tumor Visualization</h3>
                  {tumors.map((tumor) => (
                    <div key={tumor.id} className="bg-black/40 p-3 rounded-lg border border-blue-500/20">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-medium">{tumor.type}</span>
                        <Badge variant="secondary" className="bg-red-500/20 text-red-300">
                          Stage {tumor.stage}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Size:</span>
                          <span className="text-white">{(tumor.size * 4).toFixed(1)} cm</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Growth Rate:</span>
                          <span className="text-white">{(tumor.growthRate * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Malignancy:</span>
                          <span className="text-white">{(tumor.malignancy * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-red-400 to-red-600 h-2 rounded-full"
                            style={{ width: `${tumor.malignancy * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

// Human Body 3D Model Component
function HumanBodyModel({
  bodyParts,
  tumors,
  radiationPoints,
  activeTab,
  bodyOpacity,
  showLabels,
  onBodyPartSelect
}: {
  bodyParts: BodyPartData[]
  tumors: TumorData[]
  radiationPoints: RadiationData[]
  activeTab: string
  bodyOpacity: number
  showLabels: boolean
  onBodyPartSelect: (partId: string | null) => void
}) {
  const bodyRef = useRef<THREE.Group>(null)
  const [time, setTime] = useState(0)

  useFrame((state, delta) => {
    setTime(prev => prev + delta)
    if (bodyRef.current) {
      // Subtle breathing animation
      const breathe = 1 + Math.sin((state.clock.elapsedTime) * 1.5) * 0.01
      bodyRef.current.scale.setScalar(breathe)
    }
  })

  return (
    <group ref={bodyRef}>
      {/* Human Body Parts */}
      {bodyParts.map((part) => (
        <BodyPart
          key={part.id}
          data={part}
          opacity={bodyOpacity}
          showLabels={showLabels}
          activeTab={activeTab}
          onClick={() => onBodyPartSelect(part.id)}
        />
      ))}

      {/* Tumors - Show in tumor tab or always visible with reduced opacity */}
      {tumors.map((tumor) => (
        <TumorVisualization
          key={tumor.id}
          data={tumor}
          visible={activeTab === "tumor"}
          time={time}
          showLabels={showLabels}
        />
      ))}

      {/* Radiation Points - Show in radiation tab */}
      {activeTab === "radiation" && radiationPoints.map((point, index) => (
        <RadiationVisualization
          key={index}
          data={point}
          time={time}
          showLabels={showLabels}
        />
      ))}

      {/* Damage Indicators - Show in damage tab */}
      {activeTab === "damage" && bodyParts.filter(part => part.isAffected).map((part) => (
        <DamageVisualization
          key={`damage-${part.id}`}
          bodyPart={part}
          time={time}
          showLabels={showLabels}
        />
      ))}
    </group>
  )
}

// Individual Body Part Component
function BodyPart({
  data,
  opacity,
  showLabels,
  activeTab,
  onClick
}: {
  data: BodyPartData
  opacity: number
  showLabels: boolean
  activeTab: string
  onClick: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  // Determine color based on active tab and part status
  const getPartColor = () => {
    if (activeTab === "damage" && data.isAffected) {
      return new THREE.Color().lerpColors(
        new THREE.Color("#4ecdc4"),
        new THREE.Color("#ff6b6b"),
        data.damageLevel
      )
    }
    if (activeTab === "radiation" && data.radiationDose && data.radiationDose > 10) {
      return new THREE.Color().lerpColors(
        new THREE.Color("#4ecdc4"),
        new THREE.Color("#ffeb3b"),
        (data.radiationDose || 0) / 50
      )
    }
    return new THREE.Color(data.color)
  }

  return (
    <group>
      <mesh
        ref={meshRef}
        position={data.position}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={data.size} />
        <meshPhysicalMaterial
          color={getPartColor()}
          transparent
          opacity={hovered ? opacity * 1.2 : opacity}
          roughness={0.2}
          metalness={0.1}
          clearcoat={0.5}
          clearcoatRoughness={0.1}
          transmission={0.3}
          thickness={0.5}
          ior={1.4}
          emissive={getPartColor()}
          emissiveIntensity={hovered ? 0.2 : 0.1}
        />
      </mesh>

      {/* Labels */}
      {showLabels && (
        <Html position={[data.position[0], data.position[1] + data.size[1]/2 + 0.3, data.position[2]]} center>
          <div className="bg-black/80 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap border border-blue-500/30">
            {data.name}
            {activeTab === "radiation" && data.radiationDose && (
              <div className="text-yellow-300">{data.radiationDose} Gy</div>
            )}
            {activeTab === "damage" && data.isAffected && (
              <div className="text-red-300">{(data.damageLevel * 100).toFixed(0)}% damage</div>
            )}
          </div>
        </Html>
      )}
    </group>
  )
}

// Tumor Visualization Component
function TumorVisualization({
  data,
  visible,
  time,
  showLabels
}: {
  data: TumorData
  visible: boolean
  time: number
  showLabels: boolean
}) {
  const tumorRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (tumorRef.current && visible) {
      // Pulsing animation for tumors
      const pulse = 1 + Math.sin(time * 3) * 0.1
      tumorRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <group>
      <mesh ref={tumorRef} position={data.position}>
        <sphereGeometry args={[data.size, 32, 32]} />
        <meshPhysicalMaterial
          color="#ff1744"
          transparent
          opacity={visible ? 0.9 : 0.3}
          emissive="#ff1744"
          emissiveIntensity={visible ? 0.6 : 0.2}
          roughness={0.2}
          metalness={0.1}
          clearcoat={0.5}
        />
      </mesh>

      {/* Tumor Glow Effect */}
      <mesh position={data.position}>
        <sphereGeometry args={[data.size * 1.5, 16, 16]} />
        <meshBasicMaterial
          color="#ff6b6b"
          transparent
          opacity={visible ? 0.2 : 0.05}
          wireframe
        />
      </mesh>

      {/* Labels */}
      {showLabels && visible && (
        <Html position={[data.position[0], data.position[1] + data.size + 0.3, data.position[2]]} center>
          <div className="bg-black/80 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap border border-red-500/30">
            <div className="text-red-300 font-semibold">{data.type}</div>
            <div className="text-gray-300">Stage {data.stage}</div>
            <div className="text-gray-300">{(data.size * 4).toFixed(1)} cm</div>
          </div>
        </Html>
      )}
    </group>
  )
}

// Radiation Visualization Component
function RadiationVisualization({
  data,
  time,
  showLabels
}: {
  data: RadiationData
  time: number
  showLabels: boolean
}) {
  const radiationRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (radiationRef.current) {
      // Rotating radiation field
      radiationRef.current.rotation.y = time * 0.5
      radiationRef.current.rotation.z = time * 0.3
    }
  })

  return (
    <group>
      {/* Radiation Field */}
      <mesh ref={radiationRef} position={data.position}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial
          color="#ffeb3b"
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>

      {/* Radiation Intensity Visualization */}
      <mesh position={data.position}>
        <sphereGeometry args={[0.3 * data.intensity, 32, 32]} />
        <meshPhysicalMaterial
          color="#ffc107"
          transparent
          opacity={0.6}
          emissive="#ffc107"
          emissiveIntensity={data.intensity * 0.8}
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>

      {/* Radiation Beams */}
      {[...Array(8)].map((_, i) => (
        <mesh
          key={i}
          position={[
            data.position[0] + Math.cos(i * Math.PI / 4) * 0.8,
            data.position[1],
            data.position[2] + Math.sin(i * Math.PI / 4) * 0.8
          ]}
          rotation={[0, i * Math.PI / 4, 0]}
        >
          <cylinderGeometry args={[0.02, 0.02, 1.6, 8]} />
          <meshBasicMaterial
            color="#ffeb3b"
            transparent
            opacity={0.4}
            emissive="#ffeb3b"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}

      {/* Labels */}
      {showLabels && (
        <Html position={[data.position[0], data.position[1] + 0.8, data.position[2]]} center>
          <div className="bg-black/80 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap border border-yellow-500/30">
            <div className="text-yellow-300 font-semibold">{data.targetArea}</div>
            <div className="text-gray-300">{data.dose} Gy</div>
            <div className="text-gray-300">{(data.intensity * 100).toFixed(0)}% intensity</div>
          </div>
        </Html>
      )}
    </group>
  )
}

// Damage Visualization Component
function DamageVisualization({
  bodyPart,
  time,
  showLabels
}: {
  bodyPart: BodyPartData
  time: number
  showLabels: boolean
}) {
  const damageRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (damageRef.current) {
      // Pulsing damage indicators
      const pulse = 1 + Math.sin(time * 2) * 0.2
      damageRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <group ref={damageRef}>
      {/* Damage Indicators */}
      {[...Array(Math.floor(bodyPart.damageLevel * 10))].map((_, i) => (
        <mesh
          key={i}
          position={[
            bodyPart.position[0] + (Math.random() - 0.5) * bodyPart.size[0],
            bodyPart.position[1] + (Math.random() - 0.5) * bodyPart.size[1],
            bodyPart.position[2] + (Math.random() - 0.5) * bodyPart.size[2]
          ]}
        >
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial
            color="#ff5722"
            transparent
            opacity={0.8}
            emissive="#ff5722"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}

      {/* Damage Area Outline */}
      <mesh position={bodyPart.position}>
        <boxGeometry args={[
          bodyPart.size[0] * 1.1,
          bodyPart.size[1] * 1.1,
          bodyPart.size[2] * 1.1
        ]} />
        <meshBasicMaterial
          color="#ff5722"
          transparent
          opacity={0.2}
          wireframe
        />
      </mesh>

      {/* Labels */}
      {showLabels && (
        <Html position={[
          bodyPart.position[0] + bodyPart.size[0]/2 + 0.3,
          bodyPart.position[1],
          bodyPart.position[2]
        ]} center>
          <div className="bg-black/80 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap border border-red-500/30">
            <div className="text-red-300 font-semibold">Tissue Damage</div>
            <div className="text-gray-300">{(bodyPart.damageLevel * 100).toFixed(0)}% affected</div>
          </div>
        </Html>
      )}
    </group>
  )
}
