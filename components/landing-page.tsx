"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Activity,
  TrendingUp,
  Shield,
  ArrowRight,
  Play,
  Star,
  CheckCircle,
  Globe,
  Award,
  Target,
  Microscope,
} from "lucide-react"
import { ParticleBackground } from "@/components/ui-effects/particle-background"
import { StatisticCounter } from "@/components/ui-effects/statistic-counter"
import { TestimonialCarousel } from "@/components/landing/testimonial-carousel"
import { FeatureShowcase } from "@/components/landing/feature-showcase"
import { AIDemo } from "@/components/landing/ai-demo"
import { CellStructure3D } from "@/components/visualization/3d-cell-structure"
import { FullBodyNeuralNetwork3D } from "@/components/visualization/full-body-neural-network-3d"
import Link from "next/link"

export function LandingPage() {
  const [currentFeature, setCurrentFeature] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 4)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Diagnosis",
      description: "Advanced machine learning algorithms for accurate brain tumor detection and classification",
      color: "text-teal-400",
    },
    {
      icon: Activity,
      title: "Real-time Monitoring",
      description: "Continuous patient monitoring with intelligent alerts and predictive analytics",
      color: "text-blue-400",
    },
    {
      icon: TrendingUp,
      title: "Predictive Analytics",
      description: "Data-driven insights for treatment planning and outcome prediction",
      color: "text-green-400",
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "HIPAA-compliant platform with enterprise-grade security and data protection",
      color: "text-purple-400",
    },
  ]

  const stats = [
    { label: "Patients Treated", value: 10000, suffix: "+" },
    { label: "Diagnostic Accuracy", value: 97.3, suffix: "%" },
    { label: "Healthcare Partners", value: 250, suffix: "+" },
    { label: "Countries Served", value: 15, suffix: "" },
  ]

  const benefits = [
    "Reduce diagnostic time by 60%",
    "Improve accuracy by 25%",
    "24/7 AI-powered monitoring",
    "Seamless EHR integration",
    "Real-time collaboration tools",
    "Comprehensive reporting suite",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 relative overflow-hidden">
      <ParticleBackground />

      {/* Navigation */}
      <nav className="relative z-50 bg-black/20 backdrop-blur-xl border-b border-teal-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-teal-400" />
              <span className="text-xl sm:text-2xl font-bold text-teal-400">Quant-NEX</span>
            </div>
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <a href="#features" className="text-gray-300 hover:text-teal-400 transition-colors text-sm lg:text-base">
                Features
              </a>
              <a href="#demo" className="text-gray-300 hover:text-teal-400 transition-colors text-sm lg:text-base">
                Demo
              </a>
              <a
                href="#testimonials"
                className="text-gray-300 hover:text-teal-400 transition-colors text-sm lg:text-base"
              >
                Testimonials
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-teal-400 transition-colors text-sm lg:text-base">
                Pricing
              </a>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/login">
                <Button variant="outline" size="sm" className="glow-hover bg-transparent text-xs sm:text-sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/login">
                <Button size="sm" className="btn-glow-primary text-xs sm:text-sm">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className={`space-y-6 lg:space-y-8 ${isVisible ? "animate-slide-up" : "opacity-0"}`}>
              <div className="space-y-4">
                <Badge className="bg-teal-600/20 text-teal-400 border-teal-500/30 text-xs sm:text-sm">
                  🚀 Next-Generation Medical AI
                </Badge>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                  Revolutionizing
                  <span className="block text-transparent bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text">
                    Brain Tumor
                  </span>
                  Diagnosis
                </h1>
                <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-2xl">
                  Harness the power of AI to transform medical diagnosis, treatment planning, and patient care. Join
                  thousands of healthcare professionals using Quant-NEX to save lives.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login">
                  <Button
                    size="lg"
                    className="btn-glow-primary text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="glow-hover bg-transparent text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto"
                >
                  <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Watch Demo
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pt-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm sm:text-base text-gray-300">Trusted by 250+ healthcare institutions</span>
              </div>
            </div>

            <div className={`relative mt-8 lg:mt-0 ${isVisible ? "animate-slide-up" : "opacity-0"}`}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-blue-400/20 rounded-3xl blur-3xl"></div>
                <div className="relative">
                  <CellStructure3D />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-12 sm:py-16 lg:py-20 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-teal-400 mb-2">
                  <StatisticCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm sm:text-base text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-16 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 lg:mb-6">
              Powerful Features for
              <span className="block text-transparent bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text">
                Modern Healthcare
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Our comprehensive platform combines cutting-edge AI technology with intuitive design to deliver
              unprecedented capabilities for medical professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12 lg:mb-20">
            <div className="space-y-6 lg:space-y-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-4 lg:p-6 rounded-xl border transition-all duration-500 cursor-pointer ${
                    currentFeature === index
                      ? "border-teal-400 bg-teal-900/20 shadow-lg shadow-teal-400/20"
                      : "border-teal-500/30 bg-black/20 hover:border-teal-400/50"
                  }`}
                  onClick={() => setCurrentFeature(index)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r from-teal-500/20 to-blue-500/20`}>
                      <feature.icon className={`h-5 w-5 lg:h-6 lg:w-6 ${feature.color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg lg:text-xl font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-sm lg:text-base text-gray-300">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative mt-8 lg:mt-0">
              <FeatureShowcase currentFeature={currentFeature} />
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 lg:p-4 rounded-lg bg-black/20 border border-teal-500/30"
              >
                <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5 text-green-400 flex-shrink-0" />
                <span className="text-sm lg:text-base text-gray-300">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Demo Section */}
      <section id="demo" className="relative z-10 py-16 sm:py-24 lg:py-32 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 lg:mb-6">
              Experience AI in
              <span className="block text-transparent bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text">
                Action
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              See how our advanced AI algorithms analyze medical data in real-time to provide accurate diagnoses and
              treatment recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mb-8 lg:mb-12">
            <Card className="card-glow border-teal-500/30 bg-black/40 backdrop-blur-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-teal-400 flex items-center gap-2 text-lg lg:text-xl">
                  <Microscope className="h-5 w-5 lg:h-6 lg:w-6" />
                  Cellular Structure Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CellStructure3D />
              </CardContent>
            </Card>

            <Card className="card-glow border-teal-500/30 bg-black/40 backdrop-blur-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-teal-400 flex items-center gap-2 text-lg lg:text-xl">
                  <Activity className="h-5 w-5 lg:h-6 lg:w-6" />
                  Full Body Neural Network
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <FullBodyNeuralNetwork3D />
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 lg:mt-12">
            <AIDemo />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative z-10 py-16 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 lg:mb-6">
              Trusted by
              <span className="block text-transparent bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text">
                Healthcare Leaders
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of medical professionals who are already transforming patient care with Quant-NEX.
            </p>
          </div>

          <TestimonialCarousel />

          {/* Trust Indicators */}
          <div className="mt-12 lg:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="text-center">
              <Globe className="h-10 w-10 lg:h-12 lg:w-12 text-teal-400 mx-auto mb-3 lg:mb-4" />
              <h3 className="font-semibold text-white mb-2 text-sm lg:text-base">Global Reach</h3>
              <p className="text-xs lg:text-sm text-gray-400">15+ countries worldwide</p>
            </div>
            <div className="text-center">
              <Award className="h-10 w-10 lg:h-12 lg:w-12 text-teal-400 mx-auto mb-3 lg:mb-4" />
              <h3 className="font-semibold text-white mb-2 text-sm lg:text-base">Award Winning</h3>
              <p className="text-xs lg:text-sm text-gray-400">Healthcare Innovation Award 2024</p>
            </div>
            <div className="text-center">
              <Shield className="h-10 w-10 lg:h-12 lg:w-12 text-teal-400 mx-auto mb-3 lg:mb-4" />
              <h3 className="font-semibold text-white mb-2 text-sm lg:text-base">HIPAA Compliant</h3>
              <p className="text-xs lg:text-sm text-gray-400">Enterprise-grade security</p>
            </div>
            <div className="text-center">
              <Target className="h-10 w-10 lg:h-12 lg:w-12 text-teal-400 mx-auto mb-3 lg:mb-4" />
              <h3 className="font-semibold text-white mb-2 text-sm lg:text-base">97.3% Accuracy</h3>
              <p className="text-xs lg:text-sm text-gray-400">Clinically validated</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-16 sm:py-24 lg:py-32 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 lg:mb-6">
              Choose Your
              <span className="block text-transparent bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text">
                Plan
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Flexible pricing options designed to scale with your healthcare organization's needs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Starter Plan */}
            <Card className="card-glow border-teal-500/30 bg-black/40 backdrop-blur-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-white text-lg lg:text-xl">Starter</CardTitle>
                <div className="text-2xl lg:text-3xl font-bold text-teal-400">
                  ₹9,999<span className="text-base lg:text-lg text-gray-400">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm lg:text-base text-gray-300">Up to 100 patients</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm lg:text-base text-gray-300">Basic AI diagnosis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm lg:text-base text-gray-300">Standard reporting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm lg:text-base text-gray-300">Email support</span>
                  </li>
                </ul>
                <Button className="w-full btn-glow-primary">Start Free Trial</Button>
              </CardContent>
            </Card>

            {/* Professional Plan */}
            <Card className="card-glow border-teal-400 bg-teal-900/20 backdrop-blur-xl relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-teal-600 text-white">Most Popular</Badge>
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-white text-lg lg:text-xl">Professional</CardTitle>
                <div className="text-2xl lg:text-3xl font-bold text-teal-400">
                  ₹24,999<span className="text-base lg:text-lg text-gray-400">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm lg:text-base text-gray-300">Up to 500 patients</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm lg:text-base text-gray-300">Advanced AI features</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm lg:text-base text-gray-300">Real-time monitoring</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm lg:text-base text-gray-300">Priority support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm lg:text-base text-gray-300">API access</span>
                  </li>
                </ul>
                <Button className="w-full btn-glow-primary">Start Free Trial</Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="card-glow border-teal-500/30 bg-black/40 backdrop-blur-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-white text-lg lg:text-xl">Enterprise</CardTitle>
                <div className="text-2xl lg:text-3xl font-bold text-teal-400">
                  Custom<span className="text-base lg:text-lg text-gray-400"> pricing</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm lg:text-base text-gray-300">Unlimited patients</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm lg:text-base text-gray-300">Full AI suite</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm lg:text-base text-gray-300">Custom integrations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm lg:text-base text-gray-300">24/7 dedicated support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm lg:text-base text-gray-300">On-premise deployment</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full glow-hover bg-transparent">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-16 sm:py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6 lg:space-y-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Ready to Transform
              <span className="block text-transparent bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text">
                Healthcare?
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300">
              Join thousands of healthcare professionals who are already using Quant-NEX to improve patient outcomes and
              streamline their workflow. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button
                  size="lg"
                  className="btn-glow-primary text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="glow-hover bg-transparent text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto"
              >
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black/40 backdrop-blur-xl border-t border-teal-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Brain className="h-6 w-6 lg:h-8 lg:w-8 text-teal-400" />
                <span className="text-xl lg:text-2xl font-bold text-teal-400">Quant-NEX</span>
              </div>
              <p className="text-sm lg:text-base text-gray-400">
                Revolutionizing healthcare with AI-powered medical diagnosis and treatment planning.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4 text-sm lg:text-base">Product</h3>
              <ul className="space-y-2 text-gray-400 text-sm lg:text-base">
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4 text-sm lg:text-base">Company</h3>
              <ul className="space-y-2 text-gray-400 text-sm lg:text-base">
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4 text-sm lg:text-base">Support</h3>
              <ul className="space-y-2 text-gray-400 text-sm lg:text-base">
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-teal-500/30 mt-8 lg:mt-12 pt-6 lg:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm lg:text-base text-gray-400">© 2024 Quant-NEX. All rights reserved.</p>
            <div className="flex items-center gap-4 lg:gap-6">
              <a href="#" className="text-sm lg:text-base text-gray-400 hover:text-teal-400 transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm lg:text-base text-gray-400 hover:text-teal-400 transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm lg:text-base text-gray-400 hover:text-teal-400 transition-colors">
                Security
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
