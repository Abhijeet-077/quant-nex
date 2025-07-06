"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MainLayout } from "@/components/layout/main-layout"
import {
  Users,
  Calendar,
  FileText,
  BarChart3,
  Activity,
  Heart,
  Brain,
  Target,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle
} from "lucide-react"
import {
  PatientVitalsChart,
  TumorProgressionChart,
  TreatmentEfficacyChart,
  SurvivalCurveChart,
  MedicalKPICard,
  RadiationDoseMap
} from "@/components/medical-viz/simple-medical-charts"
import dynamic from "next/dynamic"

// Dynamic import for reliable 3D system to prevent SSR issues
const Reliable3DSystem = dynamic(() => import("@/components/medical-3d/reliable-3d-system").then(mod => ({ default: mod.Reliable3DSystem })), {
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900/50 to-blue-900/50">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue-300">Loading Medical Visualization...</p>
      </div>
    </div>
  ),
  ssr: false
})

export default function DashboardPage() {
  const [stats] = useState({
    totalPatients: 156,
    todayAppointments: 8,
    pendingRecords: 12,
    completedTreatments: 89
  })

  return (
    <MainLayout>
      <div className="p-6 space-y-6 bg-black min-h-screen">
        <div>
          <h1 className="text-3xl font-bold text-white glow-text">Medical Dashboard</h1>
          <p className="text-gray-300 mt-2">Welcome to Quant-NEX Medical Application</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalPatients}</div>
              <p className="text-xs text-gray-400">Active patient records</p>
            </CardContent>
          </Card>

          <Card className="card-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.todayAppointments}</div>
              <p className="text-xs text-gray-400">Scheduled for today</p>
            </CardContent>
          </Card>

          <Card className="card-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Pending Records</CardTitle>
              <FileText className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.pendingRecords}</div>
              <p className="text-xs text-gray-400">Awaiting review</p>
            </CardContent>
          </Card>

          <Card className="card-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Completed Treatments</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.completedTreatments}</div>
              <p className="text-xs text-gray-400">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Medical Visualization Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patient Vitals */}
          <PatientVitalsChart className="h-[400px]" />

          {/* Advanced 3D Medical Model */}
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Brain className="w-5 h-5 mr-2 text-blue-400" />
                Advanced 3D Medical Visualization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <Reliable3DSystem
                  modelType="brain"
                  title="Interactive Brain Model"
                  showControls={true}
                  autoRotate={true}
                  interactive={true}
                  showAnalysis={true}
                  className="w-full h-full"
                  onModelClick={(part) => {
                    console.log('Brain part clicked:', part)
                    // Handle brain part interaction
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TumorProgressionChart />
          <TreatmentEfficacyChart />
          <RadiationDoseMap />
        </div>

        {/* Survival Analysis */}
        <SurvivalCurveChart className="h-[400px]" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 button-glow">
                Add New Patient
              </Button>
              <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 button-glow">
                Schedule Appointment
              </Button>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 button-glow">
                Create Medical Record
              </Button>
            </CardContent>
          </Card>

          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">New patient registered: Priya Sharma</p>
                    <p className="text-gray-400 text-xs">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">Appointment completed: Arjun Patel</p>
                    <p className="text-gray-400 text-xs">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">Medical record updated: Sneha Gupta</p>
                    <p className="text-gray-400 text-xs">6 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
