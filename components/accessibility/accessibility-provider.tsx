"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

// WCAG 2.1 AA Compliance Provider
// Implements accessibility features for medical applications

interface AccessibilitySettings {
  highContrast: boolean
  largeText: boolean
  reducedMotion: boolean
  screenReaderMode: boolean
  keyboardNavigation: boolean
  focusIndicators: boolean
  colorBlindSupport: boolean
  voiceAnnouncements: boolean
  fontSize: number
  contrastRatio: number
}

interface AccessibilityContextType {
  settings: AccessibilitySettings
  updateSetting: (key: keyof AccessibilitySettings, value: any) => void
  announceToScreenReader: (message: string) => void
  setFocusToElement: (elementId: string) => void
  getAriaLabel: (element: string, context?: string) => string
  validateContrast: (foreground: string, background: string) => boolean
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  screenReaderMode: false,
  keyboardNavigation: true,
  focusIndicators: true,
  colorBlindSupport: false,
  voiceAnnouncements: false,
  fontSize: 16,
  contrastRatio: 4.5
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings)
  const [announcements, setAnnouncements] = useState<string[]>([])

  useEffect(() => {
    // Load accessibility preferences from localStorage
    const savedSettings = localStorage.getItem('accessibility-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...defaultSettings, ...parsed })
      } catch (error) {
        console.error('Failed to load accessibility settings:', error)
      }
    }

    // Detect user preferences from system
    detectSystemPreferences()
  }, [])

  useEffect(() => {
    // Save settings to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings))
    
    // Apply accessibility settings to document
    applyAccessibilitySettings()
  }, [settings])

  const detectSystemPreferences = () => {
    if (typeof window !== 'undefined') {
      // Detect reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReducedMotion) {
        updateSetting('reducedMotion', true)
      }

      // Detect high contrast preference
      const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches
      if (prefersHighContrast) {
        updateSetting('highContrast', true)
      }

      // Detect color scheme preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        updateSetting('highContrast', true)
      }
    }
  }

  const applyAccessibilitySettings = () => {
    if (typeof document === 'undefined') return

    const root = document.documentElement

    // Apply high contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast')
      root.style.setProperty('--contrast-ratio', '7:1')
    } else {
      root.classList.remove('high-contrast')
      root.style.setProperty('--contrast-ratio', '4.5:1')
    }

    // Apply large text
    if (settings.largeText) {
      root.classList.add('large-text')
      root.style.setProperty('--base-font-size', `${settings.fontSize * 1.25}px`)
    } else {
      root.classList.remove('large-text')
      root.style.setProperty('--base-font-size', `${settings.fontSize}px`)
    }

    // Apply reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion')
      root.style.setProperty('--animation-duration', '0.01ms')
      root.style.setProperty('--transition-duration', '0.01ms')
    } else {
      root.classList.remove('reduced-motion')
      root.style.setProperty('--animation-duration', '300ms')
      root.style.setProperty('--transition-duration', '200ms')
    }

    // Apply focus indicators
    if (settings.focusIndicators) {
      root.classList.add('enhanced-focus')
    } else {
      root.classList.remove('enhanced-focus')
    }

    // Apply color blind support
    if (settings.colorBlindSupport) {
      root.classList.add('colorblind-support')
    } else {
      root.classList.remove('colorblind-support')
    }
  }

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const announceToScreenReader = (message: string) => {
    setAnnouncements(prev => [...prev, message])
    
    // Create live region for screen reader announcements
    if (typeof document !== 'undefined') {
      let liveRegion = document.getElementById('sr-live-region')
      if (!liveRegion) {
        liveRegion = document.createElement('div')
        liveRegion.id = 'sr-live-region'
        liveRegion.setAttribute('aria-live', 'polite')
        liveRegion.setAttribute('aria-atomic', 'true')
        liveRegion.style.position = 'absolute'
        liveRegion.style.left = '-10000px'
        liveRegion.style.width = '1px'
        liveRegion.style.height = '1px'
        liveRegion.style.overflow = 'hidden'
        document.body.appendChild(liveRegion)
      }
      
      liveRegion.textContent = message
      
      // Clear after announcement
      setTimeout(() => {
        if (liveRegion) liveRegion.textContent = ''
      }, 1000)
    }

    // Voice announcement if enabled
    if (settings.voiceAnnouncements && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message)
      utterance.rate = 0.8
      utterance.pitch = 1
      utterance.volume = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const setFocusToElement = (elementId: string) => {
    if (typeof document !== 'undefined') {
      const element = document.getElementById(elementId)
      if (element) {
        element.focus()
        announceToScreenReader(`Focus moved to ${getAriaLabel(elementId)}`)
      }
    }
  }

  const getAriaLabel = (element: string, context?: string): string => {
    const labels: Record<string, string> = {
      '3d-model': 'Three-dimensional medical model viewer',
      'radiation-analysis': 'Radiation treatment analysis panel',
      'tumor-visualization': 'Tumor visualization and measurement tools',
      'damage-assessment': 'Tissue damage assessment interface',
      'patient-data': 'Patient medical information',
      'export-button': 'Export medical data and reports',
      'zoom-in': 'Zoom in on medical model',
      'zoom-out': 'Zoom out from medical model',
      'rotate-model': 'Rotate three-dimensional model',
      'toggle-labels': 'Toggle anatomical labels visibility',
      'fullscreen': 'Enter fullscreen mode',
      'close-modal': 'Close medical model viewer'
    }

    const baseLabel = labels[element] || element
    return context ? `${baseLabel} for ${context}` : baseLabel
  }

  const validateContrast = (foreground: string, background: string): boolean => {
    // Simplified contrast ratio calculation
    // In production, use a proper color contrast library
    const getLuminance = (color: string): number => {
      // Convert hex to RGB and calculate luminance
      const hex = color.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16) / 255
      const g = parseInt(hex.substr(2, 2), 16) / 255
      const b = parseInt(hex.substr(4, 2), 16) / 255
      
      const sRGB = [r, g, b].map(c => {
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      })
      
      return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2]
    }

    const l1 = getLuminance(foreground)
    const l2 = getLuminance(background)
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
    
    return ratio >= settings.contrastRatio
  }

  const contextValue: AccessibilityContextType = {
    settings,
    updateSetting,
    announceToScreenReader,
    setFocusToElement,
    getAriaLabel,
    validateContrast
  }

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
      
      {/* Screen Reader Announcements */}
      <div
        id="sr-announcements"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcements.slice(-1).map((announcement, index) => (
          <div key={index}>{announcement}</div>
        ))}
      </div>
      
      {/* Skip Links for Keyboard Navigation */}
      <div className="skip-links">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50"
        >
          Skip to main content
        </a>
        <a
          href="#navigation"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-32 bg-blue-600 text-white px-4 py-2 rounded z-50"
        >
          Skip to navigation
        </a>
      </div>
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}

// Accessibility utility components
export function AccessibilityButton({ 
  children, 
  ariaLabel, 
  onClick, 
  className = "",
  ...props 
}: {
  children: React.ReactNode
  ariaLabel: string
  onClick: () => void
  className?: string
  [key: string]: any
}) {
  const { announceToScreenReader } = useAccessibility()

  const handleClick = () => {
    onClick()
    announceToScreenReader(`${ariaLabel} activated`)
  }

  return (
    <button
      aria-label={ariaLabel}
      onClick={handleClick}
      className={`focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function AccessibilityHeading({ 
  level, 
  children, 
  className = "",
  id 
}: {
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: React.ReactNode
  className?: string
  id?: string
}) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements

  return (
    <Tag
      id={id}
      className={`focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      tabIndex={-1}
    >
      {children}
    </Tag>
  )
}
