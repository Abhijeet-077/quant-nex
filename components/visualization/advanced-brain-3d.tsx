"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Brain,
  Activity,
  AlertTriangle,
  Target,
  Layers,
  Eye,
  EyeOff
} from "lucide-react"

interface BrainRegion {
  id: string
  name: string
  x: number
  y: number
  z: number
  size: number
  color: string
  activity: number
  health: number
  tumor?: boolean
}

interface Tumor {
  id: string
  x: number
  y: number
  z: number
  size: number
  type: "malignant" | "benign"
  growth: number
}

export function AdvancedBrain3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 })
  const [zoom, setZoom] = useState(1)
  const [isAnimating, setIsAnimating] = useState(true)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [showTumors, setShowTumors] = useState(true)
  const [showActivity, setShowActivity] = useState(true)
  const [opacity, setOpacity] = useState([80])
  const [slice, setSlice] = useState([50])

  const brainRegions: BrainRegion[] = [
    { id: "frontal", name: "Frontal Lobe", x: 0, y: 60, z: 40, size: 90, color: "#06b6d4", activity: 0.8, health: 0.9 },
    { id: "parietal", name: "Parietal Lobe", x: -40, y: 30, z: -20, size: 80, color: "#10b981", activity: 0.6, health: 0.85 },
    { id: "temporal", name: "Temporal Lobe", x: 50, y: -10, z: 10, size: 70, color: "#f59e0b", activity: 0.7, health: 0.7, tumor: true },
    { id: "occipital", name: "Occipital Lobe", x: 0, y: -50, z: -40, size: 60, color: "#8b5cf6", activity: 0.5, health: 0.95 },
    { id: "cerebellum", name: "Cerebellum", x: 0, y: -70, z: -60, size: 50, color: "#ef4444", activity: 0.9, health: 0.88 },
    { id: "brainstem", name: "Brain Stem", x: 0, y: -40, z: -70, size: 30, color: "#f97316", activity: 1.0, health: 0.92 },
  ]

  const tumors: Tumor[] = [
    { id: "tumor1", x: 45, y: -5, z: 15, size: 15, type: "malignant", growth: 0.8 },
    { id: "tumor2", x: -20, y: 25, z: -10, size: 8, type: "benign", growth: 0.2 },
  ]

  useEffect(() => {
    if (!isAnimating) return

    const interval = setInterval(() => {
      setRotation(prev => ({
        x: prev.x + 0.3,
        y: prev.y + 0.8,
        z: prev.z + 0.2,
      }))
    }, 50)

    return () => clearInterval(interval)
  }, [isAnimating])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Clear canvas with dark background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw brain outline
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.ellipse(centerX, centerY, 120 * zoom, 100 * zoom, 0, 0, Math.PI * 2)
    ctx.stroke()

    // Draw slice indicator
    if (slice[0] !== 50) {
      const sliceY = centerY + (slice[0] - 50) * 2 * zoom
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.lineWidth = 1
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(centerX - 150, sliceY)
      ctx.lineTo(centerX + 150, sliceY)
      ctx.stroke()
      ctx.setLineDash([])
    }

    // Draw brain regions
    brainRegions.forEach(region => {
      const rotatedX = region.x * Math.cos(rotation.y * Math.PI / 180) - region.z * Math.sin(rotation.y * Math.PI / 180)
      const rotatedZ = region.x * Math.sin(rotation.y * Math.PI / 180) + region.z * Math.cos(rotation.y * Math.PI / 180)
      const rotatedY = region.y * Math.cos(rotation.x * Math.PI / 180) - rotatedZ * Math.sin(rotation.x * Math.PI / 180)

      const screenX = centerX + rotatedX * zoom * 1.5
      const screenY = centerY + rotatedY * zoom * 1.5
      const size = region.size * zoom * (1 + rotatedZ * 0.001)

      // Skip if outside slice view
      if (slice[0] !== 50) {
        const sliceThreshold = Math.abs((slice[0] - 50) * 2)
        if (Math.abs(rotatedY) > sliceThreshold) return
      }

      // Draw region glow
      const gradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, size)
      gradient.addColorStop(0, region.color + Math.floor(opacity[0] * 2.55).toString(16).padStart(2, '0'))
      gradient.addColorStop(0.7, region.color + Math.floor(opacity[0] * 1.28).toString(16).padStart(2, '0'))
      gradient.addColorStop(1, region.color + '00')

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(screenX, screenY, size, 0, Math.PI * 2)
      ctx.fill()

      // Draw region core
      const coreOpacity = selectedRegion === region.id ? 'FF' : Math.floor(opacity[0] * 2.04).toString(16).padStart(2, '0')
      ctx.fillStyle = region.color + coreOpacity
      ctx.beginPath()
      ctx.arc(screenX, screenY, size * 0.7, 0, Math.PI * 2)
      ctx.fill()

      // Draw activity pulse if enabled
      if (showActivity) {
        const pulseSize = size * (0.9 + Math.sin(Date.now() * 0.005 + region.activity * 10) * 0.3)
        ctx.strokeStyle = region.color + '80'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(screenX, screenY, pulseSize, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Draw health indicator
      if (region.health < 0.8) {
        ctx.fillStyle = '#ef4444'
        ctx.beginPath()
        ctx.arc(screenX + size * 0.6, screenY - size * 0.6, 5, 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw tumor indicator
      if (region.tumor) {
        ctx.strokeStyle = '#ef4444'
        ctx.lineWidth = 3
        ctx.setLineDash([3, 3])
        ctx.beginPath()
        ctx.arc(screenX, screenY, size * 0.8, 0, Math.PI * 2)
        ctx.stroke()
        ctx.setLineDash([])
      }
    })

    // Draw tumors if enabled
    if (showTumors) {
      tumors.forEach(tumor => {
        const rotatedX = tumor.x * Math.cos(rotation.y * Math.PI / 180) - tumor.z * Math.sin(rotation.y * Math.PI / 180)
        const rotatedZ = tumor.x * Math.sin(rotation.y * Math.PI / 180) + tumor.z * Math.cos(rotation.y * Math.PI / 180)
        const rotatedY = tumor.y * Math.cos(rotation.x * Math.PI / 180) - rotatedZ * Math.sin(rotation.x * Math.PI / 180)

        const screenX = centerX + rotatedX * zoom * 1.5
        const screenY = centerY + rotatedY * zoom * 1.5
        const size = tumor.size * zoom

        // Tumor glow
        const tumorColor = tumor.type === 'malignant' ? '#ef4444' : '#f59e0b'
        const gradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, size * 1.5)
        gradient.addColorStop(0, tumorColor + '80')
        gradient.addColorStop(0.5, tumorColor + '40')
        gradient.addColorStop(1, tumorColor + '00')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(screenX, screenY, size * 1.5, 0, Math.PI * 2)
        ctx.fill()

        // Tumor core
        ctx.fillStyle = tumorColor
        ctx.beginPath()
        ctx.arc(screenX, screenY, size, 0, Math.PI * 2)
        ctx.fill()

        // Growth animation
        const growthPulse = size * (1 + Math.sin(Date.now() * 0.008 + tumor.growth * 5) * 0.2)
        ctx.strokeStyle = tumorColor + '60'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(screenX, screenY, growthPulse, 0, Math.PI * 2)
        ctx.stroke()
      })
    }

  }, [rotation, zoom, selectedRegion, showTumors, showActivity, opacity, slice])

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    brainRegions.forEach(region => {
      const rotatedX = region.x * Math.cos(rotation.y * Math.PI / 180) - region.z * Math.sin(rotation.y * Math.PI / 180)
      const rotatedY = region.y * Math.cos(rotation.x * Math.PI / 180)

      const screenX = centerX + rotatedX * zoom * 1.5
      const screenY = centerY + rotatedY * zoom * 1.5
      const distance = Math.sqrt((x - screenX) ** 2 + (y - screenY) ** 2)

      if (distance < region.size * zoom * 0.7) {
        setSelectedRegion(selectedRegion === region.id ? null : region.id)
      }
    })
  }

  const resetView = () => {
    setRotation({ x: 0, y: 0, z: 0 })
    setZoom(1)
    setOpacity([80])
    setSlice([50])
    setSelectedRegion(null)
  }

  return (
    <Card className="card-glow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-teal-400 flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Advanced 3D Brain Analysis
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-teal-500/50 text-teal-400">
              Interactive
            </Badge>
            <Badge variant="outline" className="border-purple-500/50 text-purple-400">
              AI Enhanced
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-slate-800/50 rounded-lg">
          <Button
            size="sm"
            onClick={() => setIsAnimating(!isAnimating)}
            className={isAnimating ? "btn-glow-primary" : "btn-glow-secondary"}
          >
            {isAnimating ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isAnimating ? 'Pause' : 'Play'}
          </Button>
          
          <Button size="sm" onClick={resetView} variant="outline" className="glow-hover bg-transparent">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>

          <Button
            size="sm"
            onClick={() => setShowTumors(!showTumors)}
            className={showTumors ? "btn-glow-accent" : "bg-slate-700"}
          >
            <Target className="h-4 w-4 mr-2" />
            Tumors
          </Button>

          <Button
            size="sm"
            onClick={() => setShowActivity(!showActivity)}
            className={showActivity ? "btn-glow-accent" : "bg-slate-700"}
          >
            <Activity className="h-4 w-4 mr-2" />
            Activity
          </Button>

          <div className="flex items-center gap-2">
            <ZoomOut className="h-4 w-4 text-gray-400" />
            <Button size="sm" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))} variant="outline">-</Button>
            <span className="text-sm text-white w-12 text-center">{zoom.toFixed(1)}x</span>
            <Button size="sm" onClick={() => setZoom(Math.min(2, zoom + 0.1))} variant="outline">+</Button>
            <ZoomIn className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Advanced Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-800/30 rounded-lg">
          <div className="space-y-2">
            <label className="text-sm text-gray-400 flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Opacity: {opacity[0]}%
            </label>
            <Slider
              value={opacity}
              onValueChange={setOpacity}
              max={100}
              min={10}
              step={5}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-gray-400 flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Slice View: {slice[0]}%
            </label>
            <Slider
              value={slice}
              onValueChange={setSlice}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
          </div>
        </div>

        {/* 3D Canvas */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="w-full h-auto cursor-pointer bg-slate-900/50 rounded-lg border border-slate-700/50"
            onClick={handleCanvasClick}
          />
          
          {/* Region Info Overlay */}
          {selectedRegion && (
            <div className="absolute bottom-4 left-4 right-4">
              <Card className="bg-black/90 backdrop-blur-xl border-teal-500/30">
                <CardContent className="p-3">
                  {brainRegions.map(region => {
                    if (region.id !== selectedRegion) return null
                    return (
                      <div key={region.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-white font-medium">{region.name}</h4>
                          <div className="flex items-center gap-2">
                            <Badge style={{ backgroundColor: region.color + '20', color: region.color }}>
                              {Math.round(region.activity * 100)}% Active
                            </Badge>
                            {region.tumor && (
                              <Badge className="bg-red-500/20 text-red-400">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Tumor Detected
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Health:</span>
                            <div className="w-full bg-slate-700 rounded-full h-2 mt-1">
                              <div 
                                className="h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${region.health * 100}%`,
                                  backgroundColor: region.health > 0.8 ? '#10b981' : region.health > 0.6 ? '#f59e0b' : '#ef4444'
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400">Activity:</span>
                            <div className="w-full bg-slate-700 rounded-full h-2 mt-1">
                              <div 
                                className="h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${region.activity * 100}%`,
                                  backgroundColor: region.color 
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4 bg-slate-800/30 rounded-lg">
          {brainRegions.map(region => (
            <div key={region.id} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: region.color }}
              />
              <span className="text-xs text-gray-300">{region.name}</span>
              {region.tumor && <AlertTriangle className="h-3 w-3 text-red-400" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
