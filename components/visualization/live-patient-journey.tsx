"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Activity,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Users,
  ArrowRight,
  Heart,
  Brain,
  Stethoscope,
  Pill,
} from "lucide-react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface PatientFlowData {
  stage: string
  patients: number
  avgTime: number
  successRate: number
  trend: "up" | "down" | "stable"
  color: string
  icon: React.ReactNode
}

interface LiveMetric {
  label: string
  value: number
  change: number
  unit: string
  color: string
}

export function LivePatientJourney() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [animationFrame, setAnimationFrame] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [flowData, setFlowData] = useState<PatientFlowData[]>([
    {
      stage: "Initial Consultation",
      patients: 45,
      avgTime: 2.5,
      successRate: 98,
      trend: "up",
      color: "#3b82f6",
      icon: <Stethoscope className="h-5 w-5" />,
    },
    {
      stage: "Diagnostic Imaging",
      patients: 38,
      avgTime: 1.8,
      successRate: 94,
      trend: "stable",
      color: "#8b5cf6",
      icon: <Brain className="h-5 w-5" />,
    },
    {
      stage: "AI Analysis",
      patients: 35,
      avgTime: 0.3,
      successRate: 96,
      trend: "up",
      color: "#06b6d4",
      icon: <Activity className="h-5 w-5" />,
    },
    {
      stage: "Treatment Planning",
      patients: 32,
      avgTime: 3.2,
      successRate: 91,
      trend: "up",
      color: "#10b981",
      icon: <Heart className="h-5 w-5" />,
    },
    {
      stage: "Treatment Delivery",
      patients: 28,
      avgTime: 14.5,
      successRate: 89,
      trend: "stable",
      color: "#f59e0b",
      icon: <Pill className="h-5 w-5" />,
    },
  ])

  const [liveMetrics, setLiveMetrics] = useState<LiveMetric[]>([
    { label: "Active Patients", value: 178, change: 12, unit: "", color: "#3b82f6" },
    { label: "Avg Wait Time", value: 2.3, change: -0.5, unit: "hrs", color: "#10b981" },
    { label: "Success Rate", value: 94.2, change: 1.8, unit: "%", color: "#06b6d4" },
    { label: "AI Accuracy", value: 97.8, change: 0.3, unit: "%", color: "#8b5cf6" },
  ])

  const [hourlyFlow] = useState([
    { time: "00:00", patients: 12, completed: 8, waiting: 4 },
    { time: "04:00", patients: 8, completed: 6, waiting: 2 },
    { time: "08:00", patients: 35, completed: 28, waiting: 7 },
    { time: "12:00", patients: 42, completed: 38, waiting: 4 },
    { time: "16:00", patients: 38, completed: 35, waiting: 3 },
    { time: "20:00", patients: 25, completed: 22, waiting: 3 },
  ])

  const [treatmentOutcomes] = useState([
    { name: "Complete Recovery", value: 68, color: "#10b981" },
    { name: "Significant Improvement", value: 24, color: "#3b82f6" },
    { name: "Stable Condition", value: 6, color: "#f59e0b" },
    { name: "Requires Further Treatment", value: 2, color: "#ef4444" },
  ])

  // Simulate real-time updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())

      // Update flow data with small random changes
      setFlowData((prev) =>
        prev.map((stage) => ({
          ...stage,
          patients: Math.max(0, stage.patients + Math.floor(Math.random() * 3) - 1),
          successRate: Math.min(100, Math.max(80, stage.successRate + (Math.random() - 0.5) * 2)),
        })),
      )

      // Update live metrics
      setLiveMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          value: metric.value + (Math.random() - 0.5) * 0.1,
          change: metric.change + (Math.random() - 0.5) * 0.2,
        })),
      )
    }, 3000)

    return () => clearInterval(timer)
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

    // Draw patient flow stages
    const stages = [
      { name: "Admission", x: 80, y: 100, patients: 45 },
      { name: "Diagnosis", x: 200, y: 100, patients: 38 },
      { name: "Treatment", x: 320, y: 100, patients: 32 },
      { name: "Recovery", x: 440, y: 100, patients: 28 },
      { name: "Discharge", x: 560, y: 100, patients: 25 },
    ]

    // Draw connections
    ctx.strokeStyle = "rgba(0, 212, 255, 0.5)"
    ctx.lineWidth = 2
    for (let i = 0; i < stages.length - 1; i++) {
      ctx.beginPath()
      ctx.moveTo(stages[i].x + 30, stages[i].y)
      ctx.lineTo(stages[i + 1].x - 30, stages[i + 1].y)
      ctx.stroke()
    }

    // Draw stage nodes
    stages.forEach((stage, index) => {
      // Animated pulse effect
      const pulseSize = 5 + Math.sin((animationFrame + index * 10) * 0.1) * 3

      // Node circle
      ctx.fillStyle = "#00d4ff"
      ctx.beginPath()
      ctx.arc(stage.x, stage.y, 20 + pulseSize, 0, Math.PI * 2)
      ctx.fill()

      // Inner circle
      ctx.fillStyle = "#ffffff"
      ctx.beginPath()
      ctx.arc(stage.x, stage.y, 15, 0, Math.PI * 2)
      ctx.fill()

      // Patient count
      ctx.fillStyle = "#000000"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(stage.patients.toString(), stage.x, stage.y + 4)

      // Stage label
      ctx.fillStyle = "#ffffff"
      ctx.font = "14px Arial"
      ctx.fillText(stage.name, stage.x, stage.y + 45)
    })

    // Draw live metrics
    ctx.fillStyle = "#ffffff"
    ctx.font = "16px Arial"
    ctx.textAlign = "left"
    ctx.fillText("Live Patient Flow", 20, 30)

    ctx.font = "12px Arial"
    ctx.fillStyle = "#00d4ff"
    ctx.fillText(`Total Active: ${stages.reduce((sum, stage) => sum + stage.patients, 0)}`, 20, 50)
    ctx.fillText(`Avg. Processing Time: 4.2 hours`, 20, 70)
  }, [animationFrame])

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame((prev) => prev + 1)
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      {/* Live Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {liveMetrics.map((metric, index) => (
          <Card key={index} className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">{metric.label}</p>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-bold text-white">{metric.value.toFixed(1)}</span>
                    <span className="text-sm text-gray-400">{metric.unit}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    {metric.change > 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-400 mr-1" />
                    )}
                    <span className={`text-xs ${metric.change > 0 ? "text-green-400" : "text-red-400"}`}>
                      {metric.change > 0 ? "+" : ""}
                      {metric.change.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${metric.color}20` }}
                >
                  <Activity className="h-6 w-6" style={{ color: metric.color }} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Patient Flow Visualization */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-400" />
            Real-Time Patient Flow
            <Badge variant="secondary" className="ml-2 bg-green-500/20 text-green-300">
              Live
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {flowData.map((stage, index) => (
              <div key={stage.stage} className="relative">
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${stage.color}20` }}>
                      <div style={{ color: stage.color }}>{stage.icon}</div>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{stage.stage}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>{stage.patients} patients</span>
                        <span>Avg: {stage.avgTime}h</span>
                        <span className="flex items-center">
                          {stage.trend === "up" ? (
                            <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                          ) : stage.trend === "down" ? (
                            <TrendingDown className="h-3 w-3 text-red-400 mr-1" />
                          ) : (
                            <div className="w-3 h-3 bg-yellow-400 rounded-full mr-1" />
                          )}
                          {stage.successRate}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{stage.patients}</div>
                      <Progress
                        value={stage.successRate}
                        className="w-20 h-2"
                        style={{
                          backgroundColor: `${stage.color}20`,
                        }}
                      />
                    </div>
                    {index < flowData.length - 1 && <ArrowRight className="h-5 w-5 text-gray-400" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Patient Flow */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Clock className="h-5 w-5 mr-2 text-purple-400" />
              24-Hour Patient Flow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={hourlyFlow}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                />
                <Area type="monotone" dataKey="waiting" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Treatment Outcomes */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
              Treatment Outcomes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={treatmentOutcomes}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {treatmentOutcomes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {treatmentOutcomes.map((outcome, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: outcome.color }} />
                  <span className="text-xs text-gray-300">{outcome.name}</span>
                  <span className="text-xs text-white font-medium">{outcome.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Alerts */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-orange-400" />
            Live System Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <div>
                  <p className="text-white font-medium">High patient volume in Diagnostic Imaging</p>
                  <p className="text-gray-400 text-sm">Wait time increased to 2.8 hours</p>
                </div>
              </div>
              <Badge variant="outline" className="border-yellow-500/30 text-yellow-300">
                {currentTime.toLocaleTimeString()}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-white font-medium">AI analysis accuracy improved</p>
                  <p className="text-gray-400 text-sm">New model deployed with 97.8% accuracy</p>
                </div>
              </div>
              <Badge variant="outline" className="border-green-500/30 text-green-300">
                2 min ago
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Canvas Visualization */}
      <div className="w-full h-full relative">
        <canvas ref={canvasRef} className="w-full h-full" style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  )
}
