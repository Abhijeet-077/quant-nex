"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  Calendar,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react"

interface Patient {
  id: string
  name: string
  age: number
  gender: "male" | "female" | "other"
  condition: string
  status: "active" | "stable" | "critical" | "recovered"
  lastVisit: string
  nextAppointment?: string
  phone: string
  email: string
  address: string
  emergencyContact: string
  riskLevel: "low" | "medium" | "high"
  treatmentPlan: string
  notes: string
}

export function PatientsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  const [patients] = useState<Patient[]>([
    {
      id: "1",
      name: "Rajesh Kumar Sharma",
      age: 45,
      gender: "male",
      condition: "Glioblastoma Multiforme",
      status: "active",
      lastVisit: "2024-01-15",
      nextAppointment: "2024-01-22",
      phone: "+91 98765 43210",
      email: "rajesh.sharma@email.com",
      address: "123 MG Road, Mumbai, Maharashtra 400001",
      emergencyContact: "Priya Sharma (Wife) - +91 98765 43211",
      riskLevel: "high",
      treatmentPlan: "Concurrent chemoradiation therapy",
      notes: "Patient responding well to treatment. Monitor for side effects.",
    },
    {
      id: "2",
      name: "Priya Patel",
      age: 38,
      gender: "female",
      condition: "Meningioma",
      status: "stable",
      lastVisit: "2024-01-10",
      nextAppointment: "2024-02-10",
      phone: "+91 87654 32109",
      email: "priya.patel@email.com",
      address: "456 Park Street, Delhi, Delhi 110001",
      emergencyContact: "Amit Patel (Husband) - +91 87654 32108",
      riskLevel: "low",
      treatmentPlan: "Regular monitoring with MRI",
      notes: "Stable condition. Continue current monitoring schedule.",
    },
    {
      id: "3",
      name: "Amit Singh",
      age: 62,
      gender: "male",
      condition: "Astrocytoma Grade II",
      status: "critical",
      lastVisit: "2024-01-18",
      nextAppointment: "2024-01-20",
      phone: "+91 76543 21098",
      email: "amit.singh@email.com",
      address: "789 Brigade Road, Bangalore, Karnataka 560001",
      emergencyContact: "Sunita Singh (Wife) - +91 76543 21097",
      riskLevel: "high",
      treatmentPlan: "Post-surgical radiation therapy",
      notes: "Recent surgery completed. Starting radiation therapy next week.",
    },
    {
      id: "4",
      name: "Sunita Gupta",
      age: 29,
      gender: "female",
      condition: "Pituitary Adenoma",
      status: "recovered",
      lastVisit: "2024-01-05",
      nextAppointment: "2024-03-05",
      phone: "+91 65432 10987",
      email: "sunita.gupta@email.com",
      address: "321 Civil Lines, Jaipur, Rajasthan 302001",
      emergencyContact: "Ravi Gupta (Husband) - +91 65432 10986",
      riskLevel: "low",
      treatmentPlan: "Follow-up monitoring",
      notes: "Successful treatment completed. Regular follow-ups scheduled.",
    },
    {
      id: "5",
      name: "Mohammed Ali",
      age: 55,
      gender: "male",
      condition: "Brain Metastases",
      status: "active",
      lastVisit: "2024-01-12",
      nextAppointment: "2024-01-25",
      phone: "+91 54321 09876",
      email: "mohammed.ali@email.com",
      address: "654 Charminar Road, Hyderabad, Telangana 500001",
      emergencyContact: "Fatima Ali (Wife) - +91 54321 09875",
      riskLevel: "high",
      treatmentPlan: "Stereotactic radiosurgery",
      notes: "Multiple brain metastases. Planning targeted radiation treatment.",
    },
  ])

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || patient.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-500"
      case "stable":
        return "bg-green-500"
      case "critical":
        return "bg-red-500"
      case "recovered":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "stable":
        return "default"
      case "critical":
        return "destructive"
      case "recovered":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "text-red-400"
      case "medium":
        return "text-yellow-400"
      case "low":
        return "text-green-400"
      default:
        return "text-gray-400"
    }
  }

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "default"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="h-4 w-4 text-blue-400" />
      case "stable":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-400" />
      case "recovered":
        return <CheckCircle className="h-4 w-4 text-purple-400" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getPatientsByStatus = (status: string) => {
    return patients.filter((patient) => patient.status === status).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-teal-400 flex items-center gap-3">
              <Users className="h-8 w-8" />
              Patient Management
            </h1>
            <p className="text-gray-300 mt-2">Comprehensive patient records and care coordination</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="glow-hover bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filter
            </Button>
            <Button className="btn-glow-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Patient
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="card-glow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-teal-400 mb-1">{patients.length}</div>
              <p className="text-sm text-gray-400">Total Patients</p>
            </CardContent>
          </Card>
          <Card className="card-glow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">{getPatientsByStatus("active")}</div>
              <p className="text-sm text-gray-400">Active Treatment</p>
            </CardContent>
          </Card>
          <Card className="card-glow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-400 mb-1">{getPatientsByStatus("critical")}</div>
              <p className="text-sm text-gray-400">Critical Cases</p>
            </CardContent>
          </Card>
          <Card className="card-glow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">{getPatientsByStatus("stable")}</div>
              <p className="text-sm text-gray-400">Stable Condition</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="card-glow">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search patients by name or condition..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-teal-900/20 border-teal-500/30"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-48 bg-teal-900/20 border-teal-500/30">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Patients</SelectItem>
                  <SelectItem value="active">Active Treatment</SelectItem>
                  <SelectItem value="stable">Stable</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="recovered">Recovered</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-teal-900/20">
            <TabsTrigger value="all" className="data-[state=active]:bg-teal-600">
              All Patients
            </TabsTrigger>
            <TabsTrigger value="details" className="data-[state=active]:bg-teal-600">
              Patient Details
            </TabsTrigger>
            <TabsTrigger value="appointments" className="data-[state=active]:bg-teal-600">
              Appointments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-teal-400">Patient List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="p-4 rounded-lg border border-teal-500/30 bg-teal-900/10 hover:bg-teal-900/15 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedPatient(patient)
                        setActiveTab("details")
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src="/placeholder-avatar.jpg" />
                            <AvatarFallback className="bg-teal-500 text-white">
                              {patient.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>

                          <div>
                            <h3 className="font-semibold text-white">{patient.name}</h3>
                            <p className="text-sm text-gray-400">
                              {patient.age} years • {patient.gender}
                            </p>
                            <p className="text-sm text-gray-300">{patient.condition}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="flex items-center gap-2 mb-1">
                              {getStatusIcon(patient.status)}
                              <Badge variant={getStatusBadge(patient.status)}>{patient.status}</Badge>
                            </div>
                            <Badge variant={getRiskBadge(patient.riskLevel)} className="text-xs">
                              {patient.riskLevel} risk
                            </Badge>
                          </div>

                          <div className="text-right text-sm">
                            <p className="text-gray-400">Last Visit</p>
                            <p className="text-white">{new Date(patient.lastVisit).toLocaleDateString()}</p>
                            {patient.nextAppointment && (
                              <>
                                <p className="text-gray-400 mt-1">Next Appointment</p>
                                <p className="text-teal-400">
                                  {new Date(patient.nextAppointment).toLocaleDateString()}
                                </p>
                              </>
                            )}
                          </div>

                          <div className="flex flex-col gap-2">
                            <Button variant="outline" size="sm" className="glow-hover bg-transparent">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="glow-hover bg-transparent">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            {selectedPatient ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Patient Info */}
                <div className="lg:col-span-2 space-y-6">
                  <Card className="card-glow">
                    <CardHeader>
                      <CardTitle className="text-teal-400 flex items-center gap-2">
                        <Users className="h-6 w-6" />
                        Patient Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 mb-6">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src="/placeholder-avatar.jpg" />
                          <AvatarFallback className="bg-teal-500 text-white text-lg">
                            {selectedPatient.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h2 className="text-2xl font-bold text-white">{selectedPatient.name}</h2>
                          <p className="text-gray-400">
                            {selectedPatient.age} years • {selectedPatient.gender}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant={getStatusBadge(selectedPatient.status)}>{selectedPatient.status}</Badge>
                            <Badge variant={getRiskBadge(selectedPatient.riskLevel)}>
                              {selectedPatient.riskLevel} risk
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-teal-300 mb-2">Contact Information</h4>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-300">{selectedPatient.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-300">{selectedPatient.email}</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                                <span className="text-sm text-gray-300">{selectedPatient.address}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-teal-300 mb-2">Emergency Contact</h4>
                            <p className="text-sm text-gray-300">{selectedPatient.emergencyContact}</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-teal-300 mb-2">Medical Information</h4>
                            <div className="space-y-2">
                              <div>
                                <span className="text-sm text-gray-400">Condition:</span>
                                <p className="text-sm text-white">{selectedPatient.condition}</p>
                              </div>
                              <div>
                                <span className="text-sm text-gray-400">Treatment Plan:</span>
                                <p className="text-sm text-white">{selectedPatient.treatmentPlan}</p>
                              </div>
                              <div>
                                <span className="text-sm text-gray-400">Last Visit:</span>
                                <p className="text-sm text-white">
                                  {new Date(selectedPatient.lastVisit).toLocaleDateString()}
                                </p>
                              </div>
                              {selectedPatient.nextAppointment && (
                                <div>
                                  <span className="text-sm text-gray-400">Next Appointment:</span>
                                  <p className="text-sm text-teal-400">
                                    {new Date(selectedPatient.nextAppointment).toLocaleDateString()}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {selectedPatient.notes && (
                        <div>
                          <h4 className="text-sm font-medium text-teal-300 mb-2">Clinical Notes</h4>
                          <p className="text-sm text-gray-300 bg-teal-900/20 p-3 rounded-lg">{selectedPatient.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                  <Card className="card-glow">
                    <CardHeader>
                      <CardTitle className="text-teal-400">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full btn-glow-primary">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Appointment
                      </Button>
                      <Button variant="outline" className="w-full glow-hover bg-transparent">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Patient Info
                      </Button>
                      <Button variant="outline" className="w-full glow-hover bg-transparent">
                        <Eye className="h-4 w-4 mr-2" />
                        View Medical Records
                      </Button>
                      <Button variant="outline" className="w-full glow-hover bg-transparent">
                        <Phone className="h-4 w-4 mr-2" />
                        Contact Patient
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="card-glow">
                    <CardHeader>
                      <CardTitle className="text-teal-400">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm">
                        <p className="text-gray-400">Jan 15, 2024</p>
                        <p className="text-white">Completed MRI scan</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-400">Jan 10, 2024</p>
                        <p className="text-white">Started new medication</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-400">Jan 5, 2024</p>
                        <p className="text-white">Follow-up consultation</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card className="card-glow">
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300">Select a patient to view details</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-teal-400 flex items-center gap-2">
                  <Calendar className="h-6 w-6" />
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patients
                    .filter((patient) => patient.nextAppointment)
                    .sort((a, b) => new Date(a.nextAppointment!).getTime() - new Date(b.nextAppointment!).getTime())
                    .map((patient) => (
                      <div key={patient.id} className="p-4 rounded-lg bg-teal-900/10 border border-teal-500/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src="/placeholder-avatar.jpg" />
                              <AvatarFallback className="bg-teal-500 text-white">
                                {patient.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-white">{patient.name}</h3>
                              <p className="text-sm text-gray-400">{patient.condition}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm text-gray-400">Appointment</p>
                              <p className="text-sm text-teal-400">
                                {new Date(patient.nextAppointment!).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant={getStatusBadge(patient.status)}>{patient.status}</Badge>
                          </div>
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
