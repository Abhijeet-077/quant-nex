"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Brain,
  Zap,
  Target,
  Activity,
  RotateCcw,
  Play,
  Pause,
  Maximize,
  Download,
} from "lucide-react"

interface BrainRegion {
  id: string
  name: string
  x: number
  y: number
  z: number
  size: number
  activity: number
  health: number
  color: string
}

interface TumorData {
  x: number
  y: number
  z: number
  size: number
  type: string
  malignancy: number
}

export function Brain3DDiagram() {
  const [mounted, setMounted] = useState(false)
  const [isRotating, setIsRotating] = useState(true)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [rotationAngle, setRotationAngle] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    setMounted(true)
  }, [])

  const brainRegions: BrainRegion[] = [
    { id: "frontal", name: "Frontal Lobe", x: 0, y: -20, z: 40, size: 60, activity: 85, health: 92, color: "#14B8A6" },
    { id: "parietal", name: "Parietal Lobe", x: 0, y: -40, z: 0, size: 50, activity: 78, health: 88, color: "#3B82F6" },
    { id: "temporal", name: "Temporal Lobe", x: -45, y: 0, z: 0, size: 45, activity: 82, health: 75, color: "#8B5CF6" },
    { id: "temporal-r", name: "Temporal Lobe (R)", x: 45, y: 0, z: 0, size: 45, activity: 65, health: 70, color: "#EF4444" },
    { id: "occipital", name: "Occipital Lobe", x: 0, y: 40, z: -20, size: 40, activity: 90, health: 95, color: "#10B981" },
    { id: "cerebellum", name: "Cerebellum", x: 0, y: 50, z: -40, size: 35, activity: 88, health: 92, color: "#F59E0B" },
  ]

  const tumorData: TumorData = {
    x: 45,
    y: 0,
    z: 0,
    size: 15,
    type: "Glioblastoma",
    malignancy: 85,
  }

  useEffect(() => {
    if (!mounted || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    const drawBrain = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw brain outline
      ctx.strokeStyle = "#374151"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.ellipse(centerX, centerY, 120, 100, 0, 0, 2 * Math.PI)
      ctx.stroke()

      // Draw brain regions
      brainRegions.forEach((region) => {
        const rotatedX = region.x * Math.cos(rotationAngle) - region.z * Math.sin(rotationAngle)
        const rotatedZ = region.x * Math.sin(rotationAngle) + region.z * Math.cos(rotationAngle)
        
        const screenX = centerX + rotatedX
        const screenY = centerY + region.y
        const depth = (rotatedZ + 100) / 200 // Normalize depth for size scaling
        const scaledSize = region.size * depth

        // Draw region
        ctx.fillStyle = selectedRegion === region.id ? region.color : region.color + "80"
        ctx.strokeStyle = region.color
        ctx.lineWidth = selectedRegion === region.id ? 3 : 1
        
        ctx.beginPath()
        ctx.ellipse(screenX, screenY, scaledSize * 0.8, scaledSize * 0.6, 0, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()

        // Draw activity indicator
        if (region.activity > 80) {
          ctx.fillStyle = "#FCD34D"
          ctx.beginPath()
          ctx.arc(screenX + scaledSize * 0.3, screenY - scaledSize * 0.3, 4, 0, 2 * Math.PI)
          ctx.fill()
        }

        // Draw region label
        if (selectedRegion === region.id) {
          ctx.fillStyle = "#FFFFFF"
          ctx.font = "12px Inter, sans-serif"
          ctx.textAlign = "center"
          ctx.fillText(region.name, screenX, screenY - scaledSize - 10)
        }
      })

      // Draw tumor
      const tumorRotatedX = tumorData.x * Math.cos(rotationAngle) - tumorData.z * Math.sin(rotationAngle)
      const tumorRotatedZ = tumorData.x * Math.sin(rotationAngle) + tumorData.z * Math.cos(rotationAngle)
      const tumorScreenX = centerX + tumorRotatedX
      const tumorScreenY = centerY + tumorData.y
      const tumorDepth = (tumorRotatedZ + 100) / 200
      const tumorScaledSize = tumorData.size * tumorDepth

      // Pulsing tumor effect
      const pulseSize = tumorScaledSize + Math.sin(Date.now() * 0.005) * 3

      ctx.fillStyle = "#EF4444"
      ctx.strokeStyle = "#DC2626"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.ellipse(tumorScreenX, tumorScreenY, pulseSize, pulseSize * 0.8, 0, 0, 2 * Math.PI)
      ctx.fill()
      ctx.stroke()

      // Tumor warning indicator
      ctx.fillStyle = "#FEF3C7"
      ctx.strokeStyle = "#F59E0B"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(tumorScreenX, tumorScreenY, pulseSize + 8, 0, 2 * Math.PI)
      ctx.stroke()

      // Draw neural connections
      ctx.strokeStyle = "#14B8A6"
      ctx.lineWidth = 1
      ctx.globalAlpha = 0.3
      brainRegions.forEach((region, i) => {
        if (i < brainRegions.length - 1) {
          const nextRegion = brainRegions[i + 1]
          const x1 = centerX + region.x * Math.cos(rotationAngle) - region.z * Math.sin(rotationAngle)
          const y1 = centerY + region.y
          const x2 = centerX + nextRegion.x * Math.cos(rotationAngle) - nextRegion.z * Math.sin(rotationAngle)
          const y2 = centerY + nextRegion.y

          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()
        }
      })
      ctx.globalAlpha = 1
    }

    const animate = () => {
      if (isRotating) {
        setRotationAngle(prev => prev + 0.01)
      }
      drawBrain()
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mounted, isRotating, rotationAngle, selectedRegion])

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Check if click is on any region
    brainRegions.forEach((region) => {
      const rotatedX = region.x * Math.cos(rotationAngle) - region.z * Math.sin(rotationAngle)
      const screenX = centerX + rotatedX
      const screenY = centerY + region.y
      const depth = (region.z * Math.sin(rotationAngle) + region.x * Math.cos(rotationAngle) + 100) / 200
      const scaledSize = region.size * depth

      const distance = Math.sqrt((x - screenX) ** 2 + (y - screenY) ** 2)
      if (distance < scaledSize) {
        setSelectedRegion(selectedRegion === region.id ? null : region.id)
      }
    })
  }

  if (!mounted) {
    return null
  }

  const selectedRegionData = brainRegions.find(r => r.id === selectedRegion)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Brain className="h-7 w-7 text-teal-400" />
            3D Brain Analysis
          </h2>
          <p className="text-gray-400 mt-1">Interactive brain visualization with AI tumor detection</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsRotating(!isRotating)}
            className="border-teal-500 text-teal-400"
          >
            {isRotating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRotationAngle(0)}
            className="border-teal-500 text-teal-400"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3D Brain Visualization */}
        <Card className="lg:col-span-2 bg-gray-900/50 border-teal-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-teal-400" />
              Interactive Brain Model
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="w-full h-auto bg-gray-950 rounded-lg cursor-pointer"
                onClick={handleCanvasClick}
              />
              <div className="absolute top-4 left-4 space-y-2">
                <Badge className="bg-red-600/20 text-red-400 border-red-500/30">
                  <Target className="h-3 w-3 mr-1" />
                  Tumor Detected
                </Badge>
                <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-500/30">
                  <Zap className="h-3 w-3 mr-1" />
                  High Activity
                </Badge>
              </div>
              <div className="absolute bottom-4 right-4 text-xs text-gray-400">
                Click regions to inspect • {isRotating ? 'Auto-rotating' : 'Paused'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Region Details */}
        <Card className="bg-gray-900/50 border-teal-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-teal-400" />
              {selectedRegionData ? 'Region Analysis' : 'Tumor Analysis'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedRegionData ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-medium">{selectedRegionData.name}</h3>
                  <p className="text-sm text-gray-400">Brain region analysis</p>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Neural Activity</span>
                      <span className="text-white">{selectedRegionData.activity}%</span>
                    </div>
                    <Progress value={selectedRegionData.activity} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Health Status</span>
                      <span className="text-white">{selectedRegionData.health}%</span>
                    </div>
                    <Progress value={selectedRegionData.health} className="h-2" />
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-700">
                  <Badge 
                    variant={selectedRegionData.health > 85 ? "outline" : "destructive"}
                    className="w-full justify-center"
                  >
                    {selectedRegionData.health > 85 ? 'Healthy' : 'Requires Attention'}
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-medium">{tumorData.type}</h3>
                  <p className="text-sm text-gray-400">Detected tumor analysis</p>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Size</span>
                      <span className="text-white">{tumorData.size}mm</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Malignancy Risk</span>
                      <span className="text-white">{tumorData.malignancy}%</span>
                    </div>
                    <Progress value={tumorData.malignancy} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Location</span>
                      <span className="text-white">Right Temporal</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-700">
                  <Badge variant="destructive" className="w-full justify-center">
                    High Priority - Immediate Attention Required
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Brain Regions Overview */}
      <Card className="bg-gray-900/50 border-teal-500/30">
        <CardHeader>
          <CardTitle className="text-white">Brain Regions Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brainRegions.map((region) => (
              <div
                key={region.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedRegion === region.id
                    ? 'border-teal-500 bg-teal-500/10'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
                onClick={() => setSelectedRegion(selectedRegion === region.id ? null : region.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium text-sm">{region.name}</span>
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: region.color }}
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Activity</span>
                    <span className="text-gray-300">{region.activity}%</span>
                  </div>
                  <Progress value={region.activity} className="h-1" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
