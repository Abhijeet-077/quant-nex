"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  Brain,
  Activity,
  Users,
  TrendingUp,
  Heart,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  RefreshCw,
  Eye,
  Stethoscope,
  Calendar,
  FileText,
} from "lucide-react"

const patientData = [
  { month: 'Jan', patients: 45, diagnoses: 38, treatments: 42 },
  { month: 'Feb', patients: 52, diagnoses: 45, treatments: 48 },
  { month: 'Mar', patients: 48, diagnoses: 41, treatments: 45 },
  { month: 'Apr', patients: 61, diagnoses: 55, treatments: 58 },
  { month: 'May', patients: 55, diagnoses: 49, treatments: 52 },
  { month: 'Jun', patients: 67, diagnoses: 62, treatments: 64 },
]

const diagnosisData = [
  { name: 'Brain Tumor', value: 35, color: '#ef4444' },
  { name: 'Stroke', value: 25, color: '#f59e0b' },
  { name: 'Epilepsy', value: 20, color: '#10b981' },
  { name: 'Migraine', value: 15, color: '#3b82f6' },
  { name: 'Other', value: 5, color: '#8b5cf6' },
]

const recentPatients = [
  { id: 1, name: 'Rajesh Kumar', age: 45, condition: 'Brain Tumor', status: 'Critical', lastVisit: '2024-02-20' },
  { id: 2, name: 'Priya Sharma', age: 38, condition: 'Stroke', status: 'Stable', lastVisit: '2024-02-19' },
  { id: 3, name: 'Amit Patel', age: 52, condition: 'Epilepsy', status: 'Improving', lastVisit: '2024-02-18' },
  { id: 4, name: 'Sunita Devi', age: 41, condition: 'Migraine', status: 'Stable', lastVisit: '2024-02-17' },
]

export function WorkingDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('month')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Critical': return 'bg-red-500'
      case 'Stable': return 'bg-green-500'
      case 'Improving': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6 px-6 pb-6 bg-slate-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Medical Dashboard</h1>
          <p className="text-gray-400 mt-1">AI-Powered Healthcare Analytics</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="glow-hover bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button className="btn-glow-primary">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Patients</p>
                <p className="text-2xl font-bold text-white">1,247</p>
                <p className="text-xs text-green-400 mt-1">+12% from last month</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Treatments</p>
                <p className="text-2xl font-bold text-white">892</p>
                <p className="text-xs text-green-400 mt-1">+8% from last month</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-full">
                <Activity className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Critical Cases</p>
                <p className="text-2xl font-bold text-white">23</p>
                <p className="text-xs text-red-400 mt-1">-5% from last month</p>
              </div>
              <div className="p-3 bg-red-500/20 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Success Rate</p>
                <p className="text-2xl font-bold text-white">87.5%</p>
                <p className="text-xs text-green-400 mt-1">+3% from last month</p>
              </div>
              <div className="p-3 bg-teal-500/20 rounded-full">
                <TrendingUp className="h-6 w-6 text-teal-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Trends */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="text-teal-400 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Patient Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={patientData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="patients"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  name="Patients"
                />
                <Line
                  type="monotone"
                  dataKey="diagnoses"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Diagnoses"
                />
                <Line
                  type="monotone"
                  dataKey="treatments"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  name="Treatments"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Diagnosis Distribution */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="text-teal-400 flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Diagnosis Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={diagnosisData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {diagnosisData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Patients */}
      <Card className="card-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-teal-400 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recent Patients
            </CardTitle>
            <Button variant="outline" size="sm" className="glow-hover bg-transparent">
              <Eye className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPatients.map((patient) => (
              <div
                key={patient.id}
                className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{patient.name}</h4>
                    <p className="text-gray-400 text-sm">Age: {patient.age} • {patient.condition}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    className={`${getStatusColor(patient.status)} text-white`}
                  >
                    {patient.status}
                  </Badge>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Last Visit</p>
                    <p className="text-white text-sm">{patient.lastVisit}</p>
                  </div>
                  <Button variant="outline" size="sm" className="glow-hover bg-transparent">
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-glow">
          <CardContent className="p-6 text-center">
            <div className="p-4 bg-blue-500/20 rounded-full w-fit mx-auto mb-4">
              <Stethoscope className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">New Diagnosis</h3>
            <p className="text-gray-400 text-sm mb-4">Start AI-powered diagnosis for a new patient</p>
            <Button className="btn-glow-primary w-full">
              Start Diagnosis
            </Button>
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardContent className="p-6 text-center">
            <div className="p-4 bg-green-500/20 rounded-full w-fit mx-auto mb-4">
              <Calendar className="h-8 w-8 text-green-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Schedule Treatment</h3>
            <p className="text-gray-400 text-sm mb-4">Plan and schedule treatment sessions</p>
            <Button className="btn-glow-accent w-full">
              Schedule Now
            </Button>
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardContent className="p-6 text-center">
            <div className="p-4 bg-purple-500/20 rounded-full w-fit mx-auto mb-4">
              <FileText className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Generate Report</h3>
            <p className="text-gray-400 text-sm mb-4">Create comprehensive medical reports</p>
            <Button className="btn-glow-secondary w-full">
              Create Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
