"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  AlertTriangle,
  Brain,
  Calendar,
  Clock,
  MessageSquare,
  Plus,
  Search,
  Settings,
  TrendingUp,
  Users,
  Zap,
  BarChart3,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MainLayout } from "../layout/main-layout"
import { AIInsightsPanel } from "../ai/ai-insights-panel"
import { Enhanced3DModel } from "../3d/enhanced-3d-model"
import { InteractiveMedicalModels } from "../3d/interactive-medical-models"
import { ModelIconButton } from "../ui/model-icon-button"
import { ModelViewerModal } from "../ui/model-viewer-modal"
import { MedicalModelModal } from "../ui/medical-model-modal"
import { ExportButton } from "../ui/export-button"

export function InnovativeDashboard() {
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeModal, setActiveModal] = useState<"anatomy" | "brain" | "organs" | "comprehensive" | null>(null)

  // Sample dashboard data for export
  const dashboardData = [
    { metric: "Total Patients", value: "156", change: "+12%", status: "Increasing" },
    { metric: "Active Treatments", value: "89", change: "+8%", status: "Stable" },
    { metric: "Critical Cases", value: "7", change: "-2%", status: "Decreasing" },
    { metric: "Success Rate", value: "94.2%", change: "+1.5%", status: "Excellent" },
    { metric: "AI Predictions", value: "1,247", change: "+156%", status: "Active" },
    { metric: "Quantum Simulations", value: "45", change: "+23%", status: "Running" },
  ]

  useEffect(() => {
    if (typeof window !== "undefined") {
      const timer = setInterval(() => setCurrentTime(new Date()), 1000)
      return () => {
        if (timer) clearInterval(timer)
      }
    }
  }, [])

  const openModal = (type: "anatomy" | "brain" | "organs" | "comprehensive") => {
    setActiveModal(type)
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  const handleQuickAction = (action: string) => {
    console.log(`Quick action clicked: ${action}`)

    try {
      switch (action) {
        case "newPatient":
          // Navigate to patients page
          router.push("/patients")
          break
        case "schedule":
          // Navigate to scheduling page
          router.push("/schedule")
          break
        case "consult":
          // Navigate to consultation page
          router.push("/consultation")
          break
        case "reports":
          // Navigate to reports page
          router.push("/reports")
          break
        case "treatment":
          // Navigate to treatment page
          router.push("/treatment")
          break
        case "analytics":
          // Navigate to analytics page
          router.push("/analytics")
          break
        default:
          console.warn(`Unknown action: ${action}`)
          // Show user feedback for unknown actions
          alert(`Action "${action}" is not yet implemented`)
      }
    } catch (error) {
      console.error("Error handling quick action:", error)
      alert("An error occurred while processing your request. Please try again.")
    }
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-black p-6">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 glow-text">Welcome back, Dr. Sharma</h1>
              <p className="text-gray-300 text-sm sm:text-base">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search patients, reports..."
                  className="pl-10 w-full sm:w-64 lg:w-80 bg-black/50 border-blue-500/30 text-white placeholder:text-gray-400 glow-border-subtle focus:border-blue-500/60"
                />
              </div>
              <ExportButton
                pageType="dashboard"
                data={dashboardData}
                className="bg-black/50 border-blue-500/30 text-blue-300 hover:bg-blue-500/20"
                customTitle="Dashboard Overview Report"
              />
              <Button
                variant="outline"
                size="icon"
                className="bg-black/50 border-blue-500/30 text-white button-glow hover:bg-black/70 flex-shrink-0"
                onClick={() => router.push("/settings")}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Actions - Enhanced with improved visibility and contrast */}
          <Card className="card-glow mb-8 border-blue-500/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-xl font-bold glow-text flex items-center">
                <Zap className="h-5 w-5 mr-2 text-blue-400 neon-glow" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[
                  { icon: <Plus className="h-5 w-5" />, label: "New Patient", color: "bg-gradient-to-br from-blue-500 to-blue-600", hoverColor: "hover:from-blue-400 hover:to-blue-500", action: "newPatient" },
                  { icon: <Calendar className="h-5 w-5" />, label: "Schedule", color: "bg-gradient-to-br from-green-500 to-green-600", hoverColor: "hover:from-green-400 hover:to-green-500", action: "schedule" },
                  { icon: <MessageSquare className="h-5 w-5" />, label: "Consult", color: "bg-gradient-to-br from-purple-500 to-purple-600", hoverColor: "hover:from-purple-400 hover:to-purple-500", action: "consult" },
                  { icon: <FileText className="h-5 w-5" />, label: "Reports", color: "bg-gradient-to-br from-orange-500 to-orange-600", hoverColor: "hover:from-orange-400 hover:to-orange-500", action: "reports" },
                  { icon: <Zap className="h-5 w-5" />, label: "Treatment", color: "bg-gradient-to-br from-cyan-500 to-cyan-600", hoverColor: "hover:from-cyan-400 hover:to-cyan-500", action: "treatment" },
                  { icon: <BarChart3 className="h-5 w-5" />, label: "Analytics", color: "bg-gradient-to-br from-red-500 to-red-600", hoverColor: "hover:from-red-400 hover:to-red-500", action: "analytics" },
                ].map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-18 sm:h-20 flex-col space-y-2 bg-black/70 border-blue-500/50 text-white hover:bg-black/80 hover:border-blue-400/70 glow-border-subtle button-glow transition-all duration-300 group relative overflow-hidden"
                    onClick={() => handleQuickAction(action.action)}
                  >
                    {/* Background glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Icon container with improved visibility */}
                    <div className={`relative z-10 p-2 rounded-xl ${action.color} ${action.hoverColor} text-white shadow-lg shadow-black/50 neon-glow flex items-center justify-center min-w-[32px] min-h-[32px] transition-all duration-300 group-hover:scale-110`}>
                      {action.icon}
                    </div>

                    {/* Label with improved contrast */}
                    <span className="relative z-10 text-xs sm:text-sm font-semibold text-white/90 group-hover:text-white text-center leading-tight px-1 transition-colors duration-300">
                      {action.label}
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <QuickStatCard
              title="Active Patients"
              value="1,247"
              change="+12%"
              icon={<Users className="h-6 w-6" />}
              color="from-blue-500 to-cyan-500"
            />
            <QuickStatCard
              title="Critical Cases"
              value="23"
              change="-8%"
              icon={<AlertTriangle className="h-6 w-6" />}
              color="from-red-500 to-pink-500"
            />
            <QuickStatCard
              title="AI Predictions"
              value="156"
              change="+24%"
              icon={<Brain className="h-6 w-6" />}
              color="from-purple-500 to-indigo-500"
            />
            <QuickStatCard
              title="Success Rate"
              value="94.2%"
              change="+2.1%"
              icon={<TrendingUp className="h-6 w-6" />}
              color="from-green-500 to-emerald-500"
            />
          </div>
        </div>

        {/* Interactive 3D Medical Models */}
        <div className="mb-6 sm:mb-8">
          <InteractiveMedicalModels
            className="w-full"
            onModelClick={(modelType) => {
              switch (modelType) {
                case "brain":
                  openModal("brain")
                  break
                case "heart":
                  openModal("anatomy")
                  break
                case "organs":
                  openModal("organs")
                  break
              }
            }}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* AI Insights Panel */}
          <div className="lg:col-span-12">
            <AIInsightsPanel />
          </div>

          {/* Patient Information */}
          <div className="lg:col-span-6">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-white flex items-center glow-text">
                  <Users className="h-5 w-5 mr-2 text-blue-400 neon-glow" />
                  Current Patient
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center glow-border-subtle">
                      <span className="text-2xl font-bold text-white">PS</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Priya Sharma</h3>
                      <p className="text-gray-300">ID: PT-2024-0156 • Age: 54</p>
                      <p className="text-sm text-gray-400">Glioblastoma Stage IV</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-3 bg-black/30 rounded-lg glow-border-subtle">
                      <p className="text-sm text-gray-300">Tumor Size</p>
                      <p className="text-lg font-semibold text-white">4.2 cm</p>
                    </div>
                    <div className="p-3 bg-black/30 rounded-lg glow-border-subtle">
                      <p className="text-sm text-gray-300">Treatment Progress</p>
                      <p className="text-lg font-semibold text-green-400">75%</p>
                    </div>
                    <div className="p-3 bg-black/30 rounded-lg glow-border-subtle">
                      <p className="text-sm text-gray-300">Risk Level</p>
                      <p className="text-lg font-semibold text-yellow-400">High</p>
                    </div>
                    <div className="p-3 bg-black/30 rounded-lg glow-border-subtle">
                      <p className="text-sm text-gray-300">Response Rate</p>
                      <p className="text-lg font-semibold text-green-400">Excellent</p>
                    </div>
                  </div>

                  {/* Comprehensive 3D Analysis Button */}
                  <div className="mt-4 space-y-2">
                    <Button
                      onClick={() => openModal("comprehensive")}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 glow-border-subtle"
                    >
                      <Brain className="h-5 w-5 mr-2" />
                      Open Comprehensive 3D Analysis
                    </Button>
                    <p className="text-xs text-gray-400 text-center">
                      Full-body medical visualization with radiation, damage, and tumor analysis
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-6">
            <RecentActivityPanel />
          </div>
        </div>

        {/* Modals */}
        <ModelViewerModal
          isOpen={activeModal === "anatomy"}
          onClose={closeModal}
          title="Layered Anatomical Model"
          modelType="anatomy"
        >
          <div className="h-96 w-full">
            <Enhanced3DModel
              modelType="heart"
              title="Anatomical Systems"
              showControls={true}
              autoRotate={true}
            />
          </div>
        </ModelViewerModal>

        <ModelViewerModal
          isOpen={activeModal === "brain"}
          onClose={closeModal}
          title="Brain Tumor Analysis"
          modelType="brain"
        >
          <div className="h-96 w-full">
            <Enhanced3DModel
              modelType="brain"
              title="Brain Tumor Analysis"
              showControls={true}
              autoRotate={true}
            />
          </div>
        </ModelViewerModal>

        <ModelViewerModal
          isOpen={activeModal === "organs"}
          onClose={closeModal}
          title="Organ Damage Assessment"
          modelType="organs"
        >
          <div className="h-96 w-full">
            <Enhanced3DModel
              modelType="tumor"
              title="Radiation Effects"
              showControls={true}
              autoRotate={true}
            />
          </div>
        </ModelViewerModal>

        {/* Comprehensive Medical Model Modal */}
        <MedicalModelModal
          isOpen={activeModal === "comprehensive"}
          onClose={closeModal}
          title="Comprehensive 3D Medical Analysis"
          modelType="comprehensive"
          patientData={{
            name: "Priya Sharma",
            id: "PT-2024-0156",
            age: 54,
            condition: "Glioblastoma Stage IV"
          }}
        />
      </div>
    </MainLayout>
  )
}

