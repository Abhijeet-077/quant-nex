"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Eye,
  EyeOff,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  Target,
  AlertTriangle,
  Info,
  Download,
  Share2,
} from "lucide-react"

interface BrainSlice {
  id: string
  level: string
  pathology: boolean
  highlighted: boolean
  position: { x: number; y: number }
}

interface AnatomicalRegion {
  id: string
  name: string
  color: string
  visible: boolean
  opacity: number
  description: string
}

export function AdvancedMedicalBrain3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSlice, setCurrentSlice] = useState([0])
  const [zoom, setZoom] = useState([100])
  const [opacity, setOpacity] = useState([80])
  const [showLabels, setShowLabels] = useState(true)
  const [activeTab, setActiveTab] = useState("slices")

  // Brain CT/MRI slices based on the reference image
  const [brainSlices] = useState<BrainSlice[]>([
    { id: "slice1", level: "Superior", pathology: false, highlighted: false, position: { x: 0, y: -60 } },
    { id: "slice2", level: "Mid-Superior", pathology: true, highlighted: true, position: { x: 120, y: -60 } },
    { id: "slice3", level: "Mid-Level", pathology: true, highlighted: true, position: { x: 240, y: -60 } },
    { id: "slice4", level: "Mid-Inferior", pathology: false, highlighted: false, position: { x: 0, y: 60 } },
    { id: "slice5", level: "Inferior", pathology: true, highlighted: true, position: { x: 120, y: 60 } },
    { id: "slice6", level: "Base", pathology: false, highlighted: false, position: { x: 240, y: 60 } },
  ])

  const [anatomicalRegions, setAnatomicalRegions] = useState<AnatomicalRegion[]>([
    {
      id: "frontal",
      name: "Frontal Lobe",
      color: "#00ffff",
      visible: true,
      opacity: 0.8,
      description: "Executive functions, personality, motor control",
    },
    {
      id: "parietal",
      name: "Parietal Lobe",
      color: "#0d9488",
      visible: true,
      opacity: 0.8,
      description: "Sensory processing, spatial awareness",
    },
    {
      id: "temporal",
      name: "Temporal Lobe",
      color: "#06b6d4",
      visible: true,
      opacity: 0.8,
      description: "Memory, language, auditory processing",
    },
    {
      id: "occipital",
      name: "Occipital Lobe",
      color: "#0891b2",
      visible: true,
      opacity: 0.8,
      description: "Visual processing center",
    },
    {
      id: "cerebellum",
      name: "Cerebellum",
      color: "#0e7490",
      visible: true,
      opacity: 0.8,
      description: "Balance, coordination, motor learning",
    },
    {
      id: "brainstem",
      name: "Brain Stem",
      color: "#155e75",
      visible: true,
      opacity: 0.8,
      description: "Vital functions, consciousness",
    },
    {
      id: "corpus-callosum",
      name: "Corpus Callosum",
      color: "#164e63",
      visible: true,
      opacity: 0.9,
      description: "Inter-hemispheric communication",
    },
    {
      id: "ventricles",
      name: "Ventricles",
      color: "#0c4a6e",
      visible: true,
      opacity: 0.6,
      description: "CSF circulation system",
    },
  ])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 800
    canvas.height = 600
    drawMedicalBrainVisualization(ctx)
  }, [currentSlice, zoom, opacity, anatomicalRegions, brainSlices, showLabels])

  const drawMedicalBrainVisualization = (ctx: CanvasRenderingContext2D) => {
    const centerX = ctx.canvas.width / 2
    const centerY = ctx.canvas.height / 2
    const scale = zoom[0] / 100
    const globalOpacity = opacity[0] / 100

    // Clear canvas with medical background
    ctx.fillStyle = "#0a0a0a"
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // Draw medical grid
    drawMedicalGrid(ctx)

    // Draw brain slices in 2x3 grid layout (like CT scan reference)
    drawBrainSlicesGrid(ctx, scale, globalOpacity)

    // Draw anatomical regions overlay
    drawAnatomicalRegions(ctx, centerX, centerY, scale, globalOpacity)

    // Draw pathology indicators
    drawPathologyIndicators(ctx, scale, globalOpacity)

    // Draw medical annotations
    if (showLabels) {
      drawMedicalAnnotations(ctx)
    }

    // Draw scan information
    drawScanInformation(ctx)
  }

  const drawMedicalGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = "rgba(0, 255, 255, 0.1)"
    ctx.lineWidth = 1

    // Horizontal lines
    for (let y = 0; y < ctx.canvas.height; y += 40) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(ctx.canvas.width, y)
      ctx.stroke()
    }

    // Vertical lines
    for (let x = 0; x < ctx.canvas.width; x += 40) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, ctx.canvas.height)
      ctx.stroke()
    }
  }

  const drawBrainSlicesGrid = (ctx: CanvasRenderingContext2D, scale: number, globalOpacity: number) => {
    const sliceWidth = 120 * scale
    const sliceHeight = 100 * scale
    const startX = 50
    const startY = 50

    brainSlices.forEach((slice, index) => {
      const row = Math.floor(index / 3)
      const col = index % 3
      const x = startX + col * (sliceWidth + 20)
      const y = startY + row * (sliceHeight + 20)

      // Draw brain slice outline
      ctx.strokeStyle = slice.highlighted ? "#00ffff" : "#666666"
      ctx.lineWidth = slice.highlighted ? 3 : 1
      ctx.fillStyle = `rgba(40, 40, 40, ${globalOpacity})`

      // Brain slice shape (elliptical)
      ctx.beginPath()
      ctx.ellipse(x + sliceWidth / 2, y + sliceHeight / 2, sliceWidth / 2, sliceHeight / 2, 0, 0, 2 * Math.PI)
      ctx.fill()
      ctx.stroke()

      // Draw pathology areas if present
      if (slice.pathology) {
        ctx.fillStyle = `rgba(0, 255, 255, ${0.6 * globalOpacity})`

        // Multiple pathology regions
        ctx.beginPath()
        ctx.ellipse(x + sliceWidth * 0.3, y + sliceHeight * 0.4, 15 * scale, 12 * scale, 0, 0, 2 * Math.PI)
        ctx.fill()

        ctx.beginPath()
        ctx.ellipse(x + sliceWidth * 0.7, y + sliceHeight * 0.6, 12 * scale, 10 * scale, 0, 0, 2 * Math.PI)
        ctx.fill()
      }

      // Draw slice label
      ctx.fillStyle = "#ffffff"
      ctx.font = `${12 * scale}px Inter, sans-serif`
      ctx.textAlign = "center"
      ctx.fillText(slice.level, x + sliceWidth / 2, y + sliceHeight + 20)

      // Draw slice number
      ctx.fillStyle = "#00ffff"
      ctx.font = `${10 * scale}px Inter, sans-serif`
      ctx.fillText(`Slice ${index + 1}`, x + sliceWidth / 2, y - 10)
    })
  }

  const drawAnatomicalRegions = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    scale: number,
    globalOpacity: number,
  ) => {
    // Draw 3D brain model on the right side
    const brainCenterX = centerX + 200
    const brainCenterY = centerY

    anatomicalRegions.forEach((region, index) => {
      if (!region.visible) return

      const angle = (index / anatomicalRegions.length) * 2 * Math.PI
      const radius = 80 * scale
      const x = brainCenterX + Math.cos(angle) * radius
      const y = brainCenterY + Math.sin(angle) * radius * 0.7

      ctx.save()
      ctx.globalAlpha = region.opacity * globalOpacity

      // Create gradient for 3D effect
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 30 * scale)
      gradient.addColorStop(0, region.color + "ff")
      gradient.addColorStop(0.7, region.color + "80")
      gradient.addColorStop(1, region.color + "20")

      ctx.fillStyle = gradient
      ctx.strokeStyle = region.color
      ctx.lineWidth = 2

      // Draw region
      ctx.beginPath()
      ctx.arc(x, y, 25 * scale, 0, 2 * Math.PI)
      ctx.fill()
      ctx.stroke()

      // Add pulsing effect for active regions
      if (index === currentSlice[0] % anatomicalRegions.length) {
        const pulseRadius = 25 * scale + 5 * Math.sin(Date.now() * 0.005)
        ctx.strokeStyle = region.color + "80"
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(x, y, pulseRadius, 0, 2 * Math.PI)
        ctx.stroke()
      }

      ctx.restore()
    })
  }

  const drawPathologyIndicators = (ctx: CanvasRenderingContext2D, scale: number, globalOpacity: number) => {
    // Draw tumor/pathology indicators
    const pathologyAreas = [
      { x: 200, y: 150, size: 15, type: "Primary Tumor", severity: "high" },
      { x: 350, y: 180, size: 10, type: "Edema", severity: "medium" },
      { x: 280, y: 120, size: 8, type: "Secondary", severity: "low" },
    ]

    pathologyAreas.forEach((area) => {
      const x = area.x * scale
      const y = area.y * scale
      const size = area.size * scale

      ctx.save()
      ctx.globalAlpha = globalOpacity

      // Color based on severity
      let color = "#ffff00" // yellow for low
      if (area.severity === "medium") color = "#ff8800" // orange
      if (area.severity === "high") color = "#ff0000" // red

      ctx.fillStyle = color + "80"
      ctx.strokeStyle = color
      ctx.lineWidth = 2

      // Pulsing effect for high severity
      const pulseScale = area.severity === "high" ? 1 + 0.2 * Math.sin(Date.now() * 0.008) : 1

      ctx.beginPath()
      ctx.arc(x, y, size * pulseScale, 0, 2 * Math.PI)
      ctx.fill()
      ctx.stroke()

      // Add warning indicator for high severity
      if (area.severity === "high") {
        ctx.fillStyle = "#ffffff"
        ctx.font = `${8 * scale}px Inter, sans-serif`
        ctx.textAlign = "center"
        ctx.fillText("⚠", x, y + 3)
      }

      ctx.restore()
    })
  }

  const drawMedicalAnnotations = (ctx: CanvasRenderingContext2D) => {
    const annotations = [
      { x: 50, y: 30, text: "Axial Brain Slices - T2 FLAIR", color: "#00ffff" },
      { x: 450, y: 30, text: "3D Anatomical Model", color: "#00ffff" },
      { x: 50, y: 280, text: "Pathology Detected", color: "#ff4444" },
      { x: 450, y: 280, text: "Regional Analysis", color: "#44ff44" },
    ]

    annotations.forEach((annotation) => {
      ctx.fillStyle = annotation.color
      ctx.font = "14px Inter, sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(annotation.text, annotation.x, annotation.y)
    })
  }

  const drawScanInformation = (ctx: CanvasRenderingContext2D) => {
    // Patient and scan info
    const info = [
      "Patient: Rajesh Kumar Sharma",
      "Age: 45 | Gender: Male",
      "Scan: T2 FLAIR MRI",
      "Date: 2024-01-15",
      "Slice Thickness: 5mm",
      "Field Strength: 3T",
    ]

    ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
    ctx.fillRect(10, ctx.canvas.height - 120, 200, 110)

    ctx.strokeStyle = "#00ffff"
    ctx.lineWidth = 1
    ctx.strokeRect(10, ctx.canvas.height - 120, 200, 110)

    ctx.fillStyle = "#ffffff"
    ctx.font = "11px Inter, sans-serif"
    ctx.textAlign = "left"

    info.forEach((line, index) => {
      ctx.fillText(line, 15, ctx.canvas.height - 100 + index * 15)
    })
  }

  const toggleRegionVisibility = (regionId: string) => {
    setAnatomicalRegions((prev) =>
      prev.map((region) => (region.id === regionId ? { ...region, visible: !region.visible } : region)),
    )
  }

  const resetView = () => {
    setCurrentSlice([0])
    setZoom([100])
    setOpacity([80])
    setIsPlaying(false)
  }

  return (
    <div className="w-full space-y-6">
      <Card className="card-glow">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-teal-400 flex items-center gap-2">
              <Brain className="h-6 w-6" />
              Advanced Medical Brain Analysis
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="glow-hover bg-transparent">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="glow-hover bg-transparent">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Visualization */}
            <div className="lg:col-span-3 space-y-4">
              <div className="relative bg-black rounded-lg border border-teal-500/30 overflow-hidden">
                <canvas ref={canvasRef} className="w-full h-auto" style={{ aspectRatio: "4/3" }} />

                {/* Overlay Controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-black/70 backdrop-blur-sm"
                    onClick={() => setZoom([Math.min(200, zoom[0] + 10)])}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-black/70 backdrop-blur-sm"
                    onClick={() => setZoom([Math.max(50, zoom[0] - 10)])}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="bg-black/70 backdrop-blur-sm" onClick={resetView}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>

                {/* Analysis Results Overlay */}
                <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 max-w-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                      <span className="text-red-400 font-medium">Pathology Detected</span>
                    </div>
                    <div className="text-sm text-gray-300 space-y-1">
                      <p>• Multiple hyperintense lesions</p>
                      <p>• Left frontal and parietal involvement</p>
                      <p>• Perilesional edema present</p>
                      <p>• Recommend contrast study</p>
                    </div>
                    <Badge variant="destructive" className="text-xs">
                      High Priority
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Control Panel */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-teal-300">Current Slice</label>
                  <Slider value={currentSlice} onValueChange={setCurrentSlice} max={5} step={1} className="w-full" />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>1</span>
                    <span>Slice {currentSlice[0] + 1}</span>
                    <span>6</span>
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

                <div className="space-y-2">
                  <label className="text-sm text-teal-300">Opacity</label>
                  <Slider value={opacity} onValueChange={setOpacity} min={20} max={100} step={5} className="w-full" />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>20%</span>
                    <span>{opacity[0]}%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="flex items-end gap-2">
                  <Button onClick={() => setIsPlaying(!isPlaying)} className="btn-glow-primary flex-1">
                    {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {isPlaying ? "Pause" : "Play"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowLabels(!showLabels)}
                    className="glow-hover bg-transparent"
                  >
                    {showLabels ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Control Tabs */}
            <div className="space-y-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 bg-teal-900/20">
                  <TabsTrigger value="slices" className="data-[state=active]:bg-teal-600 text-xs">
                    Slices
                  </TabsTrigger>
                  <TabsTrigger value="regions" className="data-[state=active]:bg-teal-600 text-xs">
                    Regions
                  </TabsTrigger>
                  <TabsTrigger value="analysis" className="data-[state=active]:bg-teal-600 text-xs">
                    Analysis
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="slices" className="space-y-3">
                  <h4 className="text-sm font-medium text-teal-300">Brain Slices</h4>
                  {brainSlices.map((slice, index) => (
                    <div key={slice.id} className="flex items-center justify-between p-2 rounded-lg bg-teal-900/10">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            slice.pathology ? "bg-red-500" : "bg-green-500"
                          } ${slice.highlighted ? "ring-2 ring-teal-400" : ""}`}
                        />
                        <div>
                          <span className="text-sm font-medium">{slice.level}</span>
                          <p className="text-xs text-gray-400">Slice {index + 1}</p>
                        </div>
                      </div>
                      {slice.pathology && (
                        <Badge variant="destructive" className="text-xs">
                          Abnormal
                        </Badge>
                      )}
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="regions" className="space-y-3">
                  <h4 className="text-sm font-medium text-teal-300">Anatomical Regions</h4>
                  {anatomicalRegions.map((region) => (
                    <div key={region.id} className="space-y-2">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-teal-900/10">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full border border-white/50"
                            style={{ backgroundColor: region.color }}
                          />
                          <div>
                            <span className="text-sm font-medium">{region.name}</span>
                            <p className="text-xs text-gray-400">{region.description}</p>
                          </div>
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
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="analysis" className="space-y-3">
                  <h4 className="text-sm font-medium text-teal-300">AI Analysis Results</h4>

                  <div className="p-3 rounded-lg bg-red-900/20 border border-red-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                      <span className="text-sm font-medium text-red-400">Critical Findings</span>
                    </div>
                    <ul className="text-xs text-gray-300 space-y-1">
                      <li>• Multiple T2 hyperintense lesions</li>
                      <li>• Bilateral white matter involvement</li>
                      <li>• Possible demyelinating process</li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg bg-teal-900/20 border border-teal-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="h-4 w-4 text-teal-400" />
                      <span className="text-sm font-medium text-teal-400">Recommendations</span>
                    </div>
                    <ul className="text-xs text-gray-300 space-y-1">
                      <li>• Contrast-enhanced MRI</li>
                      <li>• Neurological consultation</li>
                      <li>• CSF analysis consideration</li>
                      <li>• Follow-up in 3 months</li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg bg-teal-900/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-teal-400" />
                      <span className="text-sm font-medium text-teal-400">Confidence Score</span>
                    </div>
                    <div className="text-2xl font-bold text-teal-400">92.7%</div>
                    <p className="text-xs text-gray-400">AI diagnostic confidence</p>
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
