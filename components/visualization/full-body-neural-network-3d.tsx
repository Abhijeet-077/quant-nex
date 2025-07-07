"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, Heart, Brain, Eye, EyeOff, RotateCcw, Play, Pause, Download, Share2 } from "lucide-react"

interface NeuralSystem {
  id: string
  name: string
  color: string
  visible: boolean
  intensity: number
  description: string
}

interface OrganSystem {
  id: string
  name: string
  position: { x: number; y: number }
  size: number
  color: string
  visible: boolean
  health: "normal" | "warning" | "critical"
}

export function FullBodyNeuralNetwork3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  const [isPlaying, setIsPlaying] = useState(true)
  const [neuralActivity, setNeuralActivity] = useState([75])
  const [bloodFlow, setBloodFlow] = useState([80])
  const [systemOpacity, setSystemOpacity] = useState([85])
  const [activeTab, setActiveTab] = useState("neural")
  const [animationPhase, setAnimationPhase] = useState(0)

  const [neuralSystems, setNeuralSystems] = useState<NeuralSystem[]>([
    {
      id: "central",
      name: "Central Nervous System",
      color: "#ff6b35",
      visible: true,
      intensity: 0.9,
      description: "Brain and spinal cord",
    },
    {
      id: "peripheral",
      name: "Peripheral Nervous System",
      color: "#f7931e",
      visible: true,
      intensity: 0.7,
      description: "Nerves throughout the body",
    },
    {
      id: "autonomic",
      name: "Autonomic Nervous System",
      color: "#ffb347",
      visible: true,
      intensity: 0.6,
      description: "Involuntary functions",
    },
    {
      id: "circulatory",
      name: "Circulatory System",
      color: "#ff4757",
      visible: true,
      intensity: 0.8,
      description: "Blood vessels and circulation",
    },
  ])

  const [organSystems, setOrganSystems] = useState<OrganSystem[]>([
    {
      id: "brain",
      name: "Brain",
      position: { x: 0, y: -120 },
      size: 40,
      color: "#ff6b35",
      visible: true,
      health: "normal",
    },
    {
      id: "heart",
      name: "Heart",
      position: { x: -20, y: -20 },
      size: 25,
      color: "#ff4757",
      visible: true,
      health: "normal",
    },
    {
      id: "lungs-left",
      name: "Left Lung",
      position: { x: -40, y: -10 },
      size: 30,
      color: "#3742fa",
      visible: true,
      health: "normal",
    },
    {
      id: "lungs-right",
      name: "Right Lung",
      position: { x: 40, y: -10 },
      size: 30,
      color: "#3742fa",
      visible: true,
      health: "normal",
    },
    {
      id: "liver",
      name: "Liver",
      position: { x: 30, y: 20 },
      size: 35,
      color: "#2ed573",
      visible: true,
      health: "normal",
    },
    {
      id: "kidneys-left",
      name: "Left Kidney",
      position: { x: -25, y: 40 },
      size: 15,
      color: "#ffa502",
      visible: true,
      health: "normal",
    },
    {
      id: "kidneys-right",
      name: "Right Kidney",
      position: { x: 25, y: 40 },
      size: 15,
      color: "#ffa502",
      visible: true,
      health: "normal",
    },
    {
      id: "stomach",
      name: "Stomach",
      position: { x: -15, y: 10 },
      size: 20,
      color: "#ff6348",
      visible: true,
      health: "normal",
    },
  ])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 600
    canvas.height = 800
    drawFullBodyVisualization(ctx)
  }, [neuralActivity, bloodFlow, systemOpacity, neuralSystems, organSystems, animationPhase])

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setAnimationPhase((prev) => (prev + 0.02) % (Math.PI * 2))
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

  const drawFullBodyVisualization = (ctx: CanvasRenderingContext2D) => {
    const centerX = ctx.canvas.width / 2
    const centerY = ctx.canvas.height / 2
    const opacity = systemOpacity[0] / 100

    // Clear canvas with dark background
    ctx.fillStyle = "#0a0a0a"
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // Draw body outline (translucent blue)
    drawBodyOutline(ctx, centerX, centerY, opacity)

    // Draw neural networks
    drawNeuralNetworks(ctx, centerX, centerY, opacity)

    // Draw organ systems
    drawOrganSystems(ctx, centerX, centerY, opacity)

    // Draw circulatory system
    drawCirculatorySystem(ctx, centerX, centerY, opacity)

    // Draw neural pathways
    drawNeuralPathways(ctx, centerX, centerY, opacity)

    // Draw real-time data
    drawRealTimeData(ctx)
  }

  const drawBodyOutline = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, opacity: number) => {
    ctx.save()
    ctx.globalAlpha = opacity * 0.3

    // Body outline - human silhouette
    ctx.strokeStyle = "#00bfff"
    ctx.lineWidth = 2
    ctx.fillStyle = "rgba(0, 191, 255, 0.1)"

    // Head
    ctx.beginPath()
    ctx.arc(centerX, centerY - 120, 35, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()

    // Torso
    ctx.beginPath()
    ctx.ellipse(centerX, centerY - 20, 60, 100, 0, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()

    // Arms
    ctx.beginPath()
    ctx.ellipse(centerX - 80, centerY - 40, 15, 60, Math.PI / 6, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()

    ctx.beginPath()
    ctx.ellipse(centerX + 80, centerY - 40, 15, 60, -Math.PI / 6, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()

    // Legs
    ctx.beginPath()
    ctx.ellipse(centerX - 25, centerY + 120, 20, 80, 0, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()

    ctx.beginPath()
    ctx.ellipse(centerX + 25, centerY + 120, 20, 80, 0, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()

    ctx.restore()
  }

  const drawNeuralNetworks = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, opacity: number) => {
    const activity = neuralActivity[0] / 100

    neuralSystems.forEach((system) => {
      if (!system.visible) return

      ctx.save()
      ctx.globalAlpha = opacity * system.intensity * activity

      // Neural pathways based on system type
      if (system.id === "central") {
        // Spinal cord
        ctx.strokeStyle = system.color
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.moveTo(centerX, centerY - 80)
        ctx.lineTo(centerX, centerY + 100)
        ctx.stroke()

        // Brain connections
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2
          const startX = centerX + Math.cos(angle) * 20
          const startY = centerY - 120 + Math.sin(angle) * 15
          const endX = centerX + Math.cos(angle) * 35
          const endY = centerY - 120 + Math.sin(angle) * 25

          ctx.strokeStyle = system.color
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(startX, startY)
          ctx.lineTo(endX, endY)
          ctx.stroke()
        }
      }

      if (system.id === "peripheral") {
        // Peripheral nerves
        const nervePoints = [
          { from: { x: centerX, y: centerY - 40 }, to: { x: centerX - 70, y: centerY - 30 } },
          { from: { x: centerX, y: centerY - 40 }, to: { x: centerX + 70, y: centerY - 30 } },
          { from: { x: centerX, y: centerY + 20 }, to: { x: centerX - 60, y: centerY + 80 } },
          { from: { x: centerX, y: centerY + 20 }, to: { x: centerX + 60, y: centerY + 80 } },
          { from: { x: centerX, y: centerY + 60 }, to: { x: centerX - 20, y: centerY + 150 } },
          { from: { x: centerX, y: centerY + 60 }, to: { x: centerX + 20, y: centerY + 150 } },
        ]

        nervePoints.forEach((nerve) => {
          ctx.strokeStyle = system.color
          ctx.lineWidth = 2 + Math.sin(animationPhase) * 0.5
          ctx.beginPath()
          ctx.moveTo(nerve.from.x, nerve.from.y)
          ctx.lineTo(nerve.to.x, nerve.to.y)
          ctx.stroke()
        })
      }

      ctx.restore()
    })
  }

  const drawOrganSystems = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, opacity: number) => {
    organSystems.forEach((organ) => {
      if (!organ.visible) return

      const x = centerX + organ.position.x
      const y = centerY + organ.position.y
      const pulseScale = 1 + 0.1 * Math.sin(animationPhase * 2)

      ctx.save()
      ctx.globalAlpha = opacity

      // Health-based glow
      let glowColor = organ.color
      if (organ.health === "warning") glowColor = "#ffa502"
      if (organ.health === "critical") glowColor = "#ff3838"

      // Create glow effect
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, organ.size * pulseScale)
      gradient.addColorStop(0, glowColor + "ff")
      gradient.addColorStop(0.5, glowColor + "80")
      gradient.addColorStop(1, glowColor + "20")

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, organ.size * pulseScale, 0, 2 * Math.PI)
      ctx.fill()

      // Organ outline
      ctx.strokeStyle = glowColor
      ctx.lineWidth = 2
      ctx.stroke()

      // Special effects for heart
      if (organ.id === "heart") {
        const heartbeat = 1 + 0.3 * Math.sin(animationPhase * 4)
        ctx.strokeStyle = "#ff4757"
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(x, y, organ.size * heartbeat, 0, 2 * Math.PI)
        ctx.stroke()
      }

      ctx.restore()
    })
  }

  const drawCirculatorySystem = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, opacity: number) => {
    const flow = bloodFlow[0] / 100

    ctx.save()
    ctx.globalAlpha = opacity * flow

    // Major blood vessels
    const vessels = [
      // Aorta
      { from: { x: centerX - 20, y: centerY - 20 }, to: { x: centerX, y: centerY + 100 }, width: 4 },
      // Carotid arteries
      { from: { x: centerX, y: centerY - 60 }, to: { x: centerX - 15, y: centerY - 100 }, width: 3 },
      { from: { x: centerX, y: centerY - 60 }, to: { x: centerX + 15, y: centerY - 100 }, width: 3 },
      // Arm vessels
      { from: { x: centerX - 40, y: centerY - 40 }, to: { x: centerX - 70, y: centerY - 30 }, width: 2 },
      { from: { x: centerX + 40, y: centerY - 40 }, to: { x: centerX + 70, y: centerY - 30 }, width: 2 },
      // Leg vessels
      { from: { x: centerX - 10, y: centerY + 80 }, to: { x: centerX - 25, y: centerY + 150 }, width: 3 },
      { from: { x: centerX + 10, y: centerY + 80 }, to: { x: centerX + 25, y: centerY + 150 }, width: 3 },
    ]

    vessels.forEach((vessel, index) => {
      const flowPhase = animationPhase + index * 0.5
      const intensity = 0.5 + 0.5 * Math.sin(flowPhase)

      ctx.strokeStyle = `rgba(255, 71, 87, ${intensity})`
      ctx.lineWidth = vessel.width
      ctx.beginPath()
      ctx.moveTo(vessel.from.x, vessel.from.y)
      ctx.lineTo(vessel.to.x, vessel.to.y)
      ctx.stroke()

      // Blood flow particles
      const progress = (Math.sin(flowPhase) + 1) / 2
      const particleX = vessel.from.x + (vessel.to.x - vessel.from.x) * progress
      const particleY = vessel.from.y + (vessel.to.y - vessel.from.y) * progress

      ctx.fillStyle = "#ff4757"
      ctx.beginPath()
      ctx.arc(particleX, particleY, 2, 0, 2 * Math.PI)
      ctx.fill()
    })

    ctx.restore()
  }

  const drawNeuralPathways = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, opacity: number) => {
    ctx.save()
    ctx.globalAlpha = opacity * 0.6

    // Neural network connections
    const connections = [
      // Brain to organs
      { from: { x: centerX, y: centerY - 100 }, to: { x: centerX - 20, y: centerY - 20 } }, // to heart
      { from: { x: centerX, y: centerY - 100 }, to: { x: centerX - 40, y: centerY - 10 } }, // to lungs
      { from: { x: centerX, y: centerY - 100 }, to: { x: centerX + 30, y: centerY + 20 } }, // to liver
      // Spinal connections
      { from: { x: centerX, y: centerY - 20 }, to: { x: centerX - 25, y: centerY + 40 } }, // to kidneys
      { from: { x: centerX, y: centerY + 20 }, to: { x: centerX - 15, y: centerY + 10 } }, // to stomach
    ]

    connections.forEach((connection, index) => {
      const signalPhase = animationPhase * 2 + index * 0.8
      const signalIntensity = 0.3 + 0.7 * Math.sin(signalPhase)

      ctx.strokeStyle = `rgba(255, 179, 71, ${signalIntensity})`
      ctx.lineWidth = 1
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(connection.from.x, connection.from.y)
      ctx.lineTo(connection.to.x, connection.to.y)
      ctx.stroke()
      ctx.setLineDash([])

      // Neural signal
      const progress = (Math.sin(signalPhase) + 1) / 2
      const signalX = connection.from.x + (connection.to.x - connection.from.x) * progress
      const signalY = connection.from.y + (connection.to.y - connection.from.y) * progress

      ctx.fillStyle = "#ffb347"
      ctx.beginPath()
      ctx.arc(signalX, signalY, 3, 0, 2 * Math.PI)
      ctx.fill()
    })

    ctx.restore()
  }

  const drawRealTimeData = (ctx: CanvasRenderingContext2D) => {
    // Real-time monitoring data
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
    ctx.fillRect(10, 10, 200, 120)
    ctx.strokeStyle = "#00ffff"
    ctx.lineWidth = 1
    ctx.strokeRect(10, 10, 200, 120)

    ctx.fillStyle = "#ffffff"
    ctx.font = "12px Inter, sans-serif"
    ctx.textAlign = "left"

    const vitals = [
      "Neural Activity: 75%",
      "Heart Rate: 72 BPM",
      "Blood Flow: 80%",
      "Brain Activity: High",
      "Respiratory: Normal",
      "Temperature: 98.6°F",
    ]

    vitals.forEach((vital, index) => {
      ctx.fillText(vital, 15, 30 + index * 15)
    })

    // Activity indicators
    const indicators = [
      { x: 180, y: 25, active: Math.sin(animationPhase * 3) > 0, color: "#ff6b35" },
      { x: 180, y: 45, active: Math.sin(animationPhase * 4) > 0, color: "#ff4757" },
      { x: 180, y: 65, active: Math.sin(animationPhase * 2) > 0, color: "#3742fa" },
    ]

    indicators.forEach((indicator) => {
      ctx.fillStyle = indicator.active ? indicator.color : "#333333"
      ctx.beginPath()
      ctx.arc(indicator.x, indicator.y, 4, 0, 2 * Math.PI)
      ctx.fill()
    })
  }

  const toggleSystemVisibility = (systemId: string) => {
    setNeuralSystems((prev) =>
      prev.map((system) => (system.id === systemId ? { ...system, visible: !system.visible } : system)),
    )
  }

  const toggleOrganVisibility = (organId: string) => {
    setOrganSystems((prev) =>
      prev.map((organ) => (organ.id === organId ? { ...organ, visible: !organ.visible } : organ)),
    )
  }

  const resetView = () => {
    setNeuralActivity([75])
    setBloodFlow([80])
    setSystemOpacity([85])
    setIsPlaying(true)
  }

  return (
    <div className="w-full space-y-6">
      <Card className="card-glow">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-teal-400 flex items-center gap-2">
              <Activity className="h-6 w-6" />
              Full Body Neural Network Analysis
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Visualization */}
            <div className="lg:col-span-2 space-y-4">
              <div className="relative bg-black rounded-lg border border-teal-500/30 overflow-hidden">
                <canvas ref={canvasRef} className="w-full h-auto" style={{ aspectRatio: "3/4" }} />

                {/* Patient Info Overlay */}
                <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 max-w-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-400" />
                      <span className="text-red-400 font-medium">Live Monitoring</span>
                    </div>
                    <div className="text-sm text-gray-300 space-y-1">
                      <p>Patient: Priya Sharma</p>
                      <p>Age: 32 | Female</p>
                      <p>Status: Stable</p>
                      <p>Last Update: Real-time</p>
                    </div>
                    <Badge variant="default" className="bg-green-600 text-xs">
                      All Systems Normal
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Control Panel */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-teal-300">Neural Activity</label>
                  <Slider
                    value={neuralActivity}
                    onValueChange={setNeuralActivity}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>0%</span>
                    <span>{neuralActivity[0]}%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-teal-300">Blood Flow</label>
                  <Slider value={bloodFlow} onValueChange={setBloodFlow} max={100} step={1} className="w-full" />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>0%</span>
                    <span>{bloodFlow[0]}%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-teal-300">System Opacity</label>
                  <Slider
                    value={systemOpacity}
                    onValueChange={setSystemOpacity}
                    min={20}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>20%</span>
                    <span>{systemOpacity[0]}%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="flex items-end gap-2">
                  <Button onClick={() => setIsPlaying(!isPlaying)} className="btn-glow-primary flex-1">
                    {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {isPlaying ? "Pause" : "Play"}
                  </Button>
                  <Button variant="outline" onClick={resetView} className="glow-hover bg-transparent">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Control Tabs */}
            <div className="space-y-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 bg-teal-900/20">
                  <TabsTrigger value="neural" className="data-[state=active]:bg-teal-600 text-xs">
                    Neural
                  </TabsTrigger>
                  <TabsTrigger value="organs" className="data-[state=active]:bg-teal-600 text-xs">
                    Organs
                  </TabsTrigger>
                  <TabsTrigger value="vitals" className="data-[state=active]:bg-teal-600 text-xs">
                    Vitals
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="neural" className="space-y-3">
                  <h4 className="text-sm font-medium text-teal-300">Neural Systems</h4>
                  {neuralSystems.map((system) => (
                    <div key={system.id} className="space-y-2">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-teal-900/10">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full border border-white/50"
                            style={{ backgroundColor: system.color }}
                          />
                          <div>
                            <span className="text-sm font-medium">{system.name}</span>
                            <p className="text-xs text-gray-400">{system.description}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleSystemVisibility(system.id)}
                          className="h-6 w-6 p-0"
                        >
                          {system.visible ? (
                            <Eye className="h-3 w-3 text-teal-400" />
                          ) : (
                            <EyeOff className="h-3 w-3 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="organs" className="space-y-3">
                  <h4 className="text-sm font-medium text-teal-300">Organ Systems</h4>
                  {organSystems.map((organ) => (
                    <div key={organ.id} className="space-y-2">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-teal-900/10">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full border border-white/50 ${
                              organ.health === "critical" ? "animate-pulse" : ""
                            }`}
                            style={{ backgroundColor: organ.color }}
                          />
                          <div>
                            <span className="text-sm font-medium">{organ.name}</span>
                            <Badge
                              variant={
                                organ.health === "normal"
                                  ? "default"
                                  : organ.health === "warning"
                                    ? "secondary"
                                    : "destructive"
                              }
                              className="text-xs ml-2"
                            >
                              {organ.health}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleOrganVisibility(organ.id)}
                          className="h-6 w-6 p-0"
                        >
                          {organ.visible ? (
                            <Eye className="h-3 w-3 text-teal-400" />
                          ) : (
                            <EyeOff className="h-3 w-3 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="vitals" className="space-y-3">
                  <h4 className="text-sm font-medium text-teal-300">Vital Signs</h4>

                  <div className="p-3 rounded-lg bg-teal-900/20 border border-teal-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="h-4 w-4 text-red-400" />
                      <span className="text-sm font-medium text-red-400">Cardiovascular</span>
                    </div>
                    <div className="text-xs text-gray-300 space-y-1">
                      <p>Heart Rate: 72 BPM</p>
                      <p>Blood Pressure: 120/80</p>
                      <p>Circulation: Normal</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-teal-900/20 border border-teal-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 text-orange-400" />
                      <span className="text-sm font-medium text-orange-400">Neurological</span>
                    </div>
                    <div className="text-xs text-gray-300 space-y-1">
                      <p>Brain Activity: High</p>
                      <p>Neural Pathways: Active</p>
                      <p>Reflexes: Normal</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-teal-900/20 border border-teal-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-blue-400" />
                      <span className="text-sm font-medium text-blue-400">Respiratory</span>
                    </div>
                    <div className="text-xs text-gray-300 space-y-1">
                      <p>Breathing Rate: 16/min</p>
                      <p>Oxygen Saturation: 98%</p>
                      <p>Lung Function: Normal</p>
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
