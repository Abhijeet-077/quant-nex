// Medical Application Accessibility Utilities (WCAG 2.1 AA Compliance)

import { useEffect, useState, useCallback } from 'react'

// Accessibility preferences
export interface AccessibilityPreferences {
  reducedMotion: boolean
  highContrast: boolean
  largeText: boolean
  screenReader: boolean
  keyboardNavigation: boolean
  colorBlindnessType: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'
  fontSize: 'small' | 'medium' | 'large' | 'extra-large'
  focusIndicator: 'default' | 'enhanced' | 'high-contrast'
}

// Screen reader announcements for medical data
export class MedicalScreenReader {
  private static instance: MedicalScreenReader
  private announceElement: HTMLElement | null = null

  static getInstance(): MedicalScreenReader {
    if (!MedicalScreenReader.instance) {
      MedicalScreenReader.instance = new MedicalScreenReader()
    }
    return MedicalScreenReader.instance
  }

  constructor() {
    this.createAnnounceElement()
  }

  private createAnnounceElement(): void {
    if (typeof document === 'undefined') return

    this.announceElement = document.createElement('div')
    this.announceElement.setAttribute('aria-live', 'polite')
    this.announceElement.setAttribute('aria-atomic', 'true')
    this.announceElement.setAttribute('aria-relevant', 'text')
    this.announceElement.style.position = 'absolute'
    this.announceElement.style.left = '-10000px'
    this.announceElement.style.width = '1px'
    this.announceElement.style.height = '1px'
    this.announceElement.style.overflow = 'hidden'
    document.body.appendChild(this.announceElement)
  }

  // Announce patient data changes
  announcePatientUpdate(patientName: string, updateType: string): void {
    const message = `Patient ${patientName} ${updateType} updated`
    this.announce(message)
  }

  // Announce treatment progress
  announceTreatmentProgress(patientName: string, progress: number): void {
    const message = `${patientName} treatment progress: ${progress} percent complete`
    this.announce(message)
  }

  // Announce critical alerts
  announceCriticalAlert(message: string): void {
    this.announce(`Critical alert: ${message}`, 'assertive')
  }

  // Announce navigation changes
  announceNavigation(pageName: string): void {
    const message = `Navigated to ${pageName} page`
    this.announce(message)
  }

  // Announce form validation errors
  announceFormError(fieldName: string, errorMessage: string): void {
    const message = `Error in ${fieldName}: ${errorMessage}`
    this.announce(message, 'assertive')
  }

  // Generic announce method
  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.announceElement) return

    this.announceElement.setAttribute('aria-live', priority)
    this.announceElement.textContent = message

    // Clear after announcement
    setTimeout(() => {
      if (this.announceElement) {
        this.announceElement.textContent = ''
      }
    }, 1000)
  }
}

// Keyboard navigation utilities
export class KeyboardNavigationManager {
  private focusableElements: string = [
    'button',
    '[href]',
    'input',
    'select',
    'textarea',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable]'
  ].join(', ')

  // Trap focus within a container (for modals)
  trapFocus(container: HTMLElement): () => void {
    const focusableElements = container.querySelectorAll(this.focusableElements) as NodeListOf<HTMLElement>
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  }

  // Skip navigation for complex medical dashboards
  createSkipLinks(sections: Array<{ id: string; label: string }>): HTMLElement {
    const skipNav = document.createElement('nav')
    skipNav.setAttribute('aria-label', 'Skip navigation')
    skipNav.className = 'skip-navigation'
    
    const skipList = document.createElement('ul')
    
    sections.forEach(section => {
      const listItem = document.createElement('li')
      const link = document.createElement('a')
      link.href = `#${section.id}`
      link.textContent = `Skip to ${section.label}`
      link.className = 'skip-link'
      
      // Style skip links (hidden until focused)
      link.style.position = 'absolute'
      link.style.left = '-10000px'
      link.style.top = 'auto'
      link.style.width = '1px'
      link.style.height = '1px'
      link.style.overflow = 'hidden'
      
      link.addEventListener('focus', () => {
        link.style.position = 'fixed'
        link.style.left = '6px'
        link.style.top = '6px'
        link.style.width = 'auto'
        link.style.height = 'auto'
        link.style.overflow = 'visible'
        link.style.zIndex = '999999'
        link.style.padding = '8px 16px'
        link.style.backgroundColor = '#000'
        link.style.color = '#fff'
        link.style.textDecoration = 'none'
        link.style.borderRadius = '4px'
      })
      
      link.addEventListener('blur', () => {
        link.style.position = 'absolute'
        link.style.left = '-10000px'
        link.style.top = 'auto'
        link.style.width = '1px'
        link.style.height = '1px'
        link.style.overflow = 'hidden'
      })
      
      listItem.appendChild(link)
      skipList.appendChild(listItem)
    })
    
    skipNav.appendChild(skipList)
    return skipNav
  }
}

