"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion"
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
  Microscope,
  Stethoscope,
  Eye,
  Target,
  Cpu,
  Database,
  TrendingUp,
  CheckCircle,
  Sparkles,
  MousePointer,
  RotateCcw,
  ZoomIn,
  Move3D,
} from "lucide-react"
import dynamic from "next/dynamic"
import { ErrorBoundary } from "@/components/error-boundary"

// Lazy load heavy 3D components
const Enhanced3DModel = dynamic(() => import("@/components/dynamic-imports").then(mod => ({ default: mod.Enhanced3DModel })), {
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900/50 to-blue-900/50">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue-300">Loading 3D Model...</p>
      </div>
    </div>
  ),
  ssr: false
})

const InteractiveModelShowcase = dynamic(() => import("@/components/landing/interactive-model-showcase").then(mod => ({ default: mod.InteractiveModelShowcase })), {
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900/50 to-blue-900/50">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue-300">Loading Interactive Models...</p>
      </div>
    </div>
  ),
  ssr: false
})

const EnhancedParticleBackground = dynamic(() => import("@/components/ui-effects/enhanced-particle-background").then(mod => ({ default: mod.EnhancedParticleBackground })), {
  loading: () => <div className="absolute inset-0 bg-black" />,
  ssr: false
})

const FloatingMedicalIcons = dynamic(() => import("@/components/ui-effects/enhanced-particle-background").then(mod => ({ default: mod.FloatingMedicalIcons })), {
  loading: () => null,
  ssr: false
})

const MedicalDataVisualization = dynamic(() => import("@/components/ui-effects/enhanced-particle-background").then(mod => ({ default: mod.MedicalDataVisualization })), {
  loading: () => null,
  ssr: false
})

