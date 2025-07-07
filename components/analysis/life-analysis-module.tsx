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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import {
  Heart,
  Brain,
  Activity,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Target,
  Award,
  Users,
  Zap,
  Shield,
  Download,
  RefreshCw,
  Play,
  Pause,
} from "lucide-react"

interface LifeStage {
  stage: string
  ageRange: string
  qualityOfLife: number
  functionalStatus: number
  treatmentIntensity: number
  survivalProbability: number
  keyMilestones: string[]
}

interface PatientJourney {
  phase: string
  duration: number
  qualityScore: number
  challenges: string[]
  achievements: string[]
  medicalEvents: string[]
}

interface LongTermOutcome {
  timepoint: string
  survival: number
  qualityOfLife: number
  functionalIndependence: number
  cognitiveFunction: number
  socialEngagement: number
}

export function LifeAnalysisModule() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("lifetime")
  const [patientAge, setPatientAge] = useState([45])
  const [isSimulating, setIsSimulating] = useState(false)

  const lifeStages: LifeStage[] = [
    {
      stage: "Diagnosis & Initial Treatment",
      ageRange: "45-46 years",
      qualityOfLife: 65,
      functionalStatus: 80,
      treatmentIntensity: 90,
      survivalProbability: 95,
      keyMilestones: ["Diagnosis confirmation", "Surgery completion", "Treatment initiation"],
    },
    {
      stage: "Active Treatment Phase",
      ageRange: "46-47 years",
      qualityOfLife: 55,
      functionalStatus: 70,
      treatmentIntensity: 85,
      survivalProbability: 88,
      keyMilestones: ["Radiation therapy", "Chemotherapy cycles", "Response assessment"],
    },
    {
      stage: "Maintenance & Monitoring",
      ageRange: "47-50 years",
      qualityOfLife: 75,
      functionalStatus: 85,
      treatmentIntensity: 40,
      survivalProbability: 72,
      keyMilestones: ["Treatment completion", "Regular monitoring", "Lifestyle adaptation"],
    },
    {
      stage: "Long-term Survivorship",
      ageRange: "50-55 years",
      qualityOfLife: 80,
      functionalStatus: 90,
      treatmentIntensity: 20,
      survivalProbability: 58,
      keyMilestones: ["5-year milestone", "Return to work", "Family planning"],
    },
    {
      stage: "Extended Survivorship",
      ageRange: "55+ years",
      qualityOfLife: 85,
      functionalStatus: 85,
      treatmentIntensity: 15,
      survivalProbability: 42,
      keyMilestones: ["10-year milestone", "Retirement planning", "Legacy building"],
    },
  ]

  const patientJourney: PatientJourney[] = [
    {
      phase: "Pre-Diagnosis",
      duration: 3,
      qualityScore: 90,
      challenges: ["Subtle symptoms", "Delayed recognition"],
      achievements: ["Maintained normal life", "Strong support system"],
      medicalEvents: ["Initial symptoms", "GP consultation", "Specialist referral"],
    },
    {
      phase: "Diagnosis & Planning",
      duration: 2,
      qualityScore: 60,
      challenges: ["Emotional shock", "Treatment decisions", "Family impact"],
      achievements: ["Quick diagnosis", "Comprehensive planning", "Team assembly"],
      medicalEvents: ["MRI confirmation", "Biopsy results", "Treatment planning"],
    },
    {
      phase: "Active Treatment",
      duration: 12,
      qualityScore: 55,
      challenges: ["Side effects", "Fatigue", "Work limitations"],
      achievements: ["Treatment completion", "Tumor response", "Resilience"],
      medicalEvents: ["Surgery", "Radiation therapy", "Chemotherapy"],
    },
    {
      phase: "Recovery & Adaptation",
      duration: 18,
      qualityScore: 75,
      challenges: ["Cognitive changes", "Physical recovery", "Anxiety"],
      achievements: ["Functional recovery", "Return to activities", "New perspectives"],
      medicalEvents: ["Follow-up scans", "Rehabilitation", "Monitoring"],
    },
  ]

  const longTermOutcomes: LongTermOutcome[] = [
    { timepoint: "1 year", survival: 87, qualityOfLife: 70, functionalIndependence: 85, cognitiveFunction: 80, socialEngagement: 75 },
    { timepoint: "2 years", survival: 78, qualityOfLife: 75, functionalIndependence: 88, cognitiveFunction: 82, socialEngagement: 80 },
    { timepoint: "3 years", survival: 68, qualityOfLife: 78, functionalIndependence: 90, cognitiveFunction: 85, socialEngagement: 85 },
    { timepoint: "5 years", survival: 58, qualityOfLife: 80, functionalIndependence: 85, cognitiveFunction: 88, socialEngagement: 88 },
    { timepoint: "10 years", survival: 42, qualityOfLife: 85, functionalIndependence: 80, cognitiveFunction: 90, socialEngagement: 90 },
    { timepoint: "15 years", survival: 35, qualityOfLife: 88, functionalIndependence: 75, cognitiveFunction: 85, socialEngagement: 92 },
  ]

  const runLifeSimulation = () => {
    setIsSimulating(true)
    setTimeout(() => {
      setIsSimulating(false)
    }, 3000)
  }

  const downloadAnalysis = () => {
    console.log("Downloading life analysis report...")
  }

  const getStageColor = (index: number) => {
    const colors = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"]
    return colors[index % colors.length]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="card-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-teal-400 flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Life Analysis & Patient Journey
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                onClick={runLifeSimulation}
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
                    Run Simulation
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={downloadAnalysis}
                className="glow-hover bg-transparent"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {longTermOutcomes[3]?.survival}%
              </div>
              <p className="text-sm text-gray-400">5-Year Survival</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {longTermOutcomes[3]?.qualityOfLife}%
              </div>
              <p className="text-sm text-gray-400">Quality of Life</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {longTermOutcomes[3]?.functionalIndependence}%
              </div>
              <p className="text-sm text-gray-400">Functional Independence</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {lifeStages.length}
              </div>
              <p className="text-sm text-gray-400">Life Stages</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Analysis */}
      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="text-white">Comprehensive Life Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <TabsList className="grid w-full grid-cols-4 bg-teal-900/20 mb-6">
              <TabsTrigger value="journey" className="data-[state=active]:bg-teal-600 text-xs">
                Patient Journey
              </TabsTrigger>
              <TabsTrigger value="stages" className="data-[state=active]:bg-teal-600 text-xs">
                Life Stages
              </TabsTrigger>
              <TabsTrigger value="outcomes" className="data-[state=active]:bg-teal-600 text-xs">
                Long-term Outcomes
              </TabsTrigger>
              <TabsTrigger value="simulation" className="data-[state=active]:bg-teal-600 text-xs">
                Simulation
              </TabsTrigger>
            </TabsList>

            <TabsContent value="journey" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-lg">Patient Journey Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={patientJourney}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="phase" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1f2937",
                              border: "1px solid #374151",
                              borderRadius: "8px",
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="qualityScore"
                            stroke="#06b6d4"
                            fill="#06b6d4"
                            fillOpacity={0.3}
                            strokeWidth={3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  {patientJourney.map((phase, index) => (
                    <Card key={index} className="bg-slate-800/50 border-slate-700/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-medium text-sm">{phase.phase}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {phase.duration} months
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Quality Score:</span>
                            <span className="text-white">{phase.qualityScore}%</span>
                          </div>
                          <Progress value={phase.qualityScore} className="h-1" />
                        </div>
                        <div className="mt-3 space-y-1">
                          <div className="text-xs text-gray-400">Key Events:</div>
                          {phase.medicalEvents.slice(0, 2).map((event, eventIndex) => (
                            <div key={eventIndex} className="text-xs text-gray-300">
                              • {event}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="stages" className="space-y-6">
              <div className="space-y-4">
                {lifeStages.map((stage, index) => (
                  <Card
                    key={index}
                    className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 transition-all"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-white font-semibold text-lg">{stage.stage}</h3>
                          <p className="text-gray-400">{stage.ageRange}</p>
                        </div>
                        <Badge
                          variant="outline"
                          style={{ borderColor: getStageColor(index), color: getStageColor(index) }}
                        >
                          Stage {index + 1}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Quality of Life</div>
                          <div className="flex items-center gap-2">
                            <Progress value={stage.qualityOfLife} className="h-2 flex-1" />
                            <span className="text-white text-sm">{stage.qualityOfLife}%</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Functional Status</div>
                          <div className="flex items-center gap-2">
                            <Progress value={stage.functionalStatus} className="h-2 flex-1" />
                            <span className="text-white text-sm">{stage.functionalStatus}%</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Treatment Intensity</div>
                          <div className="flex items-center gap-2">
                            <Progress value={stage.treatmentIntensity} className="h-2 flex-1" />
                            <span className="text-white text-sm">{stage.treatmentIntensity}%</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Survival Probability</div>
                          <div className="flex items-center gap-2">
                            <Progress value={stage.survivalProbability} className="h-2 flex-1" />
                            <span className="text-white text-sm">{stage.survivalProbability}%</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-400 mb-2">Key Milestones:</div>
                        <div className="flex flex-wrap gap-2">
                          {stage.keyMilestones.map((milestone, milestoneIndex) => (
                            <Badge key={milestoneIndex} variant="secondary" className="text-xs">
                              {milestone}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="outcomes" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">Long-term Outcome Predictions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={longTermOutcomes}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="timepoint" stroke="#9ca3af" />
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
                        dataKey="survival"
                        stroke="#ef4444"
                        strokeWidth={3}
                        name="Survival"
                      />
                      <Line
                        type="monotone"
                        dataKey="qualityOfLife"
                        stroke="#10b981"
                        strokeWidth={2}
                        name="Quality of Life"
                      />
                      <Line
                        type="monotone"
                        dataKey="functionalIndependence"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        name="Functional Independence"
                      />
                      <Line
                        type="monotone"
                        dataKey="cognitiveFunction"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        name="Cognitive Function"
                      />
                      <Line
                        type="monotone"
                        dataKey="socialEngagement"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        name="Social Engagement"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="simulation" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-lg">Simulation Parameters</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">
                        Patient Age: {patientAge[0]} years
                      </label>
                      <Slider
                        value={patientAge}
                        onValueChange={setPatientAge}
                        max={80}
                        min={18}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="text-white font-medium">Simulation Results</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Expected Lifespan:</span>
                          <span className="text-white">18.5 years</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Quality-Adjusted Life Years:</span>
                          <span className="text-white">14.2 QALY</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Functional Years:</span>
                          <span className="text-white">12.8 years</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-lg">Life Impact Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm text-gray-300">
                          High probability of achieving major life milestones
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-400" />
                        <span className="text-sm text-gray-300">
                          Strong family and social support system
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-gray-300">
                          Excellent treatment response potential
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-purple-400" />
                        <span className="text-sm text-gray-300">
                          Cognitive function preservation likely
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
