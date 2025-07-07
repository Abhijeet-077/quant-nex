"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Zap } from "lucide-react"

interface Cell {
  id: string
  x: number
  y: number
  z: number
  size: number
  type: "healthy" | "cancerous" | "dividing"
  color: string
  opacity: number
  rotationSpeed: number
}

interface Organelle {
  id: string
  x: number
  y: number
  size: number
  type: "nucleus" | "mitochondria" | "ribosome" | "endoplasmic"
  color: string
}

export function CellStructure3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [isPlaying, setIsPlaying] = useState(true)
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [showCancerCells, setShowCancerCells] = useState(true)

  const [cells, setCells] = useState<Cell[]>([])
  const [organelles, setOrganelles] = useState<Organelle[]>([])

  useEffect(() => {
    // Initialize cells
    const newCells: Cell[] = []
    for (let i = 0; i < 15; i++) {
      const angle = (i / 15) * Math.PI * 2
      const radius = 80 + Math.random() * 40
      newCells.push({
        id: `cell-${i}`,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z: (Math.random() - 0.5) * 60,
        size: 20 + Math.random() * 15,
        type: i < 3 ? "cancerous" : i < 6 ? "dividing" : "healthy",
        color: i < 3 ? "#ff4444" : i < 6 ? "#ffaa44" : "#44ff88",
        opacity: 0.7 + Math.random() * 0.3,
        rotationSpeed: 0.5 + Math.random() * 1.5,
      })
    }
    setCells(newCells)

    // Initialize organelles for main cell
    const newOrganelles: Organelle[] = [
      { id: "nucleus", x: 0, y: 0, size: 25, type: "nucleus", color: "#6666ff" },
      { id: "mito1", x: -15, y: -10, size: 8, type: "mitochondria", color: "#ff6666" },
      { id: "mito2", x: 20, y: 15, size: 8, type: "mitochondria", color: "#ff6666" },
      { id: "mito3", x: -10, y: 20, size: 8, type: "mitochondria", color: "#ff6666" },
      { id: "ribo1", x: -25, y: 5, size: 3, type: "ribosome", color: "#66ff66" },
      { id: "ribo2", x: 15, y: -20, size: 3, type: "ribosome", color: "#66ff66" },
      { id: "ribo3", x: 5, y: 25, size: 3, type: "ribosome", color: "#66ff66" },
      { id: "er1", x: -20, y: -15, size: 12, type: "endoplasmic", color: "#ffff66" },
      { id: "er2", x: 25, y: 10, size: 12, type: "endoplasmic", color: "#ffff66" },
    ]
    setOrganelles(newOrganelles)
  }, [])

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setRotation((prev) => prev + 0.5)
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

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 600
    canvas.height = 400
    drawCellStructure(ctx)
  }, [rotation, zoom, cells, organelles, showCancerCells])

  const drawCellStructure = (ctx: CanvasRenderingContext2D) => {
    const centerX = ctx.canvas.width / 2
    const centerY = ctx.canvas.height / 2

    // Clear canvas with dark background
    ctx.fillStyle = "#0a0a0a"
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // Draw tissue background
    drawTissueBackground(ctx)

    // Draw main cell membrane
    drawMainCell(ctx, centerX, centerY)

    // Draw organelles inside main cell
    drawOrganelles(ctx, centerX, centerY)

    // Draw surrounding cells
    drawSurroundingCells(ctx, centerX, centerY)

    // Draw cell connections
    drawCellConnections(ctx, centerX, centerY)

    // Draw DNA strands
    drawDNAStrands(ctx, centerX, centerY)
  }

  const drawTissueBackground = (ctx: CanvasRenderingContext2D) => {
    // Create tissue-like background pattern
    ctx.strokeStyle = "rgba(0, 255, 255, 0.1)"
    ctx.lineWidth = 1

    for (let i = 0; i < 20; i++) {
      const x = (i / 20) * ctx.canvas.width
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, ctx.canvas.height)
      ctx.stroke()
    }

    for (let i = 0; i < 15; i++) {
      const y = (i / 15) * ctx.canvas.height
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(ctx.canvas.width, y)
      ctx.stroke()
    }
  }

  const drawMainCell = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    const mainCellRadius = 60 * zoom

    // Cell membrane with gradient
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, mainCellRadius)
    gradient.addColorStop(0, "rgba(0, 255, 255, 0.1)")
    gradient.addColorStop(0.8, "rgba(0, 255, 255, 0.3)")
    gradient.addColorStop(1, "rgba(0, 255, 255, 0.6)")

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(centerX, centerY, mainCellRadius, 0, Math.PI * 2)
    ctx.fill()

    // Cell membrane border
    ctx.strokeStyle = "#00ffff"
    ctx.lineWidth = 2
    ctx.stroke()

    // Membrane proteins (small dots on membrane)
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + rotation * 0.01
      const x = centerX + Math.cos(angle) * mainCellRadius
      const y = centerY + Math.sin(angle) * mainCellRadius

      ctx.fillStyle = "#ffff00"
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const drawOrganelles = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    organelles.forEach((organelle) => {
      const rotatedX = centerX + organelle.x * Math.cos(rotation * 0.01) - organelle.y * Math.sin(rotation * 0.01)
      const rotatedY = centerY + organelle.x * Math.sin(rotation * 0.01) + organelle.y * Math.cos(rotation * 0.01)

      ctx.save()
      ctx.globalAlpha = 0.9

      switch (organelle.type) {
        case "nucleus":
          // Nucleus with DNA
          const nucleusGradient = ctx.createRadialGradient(rotatedX, rotatedY, 0, rotatedX, rotatedY, organelle.size)
          nucleusGradient.addColorStop(0, organelle.color + "ff")
          nucleusGradient.addColorStop(1, organelle.color + "40")

          ctx.fillStyle = nucleusGradient
          ctx.beginPath()
          ctx.arc(rotatedX, rotatedY, organelle.size * zoom, 0, Math.PI * 2)
          ctx.fill()

          ctx.strokeStyle = organelle.color
          ctx.lineWidth = 2
          ctx.stroke()

          // Nuclear pores
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2
            const poreX = rotatedX + Math.cos(angle) * organelle.size * zoom * 0.8
            const poreY = rotatedY + Math.sin(angle) * organelle.size * zoom * 0.8

            ctx.fillStyle = "#ffffff"
            ctx.beginPath()
            ctx.arc(poreX, poreY, 2, 0, Math.PI * 2)
            ctx.fill()
          }
          break

        case "mitochondria":
          // Mitochondria with cristae
          ctx.fillStyle = organelle.color + "cc"
          ctx.beginPath()
          ctx.ellipse(
            rotatedX,
            rotatedY,
            organelle.size * zoom,
            organelle.size * zoom * 0.6,
            rotation * 0.02,
            0,
            Math.PI * 2,
          )
          ctx.fill()

          ctx.strokeStyle = organelle.color
          ctx.lineWidth = 1
          ctx.stroke()

          // Cristae (internal folds)
          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 1
          for (let i = 0; i < 3; i++) {
            ctx.beginPath()
            ctx.moveTo(
              rotatedX - organelle.size * zoom * 0.5,
              rotatedY - organelle.size * zoom * 0.3 + i * organelle.size * zoom * 0.3,
            )
            ctx.lineTo(
              rotatedX + organelle.size * zoom * 0.5,
              rotatedY - organelle.size * zoom * 0.3 + i * organelle.size * zoom * 0.3,
            )
            ctx.stroke()
          }
          break

        case "ribosome":
          // Ribosomes as small dots
          ctx.fillStyle = organelle.color
          ctx.beginPath()
          ctx.arc(rotatedX, rotatedY, organelle.size * zoom, 0, Math.PI * 2)
          ctx.fill()

          // Small highlight
          ctx.fillStyle = "#ffffff"
          ctx.beginPath()
          ctx.arc(rotatedX - 1, rotatedY - 1, organelle.size * zoom * 0.3, 0, Math.PI * 2)
          ctx.fill()
          break

        case "endoplasmic":
          // Endoplasmic reticulum as interconnected tubes
          ctx.strokeStyle = organelle.color
          ctx.lineWidth = organelle.size * zoom * 0.3
          ctx.lineCap = "round"

          ctx.beginPath()
          ctx.moveTo(rotatedX - organelle.size * zoom, rotatedY)
          ctx.quadraticCurveTo(
            rotatedX,
            rotatedY - organelle.size * zoom * 0.5,
            rotatedX + organelle.size * zoom,
            rotatedY,
          )
          ctx.stroke()

          ctx.beginPath()
          ctx.moveTo(rotatedX - organelle.size * zoom * 0.5, rotatedY + organelle.size * zoom * 0.5)
          ctx.quadraticCurveTo(
            rotatedX,
            rotatedY,
            rotatedX + organelle.size * zoom * 0.5,
            rotatedY + organelle.size * zoom * 0.5,
          )
          ctx.stroke()
          break
      }

      ctx.restore()
    })
  }

  const drawSurroundingCells = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    cells.forEach((cell) => {
      if (!showCancerCells && cell.type === "cancerous") return

      const rotatedX = centerX + cell.x * Math.cos(rotation * 0.005) - cell.y * Math.sin(rotation * 0.005)
      const rotatedY = centerY + cell.x * Math.sin(rotation * 0.005) + cell.y * Math.cos(rotation * 0.005)
      const cellRadius = cell.size * zoom

      ctx.save()
      ctx.globalAlpha = cell.opacity

      // Cell gradient based on type
      const gradient = ctx.createRadialGradient(rotatedX, rotatedY, 0, rotatedX, rotatedY, cellRadius)

      if (cell.type === "cancerous") {
        gradient.addColorStop(0, "rgba(255, 68, 68, 0.8)")
        gradient.addColorStop(1, "rgba(255, 68, 68, 0.2)")
      } else if (cell.type === "dividing") {
        gradient.addColorStop(0, "rgba(255, 170, 68, 0.8)")
        gradient.addColorStop(1, "rgba(255, 170, 68, 0.2)")
      } else {
        gradient.addColorStop(0, "rgba(68, 255, 136, 0.8)")
        gradient.addColorStop(1, "rgba(68, 255, 136, 0.2)")
      }

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(rotatedX, rotatedY, cellRadius, 0, Math.PI * 2)
      ctx.fill()

      // Cell border
      ctx.strokeStyle = cell.color
      ctx.lineWidth = cell.type === "cancerous" ? 3 : 1
      ctx.stroke()

      // Special effects for different cell types
      if (cell.type === "dividing") {
        // Show cell division
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(rotatedX - cellRadius * 0.8, rotatedY)
        ctx.lineTo(rotatedX + cellRadius * 0.8, rotatedY)
        ctx.stroke()
      } else if (cell.type === "cancerous") {
        // Show irregular shape for cancer cells
        ctx.strokeStyle = "#ff0000"
        ctx.lineWidth = 1
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2
          const spikeLength = cellRadius * (1.2 + Math.sin(rotation * 0.1 + i) * 0.3)
          const spikeX = rotatedX + Math.cos(angle) * spikeLength
          const spikeY = rotatedY + Math.sin(angle) * spikeLength

          ctx.beginPath()
          ctx.moveTo(rotatedX, rotatedY)
          ctx.lineTo(spikeX, spikeY)
          ctx.stroke()
        }
      }

      ctx.restore()
    })
  }

  const drawCellConnections = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    // Draw connections between nearby cells
    ctx.strokeStyle = "rgba(0, 255, 255, 0.3)"
    ctx.lineWidth = 1

    for (let i = 0; i < cells.length; i++) {
      for (let j = i + 1; j < cells.length; j++) {
        const cell1 = cells[i]
        const cell2 = cells[j]

        const distance = Math.sqrt((cell1.x - cell2.x) ** 2 + (cell1.y - cell2.y) ** 2)

        if (distance < 100) {
          const x1 = centerX + cell1.x * Math.cos(rotation * 0.005) - cell1.y * Math.sin(rotation * 0.005)
          const y1 = centerY + cell1.x * Math.sin(rotation * 0.005) + cell1.y * Math.cos(rotation * 0.005)
          const x2 = centerX + cell2.x * Math.cos(rotation * 0.005) - cell2.y * Math.sin(rotation * 0.005)
          const y2 = centerY + cell2.x * Math.sin(rotation * 0.005) + cell2.y * Math.cos(rotation * 0.005)

          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()
        }
      }
    }
  }

  const drawDNAStrands = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    // Draw DNA double helix in the nucleus
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 2

    for (let i = 0; i < 50; i++) {
      const t = i / 50
      const angle1 = t * Math.PI * 4 + rotation * 0.02
      const angle2 = angle1 + Math.PI

      const radius = 15
      const height = t * 30 - 15

      const x1 = centerX + Math.cos(angle1) * radius
      const y1 = centerY + height
      const x2 = centerX + Math.cos(angle2) * radius
      const y2 = centerY + height

      if (i > 0) {
        const prevT = (i - 1) / 50
        const prevAngle1 = prevT * Math.PI * 4 + rotation * 0.02
        const prevAngle2 = prevAngle1 + Math.PI
        const prevHeight = prevT * 30 - 15

        const prevX1 = centerX + Math.cos(prevAngle1) * radius
        const prevY1 = centerY + prevHeight
        const prevX2 = centerX + Math.cos(prevAngle2) * radius
        const prevY2 = centerY + prevHeight

        // Draw DNA strands
        ctx.beginPath()
        ctx.moveTo(prevX1, prevY1)
        ctx.lineTo(x1, y1)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(prevX2, prevY2)
        ctx.lineTo(x2, y2)
        ctx.stroke()

        // Draw base pairs
        if (i % 3 === 0) {
          ctx.strokeStyle = "#ffff00"
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()
          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 2
        }
      }
    }
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const resetView = () => {
    setRotation(0)
    setZoom(1)
    setIsPlaying(true)
  }

  return (
    <Card className="w-full bg-black/20 backdrop-blur-sm border-teal-500/30">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-teal-400">Cellular Structure Analysis</h3>
              <p className="text-sm text-gray-400">3D visualization of tissue and cellular components</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-teal-600/20 text-teal-300">
                Live Simulation
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCancerCells(!showCancerCells)}
                className="bg-transparent border-red-500/50 text-red-300 hover:bg-red-500/10"
              >
                <Zap className="h-4 w-4 mr-1" />
                {showCancerCells ? "Hide" : "Show"} Cancer Cells
              </Button>
            </div>
          </div>

          {/* 3D Visualization */}
          <div className="relative bg-black rounded-lg border border-teal-500/30 overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-auto" style={{ aspectRatio: "3/2" }} />

            {/* Controls Overlay */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={togglePlayPause}
                className="bg-black/70 backdrop-blur-sm border-teal-500/50"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={resetView}
                className="bg-black/70 backdrop-blur-sm border-teal-500/50"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            {/* Info Overlay */}
            <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 max-w-xs">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="text-green-300">Healthy Cells</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                  <span className="text-orange-300">Dividing Cells</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <span className="text-red-300">Cancer Cells</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                  <span className="text-blue-300">Cell Nucleus</span>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Results */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-teal-900/20 rounded-lg p-4 border border-teal-500/30">
              <div className="text-sm text-teal-300 mb-1">Cell Density</div>
              <div className="text-2xl font-bold text-white">15 cells/μm²</div>
              <div className="text-xs text-gray-400">Normal range</div>
            </div>
            <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
              <div className="text-sm text-red-300 mb-1">Abnormal Cells</div>
              <div className="text-2xl font-bold text-white">3 detected</div>
              <div className="text-xs text-gray-400">Requires attention</div>
            </div>
            <div className="bg-orange-900/20 rounded-lg p-4 border border-orange-500/30">
              <div className="text-sm text-orange-300 mb-1">Mitotic Activity</div>
              <div className="text-2xl font-bold text-white">12%</div>
              <div className="text-xs text-gray-400">Elevated</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
