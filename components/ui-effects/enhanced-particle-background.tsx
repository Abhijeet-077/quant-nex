"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
  life: number
  maxLife: number
}

interface EnhancedParticleBackgroundProps {
  particleCount?: number
  colors?: string[]
  className?: string
}

export function EnhancedParticleBackground({ 
  particleCount = 50, 
  colors = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981"],
  className = ""
}: EnhancedParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticle = (): Particle => {
      const maxLife = Math.random() * 300 + 200
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: maxLife,
        maxLife,
      }
    }

    const initParticles = () => {
      particlesRef.current = Array.from({ length: particleCount }, createParticle)
    }

    const updateParticles = () => {
      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Mouse interaction
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 100) {
          const force = (100 - distance) / 100
          particle.vx += (dx / distance) * force * 0.01
          particle.vy += (dy / distance) * force * 0.01
        }

        // Boundary wrapping
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Update life
        particle.life--
        particle.opacity = (particle.life / particle.maxLife) * 0.7

        // Respawn particle
        if (particle.life <= 0) {
          particlesRef.current[index] = createParticle()
        }
      })
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections
      particlesRef.current.forEach((particle, i) => {
        particlesRef.current.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120) {
            const opacity = (120 - distance) / 120 * 0.1
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
          }
        })
      })

      // Draw particles
      particlesRef.current.forEach((particle) => {
        ctx.save()
        ctx.globalAlpha = particle.opacity
        ctx.fillStyle = particle.color
        ctx.shadowBlur = 10
        ctx.shadowColor = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })
    }

    const animate = () => {
      updateParticles()
      drawParticles()
      animationRef.current = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }

    const handleResize = () => {
      resizeCanvas()
      initParticles()
    }

    // Initialize
    resizeCanvas()
    initParticles()
    animate()

    // Event listeners
    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [particleCount, colors])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ mixBlendMode: "screen" }}
    />
  )
}

// Floating Medical Icons Component
export function FloatingMedicalIcons() {
  const icons = ["🧠", "❤️", "🫁", "🦴", "👁️", "🧬"]
  
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {icons.map((icon, index) => (
        <motion.div
          key={index}
          className="absolute text-4xl opacity-10"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
          }}
          animate={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            rotate: [0, 360],
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {icon}
        </motion.div>
      ))}
    </div>
  )
}

// Medical Data Visualization Background
export function MedicalDataVisualization() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-5">
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px),
          linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }} />
      
      {/* Animated pulse lines */}
      <motion.div
        className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"
        animate={{
          scaleX: [0, 1, 0],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"
        animate={{
          scaleX: [0, 1, 0],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      />
    </div>
  )
}
