"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Heart,
  Target,
  Play,
  Pause,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Move3D,
  Eye,
  Settings,
  Info,
  Maximize,
} from "lucide-react"
import { VercelOptimized3D } from "@/components/3d/vercel-optimized-3d"
import { ErrorBoundary } from "@/components/error-boundary"

interface ModelShowcaseProps {
  className?: string
}

export function InteractiveModelShowcase({ className = "" }: ModelShowcaseProps) {
  const [activeModel, setActiveModel] = useState<"brain" | "heart" | "tumor">("brain")
  const [isPlaying, setIsPlaying] = useState(true)
  const [showControls, setShowControls] = useState(true)
  const [modelInfo, setModelInfo] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  const models = [
    {
      id: "brain" as const,
      name: "Brain Analysis",
      icon: Brain,
      description: "Interactive brain model with neural pathway visualization and tumor detection",
      color: "from-blue-500 to-cyan-500",
      features: ["Neural Mapping", "Tumor Detection", "Surgical Planning", "Risk Assessment"],
      stats: { accuracy: "99.2%", processingTime: "0.3s", resolution: "4K" },
    },
    {
      id: "heart" as const,
      name: "Cardiovascular System",
      icon: Heart,
      description: "Comprehensive heart modeling with blood flow simulation and cardiac assessment",
      color: "from-red-500 to-pink-500",
      features: ["Blood Flow Analysis", "Cardiac Assessment", "Valve Function", "Rhythm Analysis"],
      stats: { accuracy: "98.7%", processingTime: "0.4s", resolution: "4K" },
    },
    {
      id: "tumor" as const,
      name: "Tumor Visualization",
      icon: Target,
      description: "Advanced tumor analysis with growth prediction and treatment planning",
      color: "from-purple-500 to-indigo-500",
      features: ["Growth Prediction", "Treatment Planning", "Response Tracking", "Outcome Analysis"],
      stats: { accuracy: "99.5%", processingTime: "0.2s", resolution: "8K" },
    },
  ]

  const currentModel = models.find(m => m.id === activeModel)!

  const handleModelSwitch = (modelId: "brain" | "heart" | "tumor") => {
    setActiveModel(modelId)
  }

  const renderModel = () => {
    return (
      <VercelOptimized3D
        modelType={activeModel}
        title={`Interactive ${activeModel.charAt(0).toUpperCase() + activeModel.slice(1)} Model`}
        showControls={showControls}
        autoRotate={isPlaying}
        className="w-full h-full"
      />
    )
  }



  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'h-[600px]'} rounded-3xl overflow-hidden border border-blue-500/30 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-cyan-900/10 backdrop-blur-sm shadow-2xl`}
      >
        {/* 3D Model Viewer */}
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModel}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6 }}
              className="w-full h-full"
            >
              {renderModel()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Model Selection Tabs */}
        <div className="absolute top-6 left-6 right-6">
          <div className="flex justify-center">
            <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-2 border border-blue-500/30">
              <div className="flex space-x-2">
                {models.map((model) => (
                  <motion.button
                    key={model.id}
                    onClick={() => handleModelSwitch(model.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      activeModel === model.id
                        ? `bg-gradient-to-r ${model.color} text-white shadow-lg`
                        : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <model.icon className="w-4 h-4" />
                    <span className="text-sm">{model.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-6 left-6 right-6"
            >
              <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-4 border border-blue-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <motion.button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 text-white" />
                      ) : (
                        <Play className="w-5 h-5 text-white" />
                      )}
                    </motion.button>
                    
                    <div className="flex space-x-2">
                      {[
                        { icon: RotateCcw, label: "Reset View" },
                        { icon: ZoomIn, label: "Zoom In" },
                        { icon: ZoomOut, label: "Zoom Out" },
                        { icon: Move3D, label: "3D Controls" },
                      ].map((control, index) => (
                        <motion.button
                          key={control.label}
                          className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors duration-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title={control.label}
                        >
                          <control.icon className="w-4 h-4 text-gray-300" />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <motion.button
                      onClick={() => setModelInfo(!modelInfo)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                        modelInfo ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Info className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Maximize className="w-4 h-4 text-gray-300" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Model Information Panel */}
        <AnimatePresence>
          {modelInfo && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute top-20 left-6 max-w-sm"
            >
              <Card className="bg-black/80 backdrop-blur-sm border-blue-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${currentModel.color} p-2`}>
                      <currentModel.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{currentModel.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        AI-Powered Analysis
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4">
                    {currentModel.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <h4 className="text-white text-sm font-medium">Features:</h4>
                    <div className="grid grid-cols-2 gap-1">
                      {currentModel.features.map((feature, index) => (
                        <div key={feature} className="text-xs text-gray-400">
                          • {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-white text-sm font-medium">Performance:</h4>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="text-green-400 font-medium">{currentModel.stats.accuracy}</div>
                        <div className="text-gray-500">Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-blue-400 font-medium">{currentModel.stats.processingTime}</div>
                        <div className="text-gray-500">Speed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-purple-400 font-medium">{currentModel.stats.resolution}</div>
                        <div className="text-gray-500">Quality</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Indicators */}
        <div className="absolute top-6 right-6 space-y-2">
          <motion.div
            className="bg-black/80 backdrop-blur-sm rounded-lg p-2 border border-green-500/30"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-xs font-medium">Real-time Analysis</span>
            </div>
          </motion.div>
          
          <motion.div
            className="bg-black/80 backdrop-blur-sm rounded-lg p-2 border border-blue-500/30"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-blue-400 text-xs font-medium">AI Processing</span>
            </div>
          </motion.div>
        </div>

        {/* Toggle Controls Button */}
        <motion.button
          onClick={() => setShowControls(!showControls)}
          className="absolute bottom-6 right-6 w-10 h-10 bg-gray-700/80 hover:bg-gray-600/80 rounded-lg flex items-center justify-center backdrop-blur-sm border border-gray-600"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Settings className="w-5 h-5 text-gray-300" />
        </motion.button>
      </motion.div>
    </div>
  )
}