function QuickStatCard({
  title,
  value,
  change,
  icon,
  color,
}: {
  title: string
  value: string
  change: string
  icon: React.ReactNode
  color: string
}) {
  const isPositive = change.startsWith("+")

  return (
    <Card className="card-glow overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-300 text-sm font-medium">{title}</p>
            <p className="text-3xl font-bold text-white mt-2 glow-text">{value}</p>
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${isPositive ? "text-green-400" : "text-red-400"}`}>{change}</span>
              <span className="text-gray-400 text-sm ml-1">vs last month</span>
            </div>
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-r ${color} text-white neon-glow`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function RecentActivityPanel() {
  const activities = [
    {
      id: 1,
      type: "diagnosis",
      patient: "Priya Sharma",
      action: "New MRI scan analyzed",
      time: "2 minutes ago",
      priority: "high",
    },
    {
      id: 2,
      type: "treatment",
      patient: "Arjun Patel",
      action: "Treatment plan updated",
      time: "15 minutes ago",
      priority: "medium",
    },
    {
      id: 3,
      type: "alert",
      patient: "Sneha Gupta",
      action: "Critical threshold reached",
      time: "1 hour ago",
      priority: "high",
    },
  ]

  return (
    <Card className="card-glow">
      <CardHeader>
        <CardTitle className="text-white flex items-center glow-text">
          <Clock className="h-5 w-5 mr-2 text-blue-400 neon-glow" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg bg-black/30 glow-border-subtle">
              <div
                className={`w-3 h-3 rounded-full ${activity.priority === "high" ? "bg-red-400 shadow-lg shadow-red-400/50" : "bg-yellow-400 shadow-lg shadow-yellow-400/50"}`}
              />
              <div className="flex-1">
                <p className="text-white font-medium">{activity.patient}</p>
                <p className="text-gray-300 text-sm">{activity.action}</p>
              </div>
              <span className="text-gray-400 text-xs">{activity.time}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
