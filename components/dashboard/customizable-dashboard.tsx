"use client"

import { useState } from "react"
import { MainLayout } from "../layout/main-layout"
import { InteractiveSurvivalCurves } from "./widgets/interactive-survival-curves"
import { AIInsightsPanel } from "../ai/ai-insights-panel"
import { LivePatientJourney } from "../visualization/live-patient-journey"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Activity, Users, TrendingUp, AlertTriangle, Calendar, MessageSquare, Settings } from "lucide-react"

// Simple placeholder widgets for demonstration
function RiskGaugeWidget() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl font-bold text-white mb-2">73%</div>
        <div className="text-slate-400">Risk Score</div>
        <div className="w-32 h-2 bg-white/20 rounded-full mt-3">
          <div className="w-3/4 h-full bg-red-500 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

function PatientStatsWidget() {
  return (
    <div className="h-full p-4">
      <div className="grid grid-cols-2 gap-4 h-full">
        <div className="text-center">
          <Users className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">1,247</div>
          <div className="text-sm text-slate-400">Active Patients</div>
        </div>
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">23</div>
          <div className="text-sm text-slate-400">Critical Cases</div>
        </div>
        <div className="text-center">
          <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">94.2%</div>
          <div className="text-sm text-slate-400">Success Rate</div>
        </div>
        <div className="text-center">
          <Calendar className="h-8 w-8 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">156</div>
          <div className="text-sm text-slate-400">Appointments</div>
        </div>
      </div>
    </div>
  )
}

function QuickActionsWidget() {
  const actions = [
    { icon: <Users className="h-5 w-5" />, label: "New Patient", color: "bg-blue-500" },
    { icon: <Calendar className="h-5 w-5" />, label: "Schedule", color: "bg-green-500" },
    { icon: <MessageSquare className="h-5 w-5" />, label: "Consult", color: "bg-purple-500" },
    { icon: <Activity className="h-5 w-5" />, label: "Reports", color: "bg-orange-500" },
  ]

  return (
    <div className="h-full p-4">
      <div className="grid grid-cols-2 gap-3 h-full">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-full flex-col space-y-2 bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            <div className={`p-2 rounded-lg ${action.color} text-white`}>{action.icon}</div>
            <span className="text-sm">{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}

export function CustomizableDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())

  // Define all available widgets
  const availableWidgets = [
    {
      id: "survival-curves",
      title: "Interactive Survival Analysis",
      component: InteractiveSurvivalCurves,
      size: "large" as const,
      category: "analytics",
      isVisible: true,
    },
    {
      id: "ai-insights",
      title: "AI Insights Panel",
      component: AIInsightsPanel,
      size: "medium" as const,
      category: "ai",
      isVisible: true,
    },
    {
      id: "patient-journey",
      title: "Live Patient Journey",
      component: LivePatientJourney,
      size: "large" as const,
      category: "monitoring",
      isVisible: true,
    },
    {
      id: "risk-gauge",
      title: "Risk Assessment Gauge",
      component: RiskGaugeWidget,
      size: "small" as const,
      category: "metrics",
      isVisible: true,
    },
    {
      id: "patient-stats",
      title: "Patient Statistics",
      component: PatientStatsWidget,
      size: "medium" as const,
      category: "metrics",
      isVisible: true,
    },
    {
      id: "quick-actions",
      title: "Quick Actions",
      component: QuickActionsWidget,
      size: "small" as const,
      category: "tools",
      isVisible: false,
    },
  ]

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Quantum-AI Precision Oncology Suite</h1>
              <p className="text-slate-300">
                Customizable Dashboard -{" "}
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                System Online
              </Badge>
              <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300">
                <Brain className="h-3 w-3 mr-1" />
                AI Active
              </Badge>
              <Button variant="outline" size="icon" className="bg-white/10 border-white/20 text-white">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {availableWidgets.map((widget) => {
              const Component = widget.component
              return (
                <div key={widget.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">{widget.title}</h3>
                  <Component />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
