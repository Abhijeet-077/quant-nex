"use client"

import { useState, useEffect } from "react"
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
} from "recharts"
import {
  Heart,
  Activity,
  Brain,
  Thermometer,
  Droplets,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wifi,
  WifiOff,
} from "lucide-react"

interface VitalSign {
  id: string
  name: string
  value: number
  unit: string
  normal: [number, number]
  icon: any
  color: string
  trend: number[]
}

interface Patient {
  id: string
  name: string
  room: string
  status: "stable" | "critical" | "warning"
  vitals: VitalSign[]
  lastUpdate: string
}

export function RealTimeMonitoringPanel() {
  const [isConnected, setIsConnected] = useState(true)
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)

  // Simulate real-time data
  useEffect(() => {
    const generateVitals = (): VitalSign[] => [
      {
        id: "heartRate",
        name: "Heart Rate",
        value: 72 + Math.random() * 20,
        unit: "bpm",
        normal: [60, 100],
        icon: Heart,
        color: "#ef4444",
        trend: Array.from({ length: 20 }, () => 70 + Math.random() * 25),
      },
      {
        id: "bloodPressure",
        name: "Blood Pressure",
        value: 120 + Math.random() * 20,
        unit: "mmHg",
        normal: [90, 140],
        icon: Activity,
        color: "#10b981",
        trend: Array.from({ length: 20 }, () => 115 + Math.random() * 30),
      },
      {
        id: "temperature",
        name: "Temperature",
        value: 36.5 + Math.random() * 2,
        unit: "°C",
        normal: [36, 37.5],
        icon: Thermometer,
        color: "#f59e0b",
        trend: Array.from({ length: 20 }, () => 36.2 + Math.random() * 2.5),
      },
      {
        id: "oxygenSat",
        name: "Oxygen Saturation",
        value: 95 + Math.random() * 5,
        unit: "%",
        normal: [95, 100],
        icon: Droplets,
        color: "#3b82f6",
        trend: Array.from({ length: 20 }, () => 94 + Math.random() * 6),
      },
      {
        id: "brainActivity",
        name: "Brain Activity",
        value: 40 + Math.random() * 30,
        unit: "Hz",
        normal: [30, 70],
        icon: Brain,
        color: "#8b5cf6",
        trend: Array.from({ length: 20 }, () => 35 + Math.random() * 35),
      },
    ]

    const initialPatients: Patient[] = [
      {
        id: "p1",
        name: "Rajesh Kumar",
        room: "ICU-101",
        status: "stable",
        vitals: generateVitals(),
        lastUpdate: new Date().toLocaleTimeString(),
      },
      {
        id: "p2",
        name: "Priya Sharma",
        room: "ICU-102",
        status: "critical",
        vitals: generateVitals(),
        lastUpdate: new Date().toLocaleTimeString(),
      },
      {
        id: "p3",
        name: "Amit Patel",
        room: "ICU-103",
        status: "warning",
        vitals: generateVitals(),
        lastUpdate: new Date().toLocaleTimeString(),
      },
    ]

    setPatients(initialPatients)
    setSelectedPatient(initialPatients[0].id)

    // Update data every 2 seconds
    const interval = setInterval(() => {
      setPatients(prev => prev.map(patient => ({
        ...patient,
        vitals: generateVitals(),
        lastUpdate: new Date().toLocaleTimeString(),
      })))
    }, 2000)

    // Simulate connection issues occasionally
    const connectionInterval = setInterval(() => {
      setIsConnected(prev => Math.random() > 0.1 ? true : !prev)
    }, 10000)

    return () => {
      clearInterval(interval)
      clearInterval(connectionInterval)
    }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "stable": return "text-green-400 bg-green-400/20"
      case "critical": return "text-red-400 bg-red-400/20"
      case "warning": return "text-yellow-400 bg-yellow-400/20"
      default: return "text-gray-400 bg-gray-400/20"
    }
  }

  const isVitalNormal = (vital: VitalSign) => {
    return vital.value >= vital.normal[0] && vital.value <= vital.normal[1]
  }

  const selectedPatientData = patients.find(p => p.id === selectedPatient)

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className="card-glow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isConnected ? (
                <Wifi className="h-5 w-5 text-green-400" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-400" />
              )}
              <span className={`font-medium ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                {isConnected ? 'Connected to Monitoring System' : 'Connection Lost'}
              </span>
            </div>
            <Badge className={isConnected ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'}>
              {isConnected ? 'Online' : 'Offline'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Patient List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {patients.map((patient) => (
          <Card 
            key={patient.id} 
            className={`card-glow cursor-pointer transition-all ${
              selectedPatient === patient.id ? 'ring-2 ring-teal-400' : ''
            }`}
            onClick={() => setSelectedPatient(patient.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium">{patient.name}</h3>
                <Badge className={getStatusColor(patient.status)}>
                  {patient.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Room:</span>
                  <span className="text-white">{patient.room}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Last Update:</span>
                  <span className="text-white">{patient.lastUpdate}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {patient.vitals.slice(0, 4).map((vital) => {
                    const Icon = vital.icon
                    return (
                      <div key={vital.id} className="flex items-center gap-2">
                        <Icon className={`h-4 w-4`} style={{ color: vital.color }} />
                        <span className={`text-xs ${isVitalNormal(vital) ? 'text-green-400' : 'text-red-400'}`}>
                          {vital.value.toFixed(1)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Monitoring */}
      {selectedPatientData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vital Signs */}
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="text-teal-400 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Vital Signs - {selectedPatientData.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedPatientData.vitals.map((vital) => {
                const Icon = vital.icon
                const isNormal = isVitalNormal(vital)
                return (
                  <div key={vital.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" style={{ color: vital.color }} />
                        <span className="text-white text-sm">{vital.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${isNormal ? 'text-green-400' : 'text-red-400'}`}>
                          {vital.value.toFixed(1)} {vital.unit}
                        </span>
                        {isNormal ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-400" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>Normal: {vital.normal[0]}-{vital.normal[1]} {vital.unit}</span>
                    </div>
                    <Progress 
                      value={Math.min(100, (vital.value / vital.normal[1]) * 100)} 
                      className="h-2"
                    />
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Real-time Charts */}
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="text-teal-400 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Real-time Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  {selectedPatientData.vitals.slice(0, 3).map((vital, index) => (
                    <Line
                      key={vital.id}
                      type="monotone"
                      dataKey={vital.id}
                      data={vital.trend.map((value, i) => ({ [vital.id]: value, index: i }))}
                      stroke={vital.color}
                      strokeWidth={2}
                      name={vital.name}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Alerts */}
      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="text-red-400 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Active Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {patients.filter(p => p.status === 'critical').map(patient => (
              <div key={patient.id} className="flex items-center justify-between p-3 bg-red-900/20 rounded-lg border border-red-500/30">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <div>
                    <p className="text-white font-medium">{patient.name} - {patient.room}</p>
                    <p className="text-red-400 text-sm">Critical vital signs detected</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400 text-sm">{patient.lastUpdate}</span>
                </div>
              </div>
            ))}
            {patients.filter(p => p.status === 'critical').length === 0 && (
              <div className="text-center py-4">
                <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <p className="text-green-400">No critical alerts</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
