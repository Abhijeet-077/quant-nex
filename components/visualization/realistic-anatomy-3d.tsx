"use client"

import { useState, useRef, useMemo, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Html } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, RotateCcw, Zap, Target } from "lucide-react"
import * as THREE from "three"

export function RealisticAnatomy3D() {
  const [opacity, setOpacity] = useState(0.6)
  const [showLabels, setShowLabels] = useState(true)
  const [activeView, setActiveView] = useState("organs")
  const [showDoseMap, setShowDoseMap] = useState(false)
  const [showRadiationBeams, setShowRadiationBeams] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black rounded-xl overflow-hidden flex items-center justify-center">
        <div className="text-white">Loading 3D Anatomy...</div>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black rounded-xl overflow-hidden relative">
      {/* Advanced Controls */}
      <div className="absolute top-4 left-4 z-20 bg-black/90 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
        <Tabs value={activeView} onValueChange={setActiveView} className="mb-4">
          <TabsList className="grid grid-cols-4 bg-gray-800">
            <TabsTrigger value="organs" className="text-xs">
              Organs
            </TabsTrigger>
            <TabsTrigger value="skeleton" className="text-xs">
              Skeleton
            </TabsTrigger>
            <TabsTrigger value="dosemap" className="text-xs">
              Dose Map
            </TabsTrigger>
            <TabsTrigger value="damage" className="text-xs">
              Tissue Risk
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Button
              variant={showRadiationBeams ? "default" : "outline"}
              size="sm"
              onClick={() => setShowRadiationBeams(!showRadiationBeams)}
              className="bg-cyan-500/20 border-cyan-500/50 text-cyan-300 text-xs"
            >
              <Zap className="h-3 w-3 mr-1" />
              Beams
            </Button>
            <Button
              variant={showDoseMap ? "default" : "outline"}
              size="sm"
              onClick={() => setShowDoseMap(!showDoseMap)}
              className="bg-yellow-500/20 border-yellow-500/50 text-yellow-300 text-xs"
            >
              <Target className="h-3 w-3 mr-1" />
              Dose
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

          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => setShowLabels(!showLabels)}>
              {showLabels ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setOpacity(0.6)}>
              <RotateCcw className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Medical Status */}
      <div className="absolute bottom-4 left-4 z-20 space-y-2">
        <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 block">
          Medical Grade Anatomy
        </Badge>
        {activeView === "dosemap" && (
          <Badge variant="secondary" className="bg-red-500/20 text-red-300 block">
            Radiation Planning Active
          </Badge>
        )}
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <pointLight position={[-10, -10, -5]} intensity={0.6} color="#4A90E2" />

        <RealisticHumanBody
          opacity={opacity}
          showLabels={showLabels}
          activeView={activeView}
          showDoseMap={showDoseMap}
          showRadiationBeams={showRadiationBeams}
        />

        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={3} maxDistance={12} />
        <Environment preset="studio" />
      </Canvas>
    </div>
  )
}

