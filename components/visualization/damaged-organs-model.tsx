"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Zap } from "lucide-react"

export function DamagedOrgansModel() {
  const [damageLevel, setDamageLevel] = useState(0.7)
  const [showRadiation, setShowRadiation] = useState(true)
  const [activeOrgan, setActiveOrgan] = useState("lungs")
  const [pulsePhase, setPulsePhase] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase((prev) => (prev + 0.1) % (Math.PI * 2))
    }, 100)
    return () => clearInterval(interval)
  }, [])

  const damagePulse = Math.sin(pulsePhase) * 0.2 + 0.8

  return (
    <div className="w-full h-full bg-gradient-to-b from-slate-900 via-blue-900 to-black rounded-xl overflow-hidden relative">
      {/* Controls */}
      <div className="absolute top-4 left-4 z-30 bg-black/95 backdrop-blur-sm rounded-lg p-4 border border-gray-700 max-w-xs">
        <div className="space-y-4">
          <h3 className="text-white font-semibold text-sm">Organ Damage Assessment</h3>

          <Tabs value={activeOrgan} onValueChange={setActiveOrgan} className="w-full">
            <TabsList className="grid grid-cols-3 bg-gray-800 text-xs">
              <TabsTrigger value="lungs" className="text-xs">
                Lungs
              </TabsTrigger>
              <TabsTrigger value="heart" className="text-xs">
                Heart
              </TabsTrigger>
              <TabsTrigger value="liver" className="text-xs">
                Liver
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Button
                variant={showRadiation ? "default" : "outline"}
                size="sm"
                onClick={() => setShowRadiation(!showRadiation)}
                className="bg-cyan-500/20 border-cyan-500/50 text-cyan-300 text-xs"
              >
                <Zap className="h-3 w-3 mr-1" />
                Radiation
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-white">Damage Level</span>
                <span className="text-xs text-white">{Math.round(damageLevel * 100)}%</span>
              </div>
              <Slider
                value={[damageLevel]}
                min={0.1}
                max={1}
                step={0.05}
                onValueChange={(value) => setDamageLevel(value[0])}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="absolute bottom-4 left-4 z-30 space-y-2">
        <Badge variant="secondary" className="bg-red-500/20 text-red-300">
          Radiation Pneumonitis
        </Badge>
        <Badge variant="secondary" className="bg-orange-500/20 text-orange-300">
          Cardiac Toxicity Risk
        </Badge>
      </div>

      {/* Body Visualization */}
      <div className="w-full h-full flex items-center justify-center relative">
        <div className="relative w-64 h-96">
          {/* Body Outline */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, 
                rgba(100, 200, 255, 0.1) 0%, 
                rgba(50, 150, 255, 0.05) 100%)`,
              clipPath:
                "polygon(45% 0%, 55% 0%, 60% 15%, 65% 25%, 70% 35%, 75% 50%, 70% 65%, 65% 75%, 60% 85%, 55% 95%, 50% 100%, 45% 100%, 40% 95%, 35% 85%, 30% 75%, 25% 65%, 30% 50%, 35% 35%, 40% 25%, 45% 15%)",
              border: `2px solid rgba(100, 200, 255, 0.3)`,
              boxShadow: `inset 0 0 30px rgba(100, 200, 255, 0.2), 0 0 20px rgba(100, 200, 255, 0.3)`,
            }}
          />

          {/* Head */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-20 rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(100, 200, 255, 0.15), rgba(50, 150, 255, 0.1))`,
              border: `1px solid rgba(100, 200, 255, 0.3)`,
            }}
          />

          {/* Damaged Lungs */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-20 h-16">
            {/* Left Lung */}
            <div
              className="absolute top-0 left-0 w-8 h-14 rounded-l-full"
              style={{
                background: `linear-gradient(135deg, 
                  rgba(255, 100, 100, ${damageLevel * damagePulse}) 0%,
                  rgba(255, 150, 100, ${damageLevel * 0.8}) 30%,
                  rgba(200, 100, 150, ${damageLevel * 0.6}) 70%,
                  rgba(150, 100, 200, 0.4) 100%)`,
                boxShadow: `0 0 15px rgba(255, 100, 100, ${damageLevel * 0.6})`,
              }}
            >
              {/* Damage Spots */}
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full animate-pulse"
                  style={{
                    width: `${4 + i}px`,
                    height: `${4 + i}px`,
                    top: `${10 + i * 8}px`,
                    left: `${2 + (i % 2) * 4}px`,
                    background: `rgba(255, 50, 50, ${damageLevel * 0.9})`,
                    boxShadow: `0 0 8px rgba(255, 50, 50, ${damageLevel * 0.7})`,
                  }}
                />
              ))}
            </div>

            {/* Right Lung */}
            <div
              className="absolute top-0 right-0 w-8 h-14 rounded-r-full"
              style={{
                background: `linear-gradient(135deg, 
                  rgba(255, 100, 100, ${damageLevel * damagePulse}) 0%,
                  rgba(255, 150, 100, ${damageLevel * 0.8}) 30%,
                  rgba(200, 100, 150, ${damageLevel * 0.6}) 70%,
                  rgba(150, 100, 200, 0.4) 100%)`,
                boxShadow: `0 0 15px rgba(255, 100, 100, ${damageLevel * 0.6})`,
              }}
            >
              {/* Damage Spots */}
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full animate-pulse"
                  style={{
                    width: `${3 + i * 0.5}px`,
                    height: `${3 + i * 0.5}px`,
                    top: `${8 + i * 6}px`,
                    left: `${1 + (i % 3) * 2}px`,
                    background: `rgba(255, 80, 80, ${damageLevel * 0.8})`,
                    boxShadow: `0 0 6px rgba(255, 80, 80, ${damageLevel * 0.6})`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>

            {/* Lung Inflammation Markers */}
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className="absolute border-2 border-red-400/60 rounded-full animate-pulse"
                style={{
                  width: `${20 + i * 5}px`,
                  height: `${15 + i * 3}px`,
                  top: `${5 + i * 2}px`,
                  left: `${5 + i}px`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: "2s",
                }}
              />
            ))}
          </div>

          {/* Heart with Damage */}
          <div
            className="absolute top-20 left-1/2 -translate-x-1/2 translate-x-2 w-6 h-6 rounded-full animate-pulse"
            style={{
              background: `radial-gradient(circle, 
                rgba(255, 100, 100, 0.9), 
                rgba(200, 50, 50, 0.7))`,
              animationDuration: "1.2s",
              boxShadow: `0 0 12px rgba(255, 100, 100, 0.8)`,
            }}
          >
            {/* Heart Damage Indicator */}
            <div
              className="absolute top-1 left-1 w-4 h-4 rounded-full"
              style={{
                background: `rgba(255, 150, 100, ${damageLevel * 0.7})`,
                boxShadow: `0 0 8px rgba(255, 150, 100, ${damageLevel * 0.5})`,
              }}
            />
          </div>

          {/* Liver */}
          <div
            className="absolute top-32 right-6 w-10 h-12 rounded-lg"
            style={{
              background: `linear-gradient(135deg, 
                rgba(200, 100, 50, 0.8), 
                rgba(150, 80, 40, 0.6))`,
            }}
          />

          {/* Stomach */}
          <div
            className="absolute top-36 left-8 w-6 h-8 rounded-full"
            style={{
              background: `rgba(255, 200, 100, 0.8)`,
            }}
          />

          {/* Intestines */}
          <div
            className="absolute top-52 left-1/2 -translate-x-1/2 w-14 h-16 rounded-lg"
            style={{
              background: `rgba(255, 180, 120, 0.8)`,
            }}
          />

          {/* Radiation Beams */}
          {showRadiation && (
            <div className="absolute inset-0">
              {Array.from({ length: 6 }, (_, i) => {
                const angle = (i / 6) * 360
                return (
                  <div
                    key={i}
                    className="absolute w-32 h-0.5 bg-cyan-400/70 rounded-full"
                    style={{
                      top: "40%",
                      left: "50%",
                      transformOrigin: "0 50%",
                      transform: `rotate(${angle}deg)`,
                      boxShadow: `0 0 8px rgba(0, 255, 255, 0.6)`,
                      opacity: Math.sin(pulsePhase + i) * 0.3 + 0.7,
                    }}
                  />
                )
              })}

              {/* Dose Distribution */}
              <div
                className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full"
                style={{
                  background: `radial-gradient(circle, 
                    rgba(255, 0, 0, 0.3) 0%, 
                    rgba(255, 100, 0, 0.2) 40%, 
                    rgba(255, 200, 0, 0.1) 80%, 
                    transparent 100%)`,
                  boxShadow: `0 0 20px rgba(255, 100, 0, 0.3)`,
                }}
              />
            </div>
          )}

          {/* Medical Labels */}
          <div className="absolute top-12 left-2 bg-red-600/90 text-white text-xs px-2 py-1 rounded border border-red-400">
            <div className="font-bold">Pneumonitis</div>
            <div className="text-red-200 text-xs">Grade 2-3</div>
          </div>

          <div className="absolute top-24 right-2 bg-orange-600/90 text-white text-xs px-2 py-1 rounded border border-orange-400">
            <div className="font-bold">Cardiac Risk</div>
            <div className="text-orange-200 text-xs">15% increase</div>
          </div>

          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-yellow-600/90 text-white text-xs px-2 py-1 rounded border border-yellow-400">
            <div className="font-bold">Dose: 45 Gy</div>
            <div className="text-yellow-200 text-xs">Critical organs</div>
          </div>
        </div>

        {/* Damage Assessment Panel */}
        <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-sm rounded-lg p-4 border border-gray-700 max-w-sm">
          <h3 className="text-white font-semibold mb-3 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2 text-red-400" />
            Organ Damage Assessment
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-red-900/20 rounded-lg border border-red-500/30">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-white font-medium">Lungs</span>
                <span className="text-sm text-red-400">High Risk</span>
              </div>
              <div className="text-xs text-gray-300">
                • Radiation pneumonitis • Fibrosis development • Reduced lung capacity
              </div>
            </div>

            <div className="p-3 bg-orange-900/20 rounded-lg border border-orange-500/30">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-white font-medium">Heart</span>
                <span className="text-sm text-orange-400">Moderate Risk</span>
              </div>
              <div className="text-xs text-gray-300">
                • Pericardial inflammation • Coronary artery damage • Cardiomyopathy risk
              </div>
            </div>

            <div className="p-3 bg-green-900/20 rounded-lg border border-green-500/30">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-white font-medium">Liver</span>
                <span className="text-sm text-green-400">Low Risk</span>
              </div>
              <div className="text-xs text-gray-300">• Minimal exposure • Normal function • No significant damage</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
