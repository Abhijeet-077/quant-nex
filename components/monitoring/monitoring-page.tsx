"use client"

import type React from "react"

import { useState } from "react"
import {
  Activity,
  AlertTriangle,
  BellRing,
  Calendar,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Heart,
  LineChart,
  Loader2,
  MessageSquare,
  Share2,
  Sliders,
  Thermometer,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainLayout } from "../layout/main-layout"
import {
  HeartRateChart,
  BloodPressureChart,
  TemperatureChart,
  OxygenSaturationChart
} from "./real-time-vitals-chart"

export function MonitoringPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [timeRange, setTimeRange] = useState("24h")
  const [showThresholds, setShowThresholds] = useState(false)

  const handleRefresh = () => {
    setIsLoading(true)

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  const handleTimeRange = () => {
    const ranges = ["1h", "6h", "24h", "7d"]
    const currentIndex = ranges.indexOf(timeRange)
    const nextIndex = (currentIndex + 1) % ranges.length
    setTimeRange(ranges[nextIndex])
  }

  const handleThresholds = () => {
    setShowThresholds(!showThresholds)
  }

  const handleShare = () => {
    console.log("Sharing monitoring data...")
    // Implement share functionality
  }

  const handleExport = () => {
    console.log("Exporting monitoring data...")
    // Implement export functionality
  }

  return (
    <MainLayout>
      <div className="grid grid-cols-12 gap-6 p-6">
        <div className="col-span-12 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Patient Monitoring</h1>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Clock className="h-4 w-4 mr-2" />
                  Refresh
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-black/10 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-xl font-semibold">Vital Signs Monitoring</h3>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleTimeRange}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Time Range ({timeRange})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleThresholds}
                  className={showThresholds ? "bg-blue-500/20 border-blue-500" : ""}
                >
                  <Sliders className="h-4 w-4 mr-2" />
                  Thresholds
                </Button>
              </div>
            </div>

            <div className="p-4">
              <Tabs defaultValue="vitals">
                <TabsList className="grid grid-cols-4 w-full max-w-md mx-auto mb-6">
                  <TabsTrigger value="vitals">
                    <Heart className="h-4 w-4 mr-2" />
                    Vitals
                  </TabsTrigger>
                  <TabsTrigger value="tumor">
                    <Activity className="h-4 w-4 mr-2" />
                    Tumor Response
                  </TabsTrigger>
                  <TabsTrigger value="biomarkers">
                    <LineChart className="h-4 w-4 mr-2" />
                    Biomarkers
                  </TabsTrigger>
                  <TabsTrigger value="side-effects">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Side Effects
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="vitals">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <HeartRateChart />
                    <BloodPressureChart />
                    <TemperatureChart />
                    <OxygenSaturationChart />
                  </div>
                </TabsContent>

                <TabsContent value="tumor">
                  <div className="space-y-6">
                    <div className="bg-black/20 rounded-xl p-4">
                      <h4 className="text-lg font-semibold mb-4">Tumor Size Tracking</h4>
                      <div className="h-64 flex items-center justify-center">
                        <div className="text-center">
                          <LineChart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                          <p className="text-gray-400">Tumor size tracking chart will appear here</p>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-sm text-gray-400">Initial Size</p>
                          <p className="text-xl font-semibold text-white">3.2 cm</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Current Size</p>
                          <p className="text-xl font-semibold text-green-500">2.1 cm</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Change</p>
                          <p className="text-xl font-semibold text-green-500">-34%</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/20 rounded-xl p-4">
                      <h4 className="text-lg font-semibold mb-4">RECIST Criteria</h4>
                      <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Activity className="h-5 w-5 text-green-500 mr-2" />
                          <h4 className="font-semibold text-green-400">Partial Response (PR)</h4>
                        </div>
                        <p className="text-sm text-gray-300">
                          At least a 30% decrease in the sum of diameters of target lesions, taking as reference the
                          baseline sum diameters.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="biomarkers">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <BiomarkerCard
                        name="CA-125"
                        value="42"
                        unit="U/mL"
                        normalRange="0-35"
                        trend="-18"
                        status="elevated"
                      />

                      <BiomarkerCard
                        name="CEA"
                        value="3.2"
                        unit="ng/mL"
                        normalRange="0-5"
                        trend="-0.8"
                        status="normal"
                      />

                      <BiomarkerCard
                        name="PSA"
                        value="0.8"
                        unit="ng/mL"
                        normalRange="0-4"
                        trend="-0.1"
                        status="normal"
                      />

                      <BiomarkerCard
                        name="AFP"
                        value="12"
                        unit="ng/mL"
                        normalRange="0-10"
                        trend="-5"
                        status="elevated"
                      />
                    </div>

                    <div className="bg-black/20 rounded-xl p-4">
                      <h4 className="text-lg font-semibold mb-4">Biomarker Trends</h4>
                      <div className="h-64 flex items-center justify-center">
                        <div className="text-center">
                          <LineChart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                          <p className="text-gray-400">Biomarker trend chart will appear here</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="side-effects">
                  <div className="space-y-4">
                    <div className="bg-black/20 rounded-xl p-4">
                      <h4 className="text-lg font-semibold mb-4">Side Effect Tracking</h4>

                      <div className="space-y-3">
                        <SideEffectCard
                          name="Fatigue"
                          severity="Moderate"
                          trend="Improving"
                          notes="Patient reports improved energy levels in the morning"
                        />

                        <SideEffectCard
                          name="Nausea"
                          severity="Mild"
                          trend="Stable"
                          notes="Controlled with prescribed antiemetics"
                        />

                        <SideEffectCard
                          name="Skin Reaction"
                          severity="Moderate"
                          trend="Worsening"
                          notes="Redness and irritation at radiation site"
                          alert={true}
                        />

                        <SideEffectCard
                          name="Headache"
                          severity="Mild"
                          trend="Improving"
                          notes="Less frequent than previous week"
                        />
                      </div>
                    </div>

                    <Button className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Report New Side Effect
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="bg-black/10 backdrop-blur-sm rounded-xl border border-white/10 p-4">
            <h3 className="text-xl font-semibold mb-4">Treatment Response Timeline</h3>

            <div className="relative pl-8 space-y-6">
              <div className="absolute top-0 bottom-0 left-3 w-0.5 bg-gray-700"></div>

              <TimelineEvent
                date="May 15, 2025"
                title="Treatment Started"
                description="Initial radiation therapy session completed"
                status="complete"
                color="purple"
              />

              <TimelineEvent
                date="May 29, 2025"
                title="First Assessment"
                description="Initial response observed, 10% reduction in tumor size"
                status="complete"
                color="cyan"
              />

              <TimelineEvent
                date="June 12, 2025"
                title="Mid-Treatment Assessment"
                description="Continued response, 25% reduction in tumor size"
                status="complete"
                color="green"
              />

              <TimelineEvent
                date="June 26, 2025"
                title="Treatment Completed"
                description="Final radiation session administered"
                status="current"
                color="pink"
              />

              <TimelineEvent
                date="July 10, 2025"
                title="Follow-up Assessment"
                description="Scheduled for comprehensive evaluation"
                status="upcoming"
                color="gray"
              />
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-black/10 backdrop-blur-sm rounded-xl border border-white/10 p-4">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center mr-3">
                <User className="h-6 w-6 text-cyan-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Priya Sharma</h3>
                <p className="text-sm text-gray-400">Patient ID: #PT-2024-0156</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-black/20 rounded-lg p-3">
                <p className="text-sm text-gray-400">Diagnosis</p>
                <p className="font-medium">Glioblastoma</p>
              </div>

              <div className="bg-black/20 rounded-lg p-3">
                <p className="text-sm text-gray-400">Stage</p>
                <p className="font-medium">IV</p>
              </div>

              <div className="bg-black/20 rounded-lg p-3">
                <p className="text-sm text-gray-400">Treatment</p>
                <p className="font-medium">Radiation + Chemo</p>
              </div>

              <div className="bg-black/20 rounded-lg p-3">
                <p className="text-sm text-gray-400">Status</p>
                <p className="font-medium text-green-500">Responding</p>
              </div>
            </div>
          </div>

          <div className="bg-black/10 backdrop-blur-sm rounded-xl border border-white/10 p-4">
            <h3 className="text-xl font-semibold mb-4">Alerts & Notifications</h3>

            <div className="space-y-3">
              <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                  <h4 className="font-semibold text-red-400">Skin Reaction Worsening</h4>
                </div>
                <p className="text-sm text-gray-300">
                  Patient reported increased skin irritation at radiation site. Consider topical treatment adjustment.
                </p>
                <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                  <span>Today, 10:23 AM</span>
                  <Button variant="outline" size="sm" className="h-7 px-2">
                    Respond
                  </Button>
                </div>
              </div>

              <div className="p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                <div className="flex items-center mb-2">
                  <BellRing className="h-5 w-5 text-yellow-500 mr-2" />
                  <h4 className="font-semibold text-yellow-400">Temperature Elevated</h4>
                </div>
                <p className="text-sm text-gray-300">
                  Patient temperature has been elevated for the past 24 hours. Monitor for potential infection.
                </p>
                <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                  <span>Yesterday, 3:45 PM</span>
                  <Button variant="outline" size="sm" className="h-7 px-2">
                    Respond
                  </Button>
                </div>
              </div>

              <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                <div className="flex items-center mb-2">
                  <BellRing className="h-5 w-5 text-green-500 mr-2" />
                  <h4 className="font-semibold text-green-400">Biomarker Improvement</h4>
                </div>
                <p className="text-sm text-gray-300">
                  CA-125 levels have decreased by 30% since treatment initiation, indicating positive response.
                </p>
                <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                  <span>2 days ago, 11:30 AM</span>
                  <Button variant="outline" size="sm" className="h-7 px-2">
                    View Details
                  </Button>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-4">
              View All Notifications
            </Button>
          </div>

          <div className="bg-black/10 backdrop-blur-sm rounded-xl border border-white/10 p-4">
            <h3 className="text-xl font-semibold mb-4">Predictive Insights</h3>

            <div className="space-y-4">
              <div className="p-3 bg-black/20 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-2">
                    <Activity className="h-4 w-4 text-purple-500" />
                  </div>
                  <h4 className="font-semibold text-white">Treatment Response</h4>
                </div>
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="h-2 bg-gray-700 rounded-full">
                      <div className="h-2 bg-purple-500 rounded-full" style={{ width: "78%" }}></div>
                    </div>
                  </div>
                  <span className="ml-3 font-semibold text-purple-500">78%</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Probability of continued positive response based on current trends
                </p>
              </div>

              <div className="p-3 bg-black/20 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center mr-2">
                    <AlertTriangle className="h-4 w-4 text-cyan-500" />
                  </div>
                  <h4 className="font-semibold text-white">Complication Risk</h4>
                </div>
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="h-2 bg-gray-700 rounded-full">
                      <div className="h-2 bg-cyan-500 rounded-full" style={{ width: "23%" }}></div>
                    </div>
                  </div>
                  <span className="ml-3 font-semibold text-cyan-500">23%</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">Risk of treatment complications in the next 30 days</p>
              </div>

              <div className="p-3 bg-black/20 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center mr-2">
                    <Calendar className="h-4 w-4 text-pink-500" />
                  </div>
                  <h4 className="font-semibold text-white">Next Milestone</h4>
                </div>
                <p className="text-sm text-gray-300">
                  Patient is predicted to reach 50% tumor reduction by July 15, 2025
                </p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs text-gray-400">33 days from now</span>
                  <span className="text-xs text-pink-500 font-semibold">85% confidence</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black/10 backdrop-blur-sm rounded-xl border border-white/10 p-4">
            <h3 className="text-xl font-semibold mb-4">Reports</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors cursor-pointer">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-cyan-500 mr-3" />
                  <span className="text-white">Weekly Monitoring Report</span>
                </div>
                <Download className="h-4 w-4 text-gray-400" />
              </div>

              <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors cursor-pointer">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-purple-500 mr-3" />
                  <span className="text-white">Treatment Response Analysis</span>
                </div>
                <Download className="h-4 w-4 text-gray-400" />
              </div>

              <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors cursor-pointer">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-pink-500 mr-3" />
                  <span className="text-white">Side Effect Management Plan</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

function VitalChart({
  title,
  value,
  unit,
  trend,
  status,
  icon,
  color,
}: {
  title: string
  value: string
  unit: string
  trend: string
  status: string
  icon: React.ReactNode
  color: string
}) {
  const colorMap: Record<string, string> = {
    pink: "text-pink-500",
    cyan: "text-cyan-500",
    purple: "text-purple-500",
    green: "text-green-500",
    yellow: "text-yellow-500",
    red: "text-red-500",
  }

  const statusColorMap: Record<string, string> = {
    normal: "text-green-500",
    elevated: "text-yellow-500",
    high: "text-red-500",
    low: "text-blue-500",
  }

  const textColor = colorMap[color] || "text-white"
  const statusColor = statusColorMap[status] || "text-gray-500"

  return (
    <div className="bg-black/20 rounded-xl p-4">
      <div className="flex justify-between items-start mb-4">
        <h4 className="font-semibold text-white">{title}</h4>
        <div className={`p-1.5 rounded-full bg-${color}-500/20`}>
          <div className={textColor}>{icon}</div>
        </div>
      </div>

      <div className="flex items-end mb-4">
        <div className="text-3xl font-bold text-white">{value}</div>
        <div className="ml-1 text-sm text-gray-400 mb-1">{unit}</div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-xs text-gray-400 mr-1">Trend:</span>
          <span className="text-xs text-white">{trend}</span>
        </div>
        <div className={`text-xs font-medium ${statusColor}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</div>
      </div>

      <div className="mt-4 h-24 flex items-end">
        {/* Placeholder for chart */}
        <div className="w-full h-full flex items-center justify-center">
          <LineChart className="h-12 w-12 text-gray-700" />
        </div>
      </div>
    </div>
  )
}

function BiomarkerCard({
  name,
  value,
  unit,
  normalRange,
  trend,
  status,
}: {
  name: string
  value: string
  unit: string
  normalRange: string
  trend: string
  status: string
}) {
  const statusColorMap: Record<string, string> = {
    normal: "text-green-500",
    elevated: "text-yellow-500",
    high: "text-red-500",
    low: "text-blue-500",
  }

  const statusColor = statusColorMap[status] || "text-gray-500"

  return (
    <div className="bg-black/20 rounded-lg p-3">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium text-white">{name}</h4>
        <div className={`text-xs font-medium ${statusColor}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</div>
      </div>

      <div className="flex items-baseline mb-1">
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="ml-1 text-xs text-gray-400">{unit}</div>
      </div>

      <div className="flex justify-between items-center text-xs">
        <span className="text-gray-400">Normal: {normalRange}</span>
        <span className="text-green-500">Trend: {trend}</span>
      </div>
    </div>
  )
}

function SideEffectCard({
  name,
  severity,
  trend,
  notes,
  alert = false,
}: {
  name: string
  severity: string
  trend: string
  notes: string
  alert?: boolean
}) {
  const severityColorMap: Record<string, string> = {
    Mild: "text-green-500",
    Moderate: "text-yellow-500",
    Severe: "text-red-500",
  }

  const trendColorMap: Record<string, string> = {
    Improving: "text-green-500",
    Stable: "text-blue-500",
    Worsening: "text-red-500",
  }

  const severityColor = severityColorMap[severity] || "text-gray-500"
  const trendColor = trendColorMap[trend] || "text-gray-500"

  return (
    <div className={`p-3 rounded-lg ${alert ? "bg-red-900/20 border border-red-500/30" : "bg-black/20"}`}>
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium text-white">{name}</h4>
        <div className="flex items-center space-x-2">
          <span className={`text-xs font-medium ${severityColor}`}>{severity}</span>
          <span className="text-gray-400">|</span>
          <span className={`text-xs font-medium ${trendColor}`}>{trend}</span>
        </div>
      </div>

      <p className="text-sm text-gray-300">{notes}</p>
    </div>
  )
}

function TimelineEvent({
  date,
  title,
  description,
  status,
  color,
}: {
  date: string
  title: string
  description: string
  status: "complete" | "current" | "upcoming"
  color: string
}) {
  const colorMap: Record<string, string> = {
    pink: "bg-pink-500",
    cyan: "bg-cyan-500",
    purple: "bg-purple-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    gray: "bg-gray-500",
  }

  const bgColor = colorMap[color] || "bg-gray-500"

  return (
    <div className="relative">
      <div
        className={`absolute left-[-24px] top-0 w-6 h-6 rounded-full border-4 border-gray-900 ${status === "upcoming" ? "bg-gray-700" : bgColor}`}
      ></div>

      <div className="mb-1 text-sm text-gray-400">{date}</div>

      <div className="flex items-center mb-1">
        <h4 className="font-semibold text-white">{title}</h4>
        {status === "current" && (
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-500">Current</span>
        )}
      </div>

      <p className="text-sm text-gray-300">{description}</p>
    </div>
  )
}
