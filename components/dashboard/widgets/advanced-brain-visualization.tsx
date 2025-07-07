"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Eye,
  RotateCcw,
  Settings,
  Layers,
  Zap,
  Target,
  Download,
  Play,
  Pause,
  Volume2,
} from "lucide-react"

interface BrainRegion {
  id: string
  name: string
  activity: number
  health: number
  color: string
  coordinates: [number, number, number]
}

interface TumorData {
  id: string
  type: string
  size: number
  location: string
  grade: number
  coordinates: [number, number, number]
}

export function AdvancedBrainVisualization() {
  const [viewMode, setViewMode] = useState<"3d" | "slice" | "network">("3d")
  const [brainOpacity, setBrainOpacity] = useState([0.7])
  const [tumorOpacity, setTumorOpacity] = useState([0.9])
  const [showLabels, setShowLabels] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [rotationSpeed, setRotationSpeed] = useState([1])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const brainRegions: BrainRegion[] = [
    {
      id: "frontal",
      name: "Frontal Lobe",
      activity: 85,
      health: 92,
      color: "#3b82f6",
      coordinates: [0, 0.2, 0.3],
    },
    {
      id: "parietal",
      name: "Parietal Lobe",
      activity: 78,
      health: 88,
      color: "#10b981",
      coordinates: [0, 0.1, -0.2],
    },
    {
      id: "temporal",
      name: "Temporal Lobe",
      activity: 92,
      health: 76,
      color: "#f59e0b",
      coordinates: [0.3, -0.1, 0],
    },
    {
      id: "occipital",
      name: "Occipital Lobe",
      activity: 88,
      health: 94,
      color: "#8b5cf6",
      coordinates: [0, 0, -0.4],
    },
  ]

  const tumorData: TumorData = {
    id: "tumor_1",
    type: "Glioblastoma",
    size: 2.3,
    location: "Right Frontal Lobe",
    grade: 4,
    coordinates: [0.15, 0.2, 0.25],
  }

  // Simulate 3D brain rendering
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const drawBrain = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw brain outline
      ctx.strokeStyle = "#06b6d4"
      ctx.lineWidth = 2
      ctx.globalAlpha = brainOpacity[0]
      
      // Simple brain shape representation
      ctx.beginPath()
      ctx.ellipse(canvas.width / 2, canvas.height / 2, 120, 100, 0, 0, 2 * Math.PI)
      ctx.stroke()
      
      // Draw brain regions
      brainRegions.forEach((region, index) => {
        const x = canvas.width / 2 + region.coordinates[0] * 100
        const y = canvas.height / 2 + region.coordinates[1] * 80
        
        ctx.fillStyle = region.color
        ctx.globalAlpha = 0.6
        ctx.beginPath()
        ctx.arc(x, y, 15, 0, 2 * Math.PI)
        ctx.fill()
        
        if (showLabels) {
          ctx.fillStyle = "#ffffff"
          ctx.globalAlpha = 1
          ctx.font = "12px sans-serif"
          ctx.fillText(region.name, x + 20, y + 5)
        }
      })
      
      // Draw tumor
      const tumorX = canvas.width / 2 + tumorData.coordinates[0] * 100
      const tumorY = canvas.height / 2 + tumorData.coordinates[1] * 80
      
      ctx.fillStyle = "#ef4444"
      ctx.globalAlpha = tumorOpacity[0]
      ctx.beginPath()
      ctx.arc(tumorX, tumorY, tumorData.size * 5, 0, 2 * Math.PI)
      ctx.fill()
      
      if (showLabels) {
        ctx.fillStyle = "#ffffff"
        ctx.globalAlpha = 1
        ctx.font = "12px sans-serif"
        ctx.fillText("Tumor", tumorX + 15, tumorY - 15)
      }
    }

    drawBrain()
  }, [brainOpacity, tumorOpacity, showLabels])

  const resetView = () => {
    setBrainOpacity([0.7])
    setTumorOpacity([0.9])
    setRotationSpeed([1])
    setSelectedRegion(null)
  }

  const exportVisualization = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const link = document.createElement("a")
    link.download = "brain-visualization.png"
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div className="space-y-6">
      <Card className="card-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-teal-400 flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Advanced Brain Visualization
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAnimating(!isAnimating)}
                className="glow-hover bg-transparent"
              >
                {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={resetView}
                className="glow-hover bg-transparent"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={exportVisualization}
                className="glow-hover bg-transparent"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
            <TabsList className="grid w-full grid-cols-3 bg-teal-900/20 mb-6">
              <TabsTrigger value="3d" className="data-[state=active]:bg-teal-600">
                3D View
              </TabsTrigger>
              <TabsTrigger value="slice" className="data-[state=active]:bg-teal-600">
                Cross Section
              </TabsTrigger>
              <TabsTrigger value="network" className="data-[state=active]:bg-teal-600">
                Neural Network
              </TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Visualization Area */}
              <div className="lg:col-span-2">
                <div className="relative bg-slate-900/50 rounded-lg border border-slate-700/50 p-4">
                  <canvas
                    ref={canvasRef}
                    width={500}
                    height={400}
                    className="w-full h-auto max-w-full"
                  />
                  
                  {/* Overlay Controls */}
                  <div className="absolute top-4 right-4 space-y-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowLabels(!showLabels)}
                      className="bg-slate-800/80 backdrop-blur-sm"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-slate-800/80 backdrop-blur-sm"
                    >
                      <Layers className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Control Panel */}
              <div className="space-y-4">
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm">Visualization Controls</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-400 mb-2 block">Brain Opacity</label>
                      <Slider
                        value={brainOpacity}
                        onValueChange={setBrainOpacity}
                        max={1}
                        min={0}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs text-gray-400 mb-2 block">Tumor Opacity</label>
                      <Slider
                        value={tumorOpacity}
                        onValueChange={setTumorOpacity}
                        max={1}
                        min={0}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs text-gray-400 mb-2 block">Rotation Speed</label>
                      <Slider
                        value={rotationSpeed}
                        onValueChange={setRotationSpeed}
                        max={5}
                        min={0}
                        step={0.5}
                        className="w-full"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm">Tumor Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Type:</span>
                      <Badge variant="destructive" className="text-xs">
                        {tumorData.type}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Size:</span>
                      <span className="text-xs text-white">{tumorData.size} cm</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Grade:</span>
                      <Badge variant="destructive" className="text-xs">
                        Grade {tumorData.grade}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Location:</span>
                      <span className="text-xs text-white">{tumorData.location}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm">Brain Regions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {brainRegions.map((region) => (
                      <div
                        key={region.id}
                        className={`p-2 rounded cursor-pointer transition-all ${
                          selectedRegion === region.id
                            ? "bg-teal-900/30 border border-teal-500/50"
                            : "hover:bg-slate-700/50"
                        }`}
                        onClick={() => setSelectedRegion(region.id)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: region.color }}
                            />
                            <span className="text-xs text-white">{region.name}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-400">Activity:</span>
                            <span className="text-white ml-1">{region.activity}%</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Health:</span>
                            <span className="text-white ml-1">{region.health}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
