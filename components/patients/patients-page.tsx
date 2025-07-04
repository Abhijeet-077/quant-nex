"use client"

import type React from "react"

import { useState } from "react"
import {
  AlertTriangle,
  ChevronRight,
  Download,
  FileText,
  Filter,
  Loader2,
  Plus,
  Search,
  Share2,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainLayout } from "../layout/main-layout"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function PatientsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate search
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  // Mock patient data
  const patients = [
    {
      id: "P-1001",
      firstName: "Priya",
      lastName: "Sharma",
      age: 42,
      gender: "Female",
      cancerType: "Glioblastoma",
      stage: "IV",
      status: "active",
      treatmentProgress: 65,
      lastVisit: "2025-05-10",
    },
    {
      id: "P-1002",
      firstName: "Arjun",
      lastName: "Patel",
      age: 56,
      gender: "Male",
      cancerType: "Lung Carcinoma",
      stage: "III",
      status: "active",
      treatmentProgress: 42,
      lastVisit: "2025-05-08",
    },
    {
      id: "P-1003",
      firstName: "Sneha",
      lastName: "Gupta",
      age: 38,
      gender: "Female",
      cancerType: "Breast Cancer",
      stage: "II",
      status: "remission",
      treatmentProgress: 100,
      lastVisit: "2025-05-05",
    },
    {
      id: "P-1004",
      firstName: "Rajesh",
      lastName: "Kumar",
      age: 61,
      gender: "Male",
      cancerType: "Melanoma",
      stage: "III",
      status: "critical",
      treatmentProgress: 28,
      lastVisit: "2025-05-12",
    },
    {
      id: "P-1005",
      firstName: "Kavya",
      lastName: "Singh",
      age: 45,
      gender: "Female",
      cancerType: "Lymphoma",
      stage: "II",
      status: "active",
      treatmentProgress: 75,
      lastVisit: "2025-05-07",
    },
    {
      id: "P-1006",
      firstName: "Vikram",
      lastName: "Agarwal",
      age: 52,
      gender: "Male",
      cancerType: "Prostate Cancer",
      stage: "II",
      status: "active",
      treatmentProgress: 60,
      lastVisit: "2025-05-09",
    },
    {
      id: "P-1007",
      firstName: "Ananya",
      lastName: "Reddy",
      age: 34,
      gender: "Female",
      cancerType: "Ovarian Cancer",
      stage: "III",
      status: "active",
      treatmentProgress: 50,
      lastVisit: "2025-05-11",
    },
    {
      id: "P-1008",
      firstName: "Suresh",
      lastName: "Iyer",
      age: 67,
      gender: "Male",
      cancerType: "Colorectal Cancer",
      stage: "IV",
      status: "critical",
      treatmentProgress: 35,
      lastVisit: "2025-05-13",
    },
  ]

  // Filter patients based on search query and status filter
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      searchQuery === "" ||
      patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.cancerType.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || patient.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <h1 className="text-2xl sm:text-3xl font-bold"><span>Patients</span></h1>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Share2 className="h-4 w-4 mr-2" />
              <span>Share</span>
            </Button>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              <span>Export</span>
            </Button>
            <Dialog open={isAddPatientOpen} onOpenChange={setIsAddPatientOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  <span>Add Patient</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle><span>Add New Patient</span></DialogTitle>
                  <DialogDescription><span>Enter the patient's information to create a new record.</span></DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName"><span>First Name</span></Label>
                      <Input id="firstName" placeholder="Priya" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName"><span>Last Name</span></Label>
                      <Input id="lastName" placeholder="Sharma" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age"><span>Age</span></Label>
                      <Input id="age" type="number" placeholder="45" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender"><span>Gender</span></Label>
                      <Select>
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male"><span>Male</span></SelectItem>
                          <SelectItem value="female"><span>Female</span></SelectItem>
                          <SelectItem value="other"><span>Other</span></SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cancerType"><span>Cancer Type</span></Label>
                    <Input id="cancerType" placeholder="Glioblastoma" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stage"><span>Stage</span></Label>
                      <Select>
                        <SelectTrigger id="stage">
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="I"><span>Stage I</span></SelectItem>
                          <SelectItem value="II"><span>Stage II</span></SelectItem>
                          <SelectItem value="III"><span>Stage III</span></SelectItem>
                          <SelectItem value="IV"><span>Stage IV</span></SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status"><span>Status</span></Label>
                      <Select>
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active"><span>Active</span></SelectItem>
                          <SelectItem value="remission"><span>Remission</span></SelectItem>
                          <SelectItem value="critical"><span>Critical</span></SelectItem>
                          <SelectItem value="inactive"><span>Inactive</span></SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddPatientOpen(false)}>
                    <span>Cancel</span>
                  </Button>
                  <Button
                    onClick={() => {
                      // Handle adding patient
                      setIsAddPatientOpen(false)
                    }}
                  >
                    <span>Add Patient</span>
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="bg-black/10 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <form onSubmit={handleSearch} className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search patients by name, ID, or cancer type..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-8"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Search</span>}
              </Button>
            </form>

            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-400"><span>Status:</span></span>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all"><span>All Patients</span></SelectItem>
                  <SelectItem value="active"><span>Active</span></SelectItem>
                  <SelectItem value="remission"><span>Remission</span></SelectItem>
                  <SelectItem value="critical"><span>Critical</span></SelectItem>
                  <SelectItem value="inactive"><span>Inactive</span></SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all"><span>All Patients</span></TabsTrigger>
              <TabsTrigger value="recent"><span>Recent</span></TabsTrigger>
              <TabsTrigger value="critical"><span>Critical</span></TabsTrigger>
              <TabsTrigger value="remission"><span>Remission</span></TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-400"><span>Patient ID</span></th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-400"><span>Name</span></th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-400"><span>Age/Gender</span></th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-400"><span>Cancer Type</span></th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-400"><span>Stage</span></th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-400"><span>Status</span></th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-400"><span>Progress</span></th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-400"><span>Last Visit</span></th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-400"><span>Actions</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-4 py-6 text-center text-gray-400">
                          <span>No patients found matching your search criteria.</span>
                        </td>
                      </tr>
                    ) : (
                      filteredPatients.map((patient) => (
                        <tr key={patient.id} className="border-b border-gray-800 hover:bg-black/20">
                          <td className="px-4 py-4 text-sm"><span>{patient.id}</span></td>
                          <td className="px-4 py-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center mr-3">
                                <User className="h-4 w-4 text-cyan-500" />
                              </div>
                              <div>
                                <div className="font-medium">
                                  <span>{patient.firstName} {patient.lastName}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <span>{patient.age} / {patient.gender}</span>
                          </td>
                          <td className="px-4 py-4 text-sm"><span>{patient.cancerType}</span></td>
                          <td className="px-4 py-4 text-sm"><span>Stage {patient.stage}</span></td>
                          <td className="px-4 py-4 text-sm">
                            <StatusBadge status={patient.status} />
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <div className="w-32">
                              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-green-500 rounded-full"
                                  style={{ width: `${patient.treatmentProgress}%` }}
                                />
                              </div>
                              <p className="text-xs text-white/50 text-right mt-1"><span>{patient.treatmentProgress}%</span></p>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm"><span>{patient.lastVisit}</span></td>
                          <td className="px-4 py-4 text-sm">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <ChevronRight className="h-4 w-4" />
                              <span className="sr-only"><span>View patient</span></span>
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="recent">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPatients
                  .sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime())
                  .slice(0, 6)
                  .map((patient) => (
                    <PatientCard key={patient.id} patient={patient} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="critical">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPatients
                  .filter((patient) => patient.status === "critical")
                  .map((patient) => (
                    <PatientCard key={patient.id} patient={patient} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="remission">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPatients
                  .filter((patient) => patient.status === "remission")
                  .map((patient) => (
                    <PatientCard key={patient.id} patient={patient} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="bg-black/10 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <h2 className="text-xl font-semibold mb-4"><span>Patient Reports</span></h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors cursor-pointer">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-cyan-500 mr-3" />
                <span className="text-white"><span>Monthly Patient Summary</span></span>
              </div>
              <Download className="h-4 w-4 text-gray-400" />
            </div>

            <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors cursor-pointer">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-purple-500 mr-3" />
                <span className="text-white"><span>Treatment Efficacy Analysis</span></span>
              </div>
              <Download className="h-4 w-4 text-gray-400" />
            </div>

            <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors cursor-pointer">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-pink-500 mr-3" />
                <span className="text-white"><span>Patient Demographics Report</span></span>
              </div>
              <Download className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="bg-black/10 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <h2 className="text-xl font-semibold mb-4"><span>Critical Alerts</span></h2>
          <div className="space-y-3">
            {filteredPatients
              .filter((patient) => patient.status === "critical")
              .map((patient) => (
                <div key={`alert-${patient.id}`} className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    <h4 className="font-semibold text-red-400">
                      <span>Critical Status: {patient.firstName} {patient.lastName}</span>
                    </h4>
                  </div>
                  <p className="text-sm text-gray-300">
                    <span>Patient with {patient.cancerType} (Stage {patient.stage}) requires immediate attention. Treatment
                    progress at {patient.treatmentProgress}%.</span>
                  </p>
                  <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                    <span><span>Last visit: {patient.lastVisit}</span></span>
                    <Button variant="outline" size="sm" className="h-7 px-2">
                      <span>View Details</span>
                    </Button>
                  </div>
                </div>
              ))}

            {filteredPatients.filter((patient) => patient.status === "critical").length === 0 && (
              <div className="p-6 text-center text-gray-400">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                <p><span>No critical alerts at this time.</span></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { color: string; label: string }> = {
    active: { color: "bg-green-500", label: "Active" },
    remission: { color: "bg-cyan-500", label: "Remission" },
    critical: { color: "bg-red-500", label: "Critical" },
    deceased: { color: "bg-gray-500", label: "Deceased" },
    inactive: { color: "bg-yellow-500", label: "Inactive" },
  }

  const config = statusConfig[status] || { color: "bg-gray-500", label: status }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <span>{config.label}</span>
    </span>
  )
}

function PatientCard({ patient }: { patient: any }) {
  return (
    <div className="bg-black/20 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-colors">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center mr-3">
          <User className="h-6 w-6 text-cyan-500" />
        </div>
        <div>
          <h3 className="font-semibold text-white">
            <span>{patient.firstName} {patient.lastName}</span>
          </h3>
          <p className="text-sm text-gray-400"><span>{patient.id}</span></p>
        </div>
        <StatusBadge status={patient.status} className="ml-auto" />
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div>
          <p className="text-xs text-gray-400"><span>Age/Gender</span></p>
          <p className="text-sm">
            <span>{patient.age} / {patient.gender}</span>
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400"><span>Cancer Type</span></p>
          <p className="text-sm"><span>{patient.cancerType}</span></p>
        </div>
        <div>
          <p className="text-xs text-gray-400"><span>Stage</span></p>
          <p className="text-sm"><span>Stage {patient.stage}</span></p>
        </div>
        <div>
          <p className="text-xs text-gray-400"><span>Last Visit</span></p>
          <p className="text-sm"><span>{patient.lastVisit}</span></p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <p className="text-xs text-gray-400"><span>Treatment Progress</span></p>
          <p className="text-xs text-white"><span>{patient.treatmentProgress}%</span></p>
        </div>
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full" style={{ width: `${patient.treatmentProgress}%` }} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" size="sm">
          <span>View Details</span>
        </Button>
      </div>
    </div>
  )
}
