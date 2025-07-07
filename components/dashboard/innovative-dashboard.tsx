"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { LayeredAnatomyModel } from "../visualization/layered-anatomy-model"
import { DetailedBrainTumor } from "../visualization/detailed-brain-tumor"
import { DamagedOrgansModel } from "../visualization/damaged-organs-model"
import { ModelIconButton } from "../ui/model-icon-button"
import { ModelViewerModal } from "../ui/model-viewer-modal"

export function InnovativeDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeModal, setActiveModal] = useState<"anatomy" | "brain" | "organs" | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const timer = setInterval(() => setCurrentTime(new Date()), 1000)
      return () => {
        if (timer) clearInterval(timer)
      }
    }
  }, [])

  const openModal = (type: "anatomy" | "brain" | "organs") => {
    setActiveModal(type)
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  const handleQuickAction = (action: string) => {
    console.log(`Quick action clicked: ${action}`)
    // Here you would implement the actual functionality for each quick action
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6">
        {/* Header Section */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 lg:mb-6 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">Welcome back, Dr. Chen</h1>
              <p className="text-sm sm:text-base text-slate-300">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search patients, reports..."
                  className="pl-10 w-full sm:w-80 bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                />
              </div>
              <Button variant="outline" size="icon" className="bg-white/10 border-white/20 text-white">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Actions - Moved to top */}
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 mb-6 lg:mb-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-base lg:text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
                {[
                  { icon: <Plus />, label: "New Patient", color: "bg-blue-500", action: "newPatient" },
                  { icon: <Calendar />, label: "Schedule", color: "bg-green-500", action: "schedule" },
                  { icon: <MessageSquare />, label: "Consult", color: "bg-purple-500", action: "consult" },
                  { icon: <FileText />, label: "Reports", color: "bg-orange-500", action: "reports" },
                  { icon: <Zap />, label: "Treatment", color: "bg-cyan-500", action: "treatment" },
                  { icon: <BarChart3 />, label: "Analytics", color: "bg-red-500", action: "analytics" },
                ].map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-14 lg:h-16 flex-col space-y-1 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-blue-500/50 transition-all duration-200 text-xs lg:text-sm"
                    onClick={() => handleQuickAction(action.action)}
                  >
                    <div className={`p-1 lg:p-1.5 rounded-lg ${action.color} text-white`}>{action.icon}</div>
                    <span>{action.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <QuickStatCard
              title="Active Patients"
              value="1,247"
              change="+12%"
              icon={<Users className="h-5 w-5 lg:h-6 lg:w-6" />}
              color="from-blue-500 to-cyan-500"
            />
            <QuickStatCard
              title="Critical Cases"
              value="23"
              change="-8%"
              icon={<AlertTriangle className="h-5 w-5 lg:h-6 lg:w-6" />}
              color="from-red-500 to-pink-500"
            />
            <QuickStatCard
              title="AI Predictions"
              value="156"
              change="+24%"
              icon={<Brain className="h-5 w-5 lg:h-6 lg:w-6" />}
              color="from-purple-500 to-indigo-500"
            />
            <QuickStatCard
              title="Success Rate"
              value="94.2%"
              change="+2.1%"
              icon={<TrendingUp className="h-5 w-5 lg:h-6 lg:w-6" />}
              color="from-green-500 to-emerald-500"
            />
          </div>
        </div>

        {/* 3D Model Icons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <ModelIconButton
            type="anatomy"
            title="Layered Anatomy"
            description="Interactive 3D model showing multiple anatomical systems including skin, muscles, skeleton, and organs."
            onClick={() => openModal("anatomy")}
          />
          <ModelIconButton
            type="brain"
            title="Brain Tumor Analysis"
            description="Detailed neural visualization with tumor mapping, showing affected pathways and tissue damage."
            onClick={() => openModal("brain")}
          />
          <ModelIconButton
            type="organs"
            title="Radiation Effects"
            description="Visualization of radiation impact on organs, highlighting damage patterns and risk assessment."
            onClick={() => openModal("organs")}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
          {/* AI Insights Panel */}
          <div className="xl:col-span-12">
            <AIInsightsPanel />
          </div>

          {/* Patient Information */}
          <div className="xl:col-span-6">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center text-base lg:text-lg">
                  <Users className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-blue-400" />
                  Current Patient
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg lg:text-2xl font-bold text-blue-600">ET</span>
                    </div>
                    <div>
                      <h3 className="text-base lg:text-lg font-semibold text-white">Emma Thompson</h3>
                      <p className="text-sm text-slate-400">ID: PT-2024-0156 • Age: 54</p>
                      <p className="text-xs lg:text-sm text-slate-500">Glioblastoma Stage IV</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 lg:gap-4">
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-xs lg:text-sm text-slate-400">Tumor Size</p>
                      <p className="text-base lg:text-lg font-semibold text-white">4.2 cm</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-xs lg:text-sm text-slate-400">Treatment Progress</p>
                      <p className="text-base lg:text-lg font-semibold text-green-400">75%</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-xs lg:text-sm text-slate-400">Risk Level</p>
                      <p className="text-base lg:text-lg font-semibold text-yellow-400">High</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-xs lg:text-sm text-slate-400">Response Rate</p>
                      <p className="text-base lg:text-lg font-semibold text-green-400">Excellent</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="xl:col-span-6">
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
          <LayeredAnatomyModel />
        </ModelViewerModal>

        <ModelViewerModal
          isOpen={activeModal === "brain"}
          onClose={closeModal}
          title="Brain Tumor Analysis"
          modelType="brain"
        >
          <DetailedBrainTumor />
        </ModelViewerModal>

        <ModelViewerModal
          isOpen={activeModal === "organs"}
          onClose={closeModal}
          title="Organ Damage Assessment"
          modelType="organs"
        >
          <DamagedOrgansModel />
        </ModelViewerModal>
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
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 overflow-hidden">
      <CardContent className="p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs lg:text-sm font-medium">{title}</p>
            <p className="text-xl lg:text-3xl font-bold text-white mt-1 lg:mt-2">{value}</p>
            <div className="flex items-center mt-1 lg:mt-2">
              <span className={`text-xs lg:text-sm font-medium ${isPositive ? "text-green-400" : "text-red-400"}`}>
                {change}
              </span>
              <span className="text-slate-400 text-xs lg:text-sm ml-1">vs last month</span>
            </div>
          </div>
          <div className={`p-2 lg:p-3 rounded-xl bg-gradient-to-r ${color} text-white`}>{icon}</div>
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
      patient: "Emma Thompson",
      action: "New MRI scan analyzed",
      time: "2 minutes ago",
      priority: "high",
    },
    {
      id: 2,
      type: "treatment",
      patient: "Michael Chen",
      action: "Treatment plan updated",
      time: "15 minutes ago",
      priority: "medium",
    },
    {
      id: 3,
      type: "alert",
      patient: "Sarah Wilson",
      action: "Critical threshold reached",
      time: "1 hour ago",
      priority: "high",
    },
  ]

  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 h-full">
      <CardHeader>
        <CardTitle className="text-white flex items-center text-base lg:text-lg">
          <Clock className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-blue-400" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 lg:space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center space-x-3 lg:space-x-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <div
                className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full ${activity.priority === "high" ? "bg-red-400" : "bg-yellow-400"}`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm lg:text-base text-white font-medium truncate">{activity.patient}</p>
                <p className="text-xs lg:text-sm text-slate-400 truncate">{activity.action}</p>
              </div>
              <span className="text-xs text-slate-400 whitespace-nowrap">{activity.time}</span>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-3 lg:mt-4 text-sm bg-transparent">
          View All Activities
        </Button>
      </CardContent>
    </Card>
  )
}
