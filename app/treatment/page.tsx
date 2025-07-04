"use client"

import { useState } from "react"
import { Activity, AlertTriangle, Download, Loader2, Share2, Sliders, Syringe, Zap, Target, Calendar, Clock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MainLayout } from "@/components/layout/main-layout"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TreatmentPage() {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [isOptimized, setIsOptimized] = useState(false)
  const [treatmentParams, setTreatmentParams] = useState({
    radiationDose: [60],
    beamCount: [6],
    fractionCount: [30],
    margin: [0.5],
    intensity: [0.8],
  })

  const handleOptimize = () => {
    setIsOptimizing(true)
    setTimeout(() => {
      setIsOptimizing(false)
      setIsOptimized(true)
    }, 3000)
  }

  // Sample patient data
  const patientData = {
    name: "Priya Sharma",
    age: 45,
    diagnosis: "Glioblastoma Grade IV",
    treatmentPlan: "Radiation Therapy + Chemotherapy",
    progress: 65,
    sessionsCompleted: 12,
    totalSessions: 30,
    nextSession: "2024-07-05 10:00 AM"
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6 bg-black min-h-screen">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white glow-text">
              Treatment Planning & Optimization
            </h1>
            <p className="text-gray-300 mt-2 text-sm sm:text-base">
              Advanced radiation therapy planning with real-time optimization
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="border-blue-500 text-blue-400">
              <Download className="h-4 w-4 mr-2" />
              Export Plan
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 button-glow">
              <Share2 className="h-4 w-4 mr-2" />
              Share Results
            </Button>
          </div>
        </div>

        {/* Patient Overview */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-400" />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">Patient Name</p>
                <p className="text-white font-medium">{patientData.name}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">Diagnosis</p>
                <p className="text-white font-medium">{patientData.diagnosis}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">Treatment Plan</p>
                <p className="text-white font-medium">{patientData.treatmentPlan}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">Next Session</p>
                <p className="text-white font-medium">{patientData.nextSession}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="planning" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900">
            <TabsTrigger value="planning" className="text-white">Treatment Planning</TabsTrigger>
            <TabsTrigger value="optimization" className="text-white">Optimization</TabsTrigger>
            <TabsTrigger value="progress" className="text-white">Progress Tracking</TabsTrigger>
            <TabsTrigger value="analysis" className="text-white">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="planning" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Treatment Parameters */}
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Sliders className="h-5 w-5 mr-2 text-blue-400" />
                    Treatment Parameters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <label className="text-gray-300 text-sm">Radiation Dose (Gy)</label>
                      <span className="text-white font-medium">{treatmentParams.radiationDose[0]}</span>
                    </div>
                    <Slider
                      value={treatmentParams.radiationDose}
                      onValueChange={(value) => setTreatmentParams(prev => ({ ...prev, radiationDose: value }))}
                      max={80}
                      min={40}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <label className="text-gray-300 text-sm">Beam Count</label>
                      <span className="text-white font-medium">{treatmentParams.beamCount[0]}</span>
                    </div>
                    <Slider
                      value={treatmentParams.beamCount}
                      onValueChange={(value) => setTreatmentParams(prev => ({ ...prev, beamCount: value }))}
                      max={12}
                      min={3}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <label className="text-gray-300 text-sm">Fraction Count</label>
                      <span className="text-white font-medium">{treatmentParams.fractionCount[0]}</span>
                    </div>
                    <Slider
                      value={treatmentParams.fractionCount}
                      onValueChange={(value) => setTreatmentParams(prev => ({ ...prev, fractionCount: value }))}
                      max={40}
                      min={15}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <label className="text-gray-300 text-sm">Safety Margin (cm)</label>
                      <span className="text-white font-medium">{treatmentParams.margin[0]}</span>
                    </div>
                    <Slider
                      value={treatmentParams.margin}
                      onValueChange={(value) => setTreatmentParams(prev => ({ ...prev, margin: value }))}
                      max={2}
                      min={0.1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Treatment Status */}
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-green-400" />
                    Treatment Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Overall Progress</span>
                      <span className="text-white font-medium">{patientData.progress}%</span>
                    </div>
                    <Progress value={patientData.progress} className="h-3" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-900 rounded-lg">
                      <p className="text-2xl font-bold text-blue-400">{patientData.sessionsCompleted}</p>
                      <p className="text-gray-400 text-sm">Sessions Completed</p>
                    </div>
                    <div className="text-center p-4 bg-gray-900 rounded-lg">
                      <p className="text-2xl font-bold text-green-400">{patientData.totalSessions - patientData.sessionsCompleted}</p>
                      <p className="text-gray-400 text-sm">Sessions Remaining</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Badge variant="secondary" className="w-full justify-center py-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      Next Session: Tomorrow 10:00 AM
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-6">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="h-5 w-5 mr-2 text-purple-400" />
                  Treatment Optimization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                  {!isOptimized && !isOptimizing && (
                    <div className="space-y-4">
                      <p className="text-gray-300">
                        Click below to optimize treatment parameters based on patient anatomy and tumor characteristics.
                      </p>
                      <Button
                        onClick={handleOptimize}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 button-glow"
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Optimize Treatment Plan
                      </Button>
                    </div>
                  )}

                  {isOptimizing && (
                    <div className="space-y-4">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-400" />
                      <p className="text-gray-300">Optimizing treatment parameters...</p>
                      <p className="text-gray-400 text-sm">This may take a few moments</p>
                    </div>
                  )}

                  {isOptimized && (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                        <h3 className="text-green-400 font-medium mb-2">Optimization Complete!</h3>
                        <p className="text-gray-300 text-sm">
                          Treatment plan has been optimized for maximum efficacy while minimizing side effects.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-gray-900 rounded-lg">
                          <p className="text-xl font-bold text-green-400">94%</p>
                          <p className="text-gray-400 text-sm">Target Coverage</p>
                        </div>
                        <div className="text-center p-3 bg-gray-900 rounded-lg">
                          <p className="text-xl font-bold text-blue-400">12%</p>
                          <p className="text-gray-400 text-sm">Healthy Tissue Dose</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-green-400" />
                  Treatment Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-900 rounded-lg">
                      <p className="text-2xl font-bold text-blue-400">12/30</p>
                      <p className="text-gray-400 text-sm">Sessions Completed</p>
                    </div>
                    <div className="text-center p-4 bg-gray-900 rounded-lg">
                      <p className="text-2xl font-bold text-green-400">85%</p>
                      <p className="text-gray-400 text-sm">Treatment Adherence</p>
                    </div>
                    <div className="text-center p-4 bg-gray-900 rounded-lg">
                      <p className="text-2xl font-bold text-purple-400">Good</p>
                      <p className="text-gray-400 text-sm">Patient Response</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-white font-medium">Recent Sessions</h3>
                    <div className="space-y-2">
                      {[
                        { date: "2024-07-03", status: "Completed", response: "Good" },
                        { date: "2024-07-01", status: "Completed", response: "Excellent" },
                        { date: "2024-06-28", status: "Completed", response: "Good" },
                      ].map((session, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
                          <span className="text-gray-300">{session.date}</span>
                          <Badge variant="secondary">{session.status}</Badge>
                          <span className="text-green-400">{session.response}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" />
                  Treatment Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-900 rounded-lg border-l-4 border-green-500">
                    <h3 className="text-white font-medium mb-2">Positive Response</h3>
                    <p className="text-gray-300 text-sm">
                      Patient is responding well to treatment with minimal side effects reported.
                    </p>
                  </div>
                  <div className="p-4 bg-gray-900 rounded-lg border-l-4 border-blue-500">
                    <h3 className="text-white font-medium mb-2">Treatment Efficacy</h3>
                    <p className="text-gray-300 text-sm">
                      Current treatment protocol is showing 94% target coverage with optimal dose distribution.
                    </p>
                  </div>
                  <div className="p-4 bg-gray-900 rounded-lg border-l-4 border-yellow-500">
                    <h3 className="text-white font-medium mb-2">Recommendations</h3>
                    <p className="text-gray-300 text-sm">
                      Continue current treatment plan. Monitor for any changes in patient condition.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
