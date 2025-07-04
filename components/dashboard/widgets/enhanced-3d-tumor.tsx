"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Html, Environment, ContactShadows } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Zap, Layers, Play, Pause, Volume2 } from "lucide-react"
import * as THREE from "three"

interface TumorData {
  position: [number, number, number]
  size: number
  malignancy: number
  growth: number
}

function TumorMesh({
  position,
  size,
  malignancy,
  isHighlighted,
  onClick,
}: TumorData & {
  isHighlighted: boolean
  onClick: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
      meshRef.current.scale.setScalar(size + Math.sin(state.clock.elapsedTime * 2) * 0.1)
    }
  })

  const color = malignancy > 0.7 ? "#ff4444" : malignancy > 0.4 ? "#ffaa44" : "#44ff44"

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.1 : 1}
    >
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={isHighlighted ? 0.9 : 0.7}
        emissive={color}
        emissiveIntensity={isHighlighted ? 0.3 : 0.1}
      />
      {hovered && (
        <Html distanceFactor={10}>
          <div className="bg-black/80 text-white p-2 rounded text-xs">
            <div>Size: {(size * 10).toFixed(1)}mm</div>
            <div>Malignancy: {(malignancy * 100).toFixed(0)}%</div>
          </div>
        </Html>
      )}
    </mesh>
  )
}

function RadiationBeam({
  start,
  end,
  intensity,
}: {
  start: [number, number, number]
  end: [number, number, number]
  intensity: number
}) {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)]
  const geometry = new THREE.BufferGeometry().setFromPoints(points)

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#00ffff" transparent opacity={intensity} linewidth={2} />
    </line>
  )
}

function BrainAnatomy() {
  const brainRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (brainRef.current) {
      brainRef.current.rotation.y += 0.005
    }
  })

  return (
    <group ref={brainRef}>
      {/* Brain hemispheres */}
      <mesh position={[-0.5, 0, 0]}>
        <sphereGeometry args={[1.5, 32, 32, 0, Math.PI]} />
        <meshStandardMaterial color="#ffaaaa" transparent opacity={0.3} wireframe />
      </mesh>
      <mesh position={[0.5, 0, 0]}>
        <sphereGeometry args={[1.5, 32, 32, 0, Math.PI]} />
        <meshStandardMaterial color="#ffaaaa" transparent opacity={0.3} wireframe />
      </mesh>
    </group>
  )
}

export function Enhanced3DTumor() {
  const [selectedTumor, setSelectedTumor] = useState<number | null>(null)
  const [showRadiation, setShowRadiation] = useState(false)
  const [sliceLevel, setSliceLevel] = useState([0])
  const [viewMode, setViewMode] = useState<"solid" | "wireframe" | "xray">("solid")
  const [isPlaying, setIsPlaying] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)

  const tumors: TumorData[] = [
    { position: [0, 0.5, 0], size: 0.3, malignancy: 0.8, growth: 0.2 },
    { position: [-1, -0.2, 0.5], size: 0.2, malignancy: 0.6, growth: 0.1 },
    { position: [0.8, 0.3, -0.3], size: 0.15, malignancy: 0.4, growth: 0.05 },
  ]

  const radiationBeams = [
    { start: [-3, 0, 0] as [number, number, number], end: [0, 0.5, 0] as [number, number, number], intensity: 0.8 },
    { start: [3, 1, 1] as [number, number, number], end: [0, 0.5, 0] as [number, number, number], intensity: 0.6 },
    { start: [0, -3, 2] as [number, number, number], end: [0, 0.5, 0] as [number, number, number], intensity: 0.7 },
  ]

  // Voice command simulation
  useEffect(() => {
    if (voiceEnabled) {
      const handleVoiceCommand = (event: KeyboardEvent) => {
        if (event.key === "r") setShowRadiation(!showRadiation)
        if (event.key === "v")
          setViewMode((prev) => (prev === "solid" ? "wireframe" : prev === "wireframe" ? "xray" : "solid"))
      }

      window.addEventListener("keydown", handleVoiceCommand)
      return () => window.removeEventListener("keydown", handleVoiceCommand)
    }
  }, [voiceEnabled, showRadiation])

  return (
    <div className="h-full flex flex-col">
      {/* Controls */}
      <div className="flex items-center justify-between mb-4 p-2 bg-white/5 rounded-lg">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRadiation(!showRadiation)}
            className={`h-8 ${showRadiation ? "bg-cyan-500/20" : "bg-white/10"} border-white/20 text-white`}
          >
            <Zap className="h-3 w-3 mr-1" />
            Radiation
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="h-8 bg-white/10 border-white/20 text-white"
          >
            {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`h-8 ${voiceEnabled ? "bg-green-500/20" : "bg-white/10"} border-white/20 text-white`}
          >
            <Volume2 className="h-3 w-3" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-red-500/20 text-red-300">
            {tumors.length} Tumors
          </Badge>
          <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300">
            {viewMode}
          </Badge>
        </div>
      </div>

      {/* Slice Control */}
      <div className="mb-4 p-2 bg-white/5 rounded-lg">
        <div className="flex items-center space-x-3">
          <Layers className="h-4 w-4 text-white" />
          <span className="text-white text-sm">Slice Level:</span>
          <Slider value={sliceLevel} onValueChange={setSliceLevel} max={100} step={1} className="flex-1" />
          <span className="text-white text-sm">{sliceLevel[0]}%</span>
        </div>
      </div>

      {/* 3D Visualization */}
      <div className="flex-1 rounded-lg overflow-hidden bg-black/20">
        <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <spotLight position={[-10, -10, -10]} angle={0.3} intensity={0.5} />

          <Environment preset="city" />

          <BrainAnatomy />

          {tumors.map((tumor, index) => (
            <TumorMesh
              key={index}
              {...tumor}
              isHighlighted={selectedTumor === index}
              onClick={() => setSelectedTumor(selectedTumor === index ? null : index)}
            />
          ))}

          {showRadiation && radiationBeams.map((beam, index) => <RadiationBeam key={index} {...beam} />)}

          <OrbitControls enablePan enableZoom enableRotate />
          <ContactShadows opacity={0.4} scale={10} blur={1} far={10} resolution={256} color="#000000" />
        </Canvas>
      </div>

      {/* Tumor Details */}
      {selectedTumor !== null && (
        <div className="mt-4 p-3 bg-white/5 rounded-lg">
          <h4 className="text-white font-medium mb-2">Tumor #{selectedTumor + 1} Details</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Size:</span>
              <div className="text-white">{(tumors[selectedTumor].size * 10).toFixed(1)}mm</div>
            </div>
            <div>
              <span className="text-slate-400">Malignancy:</span>
              <div className="text-white">{(tumors[selectedTumor].malignancy * 100).toFixed(0)}%</div>
            </div>
            <div>
              <span className="text-slate-400">Growth Rate:</span>
              <div className="text-white">{(tumors[selectedTumor].growth * 100).toFixed(1)}%/month</div>
            </div>
          </div>
        </div>
      )}

      {voiceEnabled && (
        <div className="mt-2 p-2 bg-green-500/10 rounded-lg border border-green-500/20">
          <div className="text-green-400 text-xs">Voice Commands: Press 'R' for radiation, 'V' to change view mode</div>
        </div>
      )}
    </div>
  )
}
