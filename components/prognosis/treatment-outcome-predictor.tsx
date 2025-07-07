"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
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
  ScatterChart,
  Scatter,
  ComposedChart,
} from "recharts"
import {
  Target,
  Zap,
  Activity,
  TrendingUp,
  Brain,
  Syringe,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Play,
  Pause,
} from "lucide-react"

interface TreatmentOption {
  id: string
  name: string
  type: "surgery" | "radiation" | "chemotherapy" | "immunotherapy" | "combination"
  efficacy: number
  sideEffects: number
  duration: number
  cost: number
  availability: number
  personalizedScore: number
  description: string
}

interface OutcomePrediction {
  timepoint: number
  surgery: number
  radiation: number
  chemotherapy: number
  immunotherapy: number
  combination: number
  noTreatment: number
}

export function TreatmentOutcomePredictor() {
  const [selectedTreatment, setSelectedTreatment] = useState<string>("combination")
  const [patientAge, setPatientAge] = useState([45])
  const [tumorSize, setTumorSize] = useState([3.2])
  const [performanceStatus, setPerformanceStatus] = useState([90])
  const [isSimulating, setIsSimulating] = useState(false)

  const treatmentOptions: TreatmentOption[] = [
    {
      id: "surgery",
      name: "Surgical Resection",
      type: "surgery",
      efficacy: 85,
      sideEffects: 25,
      duration: 1,
      cost: 75,
      availability: 95,
      personalizedScore: 88,
      description: "Complete tumor removal with maximal safe resection",
    },
    {
      id: "radiation",
      name: "Radiation Therapy",
      type: "radiation",
      efficacy: 70,
      sideEffects: 40,
      duration: 6,
      cost: 60,
      availability: 90,
      personalizedScore: 75,
      description: "Targeted radiation with intensity-modulated technique",
    },
    {
      id: "chemotherapy",
      name: "Temozolomide",
      type: "chemotherapy",
      efficacy: 65,
      sideEffects: 55,
      duration: 12,
      cost: 40,
      availability: 100,
      personalizedScore: 72,
      description: "Standard alkylating agent chemotherapy",
    },
    {
      id: "immunotherapy",
      name: "Immunotherapy",
      type: "immunotherapy",
      efficacy: 45,
      sideEffects: 30,
      duration: 24,
      cost: 90,
      availability: 60,
      personalizedScore: 58,
      description: "Checkpoint inhibitor therapy (experimental)",
    },
    {
      id: "combination",
      name: "Multimodal Therapy",
      type: "combination",
      efficacy: 92,
      sideEffects: 65,
      duration: 18,
      cost: 85,
      availability: 80,
      personalizedScore: 94,
      description: "Surgery + radiation + chemotherapy combination",
    },
  ]

  // Generate outcome predictions based on treatment
  const generateOutcomePredictions = (): OutcomePrediction[] => {
    return Array.from({ length: 61 }, (_, i) => {
      const months = i
      const ageEffect = 1 - (patientAge[0] - 40) * 0.01
      const sizeEffect = 1 - (tumorSize[0] - 2) * 0.1
      const psEffect = performanceStatus[0] / 100

      const baselineDecay = 0.02
      const adjustedDecay = baselineDecay / (ageEffect * sizeEffect * psEffect)

      return {
        timepoint: months,
        surgery: Math.max(0, 100 * Math.exp(-adjustedDecay * 0.7 * months)),
        radiation: Math.max(0, 100 * Math.exp(-adjustedDecay * 0.85 * months)),
        chemotherapy: Math.max(0, 100 * Math.exp(-adjustedDecay * 0.9 * months)),
        immunotherapy: Math.max(0, 100 * Math.exp(-adjustedDecay * 1.1 * months)),
        combination: Math.max(0, 100 * Math.exp(-adjustedDecay * 0.5 * months)),
        noTreatment: Math.max(0, 100 * Math.exp(-adjustedDecay * 1.5 * months)),
      }
    })
  }

  const [outcomePredictions, setOutcomePredictions] = useState<OutcomePrediction[]>(
    generateOutcomePredictions()
  )

  useEffect(() => {
    setOutcomePredictions(generateOutcomePredictions())
  }, [patientAge, tumorSize, performanceStatus])

  const getTreatmentColor = (type: string) => {
    switch (type) {
      case "surgery": return "#10b981"
      case "radiation": return "#3b82f6"
      case "chemotherapy": return "#f59e0b"
      case "immunotherapy": return "#8b5cf6"
      case "combination": return "#06b6d4"
      default: return "#6b7280"
    }
  }

  const getTreatmentIcon = (type: string) => {
    switch (type) {
      case "surgery": return <Target className="h-4 w-4" />
      case "radiation": return <Zap className="h-4 w-4" />
      case "chemotherapy": return <Syringe className="h-4 w-4" />
      case "immunotherapy": return <Shield className="h-4 w-4" />
      case "combination": return <Activity className="h-4 w-4" />
      default: return <Brain className="h-4 w-4" />
    }
  }

  const runSimulation = () => {
    setIsSimulating(true)
    setTimeout(() => {
      setOutcomePredictions(generateOutcomePredictions())
      setIsSimulating(false)
    }, 2000)
  }

  const downloadPrediction = () => {
    console.log("Downloading treatment outcome prediction...")
  }

  return (
    <div className="space-y-6">
      {/* Patient Parameters */}
      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="text-teal-400 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Treatment Outcome Predictor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Patient Age: {patientAge[0]} years</label>
              <Slider
                value={patientAge}
                onValueChange={setPatientAge}
                max={80}
                min={18}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Tumor Size: {tumorSize[0]} cm</label>
              <Slider
                value={tumorSize}
                onValueChange={setTumorSize}
                max={8}
                min={1}
                step={0.1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Performance Status: {performanceStatus[0]}%</label>
              <Slider
                value={performanceStatus}
                onValueChange={setPerformanceStatus}
                max={100}
                min={30}
                step={10}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <Button
              onClick={runSimulation}
              disabled={isSimulating}
              className="btn-glow-primary"
            >
              {isSimulating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Simulating...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Prediction
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={downloadPrediction}
              className="glow-hover bg-transparent"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Results
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Treatment Options Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="text-white">Survival Outcome Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={outcomePredictions}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="timepoint"
                    stroke="#9ca3af"
                    label={{ value: "Months", position: "insideBottom", offset: -5 }}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    label={{ value: "Survival (%)", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="combination"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    name="Multimodal Therapy"
                  />
                  <Line
                    type="monotone"
                    dataKey="surgery"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Surgery Only"
                  />
                  <Line
                    type="monotone"
                    dataKey="radiation"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Radiation Only"
                  />
                  <Line
                    type="monotone"
                    dataKey="chemotherapy"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    name="Chemotherapy Only"
                  />
                  <Line
                    type="monotone"
                    dataKey="immunotherapy"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="Immunotherapy"
                  />
                  <Line
                    type="monotone"
                    dataKey="noTreatment"
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="No Treatment"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="text-white text-lg">Treatment Rankings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {treatmentOptions
                .sort((a, b) => b.personalizedScore - a.personalizedScore)
                .map((treatment, index) => (
                  <div
                    key={treatment.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedTreatment === treatment.id
                        ? "border-teal-400 bg-teal-900/30"
                        : "border-slate-600/50 bg-slate-700/30 hover:bg-slate-700/50"
                    }`}
                    onClick={() => setSelectedTreatment(treatment.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div style={{ color: getTreatmentColor(treatment.type) }}>
                          {getTreatmentIcon(treatment.type)}
                        </div>
                        <span className="text-white font-medium text-sm">{treatment.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        #{index + 1}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Personalized Score:</span>
                        <span className="text-white font-medium">{treatment.personalizedScore}%</span>
                      </div>
                      <Progress value={treatment.personalizedScore} className="h-1" />
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>

          {selectedTreatment && (
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-white text-lg">Treatment Details</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const treatment = treatmentOptions.find(t => t.id === selectedTreatment)
                  if (!treatment) return null

                  return (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div style={{ color: getTreatmentColor(treatment.type) }}>
                          {getTreatmentIcon(treatment.type)}
                        </div>
                        <h4 className="text-white font-medium">{treatment.name}</h4>
                      </div>
                      
                      <p className="text-sm text-gray-300">{treatment.description}</p>
                      
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-gray-400">Efficacy:</span>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={treatment.efficacy} className="h-1 flex-1" />
                            <span className="text-white">{treatment.efficacy}%</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-400">Side Effects:</span>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={treatment.sideEffects} className="h-1 flex-1" />
                            <span className="text-white">{treatment.sideEffects}%</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-400">Duration:</span>
                          <div className="text-white mt-1">{treatment.duration} months</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Availability:</span>
                          <div className="text-white mt-1">{treatment.availability}%</div>
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
