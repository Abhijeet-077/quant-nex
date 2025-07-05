"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Heart,
  Activity,
  Shield,
  Users,
  BarChart3,
  ArrowRight,
  Play,
  Award,
  Globe,
  Target,
  Cpu,
  TrendingUp,
  CheckCircle,
  Sparkles,
} from "lucide-react"

export function LandingPageFallback() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      icon: Brain,
      title: "Advanced 3D Medical Visualization",
      description: "Interactive 3D models of human anatomy with real-time analysis and surgical planning",
      color: "from-blue-500 to-cyan-500",
      specialty: "Neurology",
    },
    {
      icon: Heart,
      title: "Cardiovascular Analysis",
      description: "Comprehensive heart modeling with blood flow simulation and cardiac assessment",
      color: "from-red-500 to-pink-500",
      specialty: "Cardiology",
    },
    {
      icon: Target,
      title: "Tumor Detection & Analysis",
      description: "AI-powered tumor identification with growth prediction and treatment planning",
      color: "from-purple-500 to-indigo-500",
      specialty: "Oncology",
    },
    {
      icon: Activity,
      title: "AI-Powered Diagnosis",
      description: "Machine learning algorithms for accurate medical diagnosis and prognosis",
      color: "from-green-500 to-emerald-500",
      specialty: "AI Medicine",
    },
    {
      icon: Shield,
      title: "HIPAA Compliant Security",
      description: "Enterprise-grade security with complete audit trails and data protection",
      color: "from-yellow-500 to-orange-500",
      specialty: "Security",
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Comprehensive medical data analysis with predictive insights and reporting",
      color: "from-cyan-500 to-blue-500",
      specialty: "Analytics",
    },
  ]

  const stats = [
    { label: "Medical Professionals", value: "15,000+", icon: Users, description: "Trusted by healthcare experts worldwide" },
    { label: "Patients Served", value: "750K+", icon: Heart, description: "Lives improved through our technology" },
    { label: "Diagnostic Accuracy", value: "99.8%", icon: Award, description: "AI-powered precision in medical analysis" },
    { label: "Global Presence", value: "65+", icon: Globe, description: "Countries using our medical platform" },
    { label: "3D Models Rendered", value: "2.5M+", icon: Cpu, description: "Interactive medical visualizations created" },
    { label: "Treatment Plans", value: "180K+", icon: Target, description: "Personalized treatment strategies developed" },
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }} />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20" />
        
        <div className="container mx-auto px-4 z-10 relative">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30 px-4 py-2 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                Next-Generation Medical Technology
              </Badge>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-bold leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
                Quant-NEX
              </span>
              <br />
              <span className="text-white">Medical Platform</span>
            </motion.h1>

            <motion.p
              className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Revolutionary healthcare platform combining AI-powered diagnostics,
              interactive 3D medical visualization, and comprehensive patient management
              in a HIPAA-compliant environment.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-8 py-4 text-lg font-semibold">
                  <span className="flex items-center">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                </Button>
              </Link>

              <Button variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500/10 hover:text-white px-8 py-4 text-lg font-semibold backdrop-blur-sm">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-3 gap-4 pt-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {stats.slice(0, 6).map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                  transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                  className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-center mb-2">
                    <stat.icon className="h-6 w-6 text-blue-400 mr-2" />
                    <span className="text-2xl font-bold text-white">{stat.value}</span>
                  </div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Badge className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-400 border-purple-500/30 px-4 py-2 text-sm font-medium mb-6">
              <Cpu className="w-4 h-4 mr-2" />
              Advanced Medical Technology
            </Badge>

            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Revolutionary Features
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Experience the future of healthcare with our cutting-edge medical platform that combines
              AI-powered diagnostics, interactive 3D visualization, and comprehensive patient care.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700 hover:border-blue-500/50 transition-all duration-500 h-full backdrop-blur-sm relative overflow-hidden">
                  <CardHeader className="relative z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} p-4 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-white group-hover:text-blue-400 transition-colors duration-300 mb-2">
                      {feature.title}
                    </CardTitle>
                    <Badge variant="outline" className="text-xs text-gray-400 border-gray-600 w-fit">
                      {feature.specialty}
                    </Badge>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <Badge className="bg-gradient-to-r from-green-500/20 to-blue-500/20 text-green-400 border-green-500/30 px-6 py-3 text-base font-medium mb-8">
              <Sparkles className="w-5 h-5 mr-2" />
              Start Your Medical Revolution Today
            </Badge>

            <h3 className="text-5xl md:text-7xl font-bold mb-8">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Ready to Transform
              </span>
              <br />
              <span className="text-white">Healthcare?</span>
            </h3>

            <p className="text-2xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto">
              Join thousands of medical professionals using Quant-NEX to deliver better patient outcomes
              with AI-powered diagnostics and interactive 3D medical visualization.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-12 py-6 text-xl font-semibold shadow-2xl hover:shadow-blue-500/25 transition-shadow duration-300">
                  <span className="flex items-center">
                    Get Started Today
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </span>
                </Button>
              </Link>

              <Link href="/contact">
                <Button variant="outline" className="border-2 border-blue-500 text-blue-400 hover:bg-blue-500/10 hover:text-white px-12 py-6 text-xl font-semibold backdrop-blur-sm">
                  <span className="flex items-center">
                    <Users className="mr-3 h-6 w-6" />
                    Contact Sales
                  </span>
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
