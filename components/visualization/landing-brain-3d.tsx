"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface BrainRegion {
  id: string
  x: number
  y: number
  z: number
  size: number
  color: string
  label: string
  activity: number
}

interface Neuron {
  id: string
  x: number
  y: number
  z: number
  connections: string[]
  activity: number
}

export function LandingBrain3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 })
  const [isAnimating, setIsAnimating] = useState(true)
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)

  const brainRegions: BrainRegion[] = [
    { id: "frontal", x: 0, y: 50, z: 30, size: 80, color: "#06b6d4", label: "Frontal Lobe", activity: 0.8 },
    { id: "parietal", x: -30, y: 20, z: -20, size: 70, color: "#10b981", label: "Parietal Lobe", activity: 0.6 },
    { id: "temporal", x: 40, y: -10, z: 0, size: 60, color: "#f59e0b", label: "Temporal Lobe", activity: 0.7 },
    { id: "occipital", x: 0, y: -40, z: -30, size: 50, color: "#8b5cf6", label: "Occipital Lobe", activity: 0.5 },
    { id: "cerebellum", x: 0, y: -60, z: -50, size: 40, color: "#ef4444", label: "Cerebellum", activity: 0.9 },
    { id: "brainstem", x: 0, y: -30, z: -60, size: 25, color: "#f97316", label: "Brain Stem", activity: 1.0 },
  ]

  const neurons: Neuron[] = Array.from({ length: 50 }, (_, i) => ({
    id: `neuron-${i}`,
    x: (Math.random() - 0.5) * 200,
    y: (Math.random() - 0.5) * 200,
    z: (Math.random() - 0.5) * 200,
    connections: [],
    activity: Math.random(),
  }))

  useEffect(() => {
    if (!isAnimating) return

    const interval = setInterval(() => {
      setRotation(prev => ({
        x: prev.x + 0.5,
        y: prev.y + 1,
        z: prev.z + 0.3,
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

    // Clear canvas
    ctx.fillStyle = 'rgba(15, 23, 42, 0.1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw neural network background
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.1)'
    ctx.lineWidth = 1
    neurons.forEach((neuron, i) => {
      if (i % 3 === 0) {
        const targetNeuron = neurons[(i + 1) % neurons.length]
        const x1 = centerX + neuron.x * 0.8
        const y1 = centerY + neuron.y * 0.8
        const x2 = centerX + targetNeuron.x * 0.8
        const y2 = centerY + targetNeuron.y * 0.8

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }
    })

    // Draw brain regions
    brainRegions.forEach(region => {
      const rotatedX = region.x * Math.cos(rotation.y * Math.PI / 180) - region.z * Math.sin(rotation.y * Math.PI / 180)
      const rotatedZ = region.x * Math.sin(rotation.y * Math.PI / 180) + region.z * Math.cos(rotation.y * Math.PI / 180)
      const rotatedY = region.y * Math.cos(rotation.x * Math.PI / 180) - rotatedZ * Math.sin(rotation.x * Math.PI / 180)

      const screenX = centerX + rotatedX * 1.5
      const screenY = centerY + rotatedY * 1.5
      const size = region.size * (1 + rotatedZ * 0.001)

      // Draw region glow
      const gradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, size)
      gradient.addColorStop(0, region.color + '80')
      gradient.addColorStop(0.7, region.color + '40')
      gradient.addColorStop(1, region.color + '00')

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(screenX, screenY, size, 0, Math.PI * 2)
      ctx.fill()

      // Draw region core
      ctx.fillStyle = region.color + (hoveredRegion === region.id ? 'FF' : 'CC')
      ctx.beginPath()
      ctx.arc(screenX, screenY, size * 0.6, 0, Math.PI * 2)
      ctx.fill()

      // Draw activity pulse
      const pulseSize = size * (0.8 + Math.sin(Date.now() * 0.005 + region.activity * 10) * 0.2)
      ctx.strokeStyle = region.color + '60'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(screenX, screenY, pulseSize, 0, Math.PI * 2)
      ctx.stroke()
    })

    // Draw neurons
    neurons.forEach(neuron => {
      const rotatedX = neuron.x * Math.cos(rotation.y * Math.PI / 180) - neuron.z * Math.sin(rotation.y * Math.PI / 180)
      const rotatedZ = neuron.x * Math.sin(rotation.y * Math.PI / 180) + neuron.z * Math.cos(rotation.y * Math.PI / 180)
      const rotatedY = neuron.y * Math.cos(rotation.x * Math.PI / 180) - rotatedZ * Math.sin(rotation.x * Math.PI / 180)

      const screenX = centerX + rotatedX * 0.8
      const screenY = centerY + rotatedY * 0.8
      const opacity = Math.max(0.1, neuron.activity)

      ctx.fillStyle = `rgba(6, 182, 212, ${opacity})`
      ctx.beginPath()
      ctx.arc(screenX, screenY, 2, 0, Math.PI * 2)
      ctx.fill()
    })

  }, [rotation, hoveredRegion])

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Check if click is on a brain region
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    brainRegions.forEach(region => {
      const rotatedX = region.x * Math.cos(rotation.y * Math.PI / 180) - region.z * Math.sin(rotation.y * Math.PI / 180)
      const rotatedY = region.y * Math.cos(rotation.x * Math.PI / 180)

      const screenX = centerX + rotatedX * 1.5
      const screenY = centerY + rotatedY * 1.5
      const distance = Math.sqrt((x - screenX) ** 2 + (y - screenY) ** 2)

      if (distance < region.size * 0.6) {
        setHoveredRegion(hoveredRegion === region.id ? null : region.id)
      }
    })
  }

  return (
    <div className="relative w-full h-full min-h-[400px] lg:min-h-[500px]">
      <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-teal-500/30 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-400/10 to-blue-400/10"></div>
        
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-teal-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-teal-400 font-medium">AI Brain Analysis</span>
            </div>
            <Badge variant="outline" className="border-teal-500/50 text-teal-400">
              Live Simulation
            </Badge>
          </div>

          <canvas
            ref={canvasRef}
            width={500}
            height={400}
            className="w-full h-auto cursor-pointer"
            onClick={handleCanvasClick}
            onMouseEnter={() => setIsAnimating(false)}
            onMouseLeave={() => setIsAnimating(true)}
          />

          {hoveredRegion && (
            <div className="absolute bottom-4 left-4 right-4">
              <Card className="bg-black/80 backdrop-blur-xl border-teal-500/30">
                <div className="p-3">
                  {brainRegions.map(region => {
                    if (region.id !== hoveredRegion) return null
                    return (
                      <div key={region.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-white font-medium">{region.label}</h4>
                          <Badge 
                            style={{ backgroundColor: region.color + '20', color: region.color }}
                            className="border-0"
                          >
                            {Math.round(region.activity * 100)}% Active
                          </Badge>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${region.activity * 100}%`,
                              backgroundColor: region.color 
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            </div>
          )}

          <div className="absolute top-4 right-4 space-y-2">
            {brainRegions.slice(0, 3).map(region => (
              <div key={region.id} className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: region.color }}
                />
                <span className="text-xs text-gray-400">{region.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
