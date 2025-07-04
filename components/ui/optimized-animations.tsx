"use client"

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

// Hook to detect reduced motion preference
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

// Optimized fade-in animation component
interface FadeInProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
  triggerOnce?: boolean
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 300,
  className,
  triggerOnce = true
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true)
      return
    }

    const timer = setTimeout(() => {
      if (!triggerOnce || !hasTriggered) {
        setIsVisible(true)
        setHasTriggered(true)
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [delay, triggerOnce, hasTriggered, prefersReducedMotion])

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <div
      className={cn(
        'transition-opacity ease-out',
        isVisible ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  )
}

// Slide-in animation for medical cards
interface SlideInProps {
  children: React.ReactNode
  direction?: 'left' | 'right' | 'up' | 'down'
  delay?: number
  duration?: number
  className?: string
}

export const SlideIn: React.FC<SlideInProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 400,
  className
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true)
      return
    }

    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay, prefersReducedMotion])

  const getTransform = () => {
    if (prefersReducedMotion || isVisible) return 'translate3d(0, 0, 0)'
    
    switch (direction) {
      case 'left': return 'translate3d(-30px, 0, 0)'
      case 'right': return 'translate3d(30px, 0, 0)'
      case 'up': return 'translate3d(0, 30px, 0)'
      case 'down': return 'translate3d(0, -30px, 0)'
      default: return 'translate3d(0, 30px, 0)'
    }
  }

  return (
    <div
      className={cn(
        'transition-all ease-out',
        isVisible ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={{
        transform: getTransform(),
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  )
}

// Staggered animation for lists
interface StaggeredListProps {
  children: React.ReactNode[]
  staggerDelay?: number
  className?: string
}

export const StaggeredList: React.FC<StaggeredListProps> = ({
  children,
  staggerDelay = 100,
  className
}) => {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className={className}>
      {children.map((child, index) => (
        <FadeIn
          key={index}
          delay={prefersReducedMotion ? 0 : index * staggerDelay}
          triggerOnce={true}
        >
          {child}
        </FadeIn>
      ))}
    </div>
  )
}

// Pulse animation for critical alerts
interface PulseProps {
  children: React.ReactNode
  intensity?: 'low' | 'medium' | 'high'
  className?: string
}

export const Pulse: React.FC<PulseProps> = ({
  children,
  intensity = 'medium',
  className
}) => {
  const prefersReducedMotion = useReducedMotion()

  const intensityClasses = {
    low: 'animate-pulse',
    medium: 'animate-pulse',
    high: 'animate-ping'
  }

  return (
    <div
      className={cn(
        !prefersReducedMotion && intensityClasses[intensity],
        className
      )}
    >
      {children}
    </div>
  )
}

// Smooth height transition for collapsible content
interface CollapseProps {
  isOpen: boolean
  children: React.ReactNode
  className?: string
}

export const Collapse: React.FC<CollapseProps> = ({
  isOpen,
  children,
  className
}) => {
  const [height, setHeight] = useState<number | 'auto'>(0)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) {
      setHeight(isOpen ? 'auto' : 0)
      return
    }

    if (isOpen) {
      const contentHeight = contentRef.current?.scrollHeight || 0
      setHeight(contentHeight)
      
      // Set to auto after animation completes
      const timer = setTimeout(() => {
        setHeight('auto')
      }, 300)
      
      return () => clearTimeout(timer)
    } else {
      setHeight(0)
    }
  }, [isOpen, prefersReducedMotion])

  return (
    <div
      className={cn(
        'overflow-hidden transition-all duration-300 ease-in-out',
        className
      )}
      style={{ height }}
    >
      <div ref={contentRef}>
        {children}
      </div>
    </div>
  )
}

// Glow effect for medical data highlights
interface GlowProps {
  children: React.ReactNode
  color?: 'blue' | 'green' | 'red' | 'yellow'
  intensity?: 'low' | 'medium' | 'high'
  className?: string
}

