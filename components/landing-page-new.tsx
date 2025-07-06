"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"

// Lazy load 3D model with error handling
const BrainModel = dynamic(() => import("@/components/3d/brain-model-enhanced"), {
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-900/50 rounded-xl border border-cyan-500/30">
      <div className="text-center space-y-2">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-cyan-400 text-sm">Loading 3D Brain Model...</p>
      </div>
    </div>
  ),
  ssr: false
})

// Fallback component for when 3D model fails
function BrainModelFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-900/50 rounded-xl border border-cyan-500/30">
      <div className="text-center space-y-4 p-8">
        <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full mx-auto flex items-center justify-center">
          <span className="text-3xl">🧠</span>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-2">Interactive Brain Model</h3>
          <p className="text-gray-400 text-sm">Advanced 3D visualization with neural pathway mapping</p>
        </div>
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  )
}

export default function LandingPageNew() {
  const [activeTab, setActiveTab] = useState<"overview" | "features" | "demo">("overview")
  const [modelError, setModelError] = useState(false)

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Professional Medical Grid Background */}
      <div className="absolute inset-0">
        {/* Primary grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Secondary fine grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '8px 8px'
          }}
        />

        {/* Medical measurement lines */}
        <div className="absolute inset-0">
          {/* Horizontal measurement lines */}
          {[...Array(8)].map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute w-full h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"
              style={{ top: `${(i + 1) * 12.5}%` }}
            />
          ))}

          {/* Vertical measurement lines */}
          {[...Array(6)].map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute h-full w-px bg-gradient-to-b from-transparent via-blue-400/30 to-transparent"
              style={{ left: `${(i + 1) * 16.66}%` }}
            />
          ))}
        </div>

        {/* Medical chart corner markers */}
        <div className="absolute top-8 left-8 w-6 h-6 border-l-2 border-t-2 border-blue-400/40"></div>
        <div className="absolute top-8 right-8 w-6 h-6 border-r-2 border-t-2 border-blue-400/40"></div>
        <div className="absolute bottom-8 left-8 w-6 h-6 border-l-2 border-b-2 border-blue-400/40"></div>
        <div className="absolute bottom-8 right-8 w-6 h-6 border-r-2 border-b-2 border-blue-400/40"></div>

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-transparent to-cyan-950/20"></div>

        {/* Medical data points */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
              style={{
                left: `${Math.random() * 90 + 5}%`,
                top: `${Math.random() * 90 + 5}%`
              }}
              animate={{
                opacity: [0.3, 0.7, 0.3],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-white">
              <span className="text-cyan-400">Quant</span>-NEX
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center space-x-4"
          >
            <nav className="hidden md:flex items-center space-x-6">
              <a href="/dashboard" className="text-gray-300 hover:text-cyan-400 transition-colors">Dashboard</a>
              <a href="/diagnosis" className="text-gray-300 hover:text-cyan-400 transition-colors">Diagnosis</a>
              <a href="/prognosis" className="text-gray-300 hover:text-cyan-400 transition-colors">Prognosis</a>
              <a href="/treatment" className="text-gray-300 hover:text-cyan-400 transition-colors">Treatment</a>
              <a href="/support" className="text-gray-300 hover:text-cyan-400 transition-colors">Support</a>
            </nav>
            <Button
              variant="outline"
              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black"
              onClick={() => window.location.href = '/dashboard'}
            >
              Get Started
            </Button>
          </motion.div>
        </header>

        {/* Main Content */}
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              Advanced <span className="text-cyan-400">3D Medical</span> Visualization
            </motion.h2>

            <motion.p
              className="text-lg text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              Interactive 3D models for precise diagnosis and surgical planning with AI-powered insights.
            </motion.p>

            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              <Button
                className="bg-cyan-600 hover:bg-cyan-500 px-6 py-3"
                onClick={() => window.location.href = '/dashboard'}
              >
                Enter Dashboard
              </Button>
              <Button
                variant="outline"
                className="text-cyan-400 border-cyan-400 hover:bg-cyan-400 hover:text-black"
                onClick={() => window.location.href = '/3d-models'}
              >
                View 3D Models
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Content - 3D Model */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="h-96 lg:h-[500px] rounded-xl overflow-hidden border border-cyan-500/30"
          >
            {modelError ? (
              <BrainModelFallback />
            ) : (
              <BrainModel />
            )}
          </motion.div>
        </main>

        {/* Features Tabs */}
        <motion.div
          className="mt-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <div className="flex border-b border-gray-700 mb-8">
            {[
              { id: "overview" as const, label: "Overview" },
              { id: "features" as const, label: "Key Features" },
              { id: "demo" as const, label: "Live Demo" }
            ].map((tab) => (
              <button
                key={tab.id}
                className={`px-6 py-3 font-medium ${activeTab === tab.id ? "text-cyan-400 border-b-2 border-cyan-400" : "text-gray-400 hover:text-white"}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🧠",
                title: "Brain Analysis",
                desc: "Detailed 3D brain mapping with tumor detection"
              },
              {
                icon: "❤️",
                title: "Cardiac Models", 
                desc: "Interactive heart models with blood flow simulation"
              },
              {
                icon: "🔬",
                title: "AI Diagnostics",
                desc: "Machine learning powered medical insights"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="p-6 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-cyan-500/30 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-medium text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Named export for compatibility
export { LandingPageNew }