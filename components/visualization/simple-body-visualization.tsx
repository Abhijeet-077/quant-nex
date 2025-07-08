"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Activity,
  Heart,
  Brain,
  Zap,
  User,
  Stethoscope,
  Activity as Pulse,
} from "lucide-react"

export function SimpleBodyVisualization() {
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [selectedSystem, setSelectedSystem] = useState("all")

  const systems = [
    { id: "cardiovascular", name: "Cardiovascular", icon: Heart, color: "text-red-400", status: "Normal" },
    { id: "nervous", name: "Nervous System", icon: Brain, color: "text-purple-400", status: "Normal" },
    { id: "respiratory", name: "Respiratory", icon: Activity, color: "text-blue-400", status: "Normal" },
  ]

  return (
    <Card className="bg-gray-900/50 border-green-500/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <User className="h-5 w-5 text-green-400" />
          Full Body Neural Network
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Main Visualization Area */}
          <div className="h-96 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/20 flex items-center justify-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-6 grid-rows-8 h-full w-full">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="border border-green-400/20"></div>
                ))}
              </div>
            </div>
            
            {/* Central Body Icon */}
            <div className="relative z-10 text-center">
              <User className={`h-32 w-32 text-green-400 mx-auto mb-4 ${isMonitoring ? 'animate-pulse' : ''}`} />
              <h3 className="text-xl font-bold text-white mb-2">Neural Network Monitoring</h3>
              <p className="text-slate-300 mb-4">Real-time body system analysis</p>
            </div>

            {/* System Indicators */}
            <div className="absolute top-4 left-4 space-y-2">
              {systems.map((system) => (
                <Badge key={system.id} className="bg-green-600/20 text-green-400 border-green-500/30">
                  <system.icon className="h-3 w-3 mr-1" />
                  {system.name}: {system.status}
                </Badge>
              ))}
            </div>

            {/* Live Monitoring Indicator */}
            <div className="absolute bottom-4 right-4">
              <Badge className={`${isMonitoring ? 'bg-green-600/20 text-green-400 border-green-500/30' : 'bg-gray-600/20 text-gray-400 border-gray-500/30'}`}>
                <Pulse className="h-3 w-3 mr-1" />
                {isMonitoring ? 'Live Monitoring' : 'Monitoring Paused'}
              </Badge>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                onClick={() => setIsMonitoring(!isMonitoring)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Zap className="h-4 w-4 mr-2" />
                {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
              </Button>
              <Button variant="outline" className="border-green-500/50">
                <Stethoscope className="h-4 w-4 mr-2" />
                Full Scan
              </Button>
            </div>
          </div>

          {/* System Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {systems.map((system) => (
              <div key={system.id} className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <system.icon className={`h-4 w-4 ${system.color}`} />
                  <span className="text-white font-medium">{system.name}</span>
                </div>
                <p className="text-2xl font-bold text-white">{system.status}</p>
                <p className="text-sm text-slate-400">All parameters normal</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
