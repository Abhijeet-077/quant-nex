"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Syringe,
  Calendar,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  FileText,
  Download,
  Plus,
  Edit,
} from "lucide-react"
import { EnhancedTreatmentRadar } from "@/components/visualization/enhanced-treatment-radar"

interface TreatmentPlan {
  id: string
  name: string
  type: "surgery" | "chemotherapy" | "radiation" | "immunotherapy" | "targeted"
  status: "planned" | "active" | "completed" | "paused"
  startDate: string
  endDate?: string
  progress: number
  effectiveness: number
  sideEffects: string[]
  notes: string
}

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  startDate: string
  endDate?: string
  sideEffects: string[]
  adherence: number
}

export function TreatmentPage() {
  const [activeTab, setActiveTab] = useState("current")
  const [selectedTreatment, setSelectedTreatment] = useState<string | null>(null)
  const [isAddingTreatment, setIsAddingTreatment] = useState(false)

  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>([
    {
      id: "1",
      name: "Surgical Resection",
      type: "surgery",
      status: "completed",
      startDate: "2024-01-15",
      endDate: "2024-01-15",
      progress: 100,
      effectiveness: 85,
      sideEffects: ["Post-operative pain", "Temporary weakness"],
      notes: "Gross total resection achieved. No complications.",
    },
    {
      id: "2",
      name: "Concurrent Chemoradiation",
      type: "radiation",
      status: "active",
      startDate: "2024-02-01",
      endDate: "2024-03-15",
      progress: 65,
      effectiveness: 78,
      sideEffects: ["Fatigue", "Skin irritation", "Nausea"],
      notes: "Patient tolerating treatment well. Minor skin reaction noted.",
    },
    {
      id: "3",
      name: "Adjuvant Temozolomide",
      type: "chemotherapy",
      status: "planned",
      startDate: "2024-03-20",
      progress: 0,
      effectiveness: 72,
      sideEffects: ["Nausea", "Fatigue", "Low blood counts"],
      notes: "6 cycles planned. Pre-treatment labs pending.",
    },
  ])

  const [medications, setMedications] = useState<Medication[]>([
    {
      id: "1",
      name: "Temozolomide",
      dosage: "150mg/m²",
      frequency: "Daily x 5 days, q28 days",
      startDate: "2024-02-01",
      sideEffects: ["Nausea", "Fatigue", "Thrombocytopenia"],
      adherence: 95,
    },
    {
      id: "2",
      name: "Dexamethasone",
      dosage: "4mg",
      frequency: "Twice daily",
      startDate: "2024-01-20",
      sideEffects: ["Insomnia", "Increased appetite", "Mood changes"],
      adherence: 98,
    },
    {
      id: "3",
      name: "Levetiracetam",
      dosage: "500mg",
      frequency: "Twice daily",
      startDate: "2024-01-16",
      sideEffects: ["Drowsiness", "Dizziness"],
      adherence: 100,
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "active":
        return "bg-blue-500"
      case "planned":
        return "bg-yellow-500"
      case "paused":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "active":
        return "default"
      case "planned":
        return "secondary"
      case "paused":
        return "outline"
      default:
        return "outline"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "surgery":
        return "🔪"
      case "chemotherapy":
        return "💊"
      case "radiation":
        return "⚡"
      case "immunotherapy":
        return "🛡️"
      case "targeted":
        return "🎯"
      default:
        return "💉"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-teal-400 flex items-center gap-3">
              <Syringe className="h-8 w-8" />
              Treatment Planning & Management
            </h1>
            <p className="text-gray-300 mt-2">Comprehensive treatment planning and progress tracking</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="glow-hover bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export Plan
            </Button>
            <Button className="btn-glow-primary" onClick={() => setIsAddingTreatment(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Treatment
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-teal-900/20">
            <TabsTrigger value="current" className="data-[state=active]:bg-teal-600">
              Current Plan
            </TabsTrigger>
            <TabsTrigger value="medications" className="data-[state=active]:bg-teal-600">
              Medications
            </TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-teal-600">
              Schedule
            </TabsTrigger>
            <TabsTrigger value="effectiveness" className="data-[state=active]:bg-teal-600">
              Effectiveness
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-teal-600">
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Treatment Plans */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="card-glow">
                  <CardHeader>
                    <CardTitle className="text-teal-400">Active Treatment Plans</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {treatmentPlans.map((treatment) => (
                      <div
                        key={treatment.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedTreatment === treatment.id
                            ? "border-teal-400 bg-teal-900/20"
                            : "border-teal-500/30 bg-teal-900/10 hover:bg-teal-900/15"
                        }`}
                        onClick={() => setSelectedTreatment(treatment.id)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{getTypeIcon(treatment.type)}</span>
                            <div>
                              <h3 className="font-semibold text-white">{treatment.name}</h3>
                              <p className="text-sm text-gray-400 capitalize">{treatment.type}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={getStatusBadge(treatment.status)}>{treatment.status}</Badge>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-300">Progress</span>
                            <span className="text-sm text-white">{treatment.progress}%</span>
                          </div>
                          <Progress value={treatment.progress} className="h-2" />
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Start Date:</span>
                            <p className="text-white">{new Date(treatment.startDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Effectiveness:</span>
                            <p className="text-white">{treatment.effectiveness}%</p>
                          </div>
                        </div>

                        {treatment.sideEffects.length > 0 && (
                          <div className="mt-3">
                            <span className="text-sm text-gray-400">Side Effects:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {treatment.sideEffects.map((effect, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {effect}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {treatment.notes && (
                          <div className="mt-3">
                            <span className="text-sm text-gray-400">Notes:</span>
                            <p className="text-sm text-gray-300 mt-1">{treatment.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Treatment Summary */}
              <div className="space-y-4">
                <Card className="card-glow">
                  <CardHeader>
                    <CardTitle className="text-teal-400">Treatment Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-teal-400 mb-1">3</div>
                      <p className="text-sm text-gray-400">Active Treatments</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Overall Progress</span>
                        <span className="text-sm text-white">55%</span>
                      </div>
                      <Progress value={55} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 rounded-lg bg-teal-900/20">
                        <div className="text-lg font-bold text-green-400">1</div>
                        <p className="text-xs text-gray-400">Completed</p>
                      </div>
                      <div className="p-3 rounded-lg bg-teal-900/20">
                        <div className="text-lg font-bold text-blue-400">1</div>
                        <p className="text-xs text-gray-400">Active</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-glow">
                  <CardHeader>
                    <CardTitle className="text-teal-400 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 rounded-lg bg-yellow-900/20 border border-yellow-500/30">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm font-medium text-yellow-400">Upcoming</span>
                      </div>
                      <p className="text-xs text-gray-300">Next chemotherapy cycle in 5 days</p>
                    </div>

                    <div className="p-3 rounded-lg bg-blue-900/20 border border-blue-500/30">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="h-4 w-4 text-blue-400" />
                        <span className="text-sm font-medium text-blue-400">Lab Results</span>
                      </div>
                      <p className="text-xs text-gray-300">Blood work scheduled for tomorrow</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="medications" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="text-teal-400">Current Medications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {medications.map((medication) => (
                    <div key={medication.id} className="p-4 rounded-lg bg-teal-900/10 border border-teal-500/30">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-white">{medication.name}</h3>
                          <p className="text-sm text-gray-400">{medication.dosage}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="default" className="bg-green-600">
                            {medication.adherence}% Adherence
                          </Badge>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Frequency:</span>
                          <span className="text-white">{medication.frequency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Started:</span>
                          <span className="text-white">{new Date(medication.startDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {medication.sideEffects.length > 0 && (
                        <div className="mt-3">
                          <span className="text-sm text-gray-400">Potential Side Effects:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {medication.sideEffects.map((effect, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {effect}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-400">Adherence</span>
                          <span className="text-sm text-white">{medication.adherence}%</span>
                        </div>
                        <Progress value={medication.adherence} className="h-2" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="text-teal-400">Medication Schedule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-teal-300">Today's Schedule</h4>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-teal-900/10">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <div>
                            <p className="text-sm font-medium text-white">Dexamethasone 4mg</p>
                            <p className="text-xs text-gray-400">8:00 AM</p>
                          </div>
                        </div>
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg bg-teal-900/10">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                          <div>
                            <p className="text-sm font-medium text-white">Levetiracetam 500mg</p>
                            <p className="text-xs text-gray-400">12:00 PM</p>
                          </div>
                        </div>
                        <Clock className="h-4 w-4 text-yellow-400" />
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg bg-teal-900/10">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                          <div>
                            <p className="text-sm font-medium text-white">Dexamethasone 4mg</p>
                            <p className="text-xs text-gray-400">8:00 PM</p>
                          </div>
                        </div>
                        <Clock className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-teal-500/30">
                    <h4 className="text-sm font-medium text-teal-300 mb-3">Adherence Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 rounded-lg bg-teal-900/20">
                        <div className="text-lg font-bold text-green-400">97%</div>
                        <p className="text-xs text-gray-400">This Week</p>
                      </div>
                      <div className="p-3 rounded-lg bg-teal-900/20">
                        <div className="text-lg font-bold text-teal-400">95%</div>
                        <p className="text-xs text-gray-400">This Month</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-teal-400 flex items-center gap-2">
                  <Calendar className="h-6 w-6" />
                  Treatment Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Calendar View */}
                  <div className="grid grid-cols-7 gap-2 text-center">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="p-2 text-sm font-medium text-teal-300">
                        {day}
                      </div>
                    ))}

                    {/* Calendar days - simplified representation */}
                    {Array.from({ length: 35 }, (_, i) => {
                      const day = i - 6 // Start from previous month
                      const isCurrentMonth = day > 0 && day <= 31
                      const hasAppointment = [5, 12, 19, 26].includes(day)
                      const hasMedication = isCurrentMonth && day % 3 === 0

                      return (
                        <div
                          key={i}
                          className={`p-2 h-16 rounded-lg border text-sm ${
                            isCurrentMonth
                              ? "border-teal-500/30 bg-teal-900/10"
                              : "border-gray-700 bg-gray-900/20 text-gray-600"
                          }`}
                        >
                          <div className="font-medium">{isCurrentMonth ? day : ""}</div>
                          <div className="space-y-1 mt-1">
                            {hasAppointment && <div className="w-2 h-2 rounded-full bg-red-400 mx-auto"></div>}
                            {hasMedication && <div className="w-2 h-2 rounded-full bg-blue-400 mx-auto"></div>}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <span className="text-gray-300">Treatment Appointments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                      <span className="text-gray-300">Medication Schedule</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="effectiveness" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <EnhancedTreatmentRadar />

              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="text-teal-400 flex items-center gap-2">
                    <Target className="h-6 w-6" />
                    Treatment Response Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-teal-900/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-white">Tumor Size Reduction</span>
                        <span className="text-sm text-teal-400">-35%</span>
                      </div>
                      <Progress value={35} className="h-2" />
                      <p className="text-xs text-gray-400 mt-1">Compared to baseline</p>
                    </div>

                    <div className="p-4 rounded-lg bg-teal-900/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-white">Symptom Improvement</span>
                        <span className="text-sm text-teal-400">+42%</span>
                      </div>
                      <Progress value={42} className="h-2" />
                      <p className="text-xs text-gray-400 mt-1">Quality of life score</p>
                    </div>

                    <div className="p-4 rounded-lg bg-teal-900/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-white">Performance Status</span>
                        <span className="text-sm text-teal-400">85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                      <p className="text-xs text-gray-400 mt-1">Karnofsky Performance Scale</p>
                    </div>

                    <div className="p-4 rounded-lg bg-teal-900/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-white">Treatment Tolerance</span>
                        <span className="text-sm text-teal-400">78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                      <p className="text-xs text-gray-400 mt-1">Side effect management</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-teal-500/30">
                    <h4 className="text-sm font-medium text-teal-300 mb-3">Overall Treatment Response</h4>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-teal-400 mb-1">Partial Response</div>
                      <p className="text-sm text-gray-400">RECIST Criteria</p>
                      <Badge variant="default" className="mt-2 bg-teal-600">
                        Responding Well
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-teal-400">Treatment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {treatmentPlans.map((treatment) => (
                    <div key={treatment.id} className="flex items-start gap-4 p-4 rounded-lg bg-teal-900/10">
                      <div className={`w-3 h-3 rounded-full mt-2 ${getStatusColor(treatment.status)}`}></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-white">{treatment.name}</h3>
                            <p className="text-sm text-gray-400 capitalize">{treatment.type}</p>
                          </div>
                          <Badge variant={getStatusBadge(treatment.status)}>{treatment.status}</Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                          <div>
                            <span className="text-gray-400">Start:</span>
                            <span className="text-white ml-2">
                              {new Date(treatment.startDate).toLocaleDateString()}
                            </span>
                          </div>
                          {treatment.endDate && (
                            <div>
                              <span className="text-gray-400">End:</span>
                              <span className="text-white ml-2">
                                {new Date(treatment.endDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-400">Effectiveness: {treatment.effectiveness}%</span>
                          <span className="text-sm text-gray-400">Progress: {treatment.progress}%</span>
                        </div>

                        {treatment.notes && (
                          <p className="text-sm text-gray-300 bg-teal-900/20 p-2 rounded mt-2">{treatment.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
