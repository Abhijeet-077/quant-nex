"use client"

import { useRef, useState, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Html, Text } from "@react-three/drei"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Maximize2, Minimize2, RotateCcw, Loader2 } from "lucide-react"
import type * as THREE from "three"

// Export as TumorVisualization3D to match the import in other files
export function TumorVisualization3D() {
  const [opacity, setOpacity] = useState(0.7)
  const [showLabels, setShowLabels] = useState(true)
  const [zoom, setZoom] = useState(1)
  const [activeTab, setActiveTab] = useState("tumor")

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden border border-white/10 bg-black/20">
      <div className="relative w-full h-full">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <Suspense fallback={<LoadingFallback />}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <Environment preset="city" />

            {activeTab === "tumor" && <TumorModel opacity={opacity} showLabels={showLabels} zoom={zoom} />}
            {activeTab === "brain" && <BrainModel opacity={opacity} showLabels={showLabels} zoom={zoom} />}

            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          </Suspense>
        </Canvas>

        <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 z-10">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-3">
              <TabsTrigger value="tumor">Tumor View</TabsTrigger>
              <TabsTrigger value="brain">Brain View</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-300">Opacity</span>
            <Slider
              className="w-48"
              value={[opacity]}
              min={0.1}
              max={1}
              step={0.05}
              onValueChange={(value) => setOpacity(value[0])}
            />
            <span className="text-xs text-gray-300">{Math.round(opacity * 100)}%</span>
          </div>

          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-300">Zoom</span>
            <Slider
              className="w-48"
              value={[zoom]}
              min={0.5}
              max={2}
              step={0.1}
              onValueChange={(value) => setZoom(value[0])}
            />
            <span className="text-xs text-gray-300">{zoom.toFixed(1)}x</span>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" size="sm" onClick={() => setShowLabels(!showLabels)}>
              {showLabels ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide Labels
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Show Labels
                </>
              )}
            </Button>

            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}>
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(2, zoom + 0.1))}>
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setOpacity(0.7)
                  setZoom(1)
                }}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center text-white">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <p className="text-sm">Loading 3D Model...</p>
      </div>
    </Html>
  )
}

function TumorModel({ opacity, showLabels, zoom }: { opacity: number; showLabels: boolean; zoom: number }) {
  const tumorRef = useRef<THREE.Mesh>(null)
  const healthyRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (tumorRef.current) {
      tumorRef.current.rotation.y += 0.002
    }
    if (healthyRef.current) {
      healthyRef.current.rotation.y += 0.002
    }
  })

  return (
    <group scale={[zoom, zoom, zoom]}>
      {/* Tumor */}
      <mesh ref={tumorRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#ff5555" transparent opacity={opacity} roughness={0.3} metalness={0.2} />
        {showLabels && (
          <Html position={[1.2, 0, 0]} center>
            <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">Tumor Mass</div>
          </Html>
        )}
      </mesh>

      {/* Healthy Tissue */}
      <mesh ref={healthyRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial color="#aaaaff" transparent opacity={0.2} roughness={0.3} metalness={0.2} wireframe />
        {showLabels && (
          <Html position={[0, 1.8, 0]} center>
            <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">Healthy Tissue</div>
          </Html>
        )}
      </mesh>

      {/* Coordinate Axes for Reference */}
      {showLabels && (
        <>
          <Text position={[2.5, 0, 0]} color="red" fontSize={0.2}>
            X
          </Text>
          <Text position={[0, 2.5, 0]} color="green" fontSize={0.2}>
            Y
          </Text>
          <Text position={[0, 0, 2.5]} color="blue" fontSize={0.2}>
            Z
          </Text>
        </>
      )}
    </group>
  )
}

function BrainModel({ opacity, showLabels, zoom }: { opacity: number; showLabels: boolean; zoom: number }) {
  const brainRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (brainRef.current) {
      brainRef.current.rotation.y += 0.002
    }
  })

  return (
    <group scale={[zoom, zoom, zoom]}>
      {/* Brain - using sphereGeometry with scale to create an ellipsoid shape */}
      <mesh ref={brainRef} position={[0, 0, 0]} scale={[1.2, 1, 0.9]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#ffaa88" transparent opacity={opacity} roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Tumor */}
      <mesh position={[0.5, 0.3, 0.4]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#ff5555" transparent opacity={opacity * 1.2} roughness={0.3} metalness={0.2} />
        {showLabels && (
          <Html position={[0.4, 0, 0]} center>
            <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">Tumor</div>
          </Html>
        )}
      </mesh>

      {/* Brain Regions */}
      {showLabels && (
        <>
          <Html position={[0, 1.2, 0]} center>
            <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">Frontal Lobe</div>
          </Html>
          <Html position={[-1.2, 0, 0]} center>
            <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">Temporal Lobe</div>
          </Html>
          <Html position={[0, -1, 0]} center>
            <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">Cerebellum</div>
          </Html>
        </>
      )}
    </group>
  )
}
