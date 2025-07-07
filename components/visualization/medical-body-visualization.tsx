"use client"

import { useState, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Html } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, RotateCcw } from "lucide-react"
import * as THREE from "three"

export function MedicalBodyVisualization() {
  const [opacity, setOpacity] = useState(0.7)
  const [showLabels, setShowLabels] = useState(true)
  const [activeView, setActiveView] = useState("organs")
  const [showDoseMap, setShowDoseMap] = useState(false)

  return (
    <div className="w-full h-full bg-black rounded-xl overflow-hidden relative">
      {/* Controls */}
      <div className="absolute top-4 left-4 z-20 bg-black/80 backdrop-blur-sm rounded-lg p-3">
        <Tabs value={activeView} onValueChange={setActiveView} className="mb-3">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="organs">Organs</TabsTrigger>
            <TabsTrigger value="skeleton">Skeleton</TabsTrigger>
            <TabsTrigger value="dosemap">Dose Map</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center space-x-2 mb-3">
          <span className="text-xs text-white">Opacity</span>
          <Slider
            value={[opacity]}
            min={0.3}
            max={1}
            step={0.05}
            onValueChange={(value) => setOpacity(value[0])}
            className="w-24"
          />
          <span className="text-xs text-white">{Math.round(opacity * 100)}%</span>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => setShowLabels(!showLabels)}>
            {showLabels ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setOpacity(0.7)}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Status */}
      <div className="absolute bottom-4 left-4 z-20">
        <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300">
          Full Body Analysis
        </Badge>
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#0066ff" />

        <MedicalBodyModel opacity={opacity} showLabels={showLabels} activeView={activeView} />

        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        <Environment preset="studio" />
      </Canvas>
    </div>
  )
}

