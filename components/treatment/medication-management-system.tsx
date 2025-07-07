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
  Pill,
  Clock,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Plus,
  Edit,
  Trash2,
  Bell,
  Activity,
  TrendingUp,
  TrendingDown,
  Syringe,
  Shield,
} from "lucide-react"

interface Medication {
  id: string
  name: string
  genericName: string
  dosage: string
  frequency: string
  route: "oral" | "iv" | "injection" | "topical"
  startDate: string
  endDate?: string
  status: "active" | "completed" | "discontinued" | "paused"
  adherence: number
  sideEffects: string[]
  interactions: string[]
  notes: string
  prescribedBy: string
  category: "chemotherapy" | "supportive" | "pain" | "antiemetic" | "steroid" | "other"
}

interface DosageSchedule {
  id: string
  medicationId: string
  time: string
  dose: string
  taken: boolean
  takenAt?: string
  notes?: string
}

interface SideEffect {
  id: string
  medicationId: string
  effect: string
  severity: "mild" | "moderate" | "severe"
  frequency: "rare" | "occasional" | "frequent"
  reportedDate: string
}

export function MedicationManagementSystem() {
  const [activeTab, setActiveTab] = useState("current")
  const [selectedMedication, setSelectedMedication] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const [medications, setMedications] = useState<Medication[]>([
    {
      id: "med1",
      name: "Temozolomide",
      genericName: "Temozolomide",
      dosage: "150 mg/m²",
      frequency: "Once daily for 5 days",
      route: "oral",
      startDate: "2024-01-15",
      status: "active",
      adherence: 95,
      sideEffects: ["Nausea", "Fatigue", "Thrombocytopenia"],
      interactions: ["Valproic acid"],
      notes: "Take on empty stomach. Monitor blood counts weekly.",
      prescribedBy: "Dr. Smith",
      category: "chemotherapy",
    },
    {
      id: "med2",
      name: "Ondansetron",
      genericName: "Ondansetron HCl",
      dosage: "8 mg",
      frequency: "Every 8 hours as needed",
      route: "oral",
      startDate: "2024-01-15",
      status: "active",
      adherence: 88,
      sideEffects: ["Headache", "Constipation"],
      interactions: [],
      notes: "For nausea control. Can be taken with or without food.",
      prescribedBy: "Dr. Smith",
      category: "antiemetic",
    },
    {
      id: "med3",
      name: "Dexamethasone",
      genericName: "Dexamethasone",
      dosage: "4 mg",
      frequency: "Twice daily",
      route: "oral",
      startDate: "2024-01-10",
      status: "active",
      adherence: 92,
      sideEffects: ["Increased appetite", "Mood changes", "Insomnia"],
      interactions: ["NSAIDs", "Warfarin"],
      notes: "Take with food. Taper dose gradually.",
      prescribedBy: "Dr. Johnson",
      category: "steroid",
    },
  ])

  const [todaysSchedule, setTodaysSchedule] = useState<DosageSchedule[]>([
    {
      id: "dose1",
      medicationId: "med1",
      time: "08:00",
      dose: "150 mg",
      taken: true,
      takenAt: "08:15",
    },
    {
      id: "dose2",
      medicationId: "med2",
      time: "12:00",
      dose: "8 mg",
      taken: true,
      takenAt: "12:05",
    },
    {
      id: "dose3",
      medicationId: "med2",
      time: "20:00",
      dose: "8 mg",
      taken: false,
    },
    {
      id: "dose4",
      medicationId: "med3",
      time: "08:00",
      dose: "4 mg",
      taken: true,
      takenAt: "08:10",
    },
    {
      id: "dose5",
      medicationId: "med3",
      time: "20:00",
      dose: "4 mg",
      taken: false,
    },
  ])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "chemotherapy": return "bg-red-900/20 border-red-500/50 text-red-400"
      case "supportive": return "bg-blue-900/20 border-blue-500/50 text-blue-400"
      case "pain": return "bg-orange-900/20 border-orange-500/50 text-orange-400"
      case "antiemetic": return "bg-green-900/20 border-green-500/50 text-green-400"
      case "steroid": return "bg-purple-900/20 border-purple-500/50 text-purple-400"
      default: return "bg-gray-900/20 border-gray-500/50 text-gray-400"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-400"
      case "completed": return "text-blue-400"
      case "discontinued": return "text-red-400"
      case "paused": return "text-yellow-400"
      default: return "text-gray-400"
    }
  }

  const getRouteIcon = (route: string) => {
    switch (route) {
      case "oral": return <Pill className="h-4 w-4" />
      case "iv": return <Syringe className="h-4 w-4" />
      case "injection": return <Syringe className="h-4 w-4" />
      default: return <Pill className="h-4 w-4" />
    }
  }

  const markDoseTaken = (doseId: string) => {
    setTodaysSchedule(prev => prev.map(dose => 
      dose.id === doseId 
        ? { ...dose, taken: true, takenAt: new Date().toLocaleTimeString() }
        : dose
    ))
  }

  const getTodaysAdherence = () => {
    const totalDoses = todaysSchedule.length
    const takenDoses = todaysSchedule.filter(dose => dose.taken).length
    return totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0
  }

  const getUpcomingDoses = () => {
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()
    
    return todaysSchedule
      .filter(dose => !dose.taken)
      .filter(dose => {
        const [hours, minutes] = dose.time.split(':').map(Number)
        const doseTime = hours * 60 + minutes
        return doseTime >= currentTime
      })
      .sort((a, b) => {
        const [aHours, aMinutes] = a.time.split(':').map(Number)
        const [bHours, bMinutes] = b.time.split(':').map(Number)
        return (aHours * 60 + aMinutes) - (bHours * 60 + bMinutes)
      })
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-glow">
          <CardContent className="p-4 text-center">
            <Pill className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-400">
              {medications.filter(m => m.status === "active").length}
            </div>
            <p className="text-sm text-gray-400">Active Medications</p>
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-400">{getTodaysAdherence()}%</div>
            <p className="text-sm text-gray-400">Today's Adherence</p>
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardContent className="p-4 text-center">
            <Bell className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-400">{getUpcomingDoses().length}</div>
            <p className="text-sm text-gray-400">Upcoming Doses</p>
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-400">
              {medications.reduce((sum, med) => sum + med.interactions.length, 0)}
            </div>
            <p className="text-sm text-gray-400">Drug Interactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="card-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-teal-400 flex items-center gap-2">
              <Pill className="h-5 w-5" />
              Medication Management
            </CardTitle>
            <Button
              onClick={() => setShowAddForm(true)}
              className="btn-glow-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Medication
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 bg-teal-900/20 mb-6">
              <TabsTrigger value="current" className="data-[state=active]:bg-teal-600 text-xs">
                Current Meds
              </TabsTrigger>
              <TabsTrigger value="schedule" className="data-[state=active]:bg-teal-600 text-xs">
                Today's Schedule
              </TabsTrigger>
              <TabsTrigger value="adherence" className="data-[state=active]:bg-teal-600 text-xs">
                Adherence
              </TabsTrigger>
              <TabsTrigger value="interactions" className="data-[state=active]:bg-teal-600 text-xs">
                Interactions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="space-y-4">
              {medications.filter(med => med.status === "active").map((medication) => (
                <Card
                  key={medication.id}
                  className={`cursor-pointer transition-all ${
                    selectedMedication === medication.id
                      ? "border-teal-400 bg-teal-900/20"
                      : "bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70"
                  }`}
                  onClick={() => setSelectedMedication(medication.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getRouteIcon(medication.route)}
                          <h4 className="text-white font-medium">{medication.name}</h4>
                          <Badge className={getCategoryColor(medication.category)}>
                            {medication.category}
                          </Badge>
                          <Badge variant="outline" className={getStatusColor(medication.status)}>
                            {medication.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-300 mb-2">{medication.genericName}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Dosage:</span>
                            <div className="text-white">{medication.dosage}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Frequency:</span>
                            <div className="text-white">{medication.frequency}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Route:</span>
                            <div className="text-white capitalize">{medication.route}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Adherence:</span>
                            <div className="text-white">{medication.adherence}%</div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <Progress value={medication.adherence} className="h-2" />
                        </div>
                        {medication.sideEffects.length > 0 && (
                          <div className="mt-3">
                            <span className="text-xs text-gray-400">Side Effects:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {medication.sideEffects.map((effect, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {effect}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="text-xs">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-white mb-2">
                  Today's Medication Schedule
                </h3>
                <p className="text-sm text-gray-400">
                  {todaysSchedule.filter(d => d.taken).length} of {todaysSchedule.length} doses taken
                </p>
              </div>
              
              {todaysSchedule.map((dose) => {
                const medication = medications.find(m => m.id === dose.medicationId)
                if (!medication) return null

                return (
                  <Card
                    key={dose.id}
                    className={`${
                      dose.taken
                        ? "bg-green-900/20 border-green-500/50"
                        : "bg-slate-800/50 border-slate-700/50"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {dose.taken ? (
                            <CheckCircle className="h-5 w-5 text-green-400" />
                          ) : (
                            <Clock className="h-5 w-5 text-yellow-400" />
                          )}
                          <div>
                            <h4 className="text-white font-medium">{medication.name}</h4>
                            <p className="text-sm text-gray-400">
                              {dose.dose} at {dose.time}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {dose.taken ? (
                            <Badge variant="default" className="text-xs">
                              Taken at {dose.takenAt}
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => markDoseTaken(dose.id)}
                              className="btn-glow-primary"
                            >
                              Mark Taken
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </TabsContent>

            <TabsContent value="adherence" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Weekly Adherence</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {medications.filter(m => m.status === "active").map((med) => (
                        <div key={med.id} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">{med.name}</span>
                            <span className="text-white">{med.adherence}%</span>
                          </div>
                          <Progress value={med.adherence} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Adherence Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-gray-300">
                          Overall adherence improved by 5% this week
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-red-400" />
                        <span className="text-sm text-gray-300">
                          Missed 2 doses of Ondansetron yesterday
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-400" />
                        <span className="text-sm text-gray-300">
                          Perfect adherence for Temozolomide this cycle
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="interactions" className="space-y-4">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Drug Interactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {medications
                      .filter(med => med.interactions.length > 0)
                      .map((medication) => (
                        <div
                          key={medication.id}
                          className="p-3 rounded-lg bg-yellow-900/20 border border-yellow-500/50"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-400" />
                            <h4 className="text-white font-medium">{medication.name}</h4>
                          </div>
                          <div className="space-y-1">
                            {medication.interactions.map((interaction, index) => (
                              <div key={index} className="text-sm text-gray-300">
                                • Interacts with {interaction}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
