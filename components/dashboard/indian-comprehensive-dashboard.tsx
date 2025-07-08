"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Brain,
  Heart,
  Stethoscope,
  Calendar,
  MapPin,
  Phone,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Plus,
  Search,
  Filter,
  Download,
  Settings,
  Bell,
  User,
  FileText,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react"
import { RealTimeMonitoringPanel } from "./real-time-monitoring-panel"
import { EnhancedMedicalCharts } from "./widgets/enhanced-medical-charts"
import { InteractivePatientFlow } from "./widgets/interactive-patient-flow"
import { Brain3DDiagram } from "../visualization/brain-3d-diagram"

interface IndianPatient {
  id: string
  name: string
  age: number
  gender: string
  location: string
  state: string
  diagnosis: string
  stage: string
  status: "active" | "critical" | "stable" | "recovered"
  treatmentProgress: number
  doctor: string
  hospital: string
  lastVisit: string
  nextAppointment: string
  phone: string
  emergencyContact: string
}

interface HospitalData {
  name: string
  location: string
  patients: number
  capacity: number
  specialization: string[]
}

export function IndianComprehensiveDashboard() {
  const [selectedPatient, setSelectedPatient] = useState<IndianPatient | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")

  // Indian patient data with English names
  const [patients] = useState<IndianPatient[]>([
    {
      id: "P001",
      name: "Rajesh Kumar Sharma",
      age: 45,
      gender: "Male",
      location: "Mumbai, Maharashtra",
      state: "Maharashtra",
      diagnosis: "Glioblastoma Multiforme",
      stage: "Grade IV",
      status: "critical",
      treatmentProgress: 35,
      doctor: "Dr. Priya Patel",
      hospital: "Tata Memorial Hospital",
      lastVisit: "2024-01-15",
      nextAppointment: "2024-01-22",
      phone: "+91 98765 43210",
      emergencyContact: "+91 98765 43211",
    },
    {
      id: "P002",
      name: "Sunita Devi Gupta",
      age: 52,
      gender: "Female",
      location: "New Delhi",
      state: "Delhi",
      diagnosis: "Breast Carcinoma",
      stage: "Stage II",
      status: "active",
      treatmentProgress: 68,
      doctor: "Dr. Amit Gupta",
      hospital: "AIIMS Delhi",
      lastVisit: "2024-01-18",
      nextAppointment: "2024-01-25",
      phone: "+91 98765 43212",
      emergencyContact: "+91 98765 43213",
    },
    {
      id: "P003",
      name: "Mohammed Ali Khan",
      age: 38,
      gender: "Male",
      location: "Hyderabad, Telangana",
      state: "Telangana",
      diagnosis: "Lung Adenocarcinoma",
      stage: "Stage III",
      status: "stable",
      treatmentProgress: 82,
      doctor: "Dr. Rajesh Reddy",
      hospital: "Apollo Hospital Hyderabad",
      lastVisit: "2024-01-20",
      nextAppointment: "2024-01-27",
      phone: "+91 98765 43214",
      emergencyContact: "+91 98765 43215",
    },
    {
      id: "P004",
      name: "Lakshmi Iyer",
      age: 41,
      gender: "Female",
      location: "Chennai, Tamil Nadu",
      state: "Tamil Nadu",
      diagnosis: "Ovarian Cancer",
      stage: "Stage I",
      status: "recovered",
      treatmentProgress: 95,
      doctor: "Dr. Kamala Nair",
      hospital: "Apollo Chennai",
      lastVisit: "2024-01-12",
      nextAppointment: "2024-02-12",
      phone: "+91 98765 43216",
      emergencyContact: "+91 98765 43217",
    },
    {
      id: "P005",
      name: "Arjun Singh Rathore",
      age: 29,
      gender: "Male",
      location: "Jaipur, Rajasthan",
      state: "Rajasthan",
      diagnosis: "Hodgkin Lymphoma",
      stage: "Stage II",
      status: "active",
      treatmentProgress: 55,
      doctor: "Dr. Vikas Sharma",
      hospital: "Fortis Jaipur",
      lastVisit: "2024-01-19",
      nextAppointment: "2024-01-26",
      phone: "+91 98765 43218",
      emergencyContact: "+91 98765 43219",
    },
  ])

  const [hospitalData] = useState<HospitalData[]>([
    {
      name: "Tata Memorial Hospital",
      location: "Mumbai, Maharashtra",
      patients: 1250,
      capacity: 1500,
      specialization: ["Oncology", "Neuro-Oncology", "Radiation Oncology"],
    },
    {
      name: "AIIMS Delhi",
      location: "New Delhi",
      patients: 2100,
      capacity: 2500,
      specialization: ["Cancer Surgery", "Chemotherapy", "Immunotherapy"],
    },
    {
      name: "Apollo Hospital Hyderabad",
      location: "Hyderabad, Telangana",
      patients: 890,
      capacity: 1200,
      specialization: ["Lung Cancer", "Prostate Cancer", "Gastro Oncology"],
    },
    {
      name: "Apollo Chennai",
      location: "Chennai, Tamil Nadu",
      patients: 1050,
      capacity: 1300,
      specialization: ["Gynecologic Oncology", "Pediatric Oncology"],
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-500"
      case "active":
        return "bg-yellow-500"
      case "stable":
        return "bg-blue-500"
      case "recovered":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "critical":
        return "Critical"
      case "active":
        return "Active"
      case "stable":
        return "Stable"
      case "recovered":
        return "Recovered"
      default:
        return status
    }
  }

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background p-6 space-y-6 grid-pattern">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-teal-400">Quant-NEX Dashboard</h1>
          <p className="text-teal-300">Indian Cancer Diagnosis & Treatment System</p>
        </div>
        <div className="flex gap-2">
          <Button className="btn-glow-primary">
            <Bell className="h-4 w-4 mr-2" />
            Alerts (3)
          </Button>
          <Button variant="outline" className="glow-hover bg-transparent">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-glow animate-slide-up">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-teal-300">Total Patients</p>
                <p className="text-2xl font-bold text-teal-400">1,247</p>
                <p className="text-xs text-green-400 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% this month
                </p>
              </div>
              <Users className="h-8 w-8 text-teal-500 animate-float" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-glow animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-teal-300">Active Treatments</p>
                <p className="text-2xl font-bold text-teal-400">892</p>
                <p className="text-xs text-green-400 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8% this week
                </p>
              </div>
              <Stethoscope className="h-8 w-8 text-teal-500 animate-float" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-glow animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-teal-300">Critical Cases</p>
                <p className="text-2xl font-bold text-red-400">23</p>
                <p className="text-xs text-red-400 flex items-center mt-1">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -5% from yesterday
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500 pulse-medical" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-glow animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-teal-300">Success Rate</p>
                <p className="text-2xl font-bold text-green-400">87.5%</p>
                <p className="text-xs text-green-400 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +2.3% this month
                </p>
              </div>
              <Heart className="h-8 w-8 text-green-500 animate-pulse-glow" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 bg-teal-900/20">
          <TabsTrigger value="overview" className="data-[state=active]:bg-teal-600 text-xs">
            Overview
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="data-[state=active]:bg-teal-600 text-xs">
            Live Monitor
          </TabsTrigger>
          <TabsTrigger value="patients" className="data-[state=active]:bg-teal-600 text-xs">
            Patient Flow
          </TabsTrigger>
          <TabsTrigger value="visualization" className="data-[state=active]:bg-teal-600 text-xs">
            Brain 3D
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-teal-600 text-xs">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="hospitals" className="data-[state=active]:bg-teal-600 text-xs">
            Hospitals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monitoring" className="space-y-6">
          <RealTimeMonitoringPanel />
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Patients */}
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-teal-400">Recent Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patients.slice(0, 5).map((patient) => (
                    <div
                      key={patient.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-teal-900/10 hover:bg-teal-900/20 transition-colors cursor-pointer glow-hover"
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                          <User className="h-5 w-5 text-teal-400" />
                        </div>
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-xs text-teal-300">{patient.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(patient.status)}>{getStatusText(patient.status)}</Badge>
                        <p className="text-xs text-gray-400 mt-1">{patient.treatmentProgress}% Complete</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Hospital Capacity */}
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-teal-400">Hospital Capacity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hospitalData.map((hospital, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{hospital.name}</p>
                          <p className="text-sm text-gray-400">{hospital.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {hospital.patients}/{hospital.capacity}
                          </p>
                          <p className="text-xs text-teal-300">
                            {Math.round((hospital.patients / hospital.capacity) * 100)}% Occupied
                          </p>
                        </div>
                      </div>
                      <Progress value={(hospital.patients / hospital.capacity) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patients" className="space-y-6">
          <InteractivePatientFlow />
        </TabsContent>

        <TabsContent value="patients-old" className="space-y-6">
          {/* Search and Filter */}
          <Card className="card-glow">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search patient name, location..."
                    className="w-full pl-10 pr-4 py-2 bg-teal-900/20 border border-teal-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button className="btn-glow-primary">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button className="btn-glow-accent">
                  <Plus className="h-4 w-4 mr-2" />
                  New Patient
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Patients List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map((patient) => (
              <Card key={patient.id} className="card-glow cursor-pointer" onClick={() => setSelectedPatient(patient)}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-teal-400">{patient.name}</CardTitle>
                      <p className="text-sm text-gray-400">
                        {patient.age} years, {patient.gender}
                      </p>
                    </div>
                    <Badge className={getStatusColor(patient.status)}>{getStatusText(patient.status)}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-teal-400" />
                      <span>{patient.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Brain className="h-4 w-4 text-teal-400" />
                      <span>{patient.diagnosis}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-teal-400" />
                      <span>Next: {patient.nextAppointment}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Treatment Progress</span>
                        <span>{patient.treatmentProgress}%</span>
                      </div>
                      <Progress value={patient.treatmentProgress} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="visualization" className="space-y-6">
          <Brain3DDiagram />
        </TabsContent>

        <TabsContent value="hospitals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hospitalData.map((hospital, index) => (
              <Card key={index} className="card-glow">
                <CardHeader>
                  <CardTitle className="text-teal-400">{hospital.name}</CardTitle>
                  <p className="text-sm text-gray-400">{hospital.location}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Patients:</span>
                      <span className="font-bold text-teal-400">{hospital.patients}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Capacity:</span>
                      <span className="font-bold">{hospital.capacity}</span>
                    </div>
                    <div>
                      <p className="text-sm text-teal-300 mb-2">Specializations:</p>
                      <div className="flex flex-wrap gap-2">
                        {hospital.specialization.map((spec, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Progress value={(hospital.patients / hospital.capacity) * 100} className="h-3" />
                    <p className="text-xs text-center text-gray-400">
                      {Math.round((hospital.patients / hospital.capacity) * 100)}% Capacity Utilization
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-teal-400 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Patient Analytics Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Patients</span>
                    <span className="text-2xl font-bold text-teal-400">1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Active Cases</span>
                    <span className="text-2xl font-bold text-green-400">892</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Critical Cases</span>
                    <span className="text-2xl font-bold text-red-400">23</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Success Rate</span>
                    <span className="text-2xl font-bold text-blue-400">87.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-teal-400 flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Treatment Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Surgery</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                      <span className="text-white text-sm">45%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Chemotherapy</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                      <span className="text-white text-sm">30%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Radiation</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-700 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                      <span className="text-white text-sm">25%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <EnhancedMedicalCharts />
        </TabsContent>

        <TabsContent value="analytics-old" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-teal-400 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  State-wise Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Maharashtra</span>
                    <span className="font-bold">342</span>
                  </div>
                  <Progress value={68} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span>Delhi</span>
                    <span className="font-bold">298</span>
                  </div>
                  <Progress value={59} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span>Tamil Nadu</span>
                    <span className="font-bold">234</span>
                  </div>
                  <Progress value={47} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span>Telangana</span>
                    <span className="font-bold">189</span>
                  </div>
                  <Progress value={38} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-teal-400 flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Cancer Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Lung Cancer</span>
                    <Badge>28%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Breast Cancer</span>
                    <Badge>24%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Brain Tumors</span>
                    <Badge>18%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Others</span>
                    <Badge>30%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-teal-400 flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Monthly Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>New Cases</span>
                    <span className="text-green-400 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +15%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Recoveries</span>
                    <span className="text-green-400 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +22%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Treatment Rate</span>
                    <span className="text-green-400 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +8%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <Card className="card-glow max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-teal-400">{selectedPatient.name}</CardTitle>
                  <p className="text-gray-400">
                    {selectedPatient.age} years, {selectedPatient.gender}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedPatient(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-teal-300 mb-2">Personal Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Age:</span>
                        <span>{selectedPatient.age} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Gender:</span>
                        <span>{selectedPatient.gender}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Location:</span>
                        <span>{selectedPatient.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Phone:</span>
                        <span>{selectedPatient.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-teal-300 mb-2">Medical Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Diagnosis:</span>
                        <span>{selectedPatient.diagnosis}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Stage:</span>
                        <Badge variant="destructive">{selectedPatient.stage}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <Badge className={getStatusColor(selectedPatient.status)}>
                          {getStatusText(selectedPatient.status)}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Doctor:</span>
                        <span>{selectedPatient.doctor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Hospital:</span>
                        <span>{selectedPatient.hospital}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-teal-300 mb-2">Treatment Progress</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Completion:</span>
                        <span>{selectedPatient.treatmentProgress}%</span>
                      </div>
                      <Progress value={selectedPatient.treatmentProgress} className="h-3" />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-teal-300 mb-2">Appointments</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Visit:</span>
                        <span>{selectedPatient.lastVisit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Next Appointment:</span>
                        <span className="text-teal-400">{selectedPatient.nextAppointment}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-teal-300 mb-2">Emergency Contact</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-teal-400" />
                      <span>{selectedPatient.emergencyContact}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button className="btn-glow-primary flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  View Medical Records
                </Button>
                <Button className="btn-glow-accent flex-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </Button>
                <Button variant="outline" className="glow-hover bg-transparent">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
