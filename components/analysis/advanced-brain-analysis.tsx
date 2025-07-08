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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import {
  Brain,
  Activity,
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  Shield,
  Download,
  RefreshCw,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle,
  Clock,
  Layers,
} from "lucide-react"
import { SimpleBrainVisualization } from "@/components/visualization/simple-brain-visualization"

interface BrainScanData {
  region: string
  volume: number
  density: number
  activity: number
  risk: number
}

interface TumorAnalysis {
  type: string
  grade: number
  size: number
  location: string
  malignancy: number
  confidence: number
}

export function AdvancedBrainAnalysis() {
  const [mounted, setMounted] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [threshold, setThreshold] = useState([75])

  useEffect(() => {
    setMounted(true)
  }, [])

  const brainRegions: BrainScanData[] = [
    { region: "Frontal Lobe", volume: 85, density: 92, activity: 78, risk: 15 },
    { region: "Parietal Lobe", volume: 88, density: 89, activity: 82, risk: 25 },
    { region: "Temporal Lobe", volume: 91, density: 87, activity: 85, risk: 35 },
    { region: "Occipital Lobe", volume: 86, density: 94, activity: 79, risk: 12 },
    { region: "Cerebellum", volume: 89, density: 91, activity: 88, risk: 18 },
    { region: "Brain Stem", volume: 92, density: 96, activity: 91, risk: 8 },
  ]

  const tumorAnalysis: TumorAnalysis = {
    type: "Glioblastoma",
    grade: 4,
    size: 2.3,
    location: "Right Temporal Lobe",
    malignancy: 85,
    confidence: 94,
  }

  const timeSeriesData = [
    { time: "0h", volume: 100, activity: 85, pressure: 12 },
    { time: "6h", volume: 102, activity: 87, pressure: 14 },
    { time: "12h", volume: 105, activity: 89, pressure: 16 },
    { time: "18h", volume: 108, activity: 92, pressure: 18 },
    { time: "24h", volume: 112, activity: 94, pressure: 20 },
    { time: "30h", volume: 115, activity: 96, pressure: 22 },
  ]

  const radarData = [
    { metric: "Volume", value: tumorAnalysis.size * 10, fullMark: 100 },
    { metric: "Density", value: 85, fullMark: 100 },
    { metric: "Vascularity", value: 72, fullMark: 100 },
    { metric: "Edema", value: 68, fullMark: 100 },
    { metric: "Enhancement", value: 91, fullMark: 100 },
    { metric: "Necrosis", value: 45, fullMark: 100 },
  ]

  const startAnalysis = () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)
    
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          return 100
        }
        return prev + 2
      })
    }, 100)
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Brain className="h-8 w-8 text-teal-400" />
            Advanced Brain Analysis
          </h1>
          <p className="text-gray-400 mt-2">AI-powered brain tumor detection and analysis</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={startAnalysis}
            disabled={isAnalyzing}
            className="bg-teal-600 hover:bg-teal-700"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Analysis
              </>
            )}
          </Button>
          <Button variant="outline" className="border-teal-500 text-teal-400">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <Card className="bg-gray-900/50 border-teal-500/30">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Analysis Progress</span>
                <span className="text-teal-400">{analysisProgress}%</span>
              </div>
              <Progress value={analysisProgress} className="h-2" />
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className={`flex items-center gap-2 ${analysisProgress > 30 ? 'text-green-400' : 'text-gray-400'}`}>
                  <CheckCircle className="h-4 w-4" />
                  Image Processing
                </div>
                <div className={`flex items-center gap-2 ${analysisProgress > 60 ? 'text-green-400' : 'text-gray-400'}`}>
                  <CheckCircle className="h-4 w-4" />
                  Feature Extraction
                </div>
                <div className={`flex items-center gap-2 ${analysisProgress > 90 ? 'text-green-400' : 'text-gray-400'}`}>
                  <CheckCircle className="h-4 w-4" />
                  Classification
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Analysis Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tumor Detection Results */}
        <Card className="lg:col-span-2 bg-gray-900/50 border-teal-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-teal-400" />
              Tumor Detection Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Tumor Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-400">Tumor Type</label>
                    <p className="text-white font-medium">{tumorAnalysis.type}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Grade</label>
                    <div className="flex items-center gap-2">
                      <Badge variant={tumorAnalysis.grade >= 3 ? "destructive" : "secondary"}>
                        Grade {tumorAnalysis.grade}
                      </Badge>
                      {tumorAnalysis.grade >= 3 && (
                        <AlertTriangle className="h-4 w-4 text-red-400" />
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Size (cm)</label>
                    <p className="text-white font-medium">{tumorAnalysis.size}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-400">Location</label>
                    <p className="text-white font-medium">{tumorAnalysis.location}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Malignancy Risk</label>
                    <div className="space-y-2">
                      <Progress value={tumorAnalysis.malignancy} className="h-2" />
                      <span className="text-sm text-gray-400">{tumorAnalysis.malignancy}%</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">AI Confidence</label>
                    <div className="space-y-2">
                      <Progress value={tumorAnalysis.confidence} className="h-2" />
                      <span className="text-sm text-gray-400">{tumorAnalysis.confidence}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Radar Chart */}
              <div className="h-64">
                <h4 className="text-white font-medium mb-4">Tumor Characteristics</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                    <PolarRadiusAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                    <Radar
                      name="Tumor"
                      dataKey="value"
                      stroke="#14B8A6"
                      fill="#14B8A6"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Brain Regions Analysis */}
        <Card className="bg-gray-900/50 border-teal-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Layers className="h-5 w-5 text-teal-400" />
              Brain Regions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {brainRegions.map((region) => (
                <div
                  key={region.region}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedRegion === region.region
                      ? 'border-teal-500 bg-teal-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                  onClick={() => setSelectedRegion(region.region)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium text-sm">{region.region}</span>
                    <Badge
                      variant={region.risk > 30 ? "destructive" : region.risk > 15 ? "secondary" : "outline"}
                      className="text-xs"
                    >
                      {region.risk}% risk
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Activity</span>
                      <span className="text-gray-300">{region.activity}%</span>
                    </div>
                    <Progress value={region.activity} className="h-1" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Brain Visualization */}
      <SimpleBrainVisualization />

      {/* Time Series Analysis */}
      <Card className="bg-gray-900/50 border-teal-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-teal-400" />
            Temporal Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" tick={{ fill: '#9CA3AF' }} />
                <YAxis tick={{ fill: '#9CA3AF' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="volume"
                  stroke="#14B8A6"
                  strokeWidth={2}
                  name="Tumor Volume"
                />
                <Line
                  type="monotone"
                  dataKey="activity"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  name="Brain Activity"
                />
                <Line
                  type="monotone"
                  dataKey="pressure"
                  stroke="#EF4444"
                  strokeWidth={2}
                  name="Intracranial Pressure"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
