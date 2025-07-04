"use client"

import { useEffect, useRef, useMemo } from "react"
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts"

export function AdvancedSurvivalChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const data = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      month: i,
      baseline: 100 * Math.exp(-0.02 * i),
      withTreatment: 100 * Math.exp(-0.008 * i) * (1 - 0.1 * Math.sin(i / 15)),
      patientPrediction: 100 * Math.exp(-0.015 * i) * (1 - 0.2 * Math.sin(i / 10)),
      confidenceUpper: 100 * Math.exp(-0.01 * i) * (1 - 0.2 * Math.sin(i / 10) + 0.05),
      confidenceLower: 100 * Math.exp(-0.02 * i) * (1 - 0.2 * Math.sin(i / 10) - 0.05),
    }))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Clear canvas
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

    // Draw survival curve
    ctx.strokeStyle = "#00d4ff"
    ctx.lineWidth = 3
    ctx.beginPath()

    const points = [
      { x: 50, y: 50 },
      { x: 100, y: 60 },
      { x: 150, y: 80 },
      { x: 200, y: 120 },
      { x: 250, y: 140 },
      { x: 300, y: 180 },
    ]

    points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y)
      } else {
        ctx.lineTo(point.x, point.y)
      }
    })

    ctx.stroke()

    // Draw data points
    ctx.fillStyle = "#00d4ff"
    points.forEach((point) => {
      ctx.beginPath()
      ctx.arc(point.x, point.y, 4, 0, Math.PI * 2)
      ctx.fill()
    })

    // Add labels
    ctx.fillStyle = "#ffffff"
    ctx.font = "12px Arial"
    ctx.fillText("Survival Rate (%)", 20, 30)
    ctx.fillText("Time (months)", canvas.offsetWidth - 100, canvas.offsetHeight - 20)
  }, [])

  return (
    <div className="w-full h-full relative">
      <canvas ref={canvasRef} className="w-full h-full" style={{ width: "100%", height: "100%" }} />
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="treatmentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00ff88" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#00ff88" stopOpacity={0.2} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} axisLine={false} tickLine={false} />
          <YAxis stroke="#9CA3AF" fontSize={12} axisLine={false} tickLine={false} domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "8px",
              color: "white",
            }}
            formatter={(value: number, name: string) => [
              `${value.toFixed(1)}%`,
              name === "baseline"
                ? "Population Baseline"
                : name === "withTreatment"
                  ? "With Treatment"
                  : name === "patientPrediction"
                    ? "Patient Prediction"
                    : name,
            ]}
            labelFormatter={(label) => `Month ${label}`}
          />
          <Legend wrapperStyle={{ color: "#9CA3AF" }} />

          <Area
            type="monotone"
            dataKey="confidenceUpper"
            stackId="1"
            stroke="none"
            fill="url(#confidenceGradient)"
            fillOpacity={0.3}
          />
          <Area type="monotone" dataKey="confidenceLower" stackId="1" stroke="none" fill="transparent" />

          <Line
            type="monotone"
            dataKey="baseline"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
            name="Population Baseline"
          />
          <Line
            type="monotone"
            dataKey="withTreatment"
            stroke="#00ff88"
            strokeWidth={3}
            dot={false}
            name="With Treatment"
          />
          <Line
            type="monotone"
            dataKey="patientPrediction"
            stroke="#3b82f6"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Patient Prediction"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
