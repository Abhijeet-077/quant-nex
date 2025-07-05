"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Heart,
  Target,
  Smartphone,
  Tablet,
  Monitor,
  Play,
  Pause,
  RotateCcw,
  ZoomIn,
  Info,
} from "lucide-react"

interface MobileOptimized3DProps {
  className?: string
  modelType?: "brain" | "heart" | "tumor"
  showControls?: boolean
}

export function MobileOptimized3D({ 
  className = "",
  modelType = "brain",
  showControls = true 
}: MobileOptimized3DProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [showInfo, setShowInfo] = useState(false)
  const [touchSupported, setTouchSupported] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
      setTouchSupported('ontouchstart' in window)
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  const getModelInfo = () => {
    switch (modelType) {
      case "brain":
        return {
          name: "Brain Analysis",
          icon: Brain,
          description: "Interactive brain model with neural pathway visualization",
          color: "from-blue-500 to-cyan-500",
          features: ["Neural Mapping", "Tumor Detection", "Surgical Planning"],
        }
      case "heart":
        return {
          name: "Heart Model",
          icon: Heart,
          description: "Cardiovascular system with blood flow simulation",
          color: "from-red-500 to-pink-500",
          features: ["Blood Flow", "Cardiac Assessment", "Valve Function"],
        }
      case "tumor":
        return {
          name: "Tumor Analysis",
          icon: Target,
          description: "Advanced tumor analysis with growth prediction",
          color: "from-purple-500 to-indigo-500",
          features: ["Growth Prediction", "Treatment Planning", "Response Tracking"],
        }
      default:
        return {
          name: "Medical Model",
          icon: Brain,
          description: "Interactive medical visualization",
          color: "from-blue-500 to-cyan-500",
          features: ["Analysis", "Visualization", "Planning"],
        }
    }
  }

  const modelInfo = getModelInfo()

  return (
    <div className={`relative ${className}`}>
      {/* Device-specific optimizations */}
      <div className={`
        relative overflow-hidden rounded-2xl border border-blue-500/30 
        bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-cyan-900/10 
        backdrop-blur-sm shadow-xl
        ${isMobile ? 'h-[400px]' : isTablet ? 'h-[500px]' : 'h-[600px]'}
      `}>
        {/* 3D Model Placeholder with optimized rendering */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className={`
              relative rounded-xl overflow-hidden
              ${isMobile ? 'w-48 h-48' : isTablet ? 'w-64 h-64' : 'w-80 h-80'}
            `}
            animate={isPlaying ? { rotateY: 360 } : {}}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <div className={`
              w-full h-full bg-gradient-to-br ${modelInfo.color} 
              rounded-xl flex items-center justify-center relative
              shadow-2xl
            `}>
              <modelInfo.icon className={`
                text-white
                ${isMobile ? 'w-16 h-16' : isTablet ? 'w-20 h-20' : 'w-24 h-24'}
              `} />
              
              {/* Animated rings for 3D effect */}
              <motion.div
                className="absolute inset-0 border-2 border-white/20 rounded-xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-2 border border-white/10 rounded-lg"
                animate={{ scale: [1, 0.9, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
            </div>
          </motion.div>
        </div>

        {/* Mobile-optimized controls */}
        {showControls && (
          <div className={`
            absolute bottom-4 left-4 right-4
            ${isMobile ? 'space-y-2' : 'space-y-3'}
          `}>
            <div className="bg-black/80 backdrop-blur-sm rounded-xl p-3 border border-blue-500/30">
              <div className={`
                flex items-center justify-between
                ${isMobile ? 'flex-col space-y-2' : 'flex-row'}
              `}>
                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`
                      bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center justify-center 
                      transition-colors duration-300
                      ${isMobile ? 'w-8 h-8' : 'w-10 h-10'}
                    `}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isPlaying ? (
                      <Pause className={`text-white ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                    ) : (
                      <Play className={`text-white ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                    )}
                  </motion.button>
                  
                  {!isMobile && (
                    <div className="flex space-x-1">
                      {[RotateCcw, ZoomIn].map((Icon, index) => (
                        <motion.button
                          key={index}
                          className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors duration-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Icon className="w-3 h-3 text-gray-300" />
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
                
                <motion.button
                  onClick={() => setShowInfo(!showInfo)}
                  className={`
                    bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center 
                    transition-colors duration-300
                    ${isMobile ? 'w-8 h-8' : 'w-8 h-8'}
                  `}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Info className={`text-gray-300 ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                </motion.button>
              </div>
              
              {/* Touch instructions for mobile */}
              {touchSupported && (
                <div className="mt-2 text-center">
                  <p className="text-xs text-gray-400">
                    {isMobile ? "Tap to interact" : "Touch to explore"}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Device indicator */}
        <div className="absolute top-4 left-4">
          <Badge variant="outline" className="text-xs bg-black/50 border-gray-600">
            {isMobile ? (
              <><Smartphone className="w-3 h-3 mr-1" /> Mobile</>
            ) : isTablet ? (
              <><Tablet className="w-3 h-3 mr-1" /> Tablet</>
            ) : (
              <><Monitor className="w-3 h-3 mr-1" /> Desktop</>
            )}
          </Badge>
        </div>

        {/* Status indicator */}
        <div className="absolute top-4 right-4">
          <motion.div
            className="bg-black/80 backdrop-blur-sm rounded-lg p-2 border border-green-500/30"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-xs font-medium">
                {isMobile ? "Active" : "Real-time"}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Model information panel */}
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`
              absolute top-16 left-4 right-4
              ${isMobile ? 'top-12' : 'top-16 left-4 right-auto max-w-sm'}
            `}
          >
            <Card className="bg-black/90 backdrop-blur-sm border-blue-500/30">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`
                    rounded-lg bg-gradient-to-r ${modelInfo.color} p-2
                    ${isMobile ? 'w-8 h-8' : 'w-10 h-10'}
                  `}>
                    <modelInfo.icon className={`text-white ${isMobile ? 'w-4 h-4' : 'w-6 h-6'}`} />
                  </div>
                  <div>
                    <h3 className={`text-white font-semibold ${isMobile ? 'text-sm' : 'text-base'}`}>
                      {modelInfo.name}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      AI-Powered
                    </Badge>
                  </div>
                </div>
                
                <p className={`text-gray-300 mb-3 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  {modelInfo.description}
                </p>
                
                <div className="space-y-2">
                  <h4 className={`text-white font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    Features:
                  </h4>
                  <div className={`grid gap-1 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    {modelInfo.features.map((feature, index) => (
                      <div key={feature} className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-xs'}`}>
                        • {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
