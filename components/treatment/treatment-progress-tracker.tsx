"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
} from "recharts"
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Target,
  CheckCircle,
  AlertTriangle,
  Zap,
  Heart,
  Brain,
  Download,
  RefreshCw,
} from "lucide-react"

interface TreatmentMilestone {
  id: string
  name: string
  date: string
  status: "completed" | "current" | "upcoming" | "delayed"
  description: string
  outcome?: string
  notes?: string
}

interface ProgressMetric {
  date: string
  tumorSize: number
  performanceStatus: number
  qualityOfLife: number
  sideEffectScore: number
  biomarker?: number
}

interface SideEffectEvent {
  id: string
  date: string
  effect: string
  severity: "mild" | "moderate" | "severe"
  duration: number
  treatment: string
  resolved: boolean
}

export function TreatmentProgressTracker() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("3months")
  const [selectedMetric, setSelectedMetric] = useState("tumorSize")

  const milestones: TreatmentMilestone[] = [
    {
      id: "m1",
      name: "Initial Diagnosis",
      date: "2024-01-10",
      status: "completed",
      description: "MRI confirmed GBM diagnosis",
      outcome: "Grade IV glioblastoma, 4.2cm diameter",
      notes: "Located in right frontal lobe",
    },
    {
      id: "m2",
      name: "Surgical Resection",
      date: "2024-01-22",
      status: "completed",
      description: "Maximal safe resection performed",
      outcome: "Gross total resection achieved (>95%)",
      notes: "No post-operative complications",
    },
    {
      id: "m3",
      name: "Radiation Therapy Start",
      date: "2024-02-05",
      status: "completed",
      description: "Concurrent chemoradiation initiated",
      outcome: "Treatment well tolerated",
      notes: "60 Gy in 30 fractions with TMZ",
    },
    {
      id: "m4",
      name: "Mid-Treatment Assessment",
      date: "2024-02-20",
      status: "current",
      description: "Interim MRI and clinical evaluation",
      notes: "Scheduled for today",
    },
    {
      id: "m5",
      name: "Radiation Completion",
      date: "2024-03-15",
      status: "upcoming",
      description: "Complete radiation therapy course",
    },
    {
      id: "m6",
      name: "Adjuvant Chemotherapy",
      date: "2024-03-29",
      status: "upcoming",
      description: "Begin maintenance temozolomide",
    },
  ]

  const progressData: ProgressMetric[] = [
    { date: "2024-01-10", tumorSize: 4.2, performanceStatus: 90, qualityOfLife: 75, sideEffectScore: 0 },
    { date: "2024-01-22", tumorSize: 0.3, performanceStatus: 80, qualityOfLife: 65, sideEffectScore: 15 },
    { date: "2024-02-05", tumorSize: 0.3, performanceStatus: 85, qualityOfLife: 70, sideEffectScore: 10 },
    { date: "2024-02-12", tumorSize: 0.2, performanceStatus: 80, qualityOfLife: 68, sideEffectScore: 25 },
    { date: "2024-02-19", tumorSize: 0.1, performanceStatus: 75, qualityOfLife: 65, sideEffectScore: 30 },
    { date: "2024-02-26", tumorSize: 0.1, performanceStatus: 78, qualityOfLife: 68, sideEffectScore: 28 },
  ]

  const sideEffects: SideEffectEvent[] = [
    {
      id: "se1",
      date: "2024-02-08",
      effect: "Fatigue",
      severity: "mild",
      duration: 7,
      treatment: "Rest and nutrition counseling",
      resolved: true,
    },
    {
      id: "se2",
      date: "2024-02-12",
      effect: "Nausea",
      severity: "moderate",
      duration: 3,
      treatment: "Ondansetron 8mg",
      resolved: true,
    },
    {
      id: "se3",
      date: "2024-02-18",
      effect: "Skin irritation",
      severity: "mild",
      duration: 5,
      treatment: "Topical moisturizer",
      resolved: false,
    },
  ]

  const getMilestoneIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-5 w-5 text-green-400" />
      case "current": return <Activity className="h-5 w-5 text-blue-400 animate-pulse" />
      case "upcoming": return <Clock className="h-5 w-5 text-yellow-400" />
      case "delayed": return <AlertTriangle className="h-5 w-5 text-red-400" />
      default: return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getMilestoneColor = (status: string) => {
    switch (status) {
      case "completed": return "border-green-500 bg-green-900/20"
      case "current": return "border-blue-500 bg-blue-900/20"
      case "upcoming": return "border-yellow-500 bg-yellow-900/20"
      case "delayed": return "border-red-500 bg-red-900/20"
      default: return "border-gray-500 bg-gray-900/20"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "mild": return "text-green-400"
      case "moderate": return "text-yellow-400"
      case "severe": return "text-red-400"
      default: return "text-gray-400"
    }
  }

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case "tumorSize": return "#ef4444"
      case "performanceStatus": return "#10b981"
      case "qualityOfLife": return "#3b82f6"
      case "sideEffectScore": return "#f59e0b"
      default: return "#6b7280"
    }
  }

  const downloadReport = () => {
    console.log("Downloading treatment progress report...")
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-glow">
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-400">
              {milestones.filter(m => m.status === "completed").length}
            </div>
            <p className="text-sm text-gray-400">Completed Milestones</p>
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardContent className="p-4 text-center">
            <TrendingDown className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-400">
              {progressData[progressData.length - 1]?.tumorSize.toFixed(1)} cm
            </div>
            <p className="text-sm text-gray-400">Current Tumor Size</p>
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardContent className="p-4 text-center">
            <Heart className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-400">
              {progressData[progressData.length - 1]?.qualityOfLife}%
            </div>
            <p className="text-sm text-gray-400">Quality of Life</p>
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-400">
              {sideEffects.filter(se => !se.resolved).length}
            </div>
            <p className="text-sm text-gray-400">Active Side Effects</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Progress Tracking */}
      <Card className="card-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-teal-400 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Treatment Progress Tracker
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={downloadReport}
                className="glow-hover bg-transparent"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button size="sm" variant="outline" className="glow-hover bg-transparent">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <TabsList className="grid w-full grid-cols-4 bg-teal-900/20 mb-6">
              <TabsTrigger value="timeline" className="data-[state=active]:bg-teal-600 text-xs">
                Timeline
              </TabsTrigger>
              <TabsTrigger value="metrics" className="data-[state=active]:bg-teal-600 text-xs">
                Progress Metrics
              </TabsTrigger>
              <TabsTrigger value="sideeffects" className="data-[state=active]:bg-teal-600 text-xs">
                Side Effects
              </TabsTrigger>
              <TabsTrigger value="outcomes" className="data-[state=active]:bg-teal-600 text-xs">
                Outcomes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="space-y-6">
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-teal-500/30" />
                
                <div className="space-y-6">
                  {milestones.map((milestone, index) => (
                    <div key={milestone.id} className="relative flex items-start gap-4">
                      {/* Timeline Node */}
                      <div className="relative z-10 flex-shrink-0">
                        {getMilestoneIcon(milestone.status)}
                      </div>
                      
                      {/* Milestone Content */}
                      <Card className={`flex-1 ${getMilestoneColor(milestone.status)}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="text-white font-medium">{milestone.name}</h4>
                              <p className="text-sm text-gray-400">{milestone.date}</p>
                            </div>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                milestone.status === "completed"
                                  ? "border-green-500 text-green-400"
                                  : milestone.status === "current"
                                  ? "border-blue-500 text-blue-400"
                                  : milestone.status === "upcoming"
                                  ? "border-yellow-500 text-yellow-400"
                                  : "border-red-500 text-red-400"
                              }`}
                            >
                              {milestone.status.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-300 mb-2">{milestone.description}</p>
                          {milestone.outcome && (
                            <div className="text-sm text-white bg-slate-700/50 p-2 rounded">
                              <strong>Outcome:</strong> {milestone.outcome}
                            </div>
                          )}
                          {milestone.notes && (
                            <p className="text-xs text-gray-400 mt-2">
                              <strong>Notes:</strong> {milestone.notes}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-lg">Progress Metrics Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={progressData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="date" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1f2937",
                              border: "1px solid #374151",
                              borderRadius: "8px",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="tumorSize"
                            stroke="#ef4444"
                            strokeWidth={2}
                            name="Tumor Size (cm)"
                          />
                          <Line
                            type="monotone"
                            dataKey="performanceStatus"
                            stroke="#10b981"
                            strokeWidth={2}
                            name="Performance Status"
                          />
                          <Line
                            type="monotone"
                            dataKey="qualityOfLife"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            name="Quality of Life"
                          />
                          <Line
                            type="monotone"
                            dataKey="sideEffectScore"
                            stroke="#f59e0b"
                            strokeWidth={2}
                            name="Side Effect Score"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-sm">Key Improvements</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-gray-300">
                          Tumor size reduced by 97.6%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-red-400" />
                        <span className="text-sm text-gray-300">
                          Side effects increased during radiation
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-400" />
                        <span className="text-sm text-gray-300">
                          Performance status stabilizing
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-sm">Current Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Tumor Response:</span>
                          <span className="text-green-400">Excellent</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Treatment Tolerance:</span>
                          <span className="text-yellow-400">Good</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Overall Progress:</span>
                          <span className="text-blue-400">On Track</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sideeffects" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">Side Effect Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sideEffects.map((effect) => (
                      <div
                        key={effect.id}
                        className={`p-4 rounded-lg border ${
                          effect.resolved
                            ? "border-gray-600 bg-gray-800/30 opacity-70"
                            : "border-yellow-500/50 bg-yellow-900/20"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-white font-medium">{effect.effect}</h4>
                            <p className="text-sm text-gray-400">{effect.date}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={`text-xs ${getSeverityColor(effect.severity)}`}
                            >
                              {effect.severity.toUpperCase()}
                            </Badge>
                            {effect.resolved ? (
                              <CheckCircle className="h-4 w-4 text-green-400" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-yellow-400" />
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Duration:</span>
                            <div className="text-white">{effect.duration} days</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Treatment:</span>
                            <div className="text-white">{effect.treatment}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="outcomes" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-lg">Treatment Response</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-400 mb-2">Excellent</div>
                        <p className="text-sm text-gray-400">Overall Response</p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Tumor Reduction:</span>
                          <span className="text-green-400 font-medium">97.6%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Symptom Improvement:</span>
                          <span className="text-blue-400 font-medium">Moderate</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Functional Status:</span>
                          <span className="text-yellow-400 font-medium">Stable</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-lg">Next Steps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-400" />
                        <span className="text-sm text-gray-300">
                          Complete radiation therapy (2 weeks remaining)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-gray-300">
                          Begin adjuvant chemotherapy in March
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-purple-400" />
                        <span className="text-sm text-gray-300">
                          Follow-up MRI in 4 weeks
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
