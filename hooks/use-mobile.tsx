import * as React from "react"

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT}px) and (max-width: ${TABLET_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsTablet(window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < TABLET_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsTablet(window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < TABLET_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isTablet
}

export function useScreenSize() {
  const [screenSize, setScreenSize] = React.useState<'mobile' | 'tablet' | 'desktop'>('desktop')

  React.useEffect(() => {
    const updateScreenSize = () => {
      if (window.innerWidth < MOBILE_BREAKPOINT) {
        setScreenSize('mobile')
      } else if (window.innerWidth < TABLET_BREAKPOINT) {
        setScreenSize('tablet')
      } else {
        setScreenSize('desktop')
      }
    }

    updateScreenSize()
    window.addEventListener('resize', updateScreenSize)
    return () => window.removeEventListener('resize', updateScreenSize)
  }, [])

  return screenSize
}

// Enhanced responsive utilities for medical applications
export function useResponsiveLayout() {
  const [layout, setLayout] = React.useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    orientation: 'landscape' as 'portrait' | 'landscape',
    touchDevice: false,
    screenWidth: 1920,
    screenHeight: 1080,
    pixelRatio: 1,
  })

  React.useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      setLayout({
        isMobile: width < MOBILE_BREAKPOINT,
        isTablet: width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT,
        isDesktop: width >= TABLET_BREAKPOINT,
        orientation: width > height ? 'landscape' : 'portrait',
        touchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        screenWidth: width,
        screenHeight: height,
        pixelRatio: window.devicePixelRatio || 1,
      })
    }

    updateLayout()
    window.addEventListener('resize', updateLayout)
    window.addEventListener('orientationchange', updateLayout)

    return () => {
      window.removeEventListener('resize', updateLayout)
      window.removeEventListener('orientationchange', updateLayout)
    }
  }, [])

  return layout
}

// Hook for medical professional tablet optimization
export function useMedicalTabletOptimization() {
  const layout = useResponsiveLayout()

  return React.useMemo(() => ({
    // Optimize for medical professionals using tablets
    shouldUseLargerTouchTargets: layout.isTablet || layout.isMobile,
    shouldShowCompactNavigation: layout.isMobile,
    shouldStackCards: layout.isMobile,
    shouldUseDrawerNavigation: layout.isMobile || layout.isTablet,
    shouldShowFullPatientDetails: layout.isDesktop,
    shouldUseSingleColumnLayout: layout.isMobile,
    shouldOptimizeForPortrait: layout.orientation === 'portrait' && layout.isTablet,
    recommendedGridColumns: layout.isMobile ? 1 : layout.isTablet ? 2 : 3,
    touchOptimized: layout.touchDevice,
  }), [layout])
}

// Hook for responsive font sizes in medical context
export function useMedicalFontSizes() {
  const layout = useResponsiveLayout()

  return React.useMemo(() => ({
    // Medical text should be larger for readability
    patientName: layout.isMobile ? 'text-lg' : layout.isTablet ? 'text-xl' : 'text-2xl',
    medicalData: layout.isMobile ? 'text-base' : layout.isTablet ? 'text-lg' : 'text-xl',
    criticalAlert: layout.isMobile ? 'text-lg' : layout.isTablet ? 'text-xl' : 'text-2xl',
    bodyText: layout.isMobile ? 'text-sm' : 'text-base',
    caption: layout.isMobile ? 'text-xs' : 'text-sm',
    heading: layout.isMobile ? 'text-xl' : layout.isTablet ? 'text-2xl' : 'text-3xl',
  }), [layout])
}
