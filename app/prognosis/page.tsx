"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { MainLayout } from "@/components/layout/main-layout"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  AlertTriangle,
  Brain,
  Calendar,
  Clock,
  Download,
  FileText,
  TrendingUp,
  Activity,
  Eye,
} from "lucide-react"
import { SurvivalCurveChart, Enhanced3DModel } from "@/components/dynamic-imports"

export default function Prognosis() {
  const [activeTab, setActiveTab] = useState("overview")

  // Sample patient data
  const patientData = {
    name: "Priya Sharma",
    age: 45,
    diagnosis: "Glioblastoma Grade IV",
    diagnosisDate: "2024-01-15",
    treatmentProgress: 65,
    survivalProbability: 78,
    riskLevel: "Moderate"
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6 bg-black min-h-screen">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white glow-text">
              Patient Prognosis Analysis
            </h1>
            <p className="text-gray-300 mt-2 text-sm sm:text-base">
              Comprehensive treatment outcome predictions and survival analysis
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="border-blue-500 text-blue-400">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 button-glow">
              <FileText className="h-4 w-4 mr-2" />
              Generate PDF
            </Button>
          </div>
        </div>

        {/* Patient Overview */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Brain className="h-5 w-5 mr-2 text-blue-400" />
              Patient Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">Patient Name</p>
                <p className="text-white font-medium">{patientData.name}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">Diagnosis</p>
                <p className="text-white font-medium">{patientData.diagnosis}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">Risk Level</p>
                <Badge variant={patientData.riskLevel === "High" ? "destructive" : "secondary"}>
                  {patientData.riskLevel}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-gray-900">
            <TabsTrigger value="overview" className="text-white">Overview</TabsTrigger>
            <TabsTrigger value="3d-view" className="text-white">3D View</TabsTrigger>
            <TabsTrigger value="survival" className="text-white">Survival Analysis</TabsTrigger>
            <TabsTrigger value="treatment" className="text-white">Treatment Response</TabsTrigger>
            <TabsTrigger value="recommendations" className="text-white">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                    Treatment Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Overall Progress</span>
                      <span className="text-white">{patientData.treatmentProgress}%</span>
                    </div>
                    <Progress value={patientData.treatmentProgress} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Survival Probability</span>
                      <span className="text-white">{patientData.survivalProbability}%</span>
                    </div>
                    <Progress value={patientData.survivalProbability} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-purple-400" />
                    Key Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-900 rounded-lg">
                      <p className="text-2xl font-bold text-blue-400">12</p>
                      <p className="text-gray-400 text-sm">Months Since Diagnosis</p>
                    </div>
                    <div className="text-center p-3 bg-gray-900 rounded-lg">
                      <p className="text-2xl font-bold text-green-400">8</p>
                      <p className="text-gray-400 text-sm">Treatment Sessions</p>
                    </div>
                    <div className="text-center p-3 bg-gray-900 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-400">24</p>
                      <p className="text-gray-400 text-sm">Months Projected</p>
                    </div>
                    <div className="text-center p-3 bg-gray-900 rounded-lg">
                      <p className="text-2xl font-bold text-purple-400">92%</p>
                      <p className="text-gray-400 text-sm">Quality of Life</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="3d-view" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 3D Tumor Model */}
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-blue-400" />
                    3D Tumor Visualization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] rounded-lg overflow-hidden border border-blue-500/20">
                    <Enhanced3DModel
                      modelType="tumor"
                      title="Tumor Progression Analysis"
                      showControls={true}
                      autoRotate={true}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Current Volume:</span>
                      <span className="text-white font-medium">1.8 cm³</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Volume Change:</span>
                      <span className="text-green-400 font-medium">-15% (3 months)</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Growth Rate:</span>
                      <span className="text-green-400 font-medium">Stable</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Anatomical Analysis */}
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Eye className="h-5 w-5 mr-2 text-purple-400" />
                    Anatomical Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] rounded-lg overflow-hidden border border-purple-500/20">
                    <Enhanced3DModel
                      modelType="brain"
                      title="Brain Anatomy Analysis"
                      showControls={true}
                      autoRotate={false}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Motor Cortex</span>
                        <Badge variant="secondary" className="bg-green-500/20 text-green-400">Safe</Badge>
                      </div>
                    </div>
                    <div className="p-3 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Speech Area</span>
                        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">Monitor</Badge>
                      </div>
                    </div>
                    <div className="p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Visual Cortex</span>
                        <Badge variant="secondary" className="bg-green-500/20 text-green-400">Safe</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progression Timeline */}
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-cyan-400" />
                  Tumor Progression Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-gray-900 rounded-lg">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-white font-medium">Initial Diagnosis</p>
                      <p className="text-gray-400 text-sm">January 15, 2024 - Tumor size: 2.3 cm³</p>
                    </div>
                    <Badge variant="outline" className="border-blue-500 text-blue-400">Baseline</Badge>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-gray-900 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-white font-medium">3-Month Follow-up</p>
                      <p className="text-gray-400 text-sm">April 15, 2024 - Tumor size: 2.0 cm³ (-13%)</p>
                    </div>
                    <Badge variant="outline" className="border-green-500 text-green-400">Responding</Badge>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-gray-900 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-white font-medium">Current Status</p>
                      <p className="text-gray-400 text-sm">July 4, 2024 - Tumor size: 1.8 cm³ (-22%)</p>
                    </div>
                    <Badge variant="outline" className="border-green-500 text-green-400">Stable</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="survival" className="space-y-6">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-white">Survival Analysis</CardTitle>
                <CardDescription className="text-gray-400">
                  Statistical analysis of treatment outcomes and survival probability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SurvivalCurveChart />
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-900 rounded-lg">
                    <p className="text-2xl font-bold text-green-400">78%</p>
                    <p className="text-gray-400 text-sm">5-Year Survival</p>
                  </div>
                  <div className="text-center p-4 bg-gray-900 rounded-lg">
                    <p className="text-2xl font-bold text-blue-400">92%</p>
                    <p className="text-gray-400 text-sm">2-Year Survival</p>
                  </div>
                  <div className="text-center p-4 bg-gray-900 rounded-lg">
                    <p className="text-2xl font-bold text-purple-400">24</p>
                    <p className="text-gray-400 text-sm">Median Months</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="treatment" className="space-y-6">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-white">Treatment Response Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-900 rounded-lg">
                    <h3 className="text-white font-medium mb-2">Current Protocol</h3>
                    <p className="text-gray-300">Combination chemotherapy with radiation therapy showing positive results.</p>
                  </div>
                  <div className="p-4 bg-gray-900 rounded-lg">
                    <h3 className="text-white font-medium mb-2">Side Effects</h3>
                    <p className="text-gray-300">Minimal side effects reported. Patient tolerance is excellent.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" />
                  Clinical Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-900 rounded-lg border-l-4 border-green-500">
                    <h3 className="text-white font-medium mb-2">Continue Current Treatment</h3>
                    <p className="text-gray-300">Maintain current chemotherapy protocol due to excellent response.</p>
                  </div>
                  <div className="p-4 bg-gray-900 rounded-lg border-l-4 border-blue-500">
                    <h3 className="text-white font-medium mb-2">Regular Monitoring</h3>
                    <p className="text-gray-300">Schedule MRI scans every 3 months to monitor tumor progression.</p>
                  </div>
                  <div className="p-4 bg-gray-900 rounded-lg border-l-4 border-yellow-500">
                    <h3 className="text-white font-medium mb-2">Lifestyle Recommendations</h3>
                    <p className="text-gray-300">Maintain healthy diet, regular exercise, and stress management techniques.</p>
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
