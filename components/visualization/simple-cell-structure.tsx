"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Microscope,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react"

export function SimpleCellStructure() {
  const [showCancerCells, setShowCancerCells] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  return (
    <Card className="bg-gray-900/50 border-purple-500/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Microscope className="h-5 w-5 text-purple-400" />
          Cellular Structure Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Main Visualization Area */}
          <div className="h-80 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20 flex items-center justify-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
                {Array.from({ length: 96 }).map((_, i) => (
                  <div key={i} className="border border-purple-400/20"></div>
                ))}
              </div>
            </div>
            
            {/* Central Microscope Icon */}
            <div className="relative z-10 text-center">
              <Microscope className={`h-24 w-24 text-purple-400 mx-auto mb-4 ${isAnalyzing ? 'animate-pulse' : ''}`} />
              <h3 className="text-xl font-bold text-white mb-2">Cellular Analysis</h3>
              <p className="text-slate-300 mb-4">High-resolution microscopic view</p>
            </div>

            {/* Cell Indicators */}
            <div className="absolute top-4 left-4 space-y-2">
              <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
                <CheckCircle className="h-3 w-3 mr-1" />
                Healthy Cells
              </Badge>
              {showCancerCells && (
                <Badge className="bg-red-600/20 text-red-400 border-red-500/30">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Abnormal Cells
                </Badge>
              )}
            </div>

            {/* Activity Indicator */}
            <div className="absolute bottom-4 right-4">
              <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">
                <Activity className="h-3 w-3 mr-1" />
                Live Analysis
              </Badge>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                onClick={() => setIsAnalyzing(!isAnalyzing)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Zap className="h-4 w-4 mr-2" />
                {isAnalyzing ? 'Stop Analysis' : 'Start Analysis'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCancerCells(!showCancerCells)}
                className="border-purple-500/50"
              >
                {showCancerCells ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showCancerCells ? 'Hide' : 'Show'} Abnormal Cells
              </Button>
            </div>
          </div>

          {/* Analysis Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-white font-medium">Healthy Cells</span>
              </div>
              <p className="text-2xl font-bold text-white">94.2%</p>
              <p className="text-sm text-slate-400">Normal cellular structure</p>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <span className="text-white font-medium">Abnormal Cells</span>
              </div>
              <p className="text-2xl font-bold text-white">5.8%</p>
              <p className="text-sm text-slate-400">Requires attention</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