export const Glow: React.FC<GlowProps> = ({
  children,
  color = 'blue',
  intensity = 'medium',
  className
}) => {
  const prefersReducedMotion = useReducedMotion()

  const glowClasses = {
    blue: {
      low: 'shadow-blue-500/20',
      medium: 'shadow-blue-500/40 shadow-lg',
      high: 'shadow-blue-500/60 shadow-xl'
    },
    green: {
      low: 'shadow-green-500/20',
      medium: 'shadow-green-500/40 shadow-lg',
      high: 'shadow-green-500/60 shadow-xl'
    },
    red: {
      low: 'shadow-red-500/20',
      medium: 'shadow-red-500/40 shadow-lg',
      high: 'shadow-red-500/60 shadow-xl'
    },
    yellow: {
      low: 'shadow-yellow-500/20',
      medium: 'shadow-yellow-500/40 shadow-lg',
      high: 'shadow-yellow-500/60 shadow-xl'
    }
  }

  return (
    <div
      className={cn(
        'transition-shadow duration-300',
        !prefersReducedMotion && glowClasses[color][intensity],
        className
      )}
    >
      {children}
    </div>
  )
}

// Loading spinner with medical theme
interface MedicalSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'blue' | 'green' | 'red'
  className?: string
}

export const MedicalSpinner: React.FC<MedicalSpinnerProps> = ({
  size = 'md',
  color = 'blue',
  className
}) => {
  const prefersReducedMotion = useReducedMotion()

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const colorClasses = {
    blue: 'border-blue-500',
    green: 'border-green-500',
    red: 'border-red-500'
  }

  return (
    <div
      className={cn(
        'border-2 border-t-transparent rounded-full',
        sizeClasses[size],
        colorClasses[color],
        !prefersReducedMotion && 'animate-spin',
        className
      )}
      role="status"
      aria-label="Loading"
    />
  )
}

// Floating action button with medical emergency styling
interface FloatingActionButtonProps {
  onClick: () => void
  icon: React.ReactNode
  label: string
  variant?: 'primary' | 'emergency' | 'success'
  className?: string
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  icon,
  label,
  variant = 'primary',
  className
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/25',
    emergency: 'bg-red-600 hover:bg-red-700 shadow-red-500/25 animate-pulse',
    success: 'bg-green-600 hover:bg-green-700 shadow-green-500/25'
  }

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'fixed bottom-6 right-6 w-14 h-14 rounded-full text-white shadow-lg',
        'transition-all duration-300 ease-out',
        'focus:outline-none focus:ring-4 focus:ring-white/20',
        'flex items-center justify-center',
        variantClasses[variant],
        !prefersReducedMotion && isHovered && 'scale-110',
        className
      )}
      aria-label={label}
    >
      <div className={cn(
        'transition-transform duration-200',
        !prefersReducedMotion && isHovered && 'scale-110'
      )}>
        {icon}
      </div>
    </button>
  )
}

// Progress bar with medical styling
interface MedicalProgressBarProps {
  progress: number
  label?: string
  color?: 'blue' | 'green' | 'red' | 'yellow'
  showPercentage?: boolean
  className?: string
}

export const MedicalProgressBar: React.FC<MedicalProgressBarProps> = ({
  progress,
  label,
  color = 'blue',
  showPercentage = true,
  className
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) {
      setAnimatedProgress(progress)
      return
    }

    const timer = setTimeout(() => {
      setAnimatedProgress(progress)
    }, 100)

    return () => clearTimeout(timer)
  }, [progress, prefersReducedMotion])

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500'
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-300">{label}</span>
          {showPercentage && (
            <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className={cn(
            'h-2 rounded-full transition-all duration-500 ease-out',
            colorClasses[color]
          )}
          style={{ width: `${animatedProgress}%` }}
        />
      </div>
    </div>
  )
}