export function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [currentModel, setCurrentModel] = useState<"brain" | "heart" | "tumor">("brain")
  const [isModelLoading, setIsModelLoading] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [activeSection, setActiveSection] = useState("hero")

  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const specialtiesRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8])
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -100])

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6)
    }, 5000)

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      clearInterval(interval)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const handleModelSwitch = async (modelType: "brain" | "heart" | "tumor") => {
    setIsModelLoading(true)
    setCurrentModel(modelType)
    // Simulate loading time for smooth transition
    setTimeout(() => setIsModelLoading(false), 800)
  }

  const features = [
    {
      icon: Brain,
      title: "Advanced 3D Medical Visualization",
      description: "Interactive 3D models of human anatomy with real-time analysis and surgical planning",
      color: "from-blue-500 to-cyan-500",
      modelType: "brain" as const,
      specialty: "Neurology",
    },
    {
      icon: Heart,
      title: "Cardiovascular Analysis",
      description: "Comprehensive heart modeling with blood flow simulation and cardiac assessment",
      color: "from-red-500 to-pink-500",
      modelType: "heart" as const,
      specialty: "Cardiology",
    },
    {
      icon: Target,
      title: "Tumor Detection & Analysis",
      description: "AI-powered tumor identification with growth prediction and treatment planning",
      color: "from-purple-500 to-indigo-500",
      modelType: "tumor" as const,
      specialty: "Oncology",
    },
    {
      icon: Activity,
      title: "AI-Powered Diagnosis",
      description: "Machine learning algorithms for accurate medical diagnosis and prognosis",
      color: "from-green-500 to-emerald-500",
      modelType: "brain" as const,
      specialty: "AI Medicine",
    },
    {
      icon: Shield,
      title: "HIPAA Compliant Security",
      description: "Enterprise-grade security with complete audit trails and data protection",
      color: "from-yellow-500 to-orange-500",
      modelType: "brain" as const,
      specialty: "Security",
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Comprehensive medical data analysis with predictive insights and reporting",
      color: "from-cyan-500 to-blue-500",
      modelType: "brain" as const,
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

  const medicalSpecialties = [
    {
      title: "Neurology & Brain Surgery",
      description: "Advanced brain tumor analysis with 3D surgical planning and real-time guidance",
      icon: Brain,
      modelType: "brain" as const,
      features: ["3D Brain Mapping", "Tumor Localization", "Surgical Planning", "Risk Assessment"],
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Cardiology & Heart Care",
      description: "Comprehensive cardiovascular analysis with blood flow simulation and cardiac modeling",
      icon: Heart,
      modelType: "heart" as const,
      features: ["Heart Modeling", "Blood Flow Analysis", "Cardiac Assessment", "Treatment Planning"],
      color: "from-red-500 to-pink-500",
    },
    {
      title: "Oncology & Cancer Care",
      description: "AI-powered tumor detection with growth prediction and personalized treatment strategies",
      icon: Target,
      modelType: "tumor" as const,
      features: ["Tumor Detection", "Growth Prediction", "Treatment Response", "Outcome Analysis"],
      color: "from-purple-500 to-indigo-500",
    },
  ]

  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Quant-NEX Medical
            </h1>
            <p className="text-xl text-gray-300">Advanced Oncology Platform</p>
            <p className="text-gray-400">Loading interactive features...</p>
          </div>
        </div>
      }
    >
      <div className="min-h-screen bg-black text-white overflow-hidden relative">
        {/* Enhanced Background Effects */}
        <ErrorBoundary fallback={<div className="absolute inset-0 bg-black" />}>
          <EnhancedParticleBackground
            particleCount={60}
            colors={["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"]}
          />
          <FloatingMedicalIcons />
          <MedicalDataVisualization />
        </ErrorBoundary>

      {/* Cursor Glow Effect */}
      <motion.div
        className="fixed w-96 h-96 pointer-events-none z-50 mix-blend-screen"
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        {/* Dynamic Background Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(147,51,234,0.1),transparent_50%)]" />

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

        {/* Enhanced Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 4 + 1,
                height: Math.random() * 4 + 1,
                background: i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#8b5cf6' : '#06b6d4',
              }}
              initial={{
                opacity: 0,
                scale: 0,
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
              }}
              animate={{
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0],
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 z-10 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-screen">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 lg:space-y-8 lg:pr-8 order-2 lg:order-1 px-4 lg:px-0"
            >
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Badge className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30 px-4 py-2 text-sm font-medium">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Next-Generation Medical Technology
                  </Badge>
                </motion.div>

                <motion.h1
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <motion.span
                    className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      backgroundSize: "200% 200%",
                    }}
                  >
                    Quant-NEX
                  </motion.span>
                  <br />
                  <motion.span
                    className="text-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    Medical Platform
                  </motion.span>
                </motion.h1>

                <motion.p
                  className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed max-w-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  Revolutionary healthcare platform combining AI-powered diagnostics,
                  interactive 3D medical visualization, and comprehensive patient management
                  in a HIPAA-compliant environment.
                </motion.p>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <Link href="/login">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold group relative overflow-hidden w-full sm:w-auto">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={false}
                      />
                      <span className="relative z-10 flex items-center">
                        Start Free Trial
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>

              {/* Enhanced Stats Grid */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6 lg:pt-8"
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
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 backdrop-blur-sm group cursor-pointer"
                  >
                    <div className="flex items-center justify-center mb-2">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <stat.icon className="h-6 w-6 text-blue-400 mr-2 group-hover:text-cyan-400 transition-colors duration-300" />
                      </motion.div>
                      <motion.span
                        className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300"
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        {stat.value}
                      </motion.span>
                    </div>
                    <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">{stat.label}</p>
                    <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-400 transition-colors duration-300">{stat.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Content - Enhanced Interactive 3D Model Showcase */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 50 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative lg:pl-8 order-1 lg:order-2 px-4 lg:px-0"
            >
              <ErrorBoundary
                fallback={
                  <div className="h-[700px] bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl border border-blue-500/30 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                        <Brain className="w-8 h-8 text-blue-400" />
                      </div>
                      <p className="text-gray-300">3D Medical Models</p>
                      <p className="text-gray-500 text-sm">Interactive visualization loading...</p>
                    </div>
                  </div>
                }
              >
                <InteractiveModelShowcase className="h-[400px] sm:h-[500px] lg:h-[700px]" />
              </ErrorBoundary>
            </motion.div>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={() => {
            featuresRef.current?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          <div className="flex flex-col items-center space-y-2">
            <motion.div
              className="w-6 h-10 border-2 border-blue-400 rounded-full flex justify-center"
              whileHover={{ scale: 1.1 }}
            >
              <motion.div
                className="w-1 h-3 bg-blue-400 rounded-full mt-2"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
            <span className="text-blue-400 text-sm font-medium">Explore Features</span>
          </div>
        </motion.div>
      </motion.section>

      {/* Enhanced Features Section */}
      <section ref={featuresRef} className="py-32 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-900/5 to-black" />
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{ y: parallaxY }}
        >
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(59,130,246,0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(147,51,234,0.1) 0%, transparent 50%)
            `,
          }} />
        </motion.div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-400 border-purple-500/30 px-4 py-2 text-sm font-medium mb-6">
                <Cpu className="w-4 h-4 mr-2" />
                Advanced Medical Technology
              </Badge>
            </motion.div>

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
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
                className="group cursor-pointer"
              >
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    y: -10,
                    rotateY: 5,
                  }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700 hover:border-blue-500/50 transition-all duration-500 h-full backdrop-blur-sm relative overflow-hidden">
                    {/* Hover Glow Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(135deg, ${feature.color.split(' ')[1]}, ${feature.color.split(' ')[3]})`,
                      }}
                    />

                    <CardHeader className="relative z-10">
                      <motion.div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} p-4 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <feature.icon className="h-8 w-8 text-white" />
                      </motion.div>
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

                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                          opacity: hoveredCard === index ? 1 : 0,
                          height: hoveredCard === index ? "auto" : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t border-gray-700"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 p-0 h-auto font-medium"
                          onClick={() => handleModelSwitch(feature.modelType)}
                        >
                          View 3D Model
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Medical Specialties Section */}
      <section ref={specialtiesRef} className="py-32 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-black to-blue-900/10" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Badge className="bg-gradient-to-r from-green-500/20 to-blue-500/20 text-green-400 border-green-500/30 px-4 py-2 text-sm font-medium mb-6">
              <Stethoscope className="w-4 h-4 mr-2" />
              Medical Specialties
            </Badge>

            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Specialized Medical Care
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Our platform supports multiple medical specialties with dedicated 3D visualization
              and AI-powered analysis tools for each field.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {medicalSpecialties.map((specialty, index) => (
              <motion.div
                key={specialty.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 border-gray-700 hover:border-blue-500/50 transition-all duration-500 h-full backdrop-blur-sm relative overflow-hidden">
                  {/* Hover Background Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${specialty.color.split(' ')[1]}, ${specialty.color.split(' ')[3]})`,
                    }}
                  />

                  <CardHeader className="relative z-10">
                    <motion.div
                      className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${specialty.color} p-5 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.8 }}
                    >
                      <specialty.icon className="h-10 w-10 text-white" />
                    </motion.div>
                    <CardTitle className="text-2xl text-white group-hover:text-blue-400 transition-colors duration-300 mb-4">
                      {specialty.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="relative z-10 space-y-6">
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                      {specialty.description}
                    </p>

                    <div className="space-y-3">
                      <h4 className="text-white font-semibold">Key Features:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {specialty.features.map((feature, featureIndex) => (
                          <motion.div
                            key={feature}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: featureIndex * 0.1 }}
                            viewport={{ once: true }}
                            className="flex items-center space-x-2"
                          >
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                            <span className="text-sm text-gray-300">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        className={`w-full bg-gradient-to-r ${specialty.color} hover:opacity-90 transition-opacity duration-300 font-semibold`}
                        onClick={() => handleModelSwitch(specialty.modelType)}
                      >
                        <Move3D className="mr-2 h-4 w-4" />
                        Explore 3D Model
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Demo Section */}
      <section className="py-32 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 to-purple-900/10" />
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(59,130,246,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(147,51,234,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(59,130,246,0.1) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Badge className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border-cyan-500/30 px-4 py-2 text-sm font-medium mb-6">
                <Cpu className="w-4 h-4 mr-2" />
                AI Technology Demo
              </Badge>

              <h3 className="text-4xl md:text-5xl font-bold mb-8">
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Interactive 3D Medical Models
                </span>
              </h3>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Explore detailed anatomical structures with our advanced 3D visualization technology.
                Rotate, zoom, and analyze medical conditions with unprecedented clarity and precision.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: RotateCcw, text: "360° rotation and zoom capabilities" },
                  { icon: Eye, text: "Real-time tissue analysis and visualization" },
                  { icon: Database, text: "Multi-layer anatomical views and data" },
                  { icon: Cpu, text: "AI-powered anomaly detection and insights" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-4 p-3 rounded-lg bg-gray-900/50 border border-gray-700 hover:border-blue-500/30 transition-colors duration-300"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 p-2 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-300 font-medium">{item.text}</span>
                  </motion.div>
                ))}
              </div>


            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative h-[500px] rounded-3xl overflow-hidden border border-cyan-500/30 bg-gradient-to-br from-cyan-900/10 to-purple-900/10 backdrop-blur-sm shadow-2xl">
                <ErrorBoundary
                  fallback={
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-900/10 to-purple-900/10">
                      <div className="text-center space-y-4">
                        <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto">
                          <Brain className="w-10 h-10 text-cyan-400" />
                        </div>
                        <p className="text-cyan-300">Interactive Brain Model</p>
                        <p className="text-gray-400 text-sm">3D visualization loading...</p>
                      </div>
                    </div>
                  }
                >
                  <Enhanced3DModel
                    modelType="brain"
                    title="Interactive Brain Model"
                    showControls={true}
                    autoRotate={true}
                    className="w-full h-full"
                  />
                </ErrorBoundary>

                {/* Interactive Hotspots */}
                <div className="absolute top-1/4 left-1/4">
                  <motion.div
                    className="w-4 h-4 bg-red-500 rounded-full cursor-pointer"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    whileHover={{ scale: 1.5 }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                      Frontal Lobe
                    </div>
                  </motion.div>
                </div>

                <div className="absolute top-1/3 right-1/3">
                  <motion.div
                    className="w-4 h-4 bg-blue-500 rounded-full cursor-pointer"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    whileHover={{ scale: 1.5 }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                      Parietal Lobe
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Statistics Section */}
      <section ref={statsRef} className="py-32 relative overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-black" />
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 25% 25%, rgba(59,130,246,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 75% 75%, rgba(147,51,234,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 25% 25%, rgba(59,130,246,0.1) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30 px-4 py-2 text-sm font-medium mb-6">
              <TrendingUp className="w-4 h-4 mr-2" />
              Global Impact
            </Badge>

            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Trusted Worldwide
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Join thousands of healthcare providers and millions of patients who trust our
              advanced medical platform for better health outcomes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group cursor-pointer"
              >
                <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 border-gray-700 hover:border-blue-500/50 transition-all duration-500 h-full backdrop-blur-sm relative overflow-hidden">
                  {/* Animated Background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />

                  <CardContent className="p-8 text-center relative z-10">
                    <motion.div
                      className="flex justify-center mb-6"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-shadow duration-300">
                        <stat.icon className="h-10 w-10 text-white" />
                      </div>
                    </motion.div>

                    <motion.h3
                      className="text-4xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {stat.value}
                    </motion.h3>

                    <h4 className="text-lg font-semibold text-gray-300 mb-2 group-hover:text-white transition-colors duration-300">
                      {stat.label}
                    </h4>

                    <p className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-32 relative overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20" />
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 30% 40%, rgba(59,130,246,0.15) 0%, transparent 70%)",
              "radial-gradient(circle at 70% 60%, rgba(147,51,234,0.15) 0%, transparent 70%)",
              "radial-gradient(circle at 30% 40%, rgba(59,130,246,0.15) 0%, transparent 70%)",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        {/* Floating Elements */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: Math.random() * 4 + 4,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge className="bg-gradient-to-r from-green-500/20 to-blue-500/20 text-green-400 border-green-500/30 px-6 py-3 text-base font-medium mb-8">
                <Sparkles className="w-5 h-5 mr-2" />
                Start Your Medical Revolution Today
              </Badge>
            </motion.div>

            <motion.h3
              className="text-5xl md:text-7xl font-bold mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Ready to Transform
              </span>
              <br />
              <span className="text-white">Healthcare?</span>
            </motion.h3>

            <motion.p
              className="text-2xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Join thousands of medical professionals using Quant-NEX to deliver better patient outcomes
              with AI-powered diagnostics and interactive 3D medical visualization.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link href="/dashboard">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-12 py-6 text-xl font-semibold shadow-2xl hover:shadow-blue-500/25 transition-shadow duration-300 group">
                    <span className="flex items-center">
                      Get Started Today
                      <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Button>
                </motion.div>
              </Link>

              <Link href="/contact">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="outline" className="border-2 border-blue-500 text-blue-400 hover:bg-blue-500/10 hover:text-white px-12 py-6 text-xl font-semibold backdrop-blur-sm group">
                    <span className="flex items-center">
                      <Users className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                      Contact Sales
                    </span>
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="mt-16 pt-12 border-t border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <p className="text-gray-400 mb-8 text-lg">Trusted by leading medical institutions worldwide</p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                {[
                  "AIIMS Delhi", "Apollo Hospitals", "Fortis Healthcare",
                  "Max Healthcare", "Manipal Hospitals", "Narayana Health"
                ].map((hospital, index) => (
                  <motion.div
                    key={hospital}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 0.6, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ opacity: 1, scale: 1.1 }}
                    className="text-gray-500 font-medium text-sm hover:text-blue-400 transition-colors duration-300 cursor-pointer"
                  >
                    {hospital}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      </div>
    </ErrorBoundary>
  )
}
