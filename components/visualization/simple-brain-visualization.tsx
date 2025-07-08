"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Brain,
  Activity,
  Target,
  Zap,
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react"

export function SimpleBrainVisualization() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  const handleStartAnalysis = () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)
    
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  return (
    <Card className="bg-gray-900/50 border-teal-500/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Brain className="h-5 w-5 text-teal-400" />
          Brain Analysis Visualization
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Main Visualization Area */}
          <div className="h-96 bg-gradient-to-br from-teal-500/10 to-blue-500/10 rounded-lg border border-teal-500/20 flex items-center justify-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="border border-teal-400/20"></div>
                ))}
              </div>
            </div>
            
            {/* Central Brain Icon */}
            <div className="relative z-10 text-center">
              <Brain className={`h-32 w-32 text-teal-400 mx-auto mb-4 ${isAnalyzing ? 'animate-pulse' : ''}`} />
              <h3 className="text-2xl font-bold text-white mb-2">Advanced Brain Analysis</h3>
              <p className="text-slate-300 mb-4">Interactive medical visualization system</p>
              
              {/* Analysis Progress */}
              {isAnalyzing && (
                <div className="w-64 mx-auto">
                  <Progress value={analysisProgress} className="mb-2" />
                  <p className="text-sm text-teal-400">Analyzing... {analysisProgress}%</p>
                </div>
              )}
            </div>

            {/* Floating Elements */}
            <div className="absolute top-4 left-4">
              <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
                <CheckCircle className="h-3 w-3 mr-1" />
                Healthy Regions
              </Badge>
            </div>
            <div className="absolute top-4 right-4">
              <Badge className="bg-red-600/20 text-red-400 border-red-500/30">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Areas of Interest
              </Badge>
            </div>
            <div className="absolute bottom-4 left-4">
              <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">
                <Activity className="h-3 w-3 mr-1" />
                Neural Activity
              </Badge>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                onClick={handleStartAnalysis}
                disabled={isAnalyzing}
                className="bg-teal-600 hover:bg-teal-700"
              >
                {isAnalyzing ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Analysis
                  </>
                )}
              </Button>
              <Button variant="outline" className="border-teal-500/50">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset View
              </Button>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-slate-300">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span>Normal</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span>Attention</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <span>Critical</span>
              </div>
            </div>
          </div>

          {/* Analysis Results */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-teal-400" />
                <span className="text-white font-medium">Tumor Detection</span>
              </div>
              <p className="text-2xl font-bold text-white">2 Areas</p>
              <p className="text-sm text-slate-400">Identified for review</p>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-green-400" />
                <span className="text-white font-medium">Neural Activity</span>
              </div>
              <p className="text-2xl font-bold text-white">Normal</p>
              <p className="text-sm text-slate-400">Within expected range</p>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-blue-400" />
                <span className="text-white font-medium">Analysis Score</span>
              </div>
              <p className="text-2xl font-bold text-white">94%</p>
              <p className="text-sm text-slate-400">Confidence level</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
