"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Stethoscope,
  Upload,
  Brain,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Camera,
  Zap,
} from "lucide-react"
import { SimpleBrainVisualization } from "@/components/visualization/simple-brain-visualization"
import { SimpleBodyVisualization } from "@/components/visualization/simple-body-visualization"

interface DiagnosisResult {
  condition: string
  confidence: number
  severity: "low" | "medium" | "high"
  description: string
  recommendations: string[]
}

export function DiagnosisPage() {
  const [patientData, setPatientData] = useState({
    name: "",
    age: "",
    gender: "",
    symptoms: "",
    medicalHistory: "",
  })

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [diagnosisResults, setDiagnosisResults] = useState<DiagnosisResult[]>([])
  const [activeTab, setActiveTab] = useState("input")
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  const handleInputChange = (field: string, value: string) => {
    setPatientData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      setUploadedImages((prev) => [...prev, ...newImages])
    }
  }

  const runDiagnosis = async () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)
    setActiveTab("analysis")

    // Simulate AI analysis progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setIsAnalyzing(false)

          // Mock diagnosis results
          setDiagnosisResults([
            {
              condition: "Multiple Sclerosis (Possible)",
              confidence: 87,
              severity: "high",
              description:
                "Multiple hyperintense lesions detected in white matter regions consistent with demyelinating disease.",
              recommendations: [
                "Contrast-enhanced MRI recommended",
                "Neurological consultation required",
                "CSF analysis for oligoclonal bands",
                "Visual evoked potentials testing",
              ],
            },
            {
              condition: "Migraine with Aura",
              confidence: 65,
              severity: "medium",
              description: "Clinical symptoms and imaging patterns suggest possible migraine-related changes.",
              recommendations: [
                "Headache diary maintenance",
                "Neurological follow-up",
                "Consider preventive medication",
              ],
            },
            {
              condition: "Vascular Dementia Risk",
              confidence: 45,
              severity: "low",
              description: "Minor vascular changes noted, requires monitoring for progression.",
              recommendations: ["Cardiovascular risk assessment", "Regular monitoring", "Lifestyle modifications"],
            },
          ])

          setActiveTab("results")
          return 100
        }
        return prev + 2
      })
    }, 100)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-teal-400 flex items-center gap-3">
              <Stethoscope className="h-8 w-8" />
              AI Medical Diagnosis
            </h1>
            <p className="text-gray-300 mt-2">Advanced AI-powered medical diagnosis and analysis system</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="glow-hover bg-transparent">
              <FileText className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button className="btn-glow-primary">
              <Camera className="h-4 w-4 mr-2" />
              New Scan
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-teal-900/20">
            <TabsTrigger value="input" className="data-[state=active]:bg-teal-600">
              Patient Input
            </TabsTrigger>
            <TabsTrigger value="imaging" className="data-[state=active]:bg-teal-600">
              Medical Imaging
            </TabsTrigger>
            <TabsTrigger value="analysis" className="data-[state=active]:bg-teal-600">
              AI Analysis
            </TabsTrigger>
            <TabsTrigger value="results" className="data-[state=active]:bg-teal-600">
              Diagnosis Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="text-teal-400">Patient Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Patient Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter patient name"
                        value={patientData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="bg-teal-900/20 border-teal-500/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="Age"
                        value={patientData.age}
                        onChange={(e) => handleInputChange("age", e.target.value)}
                        className="bg-teal-900/20 border-teal-500/30"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select onValueChange={(value) => handleInputChange("gender", value)}>
                      <SelectTrigger className="bg-teal-900/20 border-teal-500/30">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="symptoms">Current Symptoms</Label>
                    <Textarea
                      id="symptoms"
                      placeholder="Describe current symptoms, duration, and severity..."
                      value={patientData.symptoms}
                      onChange={(e) => handleInputChange("symptoms", e.target.value)}
                      className="bg-teal-900/20 border-teal-500/30 min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="history">Medical History</Label>
                    <Textarea
                      id="history"
                      placeholder="Previous medical conditions, medications, allergies..."
                      value={patientData.medicalHistory}
                      onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
                      className="bg-teal-900/20 border-teal-500/30 min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="text-teal-400">Medical Images Upload</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-teal-500/30 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-teal-400 mx-auto mb-4" />
                    <p className="text-gray-300 mb-4">Upload medical images (MRI, CT, X-Ray, etc.)</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button asChild className="btn-glow-primary">
                      <label htmlFor="image-upload" className="cursor-pointer">
                        Choose Files
                      </label>
                    </Button>
                  </div>

                  {uploadedImages.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-teal-300">Uploaded Images</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {uploadedImages.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image || "/placeholder.svg?height=96&width=96"}
                              alt={`Medical scan ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-teal-500/30"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder.svg?height=96&width=96'
                              }}
                            />
                            <Badge className="absolute top-1 right-1 text-xs">Scan {index + 1}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={runDiagnosis}
                    className="w-full btn-glow-primary"
                    disabled={!patientData.name || !patientData.symptoms}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Start AI Diagnosis
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="imaging" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <SimpleBrainVisualization />
              <SimpleBodyVisualization />
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-teal-400 flex items-center gap-2">
                  <Brain className="h-6 w-6" />
                  AI Analysis in Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 mx-auto relative">
                    <div className="absolute inset-0 rounded-full border-4 border-teal-500/30"></div>
                    <div
                      className="absolute inset-0 rounded-full border-4 border-teal-400 border-t-transparent animate-spin"
                      style={{ animationDuration: "1s" }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Brain className="h-8 w-8 text-teal-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white">Analyzing Medical Data</h3>
                    <p className="text-gray-300">AI is processing patient information and medical images...</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Analysis Progress</span>
                    <span className="text-teal-400">{analysisProgress}%</span>
                  </div>
                  <Progress value={analysisProgress} className="h-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-teal-900/20">
                    <Activity className="h-8 w-8 text-teal-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-300">Processing Symptoms</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-teal-900/20">
                    <Brain className="h-8 w-8 text-teal-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-300">Analyzing Images</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-teal-900/20">
                    <Stethoscope className="h-8 w-8 text-teal-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-300">Generating Diagnosis</p>
                  </div>
                </div>

                {isAnalyzing && (
                  <div className="text-center">
                    <p className="text-sm text-gray-400">
                      This may take a few moments. Please do not close this window.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {diagnosisResults.length > 0 && (
              <>
                <Card className="card-glow">
                  <CardHeader>
                    <CardTitle className="text-teal-400 flex items-center gap-2">
                      <CheckCircle className="h-6 w-6" />
                      Diagnosis Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {diagnosisResults.map((result, index) => (
                        <div key={index} className="p-4 rounded-lg bg-teal-900/10 border border-teal-500/30">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-white mb-1">{result.condition}</h3>
                              <p className="text-gray-300 text-sm">{result.description}</p>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Badge variant={getSeverityBadge(result.severity)}>{result.severity.toUpperCase()}</Badge>
                              <div className="text-right">
                                <div className="text-sm text-gray-400">Confidence</div>
                                <div className="text-lg font-bold text-teal-400">{result.confidence}%</div>
                              </div>
                            </div>
                          </div>

                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-300">Confidence Level</span>
                              <span className="text-teal-400">{result.confidence}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${getSeverityColor(result.severity)}`}
                                style={{ width: `${result.confidence}%` }}
                              ></div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-teal-300 mb-2">Recommendations:</h4>
                            <ul className="space-y-1">
                              {result.recommendations.map((rec, recIndex) => (
                                <li key={recIndex} className="text-sm text-gray-300 flex items-start gap-2">
                                  <span className="text-teal-400 mt-1">•</span>
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="card-glow">
                    <CardContent className="p-4 text-center">
                      <AlertTriangle className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                      <h3 className="font-semibold text-white mb-1">Priority Level</h3>
                      <Badge variant="secondary" className="bg-yellow-600">
                        High Priority
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="card-glow">
                    <CardContent className="p-4 text-center">
                      <Clock className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                      <h3 className="font-semibold text-white mb-1">Follow-up</h3>
                      <p className="text-sm text-gray-300">2 weeks</p>
                    </CardContent>
                  </Card>

                  <Card className="card-glow">
                    <CardContent className="p-4 text-center">
                      <FileText className="h-8 w-8 text-green-400 mx-auto mb-2" />
                      <h3 className="font-semibold text-white mb-1">Report Status</h3>
                      <Badge variant="default" className="bg-green-600">
                        Complete
                      </Badge>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
