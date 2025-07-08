"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  Heart,
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Bell,
  Download,
  Share2,
  Zap,
} from "lucide-react"
import { LivePatientJourney } from "@/components/visualization/live-patient-journey"
// import { AdvancedNeuralAnalysis } from "@/components/visualization/advanced-neural-analysis"

interface VitalSign {
  id: string
  name: string
  value: number
  unit: string
  normal: { min: number; max: number }
  trend: "up" | "down" | "stable"
  lastUpdated: string
}

interface Alert {
  id: string
  type: "critical" | "warning" | "info"
  message: string
  timestamp: string
  acknowledged: boolean
}

export function MonitoringPage() {
  const [activeTab, setActiveTab] = useState("realtime")
  const [isLiveMonitoring, setIsLiveMonitoring] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  const [vitalSigns, setVitalSigns] = useState<VitalSign[]>([
    {
      id: "heartRate",
      name: "Heart Rate",
      value: 72,
      unit: "BPM",
      normal: { min: 60, max: 100 },
      trend: "stable",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "bloodPressure",
      name: "Blood Pressure",
      value: 120,
      unit: "mmHg",
      normal: { min: 90, max: 140 },
      trend: "stable",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "temperature",
      name: "Temperature",
      value: 98.6,
      unit: "°F",
      normal: { min: 97, max: 99.5 },
      trend: "stable",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "oxygenSat",
      name: "Oxygen Saturation",
      value: 98,
      unit: "%",
      normal: { min: 95, max: 100 },
      trend: "stable",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "respiratoryRate",
      name: "Respiratory Rate",
      value: 16,
      unit: "/min",
      normal: { min: 12, max: 20 },
      trend: "stable",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "intracranialPressure",
      name: "Intracranial Pressure",
      value: 12,
      unit: "mmHg",
      normal: { min: 5, max: 15 },
      trend: "up",
      lastUpdated: new Date().toISOString(),
    },
  ])

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "warning",
      message: "Intracranial pressure trending upward - monitor closely",
      timestamp: new Date(Date.now() - 300000).toISOString(),
      acknowledged: false,
    },
    {
      id: "2",
      type: "info",
      message: "Medication administration due in 30 minutes",
      timestamp: new Date(Date.now() - 600000).toISOString(),
      acknowledged: false,
    },
    {
      id: "3",
      type: "critical",
      message: "Patient reported severe headache - neurological assessment needed",
      timestamp: new Date(Date.now() - 900000).toISOString(),
      acknowledged: true,
    },
  ])

  // Simulate real-time updates
  useEffect(() => {
    if (!isLiveMonitoring) return

    const interval = setInterval(() => {
      setCurrentTime(new Date())

      // Simulate vital sign updates
      setVitalSigns((prev) =>
        prev.map((vital) => {
          const variation = (Math.random() - 0.5) * 2 // ±1 unit variation
          let newValue = vital.value + variation

          // Keep values within reasonable bounds
          if (vital.id === "heartRate") {
            newValue = Math.max(60, Math.min(100, newValue))
          } else if (vital.id === "bloodPressure") {
            newValue = Math.max(90, Math.min(140, newValue))
          } else if (vital.id === "temperature") {
            newValue = Math.max(97, Math.min(99.5, newValue))
          } else if (vital.id === "oxygenSat") {
            newValue = Math.max(95, Math.min(100, newValue))
          } else if (vital.id === "respiratoryRate") {
            newValue = Math.max(12, Math.min(20, newValue))
          } else if (vital.id === "intracranialPressure") {
            newValue = Math.max(5, Math.min(20, newValue))
          }

          return {
            ...vital,
            value: Math.round(newValue * 10) / 10,
            lastUpdated: new Date().toISOString(),
          }
        }),
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [isLiveMonitoring])

  const getVitalStatus = (vital: VitalSign) => {
    if (vital.value < vital.normal.min || vital.value > vital.normal.max) {
      return "critical"
    }
    return "normal"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "text-red-400"
      case "warning":
        return "text-yellow-400"
      case "normal":
        return "text-green-400"
      default:
        return "text-gray-400"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "critical":
        return "destructive"
      case "warning":
        return "secondary"
      case "normal":
        return "default"
      default:
        return "outline"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return "↗️"
      case "down":
        return "↘️"
      case "stable":
        return "➡️"
      default:
        return "➡️"
    }
  }

  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, acknowledged: true } : alert)))
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-400" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      case "info":
        return <CheckCircle className="h-4 w-4 text-blue-400" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-teal-400 flex items-center gap-3">
              <Activity className="h-8 w-8" />
              Patient Monitoring Dashboard
            </h1>
            <p className="text-gray-300 mt-2">Real-time patient monitoring and alert system</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={isLiveMonitoring ? "default" : "outline"}
              onClick={() => setIsLiveMonitoring(!isLiveMonitoring)}
              className={isLiveMonitoring ? "btn-glow-primary" : "glow-hover bg-transparent"}
            >
              <Zap className="h-4 w-4 mr-2" />
              {isLiveMonitoring ? "Live" : "Paused"}
            </Button>
            <Button variant="outline" className="glow-hover bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" className="glow-hover bg-transparent">
              <Share2 className="h-4 w-4 mr-2" />
              Share Report
            </Button>
          </div>
        </div>

        {/* Live Status Bar */}
        <Card className="card-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${isLiveMonitoring ? "bg-green-400 animate-pulse" : "bg-gray-400"}`}
                  ></div>
                  <span className="text-sm font-medium text-white">
                    {isLiveMonitoring ? "Live Monitoring Active" : "Monitoring Paused"}
                  </span>
                </div>
                <div className="text-sm text-gray-400">Last Update: {currentTime.toLocaleTimeString()}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-300">
                  Patient: <span className="text-white font-medium">Rajesh Kumar Sharma</span>
                </div>
                <Badge variant="default" className="bg-green-600">
                  Stable
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-teal-900/20">
            <TabsTrigger value="realtime" className="data-[state=active]:bg-teal-600">
              Real-time Vitals
            </TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-teal-600">
              Alerts & Notifications
            </TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-teal-600">
              Trends & Analysis
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-teal-600">
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="realtime" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Vital Signs */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="card-glow">
                  <CardHeader>
                    <CardTitle className="text-teal-400 flex items-center gap-2">
                      <Heart className="h-6 w-6" />
                      Vital Signs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {vitalSigns.map((vital) => {
                        const status = getVitalStatus(vital)
                        return (
                          <div key={vital.id} className="p-4 rounded-lg bg-teal-900/10 border border-teal-500/30">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-semibold text-white">{vital.name}</h3>
                                <p className="text-xs text-gray-400">
                                  Normal: {vital.normal.min}-{vital.normal.max} {vital.unit}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{getTrendIcon(vital.trend)}</span>
                                <Badge variant={getStatusBadge(status)}>{status}</Badge>
                              </div>
                            </div>

                            <div className="flex items-end gap-2 mb-2">
                              <span className={`text-2xl font-bold ${getStatusColor(status)}`}>{vital.value}</span>
                              <span className="text-sm text-gray-400 mb-1">{vital.unit}</span>
                            </div>

                            <div className="space-y-1">
                              <div className="flex justify-between text-xs text-gray-400">
                                <span>Range</span>
                                <span>
                                  {vital.normal.min} - {vital.normal.max}
                                </span>
                              </div>
                              <Progress
                                value={((vital.value - vital.normal.min) / (vital.normal.max - vital.normal.min)) * 100}
                                className="h-2"
                              />
                            </div>

                            <p className="text-xs text-gray-400 mt-2">
                              Updated: {new Date(vital.lastUpdated).toLocaleTimeString()}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <Card className="card-glow">
                  <CardHeader>
                    <CardTitle className="text-teal-400">Patient Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400 mb-1">Stable</div>
                      <p className="text-sm text-gray-400">Overall Condition</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Risk Level</span>
                        <Badge variant="secondary">Low</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Monitoring Duration</span>
                        <span className="text-sm text-white">4h 23m</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Last Assessment</span>
                        <span className="text-sm text-white">15 min ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-glow">
                  <CardHeader>
                    <CardTitle className="text-teal-400 flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      Neurological Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Consciousness Level</span>
                      <Badge variant="default" className="bg-green-600">
                        Alert
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Pupil Response</span>
                      <Badge variant="default" className="bg-green-600">
                        Normal
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Motor Function</span>
                      <Badge variant="default" className="bg-green-600">
                        Intact
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Speech</span>
                      <Badge variant="default" className="bg-green-600">
                        Clear
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-glow">
                  <CardHeader>
                    <CardTitle className="text-teal-400">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full glow-hover bg-transparent">
                      <Bell className="h-4 w-4 mr-2" />
                      Set Alert
                    </Button>
                    <Button variant="outline" className="w-full glow-hover bg-transparent">
                      <Clock className="h-4 w-4 mr-2" />
                      Schedule Check
                    </Button>
                    <Button variant="outline" className="w-full glow-hover bg-transparent">
                      <Activity className="h-4 w-4 mr-2" />
                      Run Assessment
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="text-teal-400 flex items-center gap-2">
                    <Bell className="h-6 w-6" />
                    Active Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {alerts
                    .filter((alert) => !alert.acknowledged)
                    .map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-4 rounded-lg border ${
                          alert.type === "critical"
                            ? "bg-red-900/20 border-red-500/30"
                            : alert.type === "warning"
                              ? "bg-yellow-900/20 border-yellow-500/30"
                              : "bg-blue-900/20 border-blue-500/30"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getAlertIcon(alert.type)}
                            <Badge
                              variant={
                                alert.type === "critical"
                                  ? "destructive"
                                  : alert.type === "warning"
                                    ? "secondary"
                                    : "default"
                              }
                            >
                              {alert.type.toUpperCase()}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="text-xs"
                          >
                            Acknowledge
                          </Button>
                        </div>
                        <p className="text-sm text-white mb-2">{alert.message}</p>
                        <p className="text-xs text-gray-400">{new Date(alert.timestamp).toLocaleString()}</p>
                      </div>
                    ))}

                  {alerts.filter((alert) => !alert.acknowledged).length === 0 && (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                      <p className="text-gray-300">No active alerts</p>
                      <p className="text-sm text-gray-400">All systems normal</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="text-teal-400">Alert History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {alerts
                    .filter((alert) => alert.acknowledged)
                    .map((alert) => (
                      <div
                        key={alert.id}
                        className="p-4 rounded-lg bg-teal-900/10 border border-teal-500/30 opacity-60"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getAlertIcon(alert.type)}
                            <Badge variant="outline">{alert.type.toUpperCase()}</Badge>
                          </div>
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        </div>
                        <p className="text-sm text-white mb-2">{alert.message}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(alert.timestamp).toLocaleString()} - Acknowledged
                        </p>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <LivePatientJourney />
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Neural Analysis</h3>
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Brain className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                    <p className="text-slate-300">Advanced neural analysis visualization</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-teal-400">Monitoring Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-teal-900/10 border border-teal-500/30">
                    <h3 className="font-semibold text-white mb-2">Daily Summary</h3>
                    <p className="text-sm text-gray-300 mb-3">
                      Comprehensive daily monitoring report with vital trends and alerts.
                    </p>
                    <Button variant="outline" className="w-full glow-hover bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>

                  <div className="p-4 rounded-lg bg-teal-900/10 border border-teal-500/30">
                    <h3 className="font-semibold text-white mb-2">Weekly Trends</h3>
                    <p className="text-sm text-gray-300 mb-3">
                      7-day trend analysis with pattern recognition and insights.
                    </p>
                    <Button variant="outline" className="w-full glow-hover bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>

                  <div className="p-4 rounded-lg bg-teal-900/10 border border-teal-500/30">
                    <h3 className="font-semibold text-white mb-2">Alert Log</h3>
                    <p className="text-sm text-gray-300 mb-3">
                      Complete alert history with response times and outcomes.
                    </p>
                    <Button variant="outline" className="w-full glow-hover bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Download CSV
                    </Button>
                  </div>

                  <div className="p-4 rounded-lg bg-teal-900/10 border border-teal-500/30">
                    <h3 className="font-semibold text-white mb-2">Vital Signs Export</h3>
                    <p className="text-sm text-gray-300 mb-3">
                      Raw vital signs data for external analysis and archiving.
                    </p>
                    <Button variant="outline" className="w-full glow-hover bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Download JSON
                    </Button>
                  </div>

                  <div className="p-4 rounded-lg bg-teal-900/10 border border-teal-500/30">
                    <h3 className="font-semibold text-white mb-2">Custom Report</h3>
                    <p className="text-sm text-gray-300 mb-3">
                      Generate custom reports with specific date ranges and metrics.
                    </p>
                    <Button variant="outline" className="w-full glow-hover bg-transparent">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Create Report
                    </Button>
                  </div>

                  <div className="p-4 rounded-lg bg-teal-900/10 border border-teal-500/30">
                    <h3 className="font-semibold text-white mb-2">Share Dashboard</h3>
                    <p className="text-sm text-gray-300 mb-3">
                      Share live dashboard access with healthcare team members.
                    </p>
                    <Button
                      variant="outline"
                      className="w-full glow-hover bg-transparent"
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: 'QuantNex Monitoring Dashboard',
                            text: 'Real-time patient monitoring dashboard',
                            url: window.location.href,
                          })
                        } else {
                          navigator.clipboard.writeText(window.location.href)
                          alert('Dashboard link copied to clipboard!')
                        }
                      }}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Access
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
