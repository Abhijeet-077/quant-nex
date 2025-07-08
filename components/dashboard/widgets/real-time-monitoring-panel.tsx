"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Activity,
  Heart,
  Brain,
  Activity as Pulse,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Zap,
  Shield,
  Clock,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

interface VitalSign {
  id: string
  name: string
  value: number
  unit: string
  status: "normal" | "warning" | "critical"
  trend: "up" | "down" | "stable"
  icon: React.ReactNode
  color: string
  history: { time: string; value: number }[]
}

interface PatientAlert {
  id: string
  patientName: string
  type: "critical" | "warning" | "info"
  message: string
  timestamp: string
  acknowledged: boolean
}

export function RealTimeMonitoringPanel() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [vitalSigns, setVitalSigns] = useState<VitalSign[]>([
    {
      id: "heart_rate",
      name: "Heart Rate",
      value: 72,
      unit: "bpm",
      status: "normal",
      trend: "stable",
      icon: <Heart className="h-4 w-4" />,
      color: "#ef4444",
      history: generateVitalHistory(72, 10),
    },
    {
      id: "brain_activity",
      name: "Brain Activity",
      value: 85,
      unit: "%",
      status: "normal",
      trend: "up",
      icon: <Brain className="h-4 w-4" />,
      color: "#8b5cf6",
      history: generateVitalHistory(85, 15),
    },
    {
      id: "oxygen_sat",
      name: "Oxygen Saturation",
      value: 98,
      unit: "%",
      status: "normal",
      trend: "stable",
      icon: <Activity className="h-4 w-4" />,
      color: "#10b981",
      history: generateVitalHistory(98, 5),
    },
    {
      id: "neural_response",
      name: "Neural Response",
      value: 92,
      unit: "ms",
      status: "warning",
      trend: "down",
      icon: <Zap className="h-4 w-4" />,
      color: "#f59e0b",
      history: generateVitalHistory(92, 20),
    },
  ])

  const [alerts, setAlerts] = useState<PatientAlert[]>([
    {
      id: "1",
      patientName: "Rajesh Kumar",
      type: "critical",
      message: "Abnormal brain activity detected in frontal lobe",
      timestamp: "2 min ago",
      acknowledged: false,
    },
    {
      id: "2",
      patientName: "Priya Sharma",
      type: "warning",
      message: "Treatment response below expected threshold",
      timestamp: "5 min ago",
      acknowledged: false,
    },
    {
      id: "3",
      patientName: "Amit Singh",
      type: "info",
      message: "Scheduled MRI scan completed successfully",
      timestamp: "10 min ago",
      acknowledged: true,
    },
  ])

  // Simulate real-time updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      
      // Update vital signs with realistic variations
      setVitalSigns(prev => prev.map(vital => ({
        ...vital,
        value: vital.value + (Math.random() - 0.5) * 2,
        history: [
          ...vital.history.slice(1),
          {
            time: new Date().toLocaleTimeString(),
            value: vital.value + (Math.random() - 0.5) * 2,
          },
        ],
      })))
    }, 3000)

    return () => clearInterval(timer)
  }, [])

  function generateVitalHistory(baseValue: number, variance: number) {
    const history = []
    for (let i = 0; i < 20; i++) {
      history.push({
        time: new Date(Date.now() - (20 - i) * 60000).toLocaleTimeString(),
        value: baseValue + (Math.random() - 0.5) * variance,
      })
    }
    return history
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal": return "text-green-400"
      case "warning": return "text-yellow-400"
      case "critical": return "text-red-400"
      default: return "text-gray-400"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-3 w-3 text-green-400" />
      case "down": return <TrendingDown className="h-3 w-3 text-red-400" />
      default: return <div className="h-3 w-3 rounded-full bg-gray-400" />
    }
  }

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ))
  }

  return (
    <div className="space-y-6">
      {/* Real-Time Status Header */}
      <Card className="card-glow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-teal-400 flex items-center gap-2">
              <Pulse className="h-5 w-5 animate-pulse" />
              Real-Time Patient Monitoring
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
              Live • {currentTime.toLocaleTimeString()}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {vitalSigns.map((vital) => (
              <div key={vital.id} className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div style={{ color: vital.color }}>{vital.icon}</div>
                    <span className="text-xs text-gray-400">{vital.name}</span>
                  </div>
                  {getTrendIcon(vital.trend)}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-lg font-bold ${getStatusColor(vital.status)}`}>
                    {vital.value.toFixed(0)}
                  </span>
                  <span className="text-xs text-gray-500">{vital.unit}</span>
                </div>
                <div className="mt-2 h-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={vital.history.slice(-10)}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={vital.color}
                        strokeWidth={1.5}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      <Card className="card-glow">
        <CardHeader className="pb-3">
          <CardTitle className="text-teal-400 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Active Alerts ({alerts.filter(a => !a.acknowledged).length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border transition-all ${
                  alert.acknowledged
                    ? "border-gray-600 bg-gray-800/30 opacity-60"
                    : alert.type === "critical"
                    ? "border-red-500/50 bg-red-900/20"
                    : alert.type === "warning"
                    ? "border-yellow-500/50 bg-yellow-900/20"
                    : "border-blue-500/50 bg-blue-900/20"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant={
                          alert.type === "critical"
                            ? "destructive"
                            : alert.type === "warning"
                            ? "secondary"
                            : "default"
                        }
                        className="text-xs"
                      >
                        {alert.type.toUpperCase()}
                      </Badge>
                      <span className="text-sm font-medium text-white">{alert.patientName}</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{alert.message}</p>
                    <span className="text-xs text-gray-500">{alert.timestamp}</span>
                  </div>
                  {!alert.acknowledged && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="ml-3"
                    >
                      Acknowledge
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
