"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Calendar,
  Clock,
  Target,
  Zap,
  Syringe,
  Activity,
  Plus,
  Edit,
  Trash2,
  Save,
  Copy,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  GripVertical,
} from "lucide-react"

interface TreatmentPhase {
  id: string
  name: string
  type: "surgery" | "radiation" | "chemotherapy" | "immunotherapy" | "supportive"
  startDate: string
  duration: number
  status: "planned" | "active" | "completed" | "cancelled"
  progress: number
  description: string
  dosage?: string
  frequency?: string
  sideEffects: string[]
  notes: string
}

interface TreatmentPlan {
  id: string
  name: string
  patientId: string
  createdDate: string
  lastModified: string
  status: "draft" | "approved" | "active" | "completed"
  phases: TreatmentPhase[]
  totalDuration: number
  expectedOutcome: string
}

export function TreatmentPlanningInterface() {
  const [selectedPlan, setSelectedPlan] = useState<string>("plan1")
  const [isEditing, setIsEditing] = useState(false)
  const [draggedPhase, setDraggedPhase] = useState<string | null>(null)

  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>([
    {
      id: "plan1",
      name: "Multimodal GBM Protocol",
      patientId: "patient1",
      createdDate: "2024-01-15",
      lastModified: "2024-01-20",
      status: "active",
      totalDuration: 18,
      expectedOutcome: "Median survival extension to 18-24 months",
      phases: [
        {
          id: "phase1",
          name: "Surgical Resection",
          type: "surgery",
          startDate: "2024-01-22",
          duration: 1,
          status: "completed",
          progress: 100,
          description: "Maximal safe resection of tumor",
          sideEffects: ["Post-operative edema", "Temporary weakness"],
          notes: "Gross total resection achieved (>95%)",
        },
        {
          id: "phase2",
          name: "Concurrent Chemoradiation",
          type: "radiation",
          startDate: "2024-02-05",
          duration: 6,
          status: "active",
          progress: 65,
          description: "60 Gy in 30 fractions with concurrent temozolomide",
          dosage: "60 Gy",
          frequency: "Daily (Mon-Fri)",
          sideEffects: ["Fatigue", "Skin irritation", "Hair loss"],
          notes: "Patient tolerating treatment well",
        },
        {
          id: "phase3",
          name: "Adjuvant Chemotherapy",
          type: "chemotherapy",
          startDate: "2024-03-15",
          duration: 12,
          status: "planned",
          progress: 0,
          description: "Temozolomide maintenance therapy",
          dosage: "150-200 mg/m²",
          frequency: "5 days every 28 days",
          sideEffects: ["Nausea", "Fatigue", "Thrombocytopenia"],
          notes: "Dose adjustments based on blood counts",
        },
      ],
    },
  ])

  const currentPlan = treatmentPlans.find(plan => plan.id === selectedPlan)

  const getPhaseIcon = (type: string) => {
    switch (type) {
      case "surgery": return <Target className="h-4 w-4" />
      case "radiation": return <Zap className="h-4 w-4" />
      case "chemotherapy": return <Syringe className="h-4 w-4" />
      case "immunotherapy": return <Activity className="h-4 w-4" />
      default: return <Calendar className="h-4 w-4" />
    }
  }

  const getPhaseColor = (type: string) => {
    switch (type) {
      case "surgery": return "border-green-500 bg-green-900/20"
      case "radiation": return "border-blue-500 bg-blue-900/20"
      case "chemotherapy": return "border-yellow-500 bg-yellow-900/20"
      case "immunotherapy": return "border-purple-500 bg-purple-900/20"
      default: return "border-gray-500 bg-gray-900/20"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-400"
      case "active": return "text-blue-400"
      case "planned": return "text-yellow-400"
      case "cancelled": return "text-red-400"
      default: return "text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4" />
      case "active": return <Activity className="h-4 w-4" />
      case "planned": return <Clock className="h-4 w-4" />
      case "cancelled": return <AlertTriangle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const handleDragStart = (phaseId: string) => {
    setDraggedPhase(phaseId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetPhaseId: string) => {
    e.preventDefault()
    if (!draggedPhase || !currentPlan) return

    const updatedPhases = [...currentPlan.phases]
    const draggedIndex = updatedPhases.findIndex(p => p.id === draggedPhase)
    const targetIndex = updatedPhases.findIndex(p => p.id === targetPhaseId)

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [draggedItem] = updatedPhases.splice(draggedIndex, 1)
      updatedPhases.splice(targetIndex, 0, draggedItem)

      setTreatmentPlans(prev => prev.map(plan => 
        plan.id === selectedPlan 
          ? { ...plan, phases: updatedPhases }
          : plan
      ))
    }

    setDraggedPhase(null)
  }

  const addNewPhase = () => {
    if (!currentPlan) return

    const newPhase: TreatmentPhase = {
      id: `phase${Date.now()}`,
      name: "New Treatment Phase",
      type: "chemotherapy",
      startDate: new Date().toISOString().split('T')[0],
      duration: 4,
      status: "planned",
      progress: 0,
      description: "Enter treatment description",
      sideEffects: [],
      notes: "",
    }

    setTreatmentPlans(prev => prev.map(plan => 
      plan.id === selectedPlan 
        ? { ...plan, phases: [...plan.phases, newPhase] }
        : plan
    ))
  }

  const deletePhase = (phaseId: string) => {
    if (!currentPlan) return

    setTreatmentPlans(prev => prev.map(plan => 
      plan.id === selectedPlan 
        ? { ...plan, phases: plan.phases.filter(p => p.id !== phaseId) }
        : plan
    ))
  }

  const savePlan = () => {
    setIsEditing(false)
    console.log("Treatment plan saved")
  }

  const duplicatePlan = () => {
    if (!currentPlan) return

    const newPlan: TreatmentPlan = {
      ...currentPlan,
      id: `plan${Date.now()}`,
      name: `${currentPlan.name} (Copy)`,
      status: "draft",
      createdDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
    }

    setTreatmentPlans(prev => [...prev, newPlan])
    setSelectedPlan(newPlan.id)
  }

  return (
    <div className="space-y-6">
      {/* Plan Header */}
      <Card className="card-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-teal-400 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Treatment Planning Interface
              </CardTitle>
              {currentPlan && (
                <p className="text-gray-300 mt-1">
                  {currentPlan.name} • {currentPlan.phases.length} phases • {currentPlan.totalDuration} months
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={duplicatePlan}
                className="glow-hover bg-transparent"
              >
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </Button>
              <Button
                size="sm"
                variant={isEditing ? "default" : "outline"}
                onClick={() => setIsEditing(!isEditing)}
                className={isEditing ? "btn-glow-primary" : "glow-hover bg-transparent"}
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? "Save" : "Edit"}
              </Button>
              <Button
                size="sm"
                onClick={addNewPhase}
                className="btn-glow-accent"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Phase
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {currentPlan && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-400">
                  {currentPlan.phases.filter(p => p.status === "completed").length}
                </div>
                <p className="text-sm text-gray-400">Completed Phases</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {currentPlan.phases.filter(p => p.status === "active").length}
                </div>
                <p className="text-sm text-gray-400">Active Phases</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {currentPlan.phases.filter(p => p.status === "planned").length}
                </div>
                <p className="text-sm text-gray-400">Planned Phases</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {Math.round(currentPlan.phases.reduce((sum, p) => sum + p.progress, 0) / currentPlan.phases.length)}%
                </div>
                <p className="text-sm text-gray-400">Overall Progress</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Treatment Timeline */}
      {currentPlan && (
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="text-white">Treatment Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentPlan.phases.map((phase, index) => (
                <div
                  key={phase.id}
                  draggable={isEditing}
                  onDragStart={() => handleDragStart(phase.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, phase.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    getPhaseColor(phase.type)
                  } ${isEditing ? "cursor-move hover:shadow-lg" : ""} ${
                    draggedPhase === phase.id ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {isEditing && (
                        <GripVertical className="h-5 w-5 text-gray-400 mt-1" />
                      )}
                      <div className="flex items-center gap-2">
                        {getPhaseIcon(phase.type)}
                        <Badge variant="outline" className="text-xs">
                          Phase {index + 1}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-white font-medium">{phase.name}</h4>
                          <div className={`flex items-center gap-1 ${getStatusColor(phase.status)}`}>
                            {getStatusIcon(phase.status)}
                            <span className="text-xs capitalize">{phase.status}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-300 mb-2">{phase.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                          <div>
                            <span className="text-gray-400">Start Date:</span>
                            <div className="text-white">{phase.startDate}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Duration:</span>
                            <div className="text-white">{phase.duration} months</div>
                          </div>
                          {phase.dosage && (
                            <div>
                              <span className="text-gray-400">Dosage:</span>
                              <div className="text-white">{phase.dosage}</div>
                            </div>
                          )}
                          {phase.frequency && (
                            <div>
                              <span className="text-gray-400">Frequency:</span>
                              <div className="text-white">{phase.frequency}</div>
                            </div>
                          )}
                        </div>
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-400">Progress:</span>
                            <span className="text-white">{phase.progress}%</span>
                          </div>
                          <Progress value={phase.progress} className="h-2" />
                        </div>
                        {phase.sideEffects.length > 0 && (
                          <div className="mt-3">
                            <span className="text-xs text-gray-400">Side Effects:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {phase.sideEffects.map((effect, effectIndex) => (
                                <Badge
                                  key={effectIndex}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {effect}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isEditing && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deletePhase(phase.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                      {index < currentPlan.phases.length - 1 && (
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
