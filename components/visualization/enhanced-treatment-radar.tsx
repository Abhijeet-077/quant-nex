"use client"

import { useEffect, useRef } from "react"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from "recharts"

export function EnhancedTreatmentRadar() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    const centerX = canvas.offsetWidth / 2
    const centerY = canvas.offsetHeight / 2
    const radius = Math.min(centerX, centerY) - 40

    // Clear canvas
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

    // Draw radar grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
    ctx.lineWidth = 1

    // Draw concentric circles
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, (radius * i) / 5, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Draw axes
    const axes = 6
    for (let i = 0; i < axes; i++) {
      const angle = (i * Math.PI * 2) / axes
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius)
      ctx.stroke()
    }

    // Draw data polygon
    ctx.strokeStyle = "#00d4ff"
    ctx.fillStyle = "rgba(0, 212, 255, 0.2)"
    ctx.lineWidth = 2
    ctx.beginPath()

    const dataPoints = [0.8, 0.6, 0.9, 0.7, 0.5, 0.8]
    dataPoints.forEach((value, index) => {
      const angle = (index * Math.PI * 2) / axes - Math.PI / 2
      const x = centerX + Math.cos(angle) * radius * value
      const y = centerY + Math.sin(angle) * radius * value

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Add labels
    ctx.fillStyle = "#ffffff"
    ctx.font = "12px Arial"
    const labels = ["Efficacy", "Safety", "Speed", "Cost", "Availability", "Precision"]
    labels.forEach((label, index) => {
      const angle = (index * Math.PI * 2) / axes - Math.PI / 2
      const x = centerX + Math.cos(angle) * (radius + 20)
      const y = centerY + Math.sin(angle) * (radius + 20)
      ctx.fillText(label, x - 20, y + 5)
    })
  }, [])

  return (
    <div className="w-full h-full relative">
      <canvas ref={canvasRef} className="w-full h-full" style={{ width: "100%", height: "100%" }} />
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={[]} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <PolarGrid stroke="#374151" />
          <PolarAngleAxis dataKey="metric" tick={{ fill: "#9CA3AF", fontSize: 12 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#9CA3AF", fontSize: 10 }} tickCount={5} />

          <Radar
            name="Standard Chemo"
            dataKey="Standard Chemo"
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.1}
            strokeWidth={2}
          />
          <Radar
            name="Targeted Therapy"
            dataKey="Targeted Therapy"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.1}
            strokeWidth={2}
          />
          <Radar
            name="Quantum Enhanced"
            dataKey="Quantum Enhanced"
            stroke="#00ff88"
            fill="#00ff88"
            fillOpacity={0.2}
            strokeWidth={3}
          />
          <Radar
            name="Immunotherapy"
            dataKey="Immunotherapy"
            stroke="#f59e0b"
            fill="#f59e0b"
            fillOpacity={0.1}
            strokeWidth={2}
          />

          <Legend wrapperStyle={{ color: "#9CA3AF" }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
