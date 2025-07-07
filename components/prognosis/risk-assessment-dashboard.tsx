"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Treemap,
} from "recharts"
import {
  AlertTriangle,
  Shield,
  Target,
  TrendingUp,
  TrendingDown,
  Activity,
  Heart,
  Brain,
  Download,
  RefreshCw,
  Calculator,
} from "lucide-react"

interface RiskScore {
  category: string
  score: number
  maxScore: number
  weight: number
  factors: string[]
  color: string
}

interface PrognosticFactor {
  name: string
  value: string
  impact: "positive" | "negative" | "neutral"
  weight: number
  description: string
}

export function RiskAssessmentDashboard() {
  const [selectedPatient, setSelectedPatient] = useState("current")
  const [riskCalculationMethod, setRiskCalculationMethod] = useState("comprehensive")

  const riskScores: RiskScore[] = [
    {
      category: "Clinical",
      score: 7.2,
      maxScore: 10,
      weight: 0.3,
      factors: ["Age", "Performance Status", "Comorbidities"],
      color: "#ef4444",
    },
    {
      category: "Pathological",
      score: 8.5,
      maxScore: 10,
      weight: 0.25,
      factors: ["Tumor Grade", "Size", "Location"],
      color: "#f59e0b",
    },
    {
      category: "Molecular",
      score: 6.1,
      maxScore: 10,
      weight: 0.2,
      factors: ["MGMT Status", "IDH Mutation", "1p/19q Codeletion"],
      color: "#8b5cf6",
    },
    {
      category: "Treatment",
      score: 4.3,
      maxScore: 10,
      weight: 0.15,
      factors: ["Surgical Resection", "Radiation Dose", "Chemotherapy"],
      color: "#10b981",
    },
    {
      category: "Imaging",
      score: 5.8,
      maxScore: 10,
      weight: 0.1,
      factors: ["Enhancement Pattern", "Necrosis", "Edema"],
      color: "#06b6d4",
    },
  ]

  const prognosticFactors: PrognosticFactor[] = [
    {
      name: "Age",
      value: "45 years",
      impact: "positive",
      weight: 0.8,
      description: "Younger age associated with better outcomes",
    },
    {
      name: "Tumor Grade",
      value: "Grade IV (GBM)",
      impact: "negative",
      weight: 0.95,
      description: "High-grade tumor with aggressive behavior",
    },
    {
      name: "MGMT Methylation",
      value: "Methylated",
      impact: "positive",
      weight: 0.7,
      description: "Better response to alkylating agents",
    },
    {
      name: "IDH1 Status",
      value: "Wild-type",
      impact: "negative",
      weight: 0.6,
      description: "Associated with poorer prognosis",
    },
    {
      name: "Extent of Resection",
      value: "Gross Total (>95%)",
      impact: "positive",
      weight: 0.85,
      description: "Complete resection improves survival",
    },
    {
      name: "Performance Status",
      value: "KPS 90",
      impact: "positive",
      weight: 0.75,
      description: "Good functional status",
    },
  ]

  // Calculate overall risk score
  const calculateOverallRisk = () => {
    const weightedSum = riskScores.reduce((sum, score) => {
      return sum + (score.score / score.maxScore) * score.weight
    }, 0)
    return Math.round(weightedSum * 100)
  }

  const overallRiskScore = calculateOverallRisk()

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: "Very High", color: "text-red-400", bg: "bg-red-900/20" }
    if (score >= 60) return { level: "High", color: "text-orange-400", bg: "bg-orange-900/20" }
    if (score >= 40) return { level: "Moderate", color: "text-yellow-400", bg: "bg-yellow-900/20" }
    if (score >= 20) return { level: "Low", color: "text-green-400", bg: "bg-green-900/20" }
    return { level: "Very Low", color: "text-blue-400", bg: "bg-blue-900/20" }
  }

  const riskLevel = getRiskLevel(overallRiskScore)

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "positive":
        return <TrendingUp className="h-4 w-4 text-green-400" />
      case "negative":
        return <TrendingDown className="h-4 w-4 text-red-400" />
      default:
        return <Activity className="h-4 w-4 text-gray-400" />
    }
  }

  const radarData = riskScores.map(score => ({
    category: score.category,
    score: (score.score / score.maxScore) * 100,
    fullMark: 100,
  }))

  const downloadReport = () => {
    console.log("Downloading risk assessment report...")
  }

  return (
    <div className="space-y-6">
      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={`card-glow ${riskLevel.bg} border-2`}>
          <CardContent className="p-6 text-center">
            <AlertTriangle className={`h-12 w-12 mx-auto mb-4 ${riskLevel.color}`} />
            <h3 className="text-lg font-semibold text-white mb-2">Overall Risk Score</h3>
            <div className={`text-4xl font-bold ${riskLevel.color} mb-2`}>
              {overallRiskScore}%
            </div>
            <Badge variant="secondary" className={`${riskLevel.color} bg-transparent border`}>
              {riskLevel.level} Risk
            </Badge>
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardContent className="p-6 text-center">
            <Target className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Predicted Survival</h3>
            <div className="text-4xl font-bold text-blue-400 mb-2">14.6</div>
            <p className="text-sm text-gray-400">months median</p>
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardContent className="p-6 text-center">
            <Heart className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Treatment Response</h3>
            <div className="text-4xl font-bold text-purple-400 mb-2">72%</div>
            <p className="text-sm text-gray-400">probability</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Risk Analysis */}
      <Card className="card-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-teal-400 flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Comprehensive Risk Assessment
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
                Recalculate
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={riskCalculationMethod} onValueChange={setRiskCalculationMethod}>
            <TabsList className="grid w-full grid-cols-3 bg-teal-900/20 mb-6">
              <TabsTrigger value="comprehensive" className="data-[state=active]:bg-teal-600 text-xs">
                Comprehensive
              </TabsTrigger>
              <TabsTrigger value="clinical" className="data-[state=active]:bg-teal-600 text-xs">
                Clinical Only
              </TabsTrigger>
              <TabsTrigger value="molecular" className="data-[state=active]:bg-teal-600 text-xs">
                Molecular
              </TabsTrigger>
            </TabsList>

            <TabsContent value="comprehensive" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Risk Radar Chart */}
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-lg">Risk Factor Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="#374151" />
                        <PolarAngleAxis dataKey="category" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                        <PolarRadiusAxis
                          angle={90}
                          domain={[0, 100]}
                          tick={{ fill: "#9ca3af", fontSize: 10 }}
                        />
                        <Radar
                          name="Risk Score"
                          dataKey="score"
                          stroke="#ef4444"
                          fill="#ef4444"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1f2937",
                            border: "1px solid #374151",
                            borderRadius: "8px",
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Risk Categories */}
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-lg">Risk Categories</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {riskScores.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium">{category.category}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400">
                              {category.score.toFixed(1)}/{category.maxScore}
                            </span>
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                          </div>
                        </div>
                        <Progress
                          value={(category.score / category.maxScore) * 100}
                          className="h-2"
                        />
                        <div className="flex flex-wrap gap-1">
                          {category.factors.map((factor, factorIndex) => (
                            <Badge
                              key={factorIndex}
                              variant="outline"
                              className="text-xs"
                              style={{ borderColor: category.color }}
                            >
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="clinical" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">Clinical Risk Factors</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={riskScores.filter(s => s.category === "Clinical" || s.category === "Treatment")}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="category" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="score" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="molecular" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">Molecular Prognostic Factors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {prognosticFactors.map((factor, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-slate-700/30 border border-slate-600/50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getImpactIcon(factor.impact)}
                            <h4 className="text-white font-medium">{factor.name}</h4>
                          </div>
                          <Badge
                            variant={factor.impact === "positive" ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {factor.impact.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Value:</span>
                            <div className="text-white font-medium">{factor.value}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Impact Weight:</span>
                            <div className="text-white">{(factor.weight * 100).toFixed(0)}%</div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">{factor.description}</p>
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
