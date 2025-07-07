"use client"

import type React from "react"

import { motion } from "framer-motion"
import { BrainCircuit, Dna, FlaskConical, Microscope, Syringe, Users } from "lucide-react"

interface FeatureShowcaseProps {
  currentFeature: number
}

export function FeatureShowcase({ currentFeature }: FeatureShowcaseProps) {
  const features = [
    {
      title: "AI-Powered Detection",
      description: "Advanced neural networks detect and classify cancer with unprecedented accuracy",
      icon: BrainCircuit,
      color: "text-teal-400",
      bgColor: "bg-teal-500/20"
    },
    {
      title: "Genomic Analysis",
      description: "Comprehensive genomic profiling for targeted treatment options",
      icon: Dna,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20"
    },
    {
      title: "3D Visualization",
      description: "Interactive 3D models for precise intervention planning",
      icon: Microscope,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20"
    },
    {
      title: "Quantum Optimization",
      description: "Quantum-enhanced algorithms for treatment optimization",
      icon: FlaskConical,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/20"
    }
  ]

  const currentFeatureData = features[currentFeature] || features[0]
  const IconComponent = currentFeatureData.icon

  return (
    <div className="relative">
      <motion.div
        key={currentFeature}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-slate-900/90 to-teal-900/90 backdrop-blur-xl border border-teal-500/30 rounded-2xl p-8 lg:p-12"
      >
        {/* Feature Icon */}
        <div className={`w-16 h-16 lg:w-20 lg:h-20 ${currentFeatureData.bgColor} rounded-2xl flex items-center justify-center mb-6`}>
          <IconComponent className={`h-8 w-8 lg:h-10 lg:w-10 ${currentFeatureData.color}`} />
        </div>

        {/* Feature Content */}
        <div className="space-y-4">
          <h3 className="text-2xl lg:text-3xl font-bold text-white">
            {currentFeatureData.title}
          </h3>
          <p className="text-lg text-gray-300 leading-relaxed">
            {currentFeatureData.description}
          </p>
        </div>

        {/* Visual Representation */}
        <div className="mt-8">
          <div className="relative h-48 lg:h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Dynamic Visual Based on Feature */}
              {currentFeature === 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {[...Array(9)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className={`w-8 h-8 rounded-full ${i % 3 === 0 ? 'bg-teal-400' : i % 3 === 1 ? 'bg-blue-400' : 'bg-purple-400'}`}
                    />
                  ))}
                </div>
              )}

              {currentFeature === 1 && (
                <div className="flex items-center space-x-2">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: Math.random() * 100 + 50 }}
                      transition={{ delay: i * 0.2 }}
                      className="w-4 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                    />
                  ))}
                </div>
              )}

              {currentFeature === 2 && (
                <motion.div
                  animate={{ rotateY: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg"
                />
              )}

              {currentFeature === 3 && (
                <div className="relative">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.4
                      }}
                      className="absolute w-16 h-16 border-2 border-cyan-400 rounded-full"
                      style={{
                        left: `${i * 20}px`,
                        top: `${Math.sin(i) * 20}px`
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mt-6 space-x-2">
          {features.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentFeature ? 'bg-teal-400' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
