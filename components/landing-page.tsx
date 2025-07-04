"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { BrainCircuit, Dna, FlaskConical, Microscope, Syringe, Users } from "lucide-react"
import { ParticleBackground } from "./ui-effects/particle-background"
import { TumorVisualization3D } from "./visualization/tumor-model-3d"
import { StatisticCounter } from "./ui-effects/statistic-counter"
import { TestimonialCarousel } from "./landing/testimonial-carousel"
import { AIDemo } from "./landing/ai-demo"
import { MedicalShowcase } from "./landing/medical-showcase"
import { FloatingActionMenu } from "./ui/floating-action-menu"

export function LandingPage() {
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="relative overflow-hidden">
      {/* Particle Background */}
      <div className="fixed inset-0 z-0">
        <ParticleBackground />
      </div>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-24"
      >
        <div
          className="absolute inset-0 z-0"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
            pointerEvents: "none",
          }}
        />

        <div className="container max-w-6xl z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
                  The Future of Oncology is Here
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                  Combining quantum computing, AI, and advanced medical imaging to revolutionize cancer diagnosis,
                  treatment planning, and patient outcomes with unprecedented precision.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                    asChild
                  >
                    <Link href="/login">Get Started</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-purple-500 text-purple-500 hover:bg-purple-950/20"
                    asChild
                  >
                    <Link href="#features">Learn More</Link>
                  </Button>
                </div>
              </motion.div>
            </div>
            <div className="relative h-[400px] lg:h-[500px]">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="w-full h-full"
              >
                <TumorVisualization3D />
              </motion.div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-0 right-0 flex justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="animate-bounce"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </motion.div>
        </div>
      </section>

      {/* Medical Showcase Section */}
      <MedicalShowcase />

      {/* Statistics Section */}
      <section className="relative py-20 bg-black/50 backdrop-blur-sm">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-400 mb-2">
                <StatisticCounter end={95} suffix="%" duration={2} />
              </div>
              <p className="text-gray-400">Detection Accuracy</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-500 mb-2">
                <StatisticCounter end={10000} suffix="+" duration={2} />
              </div>
              <p className="text-gray-400">Patients Helped</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-pink-500 mb-2">
                <StatisticCounter end={42} suffix="%" duration={2} />
              </div>
              <p className="text-gray-400">Treatment Improvement</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-400 mb-2">
                <StatisticCounter end={24} suffix="/7" duration={2} />
              </div>
              <p className="text-gray-400">Monitoring</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24">
        <div className="container max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
              Cutting-Edge Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our platform combines the latest advancements in AI, quantum computing, and medical imaging.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BrainCircuit className="h-8 w-8 text-cyan-400" />}
              title="AI-Powered Detection"
              description="Advanced neural networks detect and classify cancer with unprecedented accuracy."
            />
            <FeatureCard
              icon={<Dna className="h-8 w-8 text-purple-500" />}
              title="Genomic Analysis"
              description="Comprehensive genomic profiling to identify targeted treatment options."
            />
            <FeatureCard
              icon={<Microscope className="h-8 w-8 text-pink-500" />}
              title="3D Visualization"
              description="Interactive 3D models of tumors for better understanding and planning."
            />
            <FeatureCard
              icon={<FlaskConical className="h-8 w-8 text-cyan-400" />}
              title="Quantum Optimization"
              description="Quantum-enhanced algorithms for treatment planning optimization."
            />
            <FeatureCard
              icon={<Syringe className="h-8 w-8 text-purple-500" />}
              title="Treatment Simulation"
              description="Simulate treatment outcomes before implementation for better results."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-pink-500" />}
              title="Collaborative Platform"
              description="Seamless collaboration between oncologists, radiologists, and researchers."
            />
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="relative py-24 bg-black/50 backdrop-blur-sm">
        <div className="container max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
              See AI in Action
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience our AI detection capabilities with this interactive demo.
            </p>
          </div>

          <AIDemo />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-24">
        <div className="container max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
              Trusted by Experts
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Hear what leading oncologists and researchers have to say about Quant-NEX.
            </p>
          </div>

          <TestimonialCarousel />
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm">
        <div className="container max-w-6xl">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6 text-white">Ready to Transform Cancer Care?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Join the growing network of institutions using Quant-NEX to improve patient outcomes.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white border-0"
              asChild
            >
              <Link href="/login">Get Started Today</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 bg-black/80 backdrop-blur-sm">
        <div className="container max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">Quant-NEX</h3>
              <p className="text-gray-400">The future of oncology, powered by quantum computing and AI.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/diagnosis" className="hover:text-cyan-400 transition-colors">
                    Diagnosis
                  </Link>
                </li>
                <li>
                  <Link href="/prognosis" className="hover:text-cyan-400 transition-colors">
                    Prognosis
                  </Link>
                </li>
                <li>
                  <Link href="/treatment" className="hover:text-cyan-400 transition-colors">
                    Treatment
                  </Link>
                </li>
                <li>
                  <Link href="/monitoring" className="hover:text-cyan-400 transition-colors">
                    Monitoring
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-cyan-400 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-cyan-400 transition-colors">
                    Research
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-cyan-400 transition-colors">
                    Partners
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-cyan-400 transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-cyan-400 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-cyan-400 transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-cyan-400 transition-colors">
                    Data Processing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-cyan-400 transition-colors">
                    Compliance
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500">
            <p>© {new Date().getFullYear()} Quant-NEX. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating Action Menu */}
      <FloatingActionMenu />
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <motion.div
      whileHover={{
        y: -5,
        boxShadow: "0 20px 40px -10px rgba(120, 0, 255, 0.4)",
        scale: 1.02
      }}
      className="bg-black/30 backdrop-blur-sm border border-purple-900/30 rounded-xl p-6 transition-all duration-300 hover:border-purple-500/50 group"
    >
      <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-purple-300 transition-colors">{title}</h3>
      <p className="text-gray-400 group-hover:text-gray-300 transition-colors">{description}</p>
    </motion.div>
  )
}