function MedicalBodyModel({
  opacity,
  showLabels,
  activeView,
}: {
  opacity: number
  showLabels: boolean
  activeView: string
}) {
  const bodyRef = useRef<THREE.Group>(null)
  const heartRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (heartRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
      heartRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <group ref={bodyRef} position={[0, 0, 0]}>
      {/* Translucent Blue Body */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[1, 3, 4, 8]} />
        <meshPhysicalMaterial
          color={new THREE.Color(0.2, 0.6, 1.0)}
          transparent
          opacity={opacity * 0.2}
          roughness={0.1}
          metalness={0.1}
          clearcoat={0.9}
          transmission={0.9}
          thickness={0.5}
        />
      </mesh>

      {/* Head */}
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshPhysicalMaterial
          color={new THREE.Color(0.2, 0.6, 1.0)}
          transparent
          opacity={opacity * 0.3}
          roughness={0.1}
          metalness={0.1}
          transmission={0.8}
        />
      </mesh>

      {/* Skeleton View */}
      {(activeView === "skeleton" || activeView === "dosemap") && (
        <group>
          {/* Spine */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 3, 8]} />
            <meshBasicMaterial color={new THREE.Color(0.9, 0.9, 0.9)} transparent opacity={0.8} />
          </mesh>

          {/* Ribs */}
          {Array.from({ length: 8 }, (_, i) => (
            <group key={i}>
              <mesh position={[0.5, 1 - i * 0.2, 0]} rotation={[0, 0, Math.PI / 6]}>
                <torusGeometry args={[0.4, 0.02, 8, 16]} />
                <meshBasicMaterial color={new THREE.Color(0.9, 0.9, 0.9)} transparent opacity={0.6} />
              </mesh>
              <mesh position={[-0.5, 1 - i * 0.2, 0]} rotation={[0, 0, -Math.PI / 6]}>
                <torusGeometry args={[0.4, 0.02, 8, 16]} />
                <meshBasicMaterial color={new THREE.Color(0.9, 0.9, 0.9)} transparent opacity={0.6} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* Organs View */}
      {(activeView === "organs" || activeView === "dosemap") && (
        <group>
          {/* Heart */}
          <mesh ref={heartRef} position={[-0.2, 0.8, 0.1]}>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshBasicMaterial color={new THREE.Color(1.0, 0.3, 0.3)} transparent opacity={0.9} />
          </mesh>

          {/* Lungs */}
          <mesh position={[0.4, 0.6, 0]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshBasicMaterial color={new THREE.Color(1.0, 0.5, 0.3)} transparent opacity={0.8} />
          </mesh>
          <mesh position={[-0.4, 0.6, 0]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshBasicMaterial color={new THREE.Color(1.0, 0.5, 0.3)} transparent opacity={0.8} />
          </mesh>

          {/* Liver */}
          <mesh position={[0.3, 0, 0.1]}>
            <boxGeometry args={[0.6, 0.4, 0.3]} />
            <meshBasicMaterial color={new THREE.Color(1.0, 0.6, 0.2)} transparent opacity={0.8} />
          </mesh>

          {/* Stomach */}
          <mesh position={[-0.1, 0.2, 0.1]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial color={new THREE.Color(1.0, 0.7, 0.3)} transparent opacity={0.8} />
          </mesh>

          {/* Intestines */}
          <mesh position={[0, -0.5, 0]}>
            <torusGeometry args={[0.3, 0.1, 8, 16]} />
            <meshBasicMaterial color={new THREE.Color(1.0, 0.8, 0.4)} transparent opacity={0.8} />
          </mesh>
          <mesh position={[0.1, -0.8, 0.1]}>
            <torusGeometry args={[0.25, 0.08, 8, 16]} />
            <meshBasicMaterial color={new THREE.Color(1.0, 0.8, 0.4)} transparent opacity={0.8} />
          </mesh>
        </group>
      )}

      {/* Dose Map Visualization */}
      {activeView === "dosemap" && (
        <group>
          {/* Radiation Beams */}
          <mesh position={[2, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 3, 8]} />
            <meshBasicMaterial color={new THREE.Color(0.0, 1.0, 1.0)} transparent opacity={0.7} />
          </mesh>
          <mesh position={[-2, 0.5, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 3, 8]} />
            <meshBasicMaterial color={new THREE.Color(0.0, 1.0, 1.0)} transparent opacity={0.7} />
          </mesh>

          {/* Dose Distribution */}
          <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.8, 32, 32]} />
            <meshBasicMaterial color={new THREE.Color(1.0, 1.0, 0.0)} transparent opacity={0.2} wireframe />
          </mesh>

          {/* High Dose Area */}
          <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshBasicMaterial color={new THREE.Color(1.0, 0.0, 0.0)} transparent opacity={0.3} />
          </mesh>
        </group>
      )}

      {/* Labels */}
      {showLabels && (
        <>
          {activeView === "organs" && (
            <>
              <Html position={[-0.4, 1.2, 0]} center>
                <div className="bg-red-500/90 text-white text-xs px-2 py-1 rounded border border-red-400 pointer-events-none">
                  Heart
                </div>
              </Html>
              <Html position={[0.6, 0.8, 0]} center>
                <div className="bg-orange-500/90 text-white text-xs px-2 py-1 rounded border border-orange-400 pointer-events-none">
                  Lungs
                </div>
              </Html>
              <Html position={[0.5, 0.2, 0]} center>
                <div className="bg-yellow-500/90 text-white text-xs px-2 py-1 rounded border border-yellow-400 pointer-events-none">
                  Liver
                </div>
              </Html>
            </>
          )}

          {activeView === "dosemap" && (
            <Html position={[0, 1.5, 0]} center>
              <div className="bg-cyan-500/90 text-white text-xs px-3 py-2 rounded-lg border border-cyan-400 shadow-xl backdrop-blur-sm pointer-events-none">
                <div className="font-bold">Radiation Therapy</div>
                <div className="text-cyan-200 text-xs">Dose Distribution Map</div>
              </div>
            </Html>
          )}
        </>
      )}
    </group>
  )
}
