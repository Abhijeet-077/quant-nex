"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { BrainCircuit, Dna, FlaskConical, Microscope, Syringe, Users } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Feature {
  id: string
  icon: React.ReactNode
  title: string
  description: string
  image: string
}

const features: Feature[] = [
  {
    id: "ai-detection",
    icon: <BrainCircuit className="h-6 w-6" />,
    title: "AI-Powered Detection",
    description:
      "Our advanced neural networks can detect and classify cancer with unprecedented accuracy. The system continuously learns from new data, improving its performance over time.",
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: "genomic-analysis",
    icon: <Dna className="h-6 w-6" />,
    title: "Genomic Analysis",
    description:
      "Comprehensive genomic profiling helps identify targeted treatment options based on the specific genetic mutations present in the tumor.",
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: "3d-visualization",
    icon: <Microscope className="h-6 w-6" />,
    title: "3D Visualization",
    description:
      "Interactive 3D models of tumors allow doctors to better understand the spatial characteristics and plan interventions with greater precision.",
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: "quantum-optimization",
    icon: <FlaskConical className="h-6 w-6" />,
    title: "Quantum Optimization",
    description:
      "Quantum-enhanced algorithms optimize treatment planning by exploring vast solution spaces that would be impossible with classical computing.",
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: "treatment-simulation",
    icon: <Syringe className="h-6 w-6" />,
    title: "Treatment Simulation",
    description:
      "Simulate treatment outcomes before implementation to identify the most effective approach for each patient's unique case.",
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: "collaborative-platform",
    icon: <Users className="h-6 w-6" />,
    title: "Collaborative Platform",
    description:
      "Enable seamless collaboration between oncologists, radiologists, and researchers to provide the best possible care for patients.",
    image: "/placeholder.svg?height=300&width=500",
  },
]

export function FeatureShowcase() {
  const [activeFeature, setActiveFeature] = useState(features[0].id)

  return (
    <Tabs defaultValue={features[0].id} onValueChange={setActiveFeature} className="w-full">
      <TabsList className="grid grid-cols-3 md:grid-cols-6 bg-black/20 p-1">
        {features.map((feature) => (
          <TabsTrigger
            key={feature.id}
            value={feature.id}
            className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-white"
          >
            <div className="flex flex-col items-center p-2">
              {feature.icon}
              <span className="mt-1 text-xs hidden md:block">{feature.title}</span>
            </div>
          </TabsTrigger>
        ))}
      </TabsList>

      {features.map((feature) => (
        <TabsContent key={feature.id} value={feature.id} className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-2 gap-8 items-center"
          >
            <div>
              <h3 className="text-2xl font-bold mb-4 text-white flex items-center">
                {feature.icon}
                <span className="ml-2">{feature.title}</span>
              </h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
            <div className="bg-black/30 backdrop-blur-sm border border-purple-900/30 rounded-xl overflow-hidden">
              <img src={feature.image || "/placeholder.svg"} alt={feature.title} className="w-full h-auto" />
            </div>
          </motion.div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
