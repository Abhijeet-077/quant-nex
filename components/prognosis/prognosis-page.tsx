"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  TrendingUp,
  Calendar,
  AlertTriangle,
  Target,
  Brain,
  Heart,
  Clock,
  Download,
  Share2,
} from "lucide-react"
import { AdvancedSurvivalChart } from "@/components/visualization/advanced-survival-chart"
import { EnhancedTreatmentRadar } from "@/components/visualization/enhanced-treatment-radar"

interface PrognosisData {
  condition: string
  stage: string
  survivalRate: {
    oneYear: number
    threeYear: number
    fiveYear: number
  }
  riskFactors: string[]
  protectiveFactors: string[]
  treatmentOptions: {
    name: string
    effectiveness: number
    sideEffects: string
  }[]
}

export function PrognosisPage() {
  const [selectedPatient, setSelectedPatient] = useState("patient1")
  const [activeTab, setActiveTab] = useState("overview")
  const [timeframe, setTimeframe] = useState("5year")

  const prognosisData: PrognosisData = {
    condition: "Glioblastoma Multiforme (Grade IV)",
    stage: "Stage IV",
    survivalRate: {
      oneYear: 65,
      threeYear: 25,
      fiveYear: 10,
    },
    riskFactors: [
      "Age > 65 years",
      "Large tumor size (>5cm)",
      "Deep brain location",
      "High Ki-67 proliferation index",
      "MGMT promoter unmethylated",
    ],
    protectiveFactors: [
      "Young age (<45 years)",
      "Complete surgical resection",
      "Good performance status",
      "IDH1 mutation present",
      "MGMT promoter methylated",
    ],
    treatmentOptions: [
      {
        name: "Surgery + Radiation + Chemotherapy",
        effectiveness: 85,
        sideEffects: "Moderate to severe",
      },
      {
        name: "Radiation Therapy Alone",
        effectiveness: 45,
        sideEffects: "Mild to moderate",
      },
      {
        name: "Immunotherapy Trial",
        effectiveness: 35,
        sideEffects: "Variable",
      },
      {
        name: "Palliative Care",
        effectiveness: 20,
        sideEffects: "Minimal",
      },
    ],
  }

  const patientProfiles = [
    {
      id: "patient1",
      name: "Rajesh Kumar Sharma",
      age: 45,
      condition: "Glioblastoma",
      riskScore: 7.2,
      status: "Active Treatment",
    },
    {
      id: "patient2",
      name: "Priya Patel",
      age: 38,
      condition: "Meningioma",
      riskScore: 3.1,
      status: "Monitoring",
    },
    {
      id: "patient3",
      name: "Amit Singh",
      age: 62,
      condition: "Astrocytoma",
      riskScore: 5.8,
      status: "Post-Surgery",
    },
  ]

  const getRiskColor = (score: number) => {
    if (score >= 7) return "text-red-400"
    if (score >= 4) return "text-yellow-400"
    return "text-green-400"
  }

  const getRiskBadge = (score: number) => {
    if (score >= 7) return "destructive"
    if (score >= 4) return "secondary"
    return "default"
  }

  return (
    <div className="container-spacing space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-teal-400 flex items-center gap-3">
              <TrendingUp className="h-8 w-8" />
              Medical Prognosis Analysis
            </h1>
            <p className="text-gray-300 mt-2">AI-powered prognosis prediction and survival analysis</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="glow-hover bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" className="glow-hover bg-transparent">
              <Share2 className="h-4 w-4 mr-2" />
              Share Analysis
            </Button>
          </div>
        </div>

        {/* Patient Selection */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="text-teal-400">Patient Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {patientProfiles.map((patient) => (
                <div
                  key={patient.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedPatient === patient.id
                      ? "border-teal-400 bg-teal-900/20"
                      : "border-teal-500/30 bg-teal-900/10 hover:bg-teal-900/15"
                  }`}
                  onClick={() => setSelectedPatient(patient.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-white">{patient.name}</h3>
                      <p className="text-sm text-gray-300">Age: {patient.age}</p>
                    </div>
                    <Badge variant={getRiskBadge(patient.riskScore)}>Risk: {patient.riskScore}</Badge>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{patient.condition}</p>
                  <Badge variant="outline" className="text-xs">
                    {patient.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-teal-900/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-teal-600 text-xs sm:text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="survival" className="data-[state=active]:bg-teal-600 text-xs sm:text-sm">
              Survival
            </TabsTrigger>
            <TabsTrigger value="treatment" className="data-[state=active]:bg-teal-600 text-xs sm:text-sm">
              Treatment
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="data-[state=active]:bg-teal-600 text-xs sm:text-sm">
              Monitoring
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {/* Condition Summary */}
              <Card className="card-glow lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-teal-400 flex items-center gap-2">
                    <Brain className="h-6 w-6" />
                    Condition Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{prognosisData.condition}</h3>
                      <Badge variant="destructive" className="mb-4">
                        {prognosisData.stage}
                      </Badge>

                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium text-teal-300 mb-2">Survival Rates</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-300">1 Year</span>
                              <div className="flex items-center gap-2">
                                <Progress value={prognosisData.survivalRate.oneYear} className="w-20 h-2" />
                                <span className="text-sm text-white">{prognosisData.survivalRate.oneYear}%</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-300">3 Year</span>
                              <div className="flex items-center gap-2">
                                <Progress value={prognosisData.survivalRate.threeYear} className="w-20 h-2" />
                                <span className="text-sm text-white">{prognosisData.survivalRate.threeYear}%</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-300">5 Year</span>
                              <div className="flex items-center gap-2">
                                <Progress value={prognosisData.survivalRate.fiveYear} className="w-20 h-2" />
                                <span className="text-sm text-white">{prognosisData.survivalRate.fiveYear}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-red-300 mb-2 flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4" />
                          Risk Factors
                        </h4>
                        <ul className="space-y-1">
                          {prognosisData.riskFactors.slice(0, 3).map((factor, index) => (
                            <li key={index} className="text-xs text-gray-300 flex items-start gap-2">
                              <span className="text-red-400 mt-1">•</span>
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-green-300 mb-2 flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          Protective Factors
                        </h4>
                        <ul className="space-y-1">
                          {prognosisData.protectiveFactors.slice(0, 3).map((factor, index) => (
                            <li key={index} className="text-xs text-gray-300 flex items-start gap-2">
                              <span className="text-green-400 mt-1">•</span>
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="space-y-4">
                <Card className="card-glow">
                  <CardContent className="p-4 text-center">
                    <Heart className="h-8 w-8 text-red-400 mx-auto mb-2" />
                    <h3 className="font-semibold text-white mb-1">Overall Risk</h3>
                    <div className={`text-2xl font-bold ${getRiskColor(7.2)}`}>7.2/10</div>
                    <Badge variant="destructive" className="text-xs mt-1">
                      High Risk
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="card-glow">
                  <CardContent className="p-4 text-center">
                    <Calendar className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <h3 className="font-semibold text-white mb-1">Median Survival</h3>
                    <div className="text-2xl font-bold text-blue-400">14.6</div>
                    <p className="text-xs text-gray-400">months</p>
                  </CardContent>
                </Card>

                <Card className="card-glow">
                  <CardContent className="p-4 text-center">
                    <Activity className="h-8 w-8 text-teal-400 mx-auto mb-2" />
                    <h3 className="font-semibold text-white mb-1">Treatment Response</h3>
                    <div className="text-2xl font-bold text-teal-400">72%</div>
                    <p className="text-xs text-gray-400">predicted</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="survival" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <AdvancedSurvivalChart />
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="text-teal-400">Survival Factors Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-teal-300">Key Prognostic Factors</h4>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 rounded-lg bg-teal-900/10">
                        <span className="text-sm text-gray-300">Age at Diagnosis</span>
                        <div className="flex items-center gap-2">
                          <Progress value={75} className="w-20 h-2" />
                          <span className="text-sm text-white">High Impact</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-3 rounded-lg bg-teal-900/10">
                        <span className="text-sm text-gray-300">Tumor Size</span>
                        <div className="flex items-center gap-2">
                          <Progress value={85} className="w-20 h-2" />
                          <span className="text-sm text-white">Very High</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-3 rounded-lg bg-teal-900/10">
                        <span className="text-sm text-gray-300">Molecular Markers</span>
                        <div className="flex items-center gap-2">
                          <Progress value={65} className="w-20 h-2" />
                          <span className="text-sm text-white">Moderate</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-3 rounded-lg bg-teal-900/10">
                        <span className="text-sm text-gray-300">Performance Status</span>
                        <div className="flex items-center gap-2">
                          <Progress value={55} className="w-20 h-2" />
                          <span className="text-sm text-white">Moderate</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-3 rounded-lg bg-teal-900/10">
                        <span className="text-sm text-gray-300">Treatment Response</span>
                        <div className="flex items-center gap-2">
                          <Progress value={90} className="w-20 h-2" />
                          <span className="text-sm text-white">Critical</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-teal-500/30">
                    <h4 className="text-sm font-medium text-teal-300 mb-3">Survival Prediction Confidence</h4>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-teal-400 mb-1">87.3%</div>
                      <p className="text-sm text-gray-400">AI Model Confidence</p>
                      <Badge variant="default" className="mt-2 bg-teal-600">
                        High Confidence
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="treatment" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
              <div className="relative z-10">
                <EnhancedTreatmentRadar />
              </div>

              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="text-teal-400">Treatment Options Comparison</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {prognosisData.treatmentOptions.map((treatment, index) => (
                    <div key={index} className="p-4 rounded-lg bg-teal-900/10 border border-teal-500/30">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-white">{treatment.name}</h3>
                        <Badge
                          variant={
                            treatment.effectiveness >= 70
                              ? "default"
                              : treatment.effectiveness >= 40
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {treatment.effectiveness}% Effective
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-300">Effectiveness</span>
                          <div className="flex items-center gap-2">
                            <Progress value={treatment.effectiveness} className="w-24 h-2" />
                            <span className="text-sm text-white">{treatment.effectiveness}%</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-300">Side Effects</span>
                          <span className="text-sm text-gray-400">{treatment.sideEffects}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="text-teal-400 flex items-center gap-2">
                    <Clock className="h-6 w-6" />
                    Monitoring Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-teal-900/10">
                      <div>
                        <h4 className="font-medium text-white">MRI Brain with Contrast</h4>
                        <p className="text-sm text-gray-400">Every 2 months</p>
                      </div>
                      <Badge variant="default">Critical</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-teal-900/10">
                      <div>
                        <h4 className="font-medium text-white">Blood Work (CBC, CMP)</h4>
                        <p className="text-sm text-gray-400">Every 3 weeks</p>
                      </div>
                      <Badge variant="secondary">Important</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-teal-900/10">
                      <div>
                        <h4 className="font-medium text-white">Neurological Assessment</h4>
                        <p className="text-sm text-gray-400">Every visit</p>
                      </div>
                      <Badge variant="default">Critical</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-teal-900/10">
                      <div>
                        <h4 className="font-medium text-white">Quality of Life Assessment</h4>
                        <p className="text-sm text-gray-400">Monthly</p>
                      </div>
                      <Badge variant="outline">Standard</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-teal-900/10">
                      <div>
                        <h4 className="font-medium text-white">Tumor Markers</h4>
                        <p className="text-sm text-gray-400">Every 6 weeks</p>
                      </div>
                      <Badge variant="secondary">Important</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="text-teal-400 flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6" />
                    Warning Signs to Monitor
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-red-900/20 border border-red-500/30">
                      <h4 className="font-medium text-red-400 mb-2">Immediate Medical Attention</h4>
                      <ul className="space-y-1 text-sm text-gray-300">
                        <li>• Severe headaches with vomiting</li>
                        <li>• Sudden vision changes</li>
                        <li>• New seizure activity</li>
                        <li>• Significant confusion or disorientation</li>
                        <li>• Weakness or numbness in limbs</li>
                      </ul>
                    </div>

                    <div className="p-3 rounded-lg bg-yellow-900/20 border border-yellow-500/30">
                      <h4 className="font-medium text-yellow-400 mb-2">Contact Healthcare Team</h4>
                      <ul className="space-y-1 text-sm text-gray-300">
                        <li>• Persistent nausea or vomiting</li>
                        <li>• Changes in speech or memory</li>
                        <li>• Unusual fatigue or weakness</li>
                        <li>• Mood or personality changes</li>
                        <li>• Balance or coordination problems</li>
                      </ul>
                    </div>

                    <div className="p-3 rounded-lg bg-teal-900/20 border border-teal-500/30">
                      <h4 className="font-medium text-teal-400 mb-2">Regular Monitoring</h4>
                      <ul className="space-y-1 text-sm text-gray-300">
                        <li>• Daily symptom tracking</li>
                        <li>• Medication adherence</li>
                        <li>• Activity level changes</li>
                        <li>• Sleep pattern disruptions</li>
                        <li>• Appetite changes</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
