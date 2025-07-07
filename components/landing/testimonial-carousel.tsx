"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

interface Testimonial {
  id: number
  name: string
  title: string
  institution: string
  quote: string
  image: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    title: "Chief Oncologist",
    institution: "Memorial Cancer Institute",
    quote:
      "Quant-NEX has revolutionized how we approach treatment planning. The quantum-enhanced algorithms have improved our radiation therapy outcomes by 32%.",
    image: "/placeholder-user.jpg",
  },
  {
    id: 2,
    name: "Prof. Michael Rodriguez",
    title: "Director of Research",
    institution: "National Cancer Research Center",
    quote:
      "The 3D visualization capabilities allow us to see tumors in ways we never could before. It's changing how we understand cancer progression.",
    image: "/placeholder-user.jpg",
  },
  {
    id: 3,
    name: "Dr. Emily Johnson",
    title: "Radiation Oncologist",
    institution: "University Medical Center",
    quote:
      "The AI-powered insights have helped us catch subtle patterns that would have been missed. It's like having a brilliant colleague who never gets tired.",
    image: "/placeholder-user.jpg",
  },
]

export function TestimonialCarousel() {
  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  const next = () => {
    setCurrent((current + 1) % testimonials.length)
  }

  const prev = () => {
    setCurrent((current - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(next, 5000)
    return () => clearInterval(interval)
  }, [current, autoplay])

  return (
    <div
      className="relative max-w-4xl mx-auto"
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="bg-black/30 backdrop-blur-sm border border-purple-900/30 rounded-xl p-8 md:p-12"
        >
          <div className="flex flex-col items-center text-center">
            <Quote className="h-12 w-12 text-purple-500 mb-6" />
            <p className="text-xl md:text-2xl text-gray-200 italic mb-8">"{testimonials[current].quote}"</p>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full overflow-hidden mb-4">
                <img
                  src={testimonials[current].image || "/placeholder.svg"}
                  alt={testimonials[current].name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-xl font-semibold text-white">{testimonials[current].name}</h4>
              <p className="text-gray-400">
                {testimonials[current].title}, {testimonials[current].institution}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={prev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 md:-translate-x-6 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={next}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-6 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
        aria-label="Next testimonial"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="flex justify-center mt-6 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-colors ${index === current ? "bg-purple-500" : "bg-gray-600"}`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
