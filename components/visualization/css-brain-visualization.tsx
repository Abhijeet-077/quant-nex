"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Zap, Target, RotateCcw } from "lucide-react"

export function CSSBrainVisualization() {
  const [opacity, setOpacity] = useState(0.7)
  const [showTumor, setShowTumor] = useState(true)
  const [showNeuralPaths, setShowNeuralPaths] = useState(true)
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.5) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full h-full bg-gradient-to-b from-slate-900 via-blue-900 to-black rounded-xl overflow-hidden relative">
      {/* Controls */}
      <div className="absolute top-4 left-4 z-20 bg-black/90 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Button
              variant={showTumor ? "default" : "outline"}
              size="sm"
              onClick={() => setShowTumor(!showTumor)}
              className="bg-red-500/20 border-red-500/50 text-red-300 text-xs"
            >
              <Target className="h-3 w-3 mr-1" />
              Tumor
            </Button>
            <Button
              variant={showNeuralPaths ? "default" : "outline"}
              size="sm"
              onClick={() => setShowNeuralPaths(!showNeuralPaths)}
              className="bg-yellow-500/20 border-yellow-500/50 text-yellow-300 text-xs"
            >
              <Zap className="h-3 w-3 mr-1" />
              Neural
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-white">Opacity</span>
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

          <Button variant="outline" size="sm" onClick={() => setOpacity(0.7)}>
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      {/* Status */}
      <div className="absolute bottom-4 left-4 z-20">
        <Badge variant="secondary" className="bg-red-500/20 text-red-300">
          Glioblastoma Stage IV • 4.2cm
        </Badge>
      </div>

      {/* Brain Visualization */}
      <div className="w-full h-full flex items-center justify-center relative">
        <div className="relative w-80 h-80" style={{ transform: `rotateY(${rotation}deg)` }}>
          {/* Head Outline */}
          <div
            className="absolute inset-0 rounded-full border-4 border-cyan-400/30"
            style={{
              background: `radial-gradient(circle at 30% 30%, rgba(100, 200, 255, ${opacity * 0.1}), rgba(50, 150, 255, ${opacity * 0.05}))`,
              boxShadow: `inset 0 0 50px rgba(100, 200, 255, ${opacity * 0.2}), 0 0 30px rgba(100, 200, 255, ${opacity * 0.3})`,
            }}
          />

          {/* Brain Structure */}
          <div
            className="absolute top-8 left-8 right-8 bottom-16 rounded-full"
            style={{
              background: `radial-gradient(circle at 40% 40%, rgba(255, 150, 200, ${opacity * 0.8}), rgba(200, 100, 150, ${opacity * 0.6}))`,
              boxShadow: `inset 0 0 30px rgba(255, 100, 150, ${opacity * 0.4})`,
            }}
          >
            {/* Brain Hemispheres */}
            <div
              className="absolute top-2 left-2 w-1/2 h-4/5 rounded-l-full border-r border-pink-300/50"
              style={{ background: `rgba(255, 180, 200, ${opacity * 0.7})` }}
            />
            <div
              className="absolute top-2 right-2 w-1/2 h-4/5 rounded-r-full"
              style={{ background: `rgba(255, 160, 180, ${opacity * 0.7})` }}
            />

            {/* Brain Folds */}
            <div className="absolute top-4 left-4 right-4 h-1 bg-pink-400/50 rounded-full" />
            <div className="absolute top-8 left-6 right-6 h-1 bg-pink-400/50 rounded-full" />
            <div className="absolute top-12 left-4 right-4 h-1 bg-pink-400/50 rounded-full" />
          </div>

          {/* Glowing Tumor */}
          {showTumor && (
            <div className="absolute top-16 right-20 w-8 h-8">
              <div
                className="w-full h-full rounded-full animate-pulse"
                style={{
                  background: `radial-gradient(circle, rgba(255, 100, 0, 0.9), rgba(255, 150, 50, 0.7), rgba(255, 200, 100, 0.3))`,
                  boxShadow: `0 0 20px rgba(255, 100, 0, 0.8), 0 0 40px rgba(255, 150, 0, 0.4)`,
                }}
              />
              <div
                className="absolute top-1/2 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-300 animate-ping"
                style={{ animationDuration: "2s" }}
              />
            </div>
          )}

          {/* Neural Pathways */}
          {showNeuralPaths && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-32 bg-gradient-to-b from-yellow-400/80 to-yellow-600/60 rounded-full">
              {/* Spinal Cord */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-yellow-300/90 rounded-full" />

              {/* Neural Branches */}
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className="absolute w-16 h-0.5 bg-yellow-400/70 rounded-full"
                  style={{
                    top: `${10 + i * 15}px`,
                    left: i % 2 === 0 ? "-30px" : "10px",
                    transform: `rotate(${i % 2 === 0 ? -30 : 30}deg)`,
                    boxShadow: `0 0 4px rgba(255, 200, 0, 0.6)`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Medical Labels */}
        <div className="absolute top-20 right-8 bg-red-600/90 text-white text-xs px-3 py-2 rounded-lg border border-red-400 shadow-xl backdrop-blur-sm">
          <div className="font-bold">Glioblastoma</div>
          <div className="text-red-200 text-xs">Grade IV • 4.2cm</div>
        </div>

        <div className="absolute bottom-20 left-8 bg-cyan-600/90 text-white text-xs px-3 py-2 rounded-lg border border-cyan-400 shadow-xl backdrop-blur-sm">
          <div className="font-bold">Neural System</div>
          <div className="text-cyan-200 text-xs">Brain & Spinal Cord</div>
        </div>
      </div>
    </div>
  )
}
