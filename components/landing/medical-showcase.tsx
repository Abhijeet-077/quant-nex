"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Brain, 
  Heart, 
  Bone, 
  Eye, 
  Activity, 
  Zap, 
  Target, 
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

interface MedicalCase {
  id: string
  title: string
  description: string
  image: string
  category: string
  accuracy: number
  detectionTime: string
  findings: string[]
  icon: React.ReactNode
  gradient: string
}

const medicalCases: MedicalCase[] = [
  {
    id: "brain-mri",
    title: "Brain MRI Analysis",
    description: "Advanced neural network detection of brain tumors and abnormalities with quantum-enhanced precision.",
    image: "/medical-scan-1.jpeg",
    category: "Neuroimaging",
    accuracy: 97.8,
    detectionTime: "2.3s",
    findings: [
      "Glioblastoma multiforme detected",
      "Tumor volume: 3.2 cm³",
      "Location: Right frontal lobe",
      "Edema pattern analyzed"
    ],
    icon: <Brain className="h-6 w-6" />,
    gradient: "from-purple-500 to-pink-500"
  },
  {
    id: "ct-scan",
    title: "CT Scan Diagnosis",
    description: "Real-time computed tomography analysis for rapid emergency diagnosis and treatment planning.",
    image: "/medical-scan-2.jpeg",
    category: "Emergency Radiology",
    accuracy: 94.2,
    detectionTime: "1.8s",
    findings: [
      "Pulmonary nodules identified",
      "Size: 8mm diameter",
      "Density: Ground-glass opacity",
      "Malignancy probability: 23%"
    ],
    icon: <Activity className="h-6 w-6" />,
    gradient: "from-cyan-500 to-blue-500"
  },
  {
    id: "xray-analysis",
    title: "X-Ray Pathology Detection",
    description: "AI-powered bone fracture and pathology detection with sub-millimeter precision analysis.",
    image: "/medical-scan-3.jpeg",
    category: "Orthopedic Imaging",
    accuracy: 96.5,
    detectionTime: "1.2s",
    findings: [
      "Fracture line detected",
      "Location: Distal radius",
      "Displacement: 2.1mm",
      "Healing assessment: Good"
    ],
    icon: <Bone className="h-6 w-6" />,
    gradient: "from-emerald-500 to-teal-500"
  }
]

export function MedicalShowcase() {
  const [activeCase, setActiveCase] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    setTimeout(() => setIsAnalyzing(false), 2000)
  }

  const nextCase = () => {
    setActiveCase((prev) => (prev + 1) % medicalCases.length)
  }

  const prevCase = () => {
    setActiveCase((prev) => (prev - 1 + medicalCases.length) % medicalCases.length)
  }

  const currentCase = medicalCases[activeCase]

  return (
    <section className="relative py-24 bg-gradient-to-b from-black/50 to-purple-900/20 backdrop-blur-sm">
      <div className="container max-w-7xl">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 animate-pulse">
              🧠 AI-Powered Medical Imaging
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
              Precision Diagnostics in Action
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience how our quantum-enhanced AI analyzes real medical images with unprecedented accuracy and speed.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image Display */}
          <motion.div
            key={activeCase}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <Card className="bg-black/30 backdrop-blur-sm border border-purple-900/30 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={currentCase.image}
                    alt={currentCase.title}
                    className="w-full h-[400px] object-cover"
                  />
                  
                  {/* Analysis Overlay */}
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                        <p className="text-white font-medium">Analyzing...</p>
                      </div>
                    </div>
                  )}

                  {/* Navigation Controls */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-black/50 border-white/20 text-white hover:bg-black/70"
                      onClick={prevCase}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-black/50 border-white/20 text-white hover:bg-black/70"
                      onClick={nextCase}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Case Indicator */}
                  <div className="absolute bottom-4 left-4">
                    <Badge className={`bg-gradient-to-r ${currentCase.gradient} text-white border-0`}>
                      {currentCase.category}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Case Navigation Dots */}
            <div className="flex justify-center mt-6 gap-2">
              {medicalCases.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveCase(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === activeCase 
                      ? 'bg-purple-500 scale-125' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* Analysis Results */}
          <motion.div
            key={`analysis-${activeCase}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${currentCase.gradient}`}>
                {currentCase.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{currentCase.title}</h3>
                <p className="text-gray-400">{currentCase.description}</p>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-black/30 backdrop-blur-sm border border-purple-900/30">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Target className="h-5 w-5 text-cyan-400 mr-2" />
                    <span className="text-2xl font-bold text-cyan-400">{currentCase.accuracy}%</span>
                  </div>
                  <p className="text-gray-400 text-sm">Accuracy</p>
                </CardContent>
              </Card>

              <Card className="bg-black/30 backdrop-blur-sm border border-purple-900/30">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Zap className="h-5 w-5 text-purple-400 mr-2" />
                    <span className="text-2xl font-bold text-purple-400">{currentCase.detectionTime}</span>
                  </div>
                  <p className="text-gray-400 text-sm">Detection Time</p>
                </CardContent>
              </Card>
            </div>

            {/* Findings */}
            <Card className="bg-black/30 backdrop-blur-sm border border-purple-900/30">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 text-pink-400 mr-2" />
                  Key Findings
                </h4>
                <ul className="space-y-2">
                  {currentCase.findings.map((finding, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 mt-2 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">{finding}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Action Button */}
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className={`w-full bg-gradient-to-r ${currentCase.gradient} hover:opacity-90 text-white border-0 py-3`}
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing Image...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Run AI Analysis
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
