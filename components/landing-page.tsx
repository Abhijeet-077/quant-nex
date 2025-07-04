"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Heart,
  Activity,
  Shield,
  Zap,
  Users,
  BarChart3,
  Calendar,
  FileText,
  ArrowRight,
  Play,
  ChevronDown,
  Star,
  Award,
  Globe,
  Lock,
} from "lucide-react"
import { Enhanced3DModel, Immersive4DSpace } from "@/components/dynamic-imports"

export function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [currentModel, setCurrentModel] = useState<"brain" | "heart" | "tumor">("brain")

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: Brain,
      title: "Advanced 3D Medical Visualization",
      description: "Interactive 3D models of human anatomy with real-time analysis",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Activity,
      title: "AI-Powered Diagnosis",
      description: "Machine learning algorithms for accurate medical diagnosis",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Shield,
      title: "HIPAA Compliant Security",
      description: "Enterprise-grade security with complete audit trails",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Comprehensive medical data analysis and reporting",
      color: "from-orange-500 to-red-500",
    },
  ]

  const stats = [
    { label: "Medical Professionals", value: "10,000+", icon: Users },
    { label: "Patients Served", value: "500K+", icon: Heart },
    { label: "Accuracy Rate", value: "99.7%", icon: Award },
    { label: "Countries", value: "50+", icon: Globe },
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  Next-Generation Medical Technology
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
                    Quant-NEX
                  </span>
                  <br />
                  <span className="text-white">Medical Platform</span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Revolutionary healthcare platform combining AI-powered diagnostics,
                  3D medical visualization, and comprehensive patient management in a
                  HIPAA-compliant environment.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-8 py-3 text-lg group">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white px-8 py-3 text-lg group">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="flex items-center justify-center mb-2">
                      <stat.icon className="h-6 w-6 text-blue-400 mr-2" />
                      <span className="text-2xl font-bold text-white">{stat.value}</span>
                    </div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Content - 3D Model */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 50 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative h-[600px] rounded-2xl overflow-hidden border border-blue-500/20 bg-gradient-to-br from-blue-900/10 to-purple-900/10 backdrop-blur-sm">
                {/* 3D Model Container */}
                <div className="absolute inset-0">
                  <Immersive4DSpace
                    className="w-full h-full"
                    onModelSelect={(modelType) => setCurrentModel(modelType as any)}
                  />
                </div>

                {/* Model Controls */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex justify-center space-x-2">
                    {["brain", "heart", "tumor"].map((model) => (
                      <Button
                        key={model}
                        variant={currentModel === model ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentModel(model as any)}
                        className={`${
                          currentModel === model
                            ? "bg-blue-500 text-white"
                            : "border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
                        }`}
                      >
                        {model.charAt(0).toUpperCase() + model.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Floating Info Cards */}
                <motion.div
                  className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-blue-500/30"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-green-400 text-sm font-medium">Real-time Analysis</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="h-6 w-6 text-blue-400" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Revolutionary Features
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of healthcare with our cutting-edge medical platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Card className="bg-gray-900/50 border-gray-700 hover:border-blue-500/50 transition-all duration-300 h-full">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} p-3 mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-white group-hover:text-blue-400 transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900/10 to-purple-900/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                Interactive 3D Medical Models
              </h3>
              <p className="text-gray-300 text-lg mb-8">
                Explore detailed anatomical structures with our advanced 3D visualization technology.
                Rotate, zoom, and analyze medical conditions with unprecedented clarity.
              </p>
              <div className="space-y-4">
                {[
                  "360° rotation and zoom capabilities",
                  "Real-time tissue analysis",
                  "Multi-layer anatomical views",
                  "AI-powered anomaly detection",
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-[400px] rounded-xl overflow-hidden border border-blue-500/20"
            >
              <Enhanced3DModel
                modelType="brain"
                title="Interactive Brain Model"
                showControls={true}
                autoRotate={true}
                className="w-full h-full"
              />
            </motion.div>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h3 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Transform Healthcare?
            </h3>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of medical professionals using Quant-NEX to deliver better patient outcomes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-8 py-3 text-lg">
                  Get Started Today
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white px-8 py-3 text-lg">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
