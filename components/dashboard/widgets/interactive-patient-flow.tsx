"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Activity,
  TrendingUp,
  Filter,
  Search,
} from "lucide-react"
import { Input } from "@/components/ui/input"

interface PatientFlowStage {
  id: string
  name: string
  patients: number
  avgTime: string
  efficiency: number
  status: "normal" | "warning" | "critical"
  color: string
  icon: React.ReactNode
}

interface Patient {
  id: string
  name: string
  age: number
  condition: string
  currentStage: string
  timeInStage: string
  priority: "low" | "medium" | "high" | "critical"
  nextAppointment: string
  progress: number
}

export function InteractivePatientFlow() {
  const [selectedStage, setSelectedStage] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPriority, setFilterPriority] = useState<string>("all")

  const flowStages: PatientFlowStage[] = [
    {
      id: "registration",
      name: "Registration",
      patients: 23,
      avgTime: "15 min",
      efficiency: 92,
      status: "normal",
      color: "#3b82f6",
      icon: <Users className="h-4 w-4" />,
    },
    {
      id: "screening",
      name: "Initial Screening",
      patients: 18,
      avgTime: "45 min",
      efficiency: 87,
      status: "normal",
      color: "#10b981",
      icon: <Activity className="h-4 w-4" />,
    },
    {
      id: "diagnosis",
      name: "Diagnosis",
      patients: 12,
      avgTime: "2.5 hrs",
      efficiency: 78,
      status: "warning",
      color: "#f59e0b",
      icon: <AlertTriangle className="h-4 w-4" />,
    },
    {
      id: "treatment",
      name: "Treatment Planning",
      patients: 8,
      avgTime: "1.8 hrs",
      efficiency: 85,
      status: "normal",
      color: "#8b5cf6",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      id: "monitoring",
      name: "Monitoring",
      patients: 34,
      avgTime: "ongoing",
      efficiency: 94,
      status: "normal",
      color: "#06b6d4",
      icon: <TrendingUp className="h-4 w-4" />,
    },
  ]

  const patients: Patient[] = [
    {
      id: "1",
      name: "Rajesh Kumar",
      age: 45,
      condition: "Glioblastoma",
      currentStage: "diagnosis",
      timeInStage: "2.3 hrs",
      priority: "critical",
      nextAppointment: "Today 3:00 PM",
      progress: 65,
    },
    {
      id: "2",
      name: "Priya Sharma",
      age: 38,
      condition: "Meningioma",
      currentStage: "treatment",
      timeInStage: "45 min",
      priority: "high",
      nextAppointment: "Tomorrow 10:00 AM",
      progress: 80,
    },
    {
      id: "3",
      name: "Amit Singh",
      age: 52,
      condition: "Astrocytoma",
      currentStage: "monitoring",
      timeInStage: "3 days",
      priority: "medium",
      nextAppointment: "Next week",
      progress: 90,
    },
    {
      id: "4",
      name: "Sunita Patel",
      age: 41,
      condition: "Brain Metastases",
      currentStage: "screening",
      timeInStage: "30 min",
      priority: "high",
      nextAppointment: "Today 4:30 PM",
      progress: 25,
    },
  ]

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = filterPriority === "all" || patient.priority === filterPriority
    const matchesStage = !selectedStage || patient.currentStage === selectedStage
    
    return matchesSearch && matchesPriority && matchesStage
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-500"
      case "high": return "bg-orange-500"
      case "medium": return "bg-yellow-500"
      case "low": return "bg-green-500"
      default: return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal": return "border-green-500/50 bg-green-900/20"
      case "warning": return "border-yellow-500/50 bg-yellow-900/20"
      case "critical": return "border-red-500/50 bg-red-900/20"
      default: return "border-gray-500/50 bg-gray-900/20"
    }
  }

  return (
    <div className="space-y-6">
      {/* Patient Flow Overview */}
      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="text-teal-400 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Patient Flow Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Flow Stages */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            {flowStages.map((stage, index) => (
              <div key={stage.id} className="flex items-center">
                <div
                  className={`relative p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedStage === stage.id
                      ? "border-teal-400 bg-teal-900/30"
                      : getStatusColor(stage.status)
                  }`}
                  onClick={() => setSelectedStage(selectedStage === stage.id ? null : stage.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div style={{ color: stage.color }}>{stage.icon}</div>
                    <Badge variant="secondary" className="text-xs">
                      {stage.patients}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-medium text-white mb-1">{stage.name}</h3>
                  <p className="text-xs text-gray-400 mb-2">Avg: {stage.avgTime}</p>
                  <div className="flex items-center gap-2">
                    <Progress value={stage.efficiency} className="h-1 flex-1" />
                    <span className="text-xs text-gray-400">{stage.efficiency}%</span>
                  </div>
                </div>
                {index < flowStages.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-gray-500 mx-2 hidden md:block" />
                )}
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700/50"
              />
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={filterPriority === "all" ? "default" : "outline"}
                onClick={() => setFilterPriority("all")}
                className="text-xs"
              >
                All
              </Button>
              <Button
                size="sm"
                variant={filterPriority === "critical" ? "destructive" : "outline"}
                onClick={() => setFilterPriority("critical")}
                className="text-xs"
              >
                Critical
              </Button>
              <Button
                size="sm"
                variant={filterPriority === "high" ? "secondary" : "outline"}
                onClick={() => setFilterPriority("high")}
                className="text-xs"
              >
                High
              </Button>
            </div>
          </div>

          {/* Patient List */}
          <div className="space-y-3">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800/70 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(patient.priority)}`} />
                    <div>
                      <h4 className="text-white font-medium">{patient.name}</h4>
                      <p className="text-sm text-gray-400">Age {patient.age} • {patient.condition}</p>
                    </div>
                  </div>
                  <Badge
                    variant={patient.priority === "critical" ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {patient.priority.toUpperCase()}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Current Stage</p>
                    <p className="text-sm text-white capitalize">{patient.currentStage}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Time in Stage</p>
                    <p className="text-sm text-white">{patient.timeInStage}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Next Appointment</p>
                    <p className="text-sm text-white">{patient.nextAppointment}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Progress:</span>
                  <Progress value={patient.progress} className="h-2 flex-1" />
                  <span className="text-xs text-gray-400">{patient.progress}%</span>
                </div>
              </div>
            ))}
          </div>

          {filteredPatients.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">No patients found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
