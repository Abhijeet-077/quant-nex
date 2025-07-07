"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Brain,
  Activity,
  Target,
  Download,
  RefreshCw,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

export function EnhancedMedicalCharts() {
  const [activeChart, setActiveChart] = useState("overview")
  const [timeRange, setTimeRange] = useState("7d")

  // Sample data for different charts
  const patientDemographics = [
    { age: "0-20", male: 45, female: 52, total: 97 },
    { age: "21-40", male: 123, female: 134, total: 257 },
    { age: "41-60", male: 189, female: 167, total: 356 },
    { age: "61-80", male: 145, female: 178, total: 323 },
    { age: "80+", male: 67, female: 89, total: 156 },
  ]

  const diagnosisDistribution = [
    { name: "Glioblastoma", value: 35, color: "#ef4444" },
    { name: "Meningioma", value: 28, color: "#f59e0b" },
    { name: "Astrocytoma", value: 22, color: "#10b981" },
    { name: "Oligodendroglioma", value: 15, color: "#3b82f6" },
  ]

  const treatmentOutcomes = [
    { month: "Jan", success: 85, partial: 12, failed: 3 },
    { month: "Feb", success: 88, partial: 10, failed: 2 },
    { month: "Mar", success: 92, partial: 6, failed: 2 },
    { month: "Apr", success: 89, partial: 8, failed: 3 },
    { month: "May", success: 94, partial: 5, failed: 1 },
    { month: "Jun", success: 91, partial: 7, failed: 2 },
  ]

  const survivalRates = [
    { timepoint: "6 months", rate: 95 },
    { timepoint: "1 year", rate: 87 },
    { timepoint: "2 years", rate: 72 },
    { timepoint: "3 years", rate: 58 },
    { timepoint: "5 years", rate: 42 },
  ]

  const riskFactorAnalysis = [
    { factor: "Age", score: 85, fullMark: 100 },
    { factor: "Tumor Size", score: 72, fullMark: 100 },
    { factor: "Location", score: 68, fullMark: 100 },
    { factor: "Grade", score: 91, fullMark: 100 },
    { factor: "Genetics", score: 76, fullMark: 100 },
    { factor: "Performance", score: 83, fullMark: 100 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  const downloadChart = (chartType: string) => {
    // Implement chart download functionality
    console.log(`Downloading ${chartType} chart...`)
  }

  return (
    <div className="space-y-6">
      <Card className="card-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-teal-400 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Medical Analytics Dashboard
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => downloadChart(activeChart)}
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
          <Tabs value={activeChart} onValueChange={setActiveChart}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-teal-900/20">
              <TabsTrigger value="overview" className="data-[state=active]:bg-teal-600 text-xs">
                Overview
              </TabsTrigger>
              <TabsTrigger value="demographics" className="data-[state=active]:bg-teal-600 text-xs">
                Demographics
              </TabsTrigger>
              <TabsTrigger value="outcomes" className="data-[state=active]:bg-teal-600 text-xs">
                Outcomes
              </TabsTrigger>
              <TabsTrigger value="survival" className="data-[state=active]:bg-teal-600 text-xs">
                Survival
              </TabsTrigger>
              <TabsTrigger value="risk" className="data-[state=active]:bg-teal-600 text-xs">
                Risk Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-lg">Diagnosis Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <RechartsPieChart>
                        <Pie
                          data={diagnosisDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {diagnosisDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-lg">Treatment Success Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={treatmentOutcomes}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#9ca3af" />
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
                          dataKey="success"
                          stackId="1"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.6}
                        />
                        <Area
                          type="monotone"
                          dataKey="partial"
                          stackId="1"
                          stroke="#f59e0b"
                          fill="#f59e0b"
                          fillOpacity={0.6}
                        />
                        <Area
                          type="monotone"
                          dataKey="failed"
                          stackId="1"
                          stroke="#ef4444"
                          fill="#ef4444"
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="demographics" className="space-y-6 mt-6">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">Patient Demographics by Age Group</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={patientDemographics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="age" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="male" fill="#3b82f6" name="Male" />
                      <Bar dataKey="female" fill="#ec4899" name="Female" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="outcomes" className="space-y-6 mt-6">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">Monthly Treatment Outcomes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={treatmentOutcomes}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9ca3af" />
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
                        dataKey="success"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="partial"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="survival" className="space-y-6 mt-6">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">Survival Rate Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={survivalRates}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="timepoint" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="rate"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.3}
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="risk" className="space-y-6 mt-6">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">Risk Factor Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <RadarChart data={riskFactorAnalysis}>
                      <PolarGrid stroke="#374151" />
                      <PolarAngleAxis dataKey="factor" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                      <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        tick={{ fill: "#9ca3af", fontSize: 10 }}
                      />
                      <Radar
                        name="Risk Score"
                        dataKey="score"
                        stroke="#06b6d4"
                        fill="#06b6d4"
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
