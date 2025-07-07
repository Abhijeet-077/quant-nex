"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Play,
  Pause,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Eye,
  EyeOff,
  Brain,
  Activity,
  Layers,
  Target,
  Info,
  Download,
  Share2,
  Settings,
} from "lucide-react"

interface BrainRegion {
  id: string
  name: string
  color: string
  visible: boolean
  opacity: number
  position: { x: number; y: number; z: number }
}

interface TumorData {
  id: string
  type: string
  size: number
  location: string
  malignancy: number
  growth_rate: number
  visible: boolean
}

export function Advanced4DBrainModel() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  const [isPlaying, setIsPlaying] = useState(false)
  const [timeSlice, setTimeSlice] = useState([0])
  const [zoom, setZoom] = useState([100])
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 })
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("regions")

  const [brainRegions, setBrainRegions] = useState<BrainRegion[]>([
    {
      id: "frontal",
      name: "Frontal Lobe",
      color: "#00ffff",
      visible: true,
      opacity: 0.8,
      position: { x: 0, y: 20, z: 30 },
    },
    {
      id: "parietal",
      name: "Parietal Lobe",
      color: "#0d9488",
      visible: true,
      opacity: 0.8,
      position: { x: 0, y: 0, z: 0 },
    },
    {
      id: "temporal",
      name: "Temporal Lobe",
      color: "#06b6d4",
      visible: true,
      opacity: 0.8,
      position: { x: -30, y: -10, z: 0 },
    },
    {
      id: "occipital",
      name: "Occipital Lobe",
      color: "#0891b2",
      visible: true,
      opacity: 0.8,
      position: { x: 0, y: -30, z: -20 },
    },
    {
      id: "cerebellum",
      name: "Cerebellum",
      color: "#0e7490",
      visible: true,
      opacity: 0.8,
      position: { x: 0, y: -40, z: -30 },
    },
    {
      id: "brainstem",
      name: "Brain Stem",
      color: "#155e75",
      visible: true,
      opacity: 0.8,
      position: { x: 0, y: -20, z: -10 },
    },
  ])

  const [tumorData, setTumorData] = useState<TumorData[]>([
    {
      id: "tumor1",
      type: "Glioblastoma",
      size: 2.3,
      location: "Left Frontal Lobe",
      malignancy: 0.89,
      growth_rate: 0.15,
      visible: true,
    },
    {
      id: "tumor2",
      type: "Meningioma",
      size: 1.8,
      location: "Right Parietal",
      malignancy: 0.23,
      growth_rate: 0.05,
      visible: true,
    },
  ])

  // Initialize 3D rendering
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = 600
    canvas.height = 400

    drawBrainModel(ctx)
  }, [brainRegions, tumorData, timeSlice, zoom, rotation])

  // Animation loop
  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setRotation((prev) => ({
          ...prev,
          y: (prev.y + 1) % 360,
        }))
        animationRef.current = requestAnimationFrame(animate)
      }
      animationRef.current = requestAnimationFrame(animate)
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying])

  const drawBrainModel = (ctx: CanvasRenderingContext2D) => {
    const centerX = ctx.canvas.width / 2
    const centerY = ctx.canvas.height / 2
    const scale = zoom[0] / 100

    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // Draw grid background
    drawGrid(ctx)

    // Draw brain regions
    brainRegions.forEach((region) => {
      if (!region.visible) return

      const x = centerX + region.position.x * scale * Math.cos((rotation.y * Math.PI) / 180)
      const y = centerY + region.position.y * scale
      const size = 40 * scale

      ctx.save()
      ctx.globalAlpha = region.opacity
      ctx.fillStyle = region.color
      ctx.strokeStyle = region.color
      ctx.lineWidth = 2

      // Draw brain region as ellipse
      ctx.beginPath()
      ctx.ellipse(x, y, size, size * 0.7, 0, 0, 2 * Math.PI)
      ctx.fill()
      ctx.stroke()

      // Add region label
      ctx.globalAlpha = 1
      ctx.fillStyle = "#ffffff"
      ctx.font = "12px Inter, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(region.name, x, y + size + 15)

      ctx.restore()
    })

    // Draw tumors
    tumorData.forEach((tumor) => {
      if (!tumor.visible) return

      const region = brainRegions.find((r) => tumor.location.includes(r.name.split(" ")[0]))
      if (!region) return

      const x = centerX + (region.position.x + 10) * scale * Math.cos((rotation.y * Math.PI) / 180)
      const y = centerY + (region.position.y - 5) * scale
      const size = tumor.size * 8 * scale

      ctx.save()

      // Pulsing effect for malignant tumors
      const pulseScale = tumor.malignancy > 0.5 ? 1 + 0.1 * Math.sin(Date.now() * 0.005) : 1

      ctx.fillStyle = tumor.malignancy > 0.5 ? "#ef4444" : "#f59e0b"
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2

      ctx.beginPath()
      ctx.arc(x, y, size * pulseScale, 0, 2 * Math.PI)
      ctx.fill()
      ctx.stroke()

      // Add tumor info
      ctx.fillStyle = "#ffffff"
      ctx.font = "10px Inter, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`${tumor.type}`, x, y + size + 20)
      ctx.fillText(`${tumor.size}cm`, x, y + size + 32)

      ctx.restore()
    })

    // Draw time slice indicator
    drawTimeSliceIndicator(ctx, timeSlice[0])
  }

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.save()
    ctx.strokeStyle = "rgba(0, 255, 255, 0.1)"
    ctx.lineWidth = 1

    const gridSize = 30
    for (let x = 0; x < ctx.canvas.width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, ctx.canvas.height)
      ctx.stroke()
    }

    for (let y = 0; y < ctx.canvas.height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(ctx.canvas.width, y)
      ctx.stroke()
    }
    ctx.restore()
  }

  const drawTimeSliceIndicator = (ctx: CanvasRenderingContext2D, time: number) => {
    ctx.save()
    ctx.fillStyle = "#00ffff"
    ctx.font = "14px Inter, sans-serif"
    ctx.textAlign = "left"
    ctx.fillText(`Time: ${time}ms`, 10, 25)

    // Draw time progress bar
    const barWidth = 200
    const barHeight = 4
    const progress = time / 1000

    ctx.fillStyle = "rgba(0, 255, 255, 0.3)"
    ctx.fillRect(10, 35, barWidth, barHeight)

    ctx.fillStyle = "#00ffff"
    ctx.fillRect(10, 35, barWidth * progress, barHeight)

    ctx.restore()
  }

  const toggleRegionVisibility = (regionId: string) => {
    setBrainRegions((prev) =>
      prev.map((region) => (region.id === regionId ? { ...region, visible: !region.visible } : region)),
    )
  }

  const toggleTumorVisibility = (tumorId: string) => {
    setTumorData((prev) => prev.map((tumor) => (tumor.id === tumorId ? { ...tumor, visible: !tumor.visible } : tumor)))
  }

  const resetView = () => {
    setRotation({ x: 0, y: 0, z: 0 })
    setZoom([100])
    setTimeSlice([0])
    setIsPlaying(false)
  }

  return (
    <div className="w-full space-y-6">
      <Card className="card-glow">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-teal-400 flex items-center gap-2">
              <Brain className="h-6 w-6" />
              Advanced 4D Brain Visualization
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="glow-hover bg-transparent">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="glow-hover bg-transparent">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="glow-hover bg-transparent">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 3D Visualization Canvas */}
            <div className="lg:col-span-2 space-y-4">
              <div className="relative bg-black/50 rounded-lg border border-teal-500/30 overflow-hidden">
                <canvas ref={canvasRef} className="w-full h-auto max-w-full" style={{ aspectRatio: "3/2" }} />

                {/* Overlay Controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-black/50 backdrop-blur-sm"
                    onClick={() => setZoom([Math.min(200, zoom[0] + 10)])}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-black/50 backdrop-blur-sm"
                    onClick={() => setZoom([Math.max(50, zoom[0] - 10)])}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="bg-black/50 backdrop-blur-sm" onClick={resetView}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>

                {/* Patient Info Overlay */}
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-sm">
                  <p className="text-teal-400 font-medium">Patient: Rajesh Kumar</p>
                  <p className="text-gray-300">Age: 45 | Gender: Male</p>
                  <p className="text-gray-300">Scan Date: Jan 15, 2024</p>
                </div>
              </div>

              {/* Control Panel */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-teal-300">Time Slice (ms)</label>
                  <Slider value={timeSlice} onValueChange={setTimeSlice} max={1000} step={10} className="w-full" />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>0ms</span>
                    <span>{timeSlice[0]}ms</span>
                    <span>1000ms</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-teal-300">Zoom Level</label>
                  <Slider value={zoom} onValueChange={setZoom} min={50} max={200} step={5} className="w-full" />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>50%</span>
                    <span>{zoom[0]}%</span>
                    <span>200%</span>
                  </div>
                </div>

                <div className="flex items-end gap-2">
                  <Button onClick={() => setIsPlaying(!isPlaying)} className="btn-glow-primary flex-1">
                    {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {isPlaying ? "Pause" : "Play"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Control Tabs */}
            <div className="space-y-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 bg-teal-900/20">
                  <TabsTrigger value="regions" className="data-[state=active]:bg-teal-600">
                    <Layers className="h-4 w-4 mr-1" />
                    Regions
                  </TabsTrigger>
                  <TabsTrigger value="tumors" className="data-[state=active]:bg-teal-600">
                    <Target className="h-4 w-4 mr-1" />
                    Tumors
                  </TabsTrigger>
                  <TabsTrigger value="analysis" className="data-[state=active]:bg-teal-600">
                    <Activity className="h-4 w-4 mr-1" />
                    Analysis
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="regions" className="space-y-3">
                  <h4 className="text-sm font-medium text-teal-300">Brain Regions</h4>
                  {brainRegions.map((region) => (
                    <div key={region.id} className="flex items-center justify-between p-2 rounded-lg bg-teal-900/10">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border-2 border-white/50"
                          style={{ backgroundColor: region.color }}
                        />
                        <span className="text-sm">{region.name}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleRegionVisibility(region.id)}
                        className="h-6 w-6 p-0"
                      >
                        {region.visible ? (
                          <Eye className="h-3 w-3 text-teal-400" />
                        ) : (
                          <EyeOff className="h-3 w-3 text-gray-500" />
                        )}
                      </Button>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="tumors" className="space-y-3">
                  <h4 className="text-sm font-medium text-teal-300">Detected Tumors</h4>
                  {tumorData.map((tumor) => (
                    <div key={tumor.id} className="p-3 rounded-lg bg-teal-900/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${tumor.malignancy > 0.5 ? "bg-red-500" : "bg-yellow-500"}`}
                          />
                          <span className="text-sm font-medium">{tumor.type}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleTumorVisibility(tumor.id)}
                          className="h-6 w-6 p-0"
                        >
                          {tumor.visible ? (
                            <Eye className="h-3 w-3 text-teal-400" />
                          ) : (
                            <EyeOff className="h-3 w-3 text-gray-500" />
                          )}
                        </Button>
                      </div>
                      <div className="text-xs text-gray-400 space-y-1">
                        <p>Size: {tumor.size} cm</p>
                        <p>Location: {tumor.location}</p>
                        <p>Malignancy: {(tumor.malignancy * 100).toFixed(1)}%</p>
                        <p>Growth Rate: {(tumor.growth_rate * 100).toFixed(1)}%/month</p>
                      </div>
                      <Badge variant={tumor.malignancy > 0.5 ? "destructive" : "secondary"} className="text-xs">
                        {tumor.malignancy > 0.5 ? "High Risk" : "Low Risk"}
                      </Badge>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="analysis" className="space-y-3">
                  <h4 className="text-sm font-medium text-teal-300">AI Analysis</h4>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-teal-900/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="h-4 w-4 text-teal-400" />
                        <span className="text-sm font-medium">Confidence Score</span>
                      </div>
                      <div className="text-2xl font-bold text-teal-400">89.3%</div>
                      <p className="text-xs text-gray-400">AI detection accuracy</p>
                    </div>

                    <div className="p-3 rounded-lg bg-teal-900/10">
                      <h5 className="text-sm font-medium text-teal-300 mb-2">Key Findings</h5>
                      <ul className="text-xs text-gray-300 space-y-1">
                        <li>• Primary tumor in left frontal lobe</li>
                        <li>• Secondary lesion detected</li>
                        <li>• No significant edema observed</li>
                        <li>• Vascular involvement minimal</li>
                      </ul>
                    </div>

                    <div className="p-3 rounded-lg bg-teal-900/10">
                      <h5 className="text-sm font-medium text-teal-300 mb-2">Recommendations</h5>
                      <ul className="text-xs text-gray-300 space-y-1">
                        <li>• Immediate neurosurgical consultation</li>
                        <li>• MRI with contrast recommended</li>
                        <li>• Biopsy for tissue analysis</li>
                        <li>• Monitor for neurological changes</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