function RealisticHumanBody({
  opacity,
  showLabels,
  activeView,
  showDoseMap,
  showRadiationBeams,
}: {
  opacity: number
  showLabels: boolean
  activeView: string
  showDoseMap: boolean
  showRadiationBeams: boolean
}) {
  const bodyRef = useRef<THREE.Group>(null)
  const heartRef = useRef<THREE.Mesh>(null)
  const lungsRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (heartRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.08
      heartRef.current.scale.setScalar(pulse)
    }

    if (lungsRef.current) {
      const breathe = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.03
      lungsRef.current.scale.setScalar(breathe)
    }
  })

  // Create realistic body geometry
  const bodyGeometry = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 2.5)
    shape.lineTo(0.8, 2.2)
    shape.lineTo(1.2, 1.5)
    shape.lineTo(1.0, 0.5)
    shape.lineTo(0.9, -0.5)
    shape.lineTo(0.7, -1.5)
    shape.lineTo(0.5, -2.5)
    shape.lineTo(-0.5, -2.5)
    shape.lineTo(-0.7, -1.5)
    shape.lineTo(-0.9, -0.5)
    shape.lineTo(-1.0, 0.5)
    shape.lineTo(-1.2, 1.5)
    shape.lineTo(-0.8, 2.2)
    shape.closePath()

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.6,
      bevelEnabled: true,
      bevelSegments: 8,
      bevelSize: 0.1,
      bevelThickness: 0.1,
    })
  }, [])

  return (
    <group ref={bodyRef} position={[0, 0, 0]}>
      {/* Realistic Body Shell */}
      <mesh geometry={bodyGeometry} position={[0, 0, -0.3]}>
        <meshPhysicalMaterial
          color={new THREE.Color(0.3, 0.7, 1.0)}
          transparent
          opacity={opacity * 0.15}
          roughness={0.1}
          metalness={0.05}
          clearcoat={1.0}
          transmission={0.95}
          thickness={0.8}
          ior={1.4}
        />
      </mesh>

      {/* Realistic Head */}
      <mesh position={[0, 3.2, 0]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshPhysicalMaterial
          color={new THREE.Color(0.3, 0.7, 1.0)}
          transparent
          opacity={opacity * 0.2}
          roughness={0.1}
          metalness={0.05}
          transmission={0.9}
          thickness={0.5}
        />
      </mesh>

      {/* Detailed Skeleton */}
      {(activeView === "skeleton" || activeView === "dosemap" || activeView === "damage") && (
        <group>
          {/* Realistic Spine with Vertebrae */}
          <group>
            {Array.from({ length: 24 }, (_, i) => (
              <mesh key={i} position={[0, 2 - i * 0.18, 0]}>
                <cylinderGeometry args={[0.08, 0.08, 0.12, 8]} />
                <meshStandardMaterial color={new THREE.Color(0.95, 0.95, 0.9)} />
              </mesh>
            ))}
          </group>

          {/* Detailed Rib Cage */}
          {Array.from({ length: 12 }, (_, i) => {
            const height = 1.8 - i * 0.15
            const width = 0.6 + Math.sin(i * 0.3) * 0.2
            return (
              <group key={i}>
                <mesh position={[0, height, 0]}>
                  <torusGeometry args={[width, 0.025, 8, 24]} />
                  <meshStandardMaterial color={new THREE.Color(0.9, 0.9, 0.85)} />
                </mesh>
              </group>
            )
          })}
        </group>
      )}

      {/* Highly Detailed Organs */}
      {(activeView === "organs" || activeView === "dosemap" || activeView === "damage") && (
        <group>
          {/* Anatomically Correct Heart */}
          <mesh ref={heartRef} position={[-0.15, 1.2, 0.2]}>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshStandardMaterial
              color={new THREE.Color(0.8, 0.2, 0.2)}
              transparent
              opacity={0.9}
              emissive={new THREE.Color(0.1, 0.02, 0.02)}
            />
          </mesh>

          {/* Realistic Lungs */}
          <group ref={lungsRef}>
            <mesh position={[0.45, 1.0, 0.1]}>
              <sphereGeometry args={[0.35, 20, 20]} />
              <meshStandardMaterial color={new THREE.Color(1.0, 0.6, 0.4)} transparent opacity={0.8} roughness={0.8} />
            </mesh>
            <mesh position={[-0.45, 1.0, 0.1]}>
              <sphereGeometry args={[0.35, 20, 20]} />
              <meshStandardMaterial color={new THREE.Color(1.0, 0.6, 0.4)} transparent opacity={0.8} roughness={0.8} />
            </mesh>
          </group>

          {/* Detailed Liver */}
          <mesh position={[0.4, 0.3, 0.15]}>
            <boxGeometry args={[0.7, 0.5, 0.4]} />
            <meshStandardMaterial color={new THREE.Color(0.6, 0.3, 0.1)} transparent opacity={0.85} />
          </mesh>

          {/* Stomach */}
          <mesh position={[-0.2, 0.5, 0.2]}>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color={new THREE.Color(0.9, 0.7, 0.4)} transparent opacity={0.8} />
          </mesh>

          {/* Kidneys */}
          <mesh position={[0.3, 0, -0.1]}>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshStandardMaterial color={new THREE.Color(0.7, 0.4, 0.3)} transparent opacity={0.8} />
          </mesh>
          <mesh position={[-0.3, 0, -0.1]}>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshStandardMaterial color={new THREE.Color(0.7, 0.4, 0.3)} transparent opacity={0.8} />
          </mesh>

          {/* Intestines */}
          <group position={[0, -0.5, 0]}>
            <mesh>
              <torusGeometry args={[0.3, 0.08, 8, 24]} />
              <meshStandardMaterial color={new THREE.Color(1.0, 0.8, 0.5)} transparent opacity={0.8} />
            </mesh>
            <mesh position={[0.1, -0.3, 0.1]} rotation={[0.3, 0.5, 0]}>
              <torusGeometry args={[0.25, 0.06, 8, 24]} />
              <meshStandardMaterial color={new THREE.Color(1.0, 0.8, 0.5)} transparent opacity={0.8} />
            </mesh>
          </group>
        </group>
      )}

      {/* Advanced Radiation Therapy Visualization */}
      {showRadiationBeams && (
        <group>
          {Array.from({ length: 6 }, (_, i) => {
            const angle = (i / 6) * Math.PI * 2
            const x = Math.cos(angle) * 3
            const z = Math.sin(angle) * 3
            return (
              <group key={i}>
                <mesh position={[x, 1, z]} lookAt={[0, 1, 0]}>
                  <cylinderGeometry args={[0.02, 0.15, 3, 8]} />
                  <meshBasicMaterial color={new THREE.Color(0.0, 1.0, 1.0)} transparent opacity={0.6} />
                </mesh>
              </group>
            )
          })}
        </group>
      )}

      {/* Dose Distribution Map */}
      {(activeView === "dosemap" || showDoseMap) && (
        <group>
          <mesh position={[0, 1, 0]}>
            <sphereGeometry args={[0.4, 32, 32]} />
            <meshBasicMaterial
              color={new THREE.Color(1.0, 0.0, 0.0)}
              transparent
              opacity={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0, 1, 0]}>
            <sphereGeometry args={[0.7, 32, 32]} />
            <meshBasicMaterial
              color={new THREE.Color(1.0, 0.5, 0.0)}
              transparent
              opacity={0.2}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}

      {/* Medical Labels */}
      {showLabels && (
        <>
          {activeView === "organs" && (
            <>
              <Html position={[-0.3, 1.5, 0.5]} center>
                <div className="bg-red-600/90 text-white text-xs px-3 py-2 rounded-lg border border-red-400 shadow-xl backdrop-blur-sm pointer-events-none">
                  <div className="font-bold">Heart</div>
                  <div className="text-red-200 text-xs">BPM: 72 • Normal</div>
                </div>
              </Html>
              <Html position={[0.7, 1.3, 0.3]} center>
                <div className="bg-orange-600/90 text-white text-xs px-3 py-2 rounded-lg border border-orange-400 shadow-xl backdrop-blur-sm pointer-events-none">
                  <div className="font-bold">Lungs</div>
                  <div className="text-orange-200 text-xs">Capacity: 95%</div>
                </div>
              </Html>
            </>
          )}
        </>
      )}
    </group>
  )
}
