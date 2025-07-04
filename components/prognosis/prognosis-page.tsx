"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { MainLayout } from "../layout/main-layout"
import { SurvivalCurveChart } from "../visualization/survival-curve-chart"
import { TreatmentEfficacyRadar } from "../visualization/treatment-efficacy-radar"
import { TumorVisualization3D } from "../visualization/tumor-model-3d"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  AlertTriangle,
  ArrowRight,
  Brain,
  Calendar,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Share2,
} from "lucide-react"

export function PrognosisPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Prognosis</h1>
            <p className="text-gray-400">Patient: Priya Sharma (P-1001)</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-black/10 backdrop-blur-sm border-white/10">
            <CardHeader className="pb-2">
              <CardTitle>Survival Probability</CardTitle>
              <CardDescription>5-year survival prediction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      className="text-gray-800 stroke-current"
                      strokeWidth="10"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                    ></circle>
                    <circle
                      className="text-purple-500 stroke-current"
                      strokeWidth="10"
                      strokeLinecap="round"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      strokeDasharray="251.2"
                      strokeDashoffset="50.24"
                    ></circle>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold">80%</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Confidence Interval:</span>
                  <span>75% - 85%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Baseline Population:</span>
                  <span>65%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">With Treatment:</span>
                  <span className="text-green-400">+15%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/10 backdrop-blur-sm border-white/10">
            <CardHeader className="pb-2">
              <CardTitle>Risk Factors</CardTitle>
              <CardDescription>Key factors affecting prognosis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Tumor Size</span>
                    <span className="text-sm text-amber-400">Moderate Risk</span>
                  </div>
                  <Progress value={60} className="h-2 bg-gray-800" indicatorClassName="bg-amber-500" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Tumor Location</span>
                    <span className="text-sm text-red-400">High Risk</span>
                  </div>
                  <Progress value={80} className="h-2 bg-gray-800" indicatorClassName="bg-red-500" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Genetic Markers</span>
                    <span className="text-sm text-green-400">Low Risk</span>
                  </div>
                  <Progress value={30} className="h-2 bg-gray-800" indicatorClassName="bg-green-500" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Age</span>
                    <span className="text-sm text-amber-400">Moderate Risk</span>
                  </div>
                  <Progress value={50} className="h-2 bg-gray-800" indicatorClassName="bg-amber-500" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Treatment Response</span>
                    <span className="text-sm text-green-400">Low Risk</span>
                  </div>
                  <Progress value={20} className="h-2 bg-gray-800" indicatorClassName="bg-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/10 backdrop-blur-sm border-white/10">
            <CardHeader className="pb-2">
              <CardTitle>Key Metrics</CardTitle>
              <CardDescription>Important prognostic indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                    <Calendar className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-medium">Disease-Free Interval</p>
                    <p className="text-2xl font-bold">18 months</p>
                    <p className="text-sm text-green-400">+4 months vs. average</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center mr-3">
                    <Brain className="h-5 w-5 text-cyan-500" />
                  </div>
                  <div>
                    <p className="font-medium">Tumor Progression</p>
                    <p className="text-2xl font-bold">Slow</p>
                    <p className="text-sm text-green-400">Better than 70% of cases</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center mr-3">
                    <Clock className="h-5 w-5 text-pink-500" />
                  </div>
                  <div>
                    <p className="font-medium">Time to Recurrence</p>
                    <p className="text-2xl font-bold">36 months</p>
                    <p className="text-sm text-green-400">+8 months vs. average</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-black/10 backdrop-blur-sm border-white/10 lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Detailed Analysis</CardTitle>
              </div>
              <CardDescription>
                {activeTab === "overview" && "Comprehensive prognosis overview"}
                {activeTab === "survival" && "Survival probability over time"}
                {activeTab === "treatment" && "Comparative treatment efficacy"}
                {activeTab === "visualization" && "3D tumor visualization"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="survival">Survival Curve</TabsTrigger>
                  <TabsTrigger value="treatment">Treatment Efficacy</TabsTrigger>
                  <TabsTrigger value="visualization">3D Visualization</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-0">
                  <div className="space-y-6">
                    <div className="p-4 border border-white/10 rounded-lg bg-black/20">
                      <h3 className="text-lg font-medium mb-2">Prognosis Summary</h3>
                      <p className="text-gray-300">
                        Patient Priya Sharma presents with Stage IV Glioblastoma. Based on our quantum-enhanced
                        prognostic model, which considers tumor characteristics, genetic markers, and treatment
                        response, the patient has an 80% 5-year survival probability. This is significantly higher than
                        the baseline population (65%) for this condition.
                      </p>
                      <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                        <p className="text-sm text-green-400">
                          The patient's tumor shows favorable genetic markers and excellent response to the
                          quantum-optimized treatment plan, contributing to the positive prognosis.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-white/10 rounded-lg bg-black/20">
                        <h3 className="text-lg font-medium mb-2">Genetic Analysis</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">IDH1 Mutation</span>
                            <Badge className="bg-green-500">Positive</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">MGMT Methylation</span>
                            <Badge className="bg-green-500">Positive</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">1p/19q Co-deletion</span>
                            <Badge className="bg-red-500">Negative</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">EGFR Amplification</span>
                            <Badge className="bg-amber-500">Partial</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">TERT Promoter</span>
                            <Badge className="bg-green-500">Favorable</Badge>
                          </div>
                        </div>
                        <p className="mt-3 text-sm text-gray-300">
                          Genetic profile indicates favorable response to targeted therapy and immunotherapy.
                        </p>
                      </div>

                      <div className="p-4 border border-white/10 rounded-lg bg-black/20">
                        <h3 className="text-lg font-medium mb-2">Treatment Response</h3>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Tumor Size Reduction</span>
                              <span className="text-sm">65%</span>
                            </div>
                            <Progress value={65} className="h-2 bg-gray-800" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Metabolic Activity</span>
                              <span className="text-sm">-70%</span>
                            </div>
                            <Progress value={70} className="h-2 bg-gray-800" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Symptom Improvement</span>
                              <span className="text-sm">85%</span>
                            </div>
                            <Progress value={85} className="h-2 bg-gray-800" />
                          </div>
                        </div>
                        <p className="mt-3 text-sm text-gray-300">
                          Patient shows excellent response to the current treatment regimen with significant reduction
                          in tumor size and metabolic activity.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 border border-white/10 rounded-lg bg-black/20">
                      <h3 className="text-lg font-medium mb-2">AI-Generated Insights</h3>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3 mt-1">
                            <Brain className="h-4 w-4 text-purple-500" />
                          </div>
                          <div>
                            <p className="font-medium">Treatment Optimization</p>
                            <p className="text-sm text-gray-300">
                              Quantum algorithm suggests increasing the radiation dose by 10% while reducing
                              chemotherapy intensity to minimize side effects without compromising efficacy.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center mr-3 mt-1">
                            <Brain className="h-4 w-4 text-cyan-500" />
                          </div>
                          <div>
                            <p className="font-medium">Recurrence Risk</p>
                            <p className="text-sm text-gray-300">
                              Based on the current treatment response and genetic profile, the risk of recurrence within
                              2 years is estimated at 15%, which is significantly lower than the average of 40%.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center mr-3 mt-1">
                            <Brain className="h-4 w-4 text-pink-500" />
                          </div>
                          <div>
                            <p className="font-medium">Quality of Life Prediction</p>
                            <p className="text-sm text-gray-300">
                              Patient is expected to maintain good quality of life with minimal neurological deficits
                              for at least 3 years based on the current treatment plan and disease progression rate.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="survival" className="mt-0">
                  <div className="h-[400px]">
                    <SurvivalCurveChart />
                  </div>
                </TabsContent>

                <TabsContent value="treatment" className="mt-0">
                  <div className="h-[400px]">
                    <TreatmentEfficacyRadar />
                  </div>
                </TabsContent>

                <TabsContent value="visualization" className="mt-0">
                  <TumorVisualization3D />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="bg-black/10 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle>Similar Cases</CardTitle>
              <CardDescription>Patients with similar profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SimilarCaseCard
                id="P-0872"
                name="Rajesh Kumar"
                age={44}
                gender="Male"
                similarity={92}
                outcome="Positive"
                survivalMonths={48}
              />
              <SimilarCaseCard
                id="P-0654"
                name="Meera Singh"
                age={40}
                gender="Female"
                similarity={87}
                outcome="Positive"
                survivalMonths={60}
              />
              <SimilarCaseCard
                id="P-0921"
                name="Arjun Patel"
                age={45}
                gender="Male"
                similarity={82}
                outcome="Mixed"
                survivalMonths={36}
              />
              <SimilarCaseCard
                id="P-0789"
                name="Sneha Gupta"
                age={38}
                gender="Female"
                similarity={78}
                outcome="Positive"
                survivalMonths={54}
              />

              <div className="pt-2">
                <Button variant="outline" className="w-full">
                  View All Similar Cases
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-black/10 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
              <CardDescription>AI-generated treatment recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                <h3 className="font-medium flex items-center">
                  <Brain className="h-4 w-4 mr-2 text-purple-400" />
                  Primary Recommendation
                </h3>
                <p className="mt-1 text-sm text-gray-300">
                  Continue with the current quantum-optimized treatment plan with a 10% increase in radiation dose to
                  the peripheral tumor region while maintaining the same chemotherapy regimen.
                </p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs text-purple-400">Confidence: 92%</span>
                  <Button variant="outline" size="sm">
                    Apply
                  </Button>
                </div>
              </div>

              <div className="p-3 bg-cyan-900/20 border border-cyan-500/30 rounded-lg">
                <h3 className="font-medium flex items-center">
                  <Brain className="h-4 w-4 mr-2 text-cyan-400" />
                  Alternative Approach
                </h3>
                <p className="mt-1 text-sm text-gray-300">
                  Consider adding immunotherapy to the current regimen to enhance long-term outcomes. Genetic profile
                  suggests high likelihood of positive response to PD-1 inhibitors.
                </p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs text-cyan-400">Confidence: 85%</span>
                  <Button variant="outline" size="sm">
                    Consider
                  </Button>
                </div>
              </div>

              <div className="p-3 bg-amber-900/20 border border-amber-500/30 rounded-lg">
                <h3 className="font-medium flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-amber-400" />
                  Monitoring Recommendation
                </h3>
                <p className="mt-1 text-sm text-gray-300">
                  Increase MRI frequency to every 6 weeks to closely monitor the tumor's response to the adjusted
                  treatment plan, with particular attention to the inferior margin.
                </p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs text-amber-400">Priority: High</span>
                  <Button variant="outline" size="sm">
                    Schedule
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/10 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle>Clinical Trial Matches</CardTitle>
              <CardDescription>Potential clinical trials for this patient</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors">
                <div className="flex justify-between">
                  <h3 className="font-medium">Quantum-Enhanced Radiotherapy</h3>
                  <Badge className="bg-green-500">98% Match</Badge>
                </div>
                <p className="mt-1 text-sm text-gray-300">
                  Novel radiotherapy approach using quantum algorithms to optimize radiation delivery for maximum tumor
                  impact with minimal damage to surrounding tissue.
                </p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs text-gray-400">Memorial Cancer Institute</span>
                  <Button variant="outline" size="sm">
                    Details
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>

              <div className="p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors">
                <div className="flex justify-between">
                  <h3 className="font-medium">Targeted Immunotherapy</h3>
                  <Badge className="bg-green-500">92% Match</Badge>
                </div>
                <p className="mt-1 text-sm text-gray-300">
                  Personalized immunotherapy treatment targeting specific genetic markers present in the patient's tumor
                  profile, combined with standard chemotherapy.
                </p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs text-gray-400">National Cancer Research Center</span>
                  <Button variant="outline" size="sm">
                    Details
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>

              <div className="p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors">
                <div className="flex justify-between">
                  <h3 className="font-medium">AI-Guided Adaptive Therapy</h3>
                  <Badge className="bg-amber-500">85% Match</Badge>
                </div>
                <p className="mt-1 text-sm text-gray-300">
                  Treatment protocol that uses AI to continuously adapt and optimize the treatment plan based on the
                  patient's response and tumor evolution.
                </p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs text-gray-400">University Medical Research</span>
                  <Button variant="outline" size="sm">
                    Details
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>

              <div className="pt-2">
                <Button variant="outline" className="w-full">
                  View All Clinical Trials
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}

function SimilarCaseCard({
  id,
  name,
  age,
  gender,
  similarity,
  outcome,
  survivalMonths,
}: {
  id: string
  name: string
  age: number
  gender: string
  similarity: number
  outcome: "Positive" | "Negative" | "Mixed"
  survivalMonths: number
}) {
  const outcomeColors = {
    Positive: "text-green-400",
    Negative: "text-red-400",
    Mixed: "text-amber-400",
  }

  return (
    <div className="p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors">
      <div className="flex items-center">
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={name} />
          <AvatarFallback>
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center">
            <p className="font-medium">{name}</p>
            <Badge className="ml-2 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30">{id}</Badge>
          </div>
          <p className="text-xs text-gray-400">
            {age} / {gender}
          </p>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2 text-center text-sm">
        <div>
          <p className="text-gray-400 text-xs">Similarity</p>
          <p className="font-medium">{similarity}%</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Outcome</p>
          <p className={`font-medium ${outcomeColors[outcome]}`}>{outcome}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Survival</p>
          <p className="font-medium">{survivalMonths} mo</p>
        </div>
      </div>
    </div>
  )
}