// Color contrast utilities for medical applications
export function checkColorContrast(foreground: string, background: string): {
  ratio: number
  wcagAA: boolean
  wcagAAA: boolean
  medical: boolean // Higher standard for medical apps
} {
  // Convert colors to RGB
  const fgRgb = hexToRgb(foreground)
  const bgRgb = hexToRgb(background)
  
  if (!fgRgb || !bgRgb) {
    return { ratio: 0, wcagAA: false, wcagAAA: false, medical: false }
  }
  
  // Calculate relative luminance
  const fgLuminance = getRelativeLuminance(fgRgb)
  const bgLuminance = getRelativeLuminance(bgRgb)
  
  // Calculate contrast ratio
  const lighter = Math.max(fgLuminance, bgLuminance)
  const darker = Math.min(fgLuminance, bgLuminance)
  const ratio = (lighter + 0.05) / (darker + 0.05)
  
  return {
    ratio,
    wcagAA: ratio >= 4.5,
    wcagAAA: ratio >= 7,
    medical: ratio >= 7 // Higher standard for medical applications
  }
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

function getRelativeLuminance({ r, g, b }: { r: number; g: number; b: number }): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

// React hooks for accessibility
export function useAccessibilityPreferences(): [AccessibilityPreferences, (prefs: Partial<AccessibilityPreferences>) => void] {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>({
    reducedMotion: false,
    highContrast: false,
    largeText: false,
    screenReader: false,
    keyboardNavigation: false,
    colorBlindnessType: 'none',
    fontSize: 'medium',
    focusIndicator: 'default'
  })

  useEffect(() => {
    // Detect system preferences
    const mediaQueries = {
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)'),
      highContrast: window.matchMedia('(prefers-contrast: high)'),
      largeText: window.matchMedia('(prefers-reduced-data: reduce)')
    }

    const updatePreferences = () => {
      setPreferences(prev => ({
        ...prev,
        reducedMotion: mediaQueries.reducedMotion.matches,
        highContrast: mediaQueries.highContrast.matches,
        largeText: mediaQueries.largeText.matches
      }))
    }

    // Listen for changes
    Object.values(mediaQueries).forEach(mq => {
      mq.addEventListener('change', updatePreferences)
    })

    updatePreferences()

    // Load saved preferences
    const saved = localStorage.getItem('accessibility-preferences')
    if (saved) {
      try {
        const savedPrefs = JSON.parse(saved)
        setPreferences(prev => ({ ...prev, ...savedPrefs }))
      } catch (error) {
        console.error('Failed to load accessibility preferences:', error)
      }
    }

    return () => {
      Object.values(mediaQueries).forEach(mq => {
        mq.removeEventListener('change', updatePreferences)
      })
    }
  }, [])

  const updatePreferences = useCallback((newPrefs: Partial<AccessibilityPreferences>) => {
    setPreferences(prev => {
      const updated = { ...prev, ...newPrefs }
      localStorage.setItem('accessibility-preferences', JSON.stringify(updated))
      return updated
    })
  }, [])

  return [preferences, updatePreferences]
}

// Focus management hook
export function useFocusManagement() {
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null)

  const focusElement = useCallback((element: HTMLElement | null) => {
    if (element) {
      element.focus()
      setFocusedElement(element)
    }
  }, [])

  const focusById = useCallback((id: string) => {
    const element = document.getElementById(id)
    if (element) {
      focusElement(element)
    }
  }, [focusElement])

  const focusFirst = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>
    
    if (focusableElements.length > 0) {
      focusElement(focusableElements[0])
    }
  }, [focusElement])

  return {
    focusedElement,
    focusElement,
    focusById,
    focusFirst
  }
}

// ARIA utilities for medical data
export const AriaUtils = {
  // Generate ARIA label for patient data
  patientDataLabel: (patientName: string, dataType: string, value: string) => 
    `${patientName} ${dataType}: ${value}`,

  // Generate ARIA label for treatment progress
  treatmentProgressLabel: (patientName: string, progress: number) =>
    `${patientName} treatment progress: ${progress} percent complete`,

  // Generate ARIA label for medical alerts
  medicalAlertLabel: (severity: string, message: string) =>
    `${severity} alert: ${message}`,

  // Generate ARIA label for medical charts
  chartLabel: (chartType: string, dataPoints: number, timeRange: string) =>
    `${chartType} chart with ${dataPoints} data points over ${timeRange}`,

  // Generate ARIA description for complex medical data
  complexDataDescription: (summary: string, details: string[]) =>
    `${summary}. Additional details: ${details.join(', ')}`
}

// Export singleton instances
export const screenReader = MedicalScreenReader.getInstance()
export const keyboardNav = new KeyboardNavigationManager()
