"use client"

import { useState } from "react"
import { BarChart3, TrendingUp, Users, Activity, Brain, Target, Calendar, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MainLayout } from "../layout/main-layout"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExportButton } from "@/components/ui/export-button"

export function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")

  // Mock analytics data
  const kpiData = [
    {
      title: "Total Patients",
      value: "1,247",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Success Rate",
      value: "94.2%",
      change: "+2.1%",
      trend: "up",
      icon: Target,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "AI Predictions",
      value: "156",
      change: "+24.3%",
      trend: "up",
      icon: Brain,
      color: "from-purple-500 to-indigo-500"
    },
    {
      title: "Active Treatments",
      value: "89",
      change: "-3.2%",
      trend: "down",
      icon: Activity,
      color: "from-orange-500 to-red-500"
    }
  ]

  const treatmentOutcomes = [
    { treatment: "Chemotherapy", success: 87, total: 120, rate: 72.5 },
    { treatment: "Radiation", success: 94, total: 110, rate: 85.5 },
    { treatment: "Immunotherapy", success: 45, total: 52, rate: 86.5 },
    { treatment: "Surgery", success: 78, total: 85, rate: 91.8 },
    { treatment: "Targeted Therapy", success: 34, total: 40, rate: 85.0 }
  ]

  const patientDemographics = [
    { ageGroup: "18-30", count: 89, percentage: 7.1 },
    { ageGroup: "31-45", count: 234, percentage: 18.8 },
    { ageGroup: "46-60", count: 456, percentage: 36.6 },
    { ageGroup: "61-75", count: 378, percentage: 30.3 },
    { ageGroup: "75+", count: 90, percentage: 7.2 }
  ]

  return (
    <MainLayout>
      <div className="p-6 space-y-6 bg-black min-h-screen">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white glow-text">Analytics Dashboard</h1>
            <p className="text-gray-300 mt-2 text-sm sm:text-base">Comprehensive insights into patient outcomes and treatment effectiveness</p>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-full sm:w-40 bg-black/50 border-blue-500/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black border-blue-500/30">
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <ExportButton
              pageType="analytics"
              data={[...kpiData, ...treatmentOutcomes, ...patientDemographics]}
              variant="outline"
              className="bg-black/50 border-blue-500/30 text-white hover:bg-black/70 w-full sm:w-auto"
              customTitle="Analytics Dashboard Report"
            />
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi, index) => (
            <Card key={index} className="card-glow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm font-medium">{kpi.title}</p>
                    <p className="text-3xl font-bold text-white mt-2 glow-text">{kpi.value}</p>
                    <div className="flex items-center mt-2">
                      <span className={`text-sm font-medium ${kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                        {kpi.change}
                      </span>
                      <span className="text-gray-400 text-sm ml-1">vs last period</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${kpi.color} text-white neon-glow`}>
                    <kpi.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="outcomes" className="space-y-6">
          <TabsList className="bg-black/50 border border-blue-500/30">
            <TabsTrigger value="outcomes" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-white">
              Treatment Outcomes
            </TabsTrigger>
            <TabsTrigger value="demographics" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-white">
              Patient Demographics
            </TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-white">
              Trends & Patterns
            </TabsTrigger>
          </TabsList>

          <TabsContent value="outcomes" className="space-y-6">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-white flex items-center glow-text">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-400 neon-glow" />
                  Treatment Success Rates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {treatmentOutcomes.map((outcome, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-black/30 rounded-lg glow-border-subtle">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-white">{outcome.treatment}</h3>
                          <span className="text-sm text-gray-300">{outcome.success}/{outcome.total} patients</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                            style={{ width: `${outcome.rate}%` }}
                          />
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <span className="text-2xl font-bold text-green-400">{outcome.rate}%</span>
                        <p className="text-xs text-gray-400">Success Rate</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="demographics" className="space-y-6">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-white flex items-center glow-text">
                  <Users className="h-5 w-5 mr-2 text-blue-400 neon-glow" />
                  Patient Age Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patientDemographics.map((demo, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-black/30 rounded-lg glow-border-subtle">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-white">{demo.ageGroup} years</h3>
                          <span className="text-sm text-gray-300">{demo.count} patients</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                            style={{ width: `${demo.percentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <span className="text-2xl font-bold text-blue-400">{demo.percentage}%</span>
                        <p className="text-xs text-gray-400">of Total</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="text-white flex items-center glow-text">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-400 neon-glow" />
                    Monthly Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                      <span className="text-white">New Patients</span>
                      <span className="text-green-400 font-semibold">+15.2%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                      <span className="text-white">Treatment Completion</span>
                      <span className="text-green-400 font-semibold">+8.7%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                      <span className="text-white">AI Accuracy</span>
                      <span className="text-green-400 font-semibold">+3.1%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                      <span className="text-white">Patient Satisfaction</span>
                      <span className="text-green-400 font-semibold">+12.4%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="text-white flex items-center glow-text">
                    <Calendar className="h-5 w-5 mr-2 text-blue-400 neon-glow" />
                    Key Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <p className="text-blue-400 font-semibold text-sm">Peak Treatment Hours</p>
                      <p className="text-white text-sm">Most treatments scheduled between 10 AM - 2 PM</p>
                    </div>
                    <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <p className="text-green-400 font-semibold text-sm">Best Performing Treatment</p>
                      <p className="text-white text-sm">Surgery shows highest success rate at 91.8%</p>
                    </div>
                    <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                      <p className="text-purple-400 font-semibold text-sm">AI Model Performance</p>
                      <p className="text-white text-sm">Detection accuracy improved by 24.3% this month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
