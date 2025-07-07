"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, Target } from "lucide-react"

export function CSSBodyVisualization() {
  const [opacity, setOpacity] = useState(0.6)
  const [activeView, setActiveView] = useState("organs")
  const [showDoseMap, setShowDoseMap] = useState(false)
  const [showRadiationBeams, setShowRadiationBeams] = useState(false)

  return (
    <div className="w-full h-full bg-gradient-to-b from-slate-900 via-purple-900 to-black rounded-xl overflow-hidden relative">
      {/* Controls */}
      <div className="absolute top-4 left-4 z-20 bg-black/90 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
        <Tabs value={activeView} onValueChange={setActiveView} className="mb-4">
          <TabsList className="grid grid-cols-4 bg-gray-800">
            <TabsTrigger value="organs" className="text-xs">
              Organs
            </TabsTrigger>
            <TabsTrigger value="skeleton" className="text-xs">
              Skeleton
            </TabsTrigger>
            <TabsTrigger value="dosemap" className="text-xs">
              Dose Map
            </TabsTrigger>
            <TabsTrigger value="damage" className="text-xs">
              Risk
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Button
              variant={showRadiationBeams ? "default" : "outline"}
              size="sm"
              onClick={() => setShowRadiationBeams(!showRadiationBeams)}
              className="bg-cyan-500/20 border-cyan-500/50 text-cyan-300 text-xs"
            >
              <Zap className="h-3 w-3 mr-1" />
              Beams
            </Button>
            <Button
              variant={showDoseMap ? "default" : "outline"}
              size="sm"
              onClick={() => setShowDoseMap(!showDoseMap)}
              className="bg-yellow-500/20 border-yellow-500/50 text-yellow-300 text-xs"
            >
              <Target className="h-3 w-3 mr-1" />
              Dose
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-white">Transparency</span>
            <Slider
              value={[opacity]}
              min={0.1}
              max={1}
              step={0.05}
              onValueChange={(value) => setOpacity(value[0])}
              className="w-20"
            />
            <span className="text-xs text-white">{Math.round(opacity * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="absolute bottom-4 left-4 z-20">
        <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
          Medical Grade Anatomy
        </Badge>
      </div>

      {/* Body Visualization */}
      <div className="w-full h-full flex items-center justify-center relative">
        <div className="relative w-64 h-96">
          {/* Body Outline */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, rgba(100, 200, 255, ${opacity * 0.1}) 0%, rgba(50, 150, 255, ${opacity * 0.05}) 100%)`,
              clipPath:
                "polygon(45% 0%, 55% 0%, 60% 15%, 65% 25%, 70% 35%, 75% 50%, 70% 65%, 65% 75%, 60% 85%, 55% 95%, 50% 100%, 45% 100%, 40% 95%, 35% 85%, 30% 75%, 25% 65%, 30% 50%, 35% 35%, 40% 25%, 45% 15%)",
              border: `2px solid rgba(100, 200, 255, ${opacity * 0.3})`,
              boxShadow: `inset 0 0 30px rgba(100, 200, 255, ${opacity * 0.2}), 0 0 20px rgba(100, 200, 255, ${opacity * 0.3})`,
            }}
          />

          {/* Head */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-20 rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(100, 200, 255, ${opacity * 0.15}), rgba(50, 150, 255, ${opacity * 0.1}))`,
              border: `1px solid rgba(100, 200, 255, ${opacity * 0.3})`,
            }}
          />

          {/* Skeleton View */}
          {(activeView === "skeleton" || activeView === "dosemap") && (
            <div className="absolute inset-0">
              {/* Spine */}
              <div className="absolute left-1/2 top-16 -translate-x-1/2 w-1 h-64 bg-gray-300/80 rounded-full" />

              {/* Ribs */}
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={i}
                  className="absolute left-1/2 -translate-x-1/2 border-2 border-gray-300/60 rounded-full"
                  style={{
                    top: `${80 + i * 15}px`,
                    width: `${120 - i * 5}px`,
                    height: `${20 + i * 2}px`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Organs View */}
          {(activeView === "organs" || activeView === "dosemap" || activeView === "damage") && (
            <div className="absolute inset-0">
              {/* Heart */}
              <div
                className="absolute top-20 left-12 w-8 h-8 rounded-full animate-pulse"
                style={{
                  background: `radial-gradient(circle, rgba(255, 100, 100, 0.9), rgba(200, 50, 50, 0.7))`,
                  animationDuration: "1.5s",
                }}
              />

              {/* Lungs */}
              <div
                className="absolute top-18 left-8 w-6 h-12 rounded-full"
                style={{ background: `rgba(255, 150, 100, 0.8)` }}
              />
              <div
                className="absolute top-18 right-8 w-6 h-12 rounded-full"
                style={{ background: `rgba(255, 150, 100, 0.8)` }}
              />

              {/* Liver */}
              <div
                className="absolute top-32 right-6 w-12 h-16 rounded-lg"
                style={{ background: `rgba(200, 100, 50, 0.8)` }}
              />

              {/* Stomach */}
              <div
                className="absolute top-36 left-8 w-8 h-10 rounded-full"
                style={{ background: `rgba(255, 200, 100, 0.8)` }}
              />

              {/* Intestines */}
              <div
                className="absolute top-52 left-1/2 -translate-x-1/2 w-16 h-20 rounded-lg"
                style={{ background: `rgba(255, 180, 120, 0.8)` }}
              />
            </div>
          )}

          {/* Radiation Beams */}
          {showRadiationBeams && (
            <div className="absolute inset-0">
              {Array.from({ length: 6 }, (_, i) => {
                const angle = (i / 6) * 360
                return (
                  <div
                    key={i}
                    className="absolute w-32 h-0.5 bg-cyan-400/70 rounded-full"
                    style={{
                      top: "50%",
                      left: "50%",
                      transformOrigin: "0 50%",
                      transform: `rotate(${angle}deg)`,
                      boxShadow: `0 0 8px rgba(0, 255, 255, 0.6)`,
                    }}
                  />
                )
              })}
            </div>
          )}

          {/* Dose Map */}
          {(activeView === "dosemap" || showDoseMap) && (
            <div className="absolute inset-0">
              {/* High Dose Zone */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full"
                style={{
                  background: `radial-gradient(circle, rgba(255, 0, 0, 0.4), rgba(255, 100, 0, 0.2))`,
                  boxShadow: `0 0 20px rgba(255, 0, 0, 0.3)`,
                }}
              />

              {/* Medium Dose Zone */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full"
                style={{
                  background: `radial-gradient(circle, rgba(255, 150, 0, 0.2), rgba(255, 200, 0, 0.1))`,
                  boxShadow: `0 0 15px rgba(255, 150, 0, 0.2)`,
                }}
              />
            </div>
          )}

          {/* Risk Assessment */}
          {activeView === "damage" && (
            <div className="absolute inset-0">
              {/* Heart Risk */}
              <div className="absolute top-20 left-12 w-10 h-10 border-2 border-red-500/70 rounded-full animate-pulse" />

              {/* Lung Risk */}
              <div className="absolute top-18 left-8 w-8 h-14 border-2 border-yellow-500/70 rounded-full" />
              <div className="absolute top-18 right-8 w-8 h-14 border-2 border-yellow-500/70 rounded-full" />
            </div>
          )}
        </div>

        {/* Medical Labels */}
        {activeView === "organs" && (
          <>
            <div className="absolute top-24 right-4 bg-red-600/90 text-white text-xs px-3 py-2 rounded-lg border border-red-400 shadow-xl backdrop-blur-sm">
              <div className="font-bold">Heart</div>
              <div className="text-red-200 text-xs">BPM: 72 • Normal</div>
            </div>
            <div className="absolute top-40 left-4 bg-orange-600/90 text-white text-xs px-3 py-2 rounded-lg border border-orange-400 shadow-xl backdrop-blur-sm">
              <div className="font-bold">Lungs</div>
              <div className="text-orange-200 text-xs">Capacity: 95%</div>
            </div>
          </>
        )}

        {activeView === "dosemap" && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-cyan-600/90 text-white text-xs px-4 py-3 rounded-lg border border-cyan-400 shadow-xl backdrop-blur-sm">
            <div className="font-bold">Radiation Therapy Plan</div>
            <div className="text-cyan-200 text-xs">6-Field IMRT • 60 Gy Total</div>
          </div>
        )}
      </div>
    </div>
  )
}
