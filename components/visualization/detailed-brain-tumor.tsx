"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Target, Activity, AlertTriangle } from "lucide-react"

export function DetailedBrainTumor() {
  const [tumorIntensity, setTumorIntensity] = useState(0.8)
  const [neuralActivity, setNeuralActivity] = useState(0.7)
  const [showPathways, setShowPathways] = useState(true)
  const [showTumorBoundary, setShowTumorBoundary] = useState(true)
  const [pulsePhase, setPulsePhase] = useState(0)
  const [networkAnimation, setNetworkAnimation] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase((prev) => (prev + 0.1) % (Math.PI * 2))
      setNetworkAnimation((prev) => (prev + 0.05) % (Math.PI * 2))
    }, 50)
    return () => clearInterval(interval)
  }, [])

  const tumorPulse = Math.sin(pulsePhase) * 0.3 + 0.7
  const networkPulse = Math.sin(networkAnimation) * 0.2 + 0.8

  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-900 via-indigo-900 to-black rounded-xl overflow-hidden relative">
      {/* Advanced Controls */}
      <div className="absolute top-4 left-4 z-30 bg-black/95 backdrop-blur-sm rounded-lg p-4 border border-gray-700 max-w-xs">
        <div className="space-y-4">
          <h3 className="text-white font-semibold text-sm">Brain Tumor Analysis</h3>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Button
                variant={showTumorBoundary ? "default" : "outline"}
                size="sm"
                onClick={() => setShowTumorBoundary(!showTumorBoundary)}
                className="bg-red-500/20 border-red-500/50 text-red-300 text-xs"
              >
                <Target className="h-3 w-3 mr-1" />
                Boundary
              </Button>
              <Button
                variant={showPathways ? "default" : "outline"}
                size="sm"
                onClick={() => setShowPathways(!showPathways)}
                className="bg-blue-500/20 border-blue-500/50 text-blue-300 text-xs"
              >
                <Activity className="h-3 w-3 mr-1" />
                Neural
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-white">Tumor Intensity</span>
                <span className="text-xs text-white">{Math.round(tumorIntensity * 100)}%</span>
              </div>
              <Slider
                value={[tumorIntensity]}
                min={0.1}
                max={1}
                step={0.05}
                onValueChange={(value) => setTumorIntensity(value[0])}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-white">Neural Activity</span>
                <span className="text-xs text-white">{Math.round(neuralActivity * 100)}%</span>
              </div>
              <Slider
                value={[neuralActivity]}
                min={0.1}
                max={1}
                step={0.05}
                onValueChange={(value) => setNeuralActivity(value[0])}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Medical Status */}
      <div className="absolute bottom-4 left-4 z-30 space-y-2">
        <Badge variant="secondary" className="bg-red-500/20 text-red-300">
          Glioblastoma Grade IV
        </Badge>
        <Badge variant="secondary" className="bg-orange-500/20 text-orange-300">
          4.2cm Diameter
        </Badge>
        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
          High Vascularization
        </Badge>
      </div>

      {/* Brain Visualization */}
      <div className="w-full h-full flex items-center justify-center relative">
        <div className="relative w-96 h-80">
          {/* Brain Outline - Crystalline Structure */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(ellipse at 30% 30%, 
                rgba(200, 220, 255, 0.15) 0%, 
                rgba(150, 180, 255, 0.1) 40%, 
                rgba(100, 140, 255, 0.05) 80%, 
                transparent 100%)`,
              border: "2px solid rgba(200, 220, 255, 0.3)",
              boxShadow: `
                inset 0 0 50px rgba(200, 220, 255, 0.2),
                0 0 30px rgba(200, 220, 255, 0.3),
                0 0 60px rgba(150, 180, 255, 0.1)
              `,
              clipPath: "ellipse(85% 90% at 50% 45%)",
            }}
          />

          {/* Neural Network - Web-like Structure */}
          {showPathways && (
            <div className="absolute inset-0" style={{ opacity: neuralActivity * networkPulse }}>
              {/* Primary Neural Pathways */}
              {Array.from({ length: 24 }, (_, i) => {
                const angle = (i / 24) * Math.PI * 2
                const radius = 120 + Math.sin(i * 0.5) * 20
                const x = Math.cos(angle) * radius
                const y = Math.sin(angle) * radius * 0.8

                return (
                  <div
                    key={i}
                    className="absolute w-0.5 bg-blue-300/60 rounded-full"
                    style={{
                      height: `${60 + Math.sin(networkAnimation + i) * 20}px`,
                      left: `${192 + x}px`,
                      top: `${160 + y}px`,
                      transform: `rotate(${(angle * 180) / Math.PI + 90}deg)`,
                      transformOrigin: "bottom center",
                      boxShadow: `0 0 4px rgba(100, 200, 255, ${0.6 * networkPulse})`,
                    }}
                  />
                )
              })}

              {/* Secondary Network Connections */}
              {Array.from({ length: 48 }, (_, i) => {
                const angle1 = (i / 48) * Math.PI * 2
                const angle2 = ((i + 8) / 48) * Math.PI * 2
                const radius = 80 + Math.sin(i * 0.3) * 15
                const x1 = Math.cos(angle1) * radius
                const y1 = Math.sin(angle1) * radius * 0.8
                const x2 = Math.cos(angle2) * radius
                const y2 = Math.sin(angle2) * radius * 0.8
                const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
                const angle = Math.atan2(y2 - y1, x2 - x1)

                return (
                  <div
                    key={i}
                    className="absolute h-0.5 bg-cyan-400/40 rounded-full"
                    style={{
                      width: `${length}px`,
                      left: `${192 + x1}px`,
                      top: `${160 + y1}px`,
                      transform: `rotate(${angle}rad)`,
                      transformOrigin: "left center",
                      opacity: Math.sin(networkAnimation + i * 0.1) * 0.3 + 0.4,
                      boxShadow: `0 0 2px rgba(0, 255, 255, ${0.4 * networkPulse})`,
                    }}
                  />
                )
              })}

              {/* Neural Nodes */}
              {Array.from({ length: 16 }, (_, i) => {
                const angle = (i / 16) * Math.PI * 2
                const radius = 100 + Math.sin(i * 0.7) * 25
                const x = Math.cos(angle) * radius
                const y = Math.sin(angle) * radius * 0.8

                return (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-blue-400/80 rounded-full"
                    style={{
                      left: `${190 + x}px`,
                      top: `${158 + y}px`,
                      boxShadow: `0 0 8px rgba(100, 200, 255, ${0.8 * networkPulse})`,
                      transform: `scale(${0.8 + Math.sin(networkAnimation + i) * 0.3})`,
                    }}
                  />
                )
              })}
            </div>
          )}

          {/* Tumor Core - Bright Orange Center */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: `${60 * tumorPulse}px`,
              height: `${60 * tumorPulse}px`,
              background: `radial-gradient(circle, 
                rgba(255, 100, 0, ${tumorIntensity * 0.9}) 0%,
                rgba(255, 150, 50, ${tumorIntensity * 0.7}) 30%,
                rgba(255, 200, 100, ${tumorIntensity * 0.5}) 60%,
                rgba(255, 220, 150, ${tumorIntensity * 0.2}) 100%)`,
              borderRadius: "50%",
              boxShadow: `
                0 0 20px rgba(255, 100, 0, ${tumorIntensity * 0.8}),
                0 0 40px rgba(255, 150, 0, ${tumorIntensity * 0.4}),
                0 0 60px rgba(255, 200, 0, ${tumorIntensity * 0.2})
              `,
              filter: `brightness(${1 + tumorPulse * 0.3})`,
            }}
          >
            {/* Tumor Necrotic Core */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
              style={{
                background: `radial-gradient(circle, rgba(150, 50, 0, 0.9), rgba(200, 80, 0, 0.6))`,
                boxShadow: `0 0 10px rgba(150, 50, 0, 0.8)`,
              }}
            />

            {/* Tumor Vasculature */}
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className="absolute w-8 h-0.5 bg-red-500/70 rounded-full"
                style={{
                  top: "50%",
                  left: "50%",
                  transformOrigin: "0 50%",
                  transform: `rotate(${i * 45}deg)`,
                  boxShadow: `0 0 3px rgba(255, 0, 0, 0.6)`,
                }}
              />
            ))}
          </div>

          {/* Tumor Boundary Visualization */}
          {showTumorBoundary && (
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-dashed border-red-400/60 rounded-full animate-pulse"
              style={{
                width: `${120 * tumorPulse}px`,
                height: `${120 * tumorPulse}px`,
                boxShadow: `0 0 15px rgba(255, 100, 100, 0.3)`,
              }}
            />
          )}

          {/* Edema Zone */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-yellow-400/40 rounded-full"
            style={{
              width: `${180 * tumorPulse}px`,
              height: `${180 * tumorPulse}px`,
              background: `radial-gradient(circle, transparent 60%, rgba(255, 255, 0, 0.1) 80%, transparent 100%)`,
            }}
          />

          {/* Medical Labels */}
          <div className="absolute top-8 right-4 bg-red-600/90 text-white text-xs px-3 py-2 rounded-lg border border-red-400 shadow-xl backdrop-blur-sm">
            <div className="font-bold">Tumor Core</div>
            <div className="text-red-200 text-xs">High Cellularity</div>
          </div>

          <div className="absolute top-20 left-4 bg-blue-600/90 text-white text-xs px-3 py-2 rounded-lg border border-blue-400 shadow-xl backdrop-blur-sm">
            <div className="font-bold">Neural Network</div>
            <div className="text-blue-200 text-xs">Disrupted Pathways</div>
          </div>

          <div className="absolute bottom-8 right-8 bg-yellow-600/90 text-white text-xs px-3 py-2 rounded-lg border border-yellow-400 shadow-xl backdrop-blur-sm">
            <div className="font-bold">Edema Zone</div>
            <div className="text-yellow-200 text-xs">Swelling Area</div>
          </div>

          <div className="absolute bottom-20 left-8 bg-orange-600/90 text-white text-xs px-3 py-2 rounded-lg border border-orange-400 shadow-xl backdrop-blur-sm">
            <div className="font-bold">Vascularization</div>
            <div className="text-orange-200 text-xs">Blood Supply</div>
          </div>
        </div>

        {/* Tumor Analysis Panel */}
        <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-sm rounded-lg p-4 border border-gray-700 max-w-sm">
          <h3 className="text-white font-semibold mb-3 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2 text-red-400" />
            Tumor Analysis
          </h3>
          <div className="space-y-2 text-sm text-gray-300">
            <div className="flex justify-between">
              <span>Size:</span>
              <span className="text-white">4.2 cm diameter</span>
            </div>
            <div className="flex justify-between">
              <span>Grade:</span>
              <span className="text-red-400">IV (Glioblastoma)</span>
            </div>
            <div className="flex justify-between">
              <span>Vascularity:</span>
              <span className="text-orange-400">High</span>
            </div>
            <div className="flex justify-between">
              <span>Edema:</span>
              <span className="text-yellow-400">Moderate</span>
            </div>
            <div className="flex justify-between">
              <span>Neural Impact:</span>
              <span className="text-blue-400">Severe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
