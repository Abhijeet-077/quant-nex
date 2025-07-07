"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
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
  ScatterChart,
  Scatter,
  ReferenceLine,
  BarChart,
  Bar,
} from "recharts"
import {
  TrendingUp,
  Download,
  RefreshCw,
  Calendar,
  Target,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Heart,
} from "lucide-react"

interface SurvivalData {
  timepoint: number
  overall: number
  stage1: number
  stage2: number
  stage3: number
  stage4: number
  withTreatment: number
  withoutTreatment: number
  confidenceUpper: number
  confidenceLower: number
}

interface RiskFactor {
  name: string
  hazardRatio: number
  pValue: number
  confidence95Lower: number
  confidence95Upper: number
  significance: "high" | "medium" | "low"
}

export function AdvancedSurvivalAnalysis() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("5year")
  const [selectedCohort, setSelectedCohort] = useState("all")
  const [confidenceLevel, setConfidenceLevel] = useState([95])
  const [showConfidenceInterval, setShowConfidenceInterval] = useState(true)

  // Generate realistic survival data
  const survivalData: SurvivalData[] = Array.from({ length: 61 }, (_, i) => {
    const months = i
    const baselineDecay = 0.015
    const treatmentBenefit = 0.6
    
    return {
      timepoint: months,
      overall: Math.max(0, 100 * Math.exp(-baselineDecay * months)),
      stage1: Math.max(0, 100 * Math.exp(-0.005 * months)),
      stage2: Math.max(0, 100 * Math.exp(-0.01 * months)),
      stage3: Math.max(0, 100 * Math.exp(-0.02 * months)),
      stage4: Math.max(0, 100 * Math.exp(-0.04 * months)),
      withTreatment: Math.max(0, 100 * Math.exp(-baselineDecay * treatmentBenefit * months)),
      withoutTreatment: Math.max(0, 100 * Math.exp(-baselineDecay * 1.5 * months)),
      confidenceUpper: Math.max(0, 100 * Math.exp(-baselineDecay * months) * 1.1),
      confidenceLower: Math.max(0, 100 * Math.exp(-baselineDecay * months) * 0.9),
    }
  })

  const riskFactors: RiskFactor[] = [
    {
      name: "Age > 65 years",
      hazardRatio: 2.3,
      pValue: 0.001,
      confidence95Lower: 1.8,
      confidence95Upper: 2.9,
      significance: "high",
    },
    {
      name: "Tumor size > 5cm",
      hazardRatio: 1.8,
      pValue: 0.003,
      confidence95Lower: 1.4,
      confidence95Upper: 2.3,
      significance: "high",
    },
    {
      name: "High grade (III-IV)",
      hazardRatio: 3.1,
      pValue: 0.0001,
      confidence95Lower: 2.5,
      confidence95Upper: 3.8,
      significance: "high",
    },
    {
      name: "Deep location",
      hazardRatio: 1.4,
      pValue: 0.02,
      confidence95Lower: 1.1,
      confidence95Upper: 1.8,
      significance: "medium",
    },
    {
      name: "MGMT unmethylated",
      hazardRatio: 2.7,
      pValue: 0.0005,
      confidence95Lower: 2.1,
      confidence95Upper: 3.4,
      significance: "high",
    },
  ]

  const medianSurvival = {
    overall: 14.6,
    stage1: 48.2,
    stage2: 28.4,
    stage3: 16.8,
    stage4: 8.2,
    withTreatment: 22.3,
    withoutTreatment: 9.1,
  }

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case "high": return "text-red-400"
      case "medium": return "text-yellow-400"
      case "low": return "text-green-400"
      default: return "text-gray-400"
    }
  }

  const downloadChart = () => {
    console.log("Downloading survival analysis chart...")
  }

  return (
    <div className="space-y-6">
      <Card className="card-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-teal-400 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Advanced Survival Analysis
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={downloadChart}
                className="glow-hover bg-transparent"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm" variant="outline" className="glow-hover bg-transparent">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedCohort} onValueChange={setSelectedCohort}>
            <TabsList className="grid w-full grid-cols-4 bg-teal-900/20 mb-6">
              <TabsTrigger value="all" className="data-[state=active]:bg-teal-600 text-xs">
                Overall
              </TabsTrigger>
              <TabsTrigger value="stage" className="data-[state=active]:bg-teal-600 text-xs">
                By Stage
              </TabsTrigger>
              <TabsTrigger value="treatment" className="data-[state=active]:bg-teal-600 text-xs">
                Treatment
              </TabsTrigger>
              <TabsTrigger value="risk" className="data-[state=active]:bg-teal-600 text-xs">
                Risk Factors
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-lg">Overall Survival Curve</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={400}>
                        <AreaChart data={survivalData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis
                            dataKey="timepoint"
                            stroke="#9ca3af"
                            label={{ value: "Months", position: "insideBottom", offset: -5 }}
                          />
                          <YAxis
                            stroke="#9ca3af"
                            label={{ value: "Survival (%)", angle: -90, position: "insideLeft" }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1f2937",
                              border: "1px solid #374151",
                              borderRadius: "8px",
                            }}
                          />
                          {showConfidenceInterval && (
                            <Area
                              type="monotone"
                              dataKey="confidenceUpper"
                              stackId="1"
                              stroke="none"
                              fill="#06b6d4"
                              fillOpacity={0.1}
                            />
                          )}
                          <Area
                            type="monotone"
                            dataKey="overall"
                            stroke="#06b6d4"
                            fill="#06b6d4"
                            fillOpacity={0.3}
                            strokeWidth={3}
                          />
                          {showConfidenceInterval && (
                            <Area
                              type="monotone"
                              dataKey="confidenceLower"
                              stackId="1"
                              stroke="none"
                              fill="#ffffff"
                              fillOpacity={1}
                            />
                          )}
                          <ReferenceLine y={50} stroke="#ef4444" strokeDasharray="5 5" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-sm">Median Survival</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-teal-400">
                          {medianSurvival.overall} months
                        </div>
                        <p className="text-xs text-gray-400">Overall cohort</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">1-year:</span>
                          <span className="text-white">
                            {survivalData[12]?.overall.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">3-year:</span>
                          <span className="text-white">
                            {survivalData[36]?.overall.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">5-year:</span>
                          <span className="text-white">
                            {survivalData[60]?.overall.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-sm">Chart Options</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-xs text-gray-400 mb-2 block">
                          Confidence Level: {confidenceLevel[0]}%
                        </label>
                        <Slider
                          value={confidenceLevel}
                          onValueChange={setConfidenceLevel}
                          max={99}
                          min={80}
                          step={5}
                          className="w-full"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Show CI</span>
                        <Button
                          size="sm"
                          variant={showConfidenceInterval ? "default" : "outline"}
                          onClick={() => setShowConfidenceInterval(!showConfidenceInterval)}
                          className="text-xs"
                        >
                          {showConfidenceInterval ? "ON" : "OFF"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="stage" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">Survival by Disease Stage</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={survivalData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="timepoint" stroke="#9ca3af" />
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
                        dataKey="stage1"
                        stroke="#10b981"
                        strokeWidth={2}
                        name="Stage I"
                      />
                      <Line
                        type="monotone"
                        dataKey="stage2"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        name="Stage II"
                      />
                      <Line
                        type="monotone"
                        dataKey="stage3"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        name="Stage III"
                      />
                      <Line
                        type="monotone"
                        dataKey="stage4"
                        stroke="#ef4444"
                        strokeWidth={2}
                        name="Stage IV"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="treatment" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">Treatment Impact Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={survivalData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="timepoint" stroke="#9ca3af" />
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
                        dataKey="withTreatment"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.3}
                        strokeWidth={3}
                        name="With Treatment"
                      />
                      <Area
                        type="monotone"
                        dataKey="withoutTreatment"
                        stroke="#ef4444"
                        fill="#ef4444"
                        fillOpacity={0.3}
                        strokeWidth={3}
                        name="Without Treatment"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="risk" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">Risk Factor Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {riskFactors.map((factor, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-slate-700/30 border border-slate-600/50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-medium">{factor.name}</h4>
                          <Badge
                            variant={
                              factor.significance === "high"
                                ? "destructive"
                                : factor.significance === "medium"
                                ? "secondary"
                                : "default"
                            }
                            className="text-xs"
                          >
                            {factor.significance.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Hazard Ratio:</span>
                            <div className={`font-bold ${getSignificanceColor(factor.significance)}`}>
                              {factor.hazardRatio.toFixed(1)}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400">95% CI:</span>
                            <div className="text-white">
                              {factor.confidence95Lower.toFixed(1)} - {factor.confidence95Upper.toFixed(1)}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400">P-value:</span>
                            <div className="text-white">{factor.pValue.toFixed(4)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
