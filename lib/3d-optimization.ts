import { useState, useEffect, useCallback } from 'react'

// 3D Model Loading States
export enum ModelLoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  LOADED = 'loaded',
  ERROR = 'error',
  FALLBACK = 'fallback'
}

// 3D Model Quality Levels
export enum ModelQuality {
  LOW = 'low',      // Mobile/slow connections
  MEDIUM = 'medium', // Tablets/moderate connections
  HIGH = 'high',    // Desktop/fast connections
  ULTRA = 'ultra'   // High-end devices/very fast connections
}

// Connection Speed Detection
export function detectConnectionSpeed(): ModelQuality {
  if (typeof navigator === 'undefined') return ModelQuality.MEDIUM

  // Check for Network Information API
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection

  if (connection) {
    const { effectiveType, downlink } = connection
    
    // Based on effective connection type
    switch (effectiveType) {
      case 'slow-2g':
      case '2g':
        return ModelQuality.LOW
      case '3g':
        return ModelQuality.MEDIUM
      case '4g':
        return downlink > 10 ? ModelQuality.HIGH : ModelQuality.MEDIUM
      default:
        return ModelQuality.MEDIUM
    }
  }

  // Fallback: Check device capabilities
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  const isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(navigator.userAgent)
  
  if (isMobile) return ModelQuality.LOW
  if (isTablet) return ModelQuality.MEDIUM
  return ModelQuality.HIGH
}

// Device Performance Detection
export function detectDevicePerformance(): ModelQuality {
  if (typeof navigator === 'undefined') return ModelQuality.MEDIUM

  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 4
  
  // Check device memory (if available)
  const memory = (navigator as any).deviceMemory || 4

  // Check WebGL capabilities
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  
  let webglScore = 0
  if (gl && (gl instanceof WebGLRenderingContext)) {
    const renderer = gl.getParameter(WebGLRenderingContext.RENDERER)
    const vendor = gl.getParameter(WebGLRenderingContext.VENDOR)
    
    // Basic WebGL capability scoring
    if (typeof renderer === 'string' && renderer.includes('Intel')) webglScore = 1
    else if (typeof renderer === 'string' && (renderer.includes('AMD') || renderer.includes('NVIDIA'))) webglScore = 2
    else webglScore = 1
  }

  // Calculate performance score
  const performanceScore = (cores * 0.3) + (memory * 0.4) + (webglScore * 0.3)

  if (performanceScore < 3) return ModelQuality.LOW
  if (performanceScore < 6) return ModelQuality.MEDIUM
  if (performanceScore < 9) return ModelQuality.HIGH
  return ModelQuality.ULTRA
}

// Model URL Generator
export function getOptimizedModelUrl(baseUrl: string, quality: ModelQuality): string {
  const qualityMap = {
    [ModelQuality.LOW]: '_low.glb',
    [ModelQuality.MEDIUM]: '_medium.glb',
    [ModelQuality.HIGH]: '_high.glb',
    [ModelQuality.ULTRA]: '_ultra.glb'
  }

  const baseName = baseUrl.replace(/\.(glb|gltf)$/, '')
  return `${baseName}${qualityMap[quality]}`
}

// Progressive Loading Hook
export function useProgressiveModelLoading(baseModelUrl: string) {
  const [loadingState, setLoadingState] = useState<ModelLoadingState>(ModelLoadingState.IDLE)
  const [currentQuality, setCurrentQuality] = useState<ModelQuality>(ModelQuality.LOW)
  const [modelUrl, setModelUrl] = useState<string>('')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  // Determine optimal quality based on device and connection
  const optimalQuality = useCallback(() => {
    const connectionQuality = detectConnectionSpeed()
    const deviceQuality = detectDevicePerformance()
    
    // Use the lower of the two to ensure smooth performance
    const qualityLevels = [ModelQuality.LOW, ModelQuality.MEDIUM, ModelQuality.HIGH, ModelQuality.ULTRA]
    const connectionIndex = qualityLevels.indexOf(connectionQuality)
    const deviceIndex = qualityLevels.indexOf(deviceQuality)
    
    return qualityLevels[Math.min(connectionIndex, deviceIndex)]
  }, [])

  // Load model progressively
  const loadModel = useCallback(async (targetQuality?: ModelQuality) => {
    const quality: ModelQuality = targetQuality ?? optimalQuality() ?? ModelQuality.LOW;
    setLoadingState(ModelLoadingState.LOADING)
    setError(null)
    setProgress(0)

    try {
      // Start with low quality for immediate feedback
      if (quality !== ModelQuality.LOW) {
        const lowQualityUrl = getOptimizedModelUrl(baseModelUrl, ModelQuality.LOW)
        setModelUrl(lowQualityUrl)
        setCurrentQuality(ModelQuality.LOW)
        setProgress(25)
      }

      // Load target quality
      const targetUrl = getOptimizedModelUrl(baseModelUrl, quality)
      
      // Simulate progressive loading (in production, use actual loading progress)
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // In production, replace with actual model loading
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      clearInterval(progressInterval)
      setModelUrl(targetUrl)
      setCurrentQuality(quality)
      setProgress(100)
      setLoadingState(ModelLoadingState.LOADED)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load 3D model')
      setLoadingState(ModelLoadingState.ERROR)
      
      // Try fallback to lower quality
      if (quality !== ModelQuality.LOW) {
        setTimeout(() => loadModel(ModelQuality.LOW), 1000)
      } else {
        setLoadingState(ModelLoadingState.FALLBACK)
      }
    }
  }, [baseModelUrl, optimalQuality])

  // Upgrade quality when possible
  const upgradeQuality = useCallback(() => {
    const optimal = optimalQuality() ?? ModelQuality.LOW;
    if (optimal !== currentQuality && loadingState === ModelLoadingState.LOADED) {
      loadModel(optimal)
    }
  }, [currentQuality, loadingState, loadModel, optimalQuality])

  useEffect(() => {
    loadModel()
  }, [loadModel])

  return {
    modelUrl,
    loadingState,
    currentQuality,
    progress,
    error,
    loadModel,
    upgradeQuality,
    optimalQuality: optimalQuality() ?? ModelQuality.LOW
  }
}

// Model Preloader
export class ModelPreloader {
  private static instance: ModelPreloader
  private preloadedModels: Map<string, string> = new Map()
  private loadingPromises: Map<string, Promise<string>> = new Map()

  static getInstance(): ModelPreloader {
    if (!ModelPreloader.instance) {
      ModelPreloader.instance = new ModelPreloader()
    }
    return ModelPreloader.instance
  }

  async preloadModel(modelUrl: string, quality: ModelQuality = ModelQuality.MEDIUM): Promise<string> {
    const optimizedUrl = getOptimizedModelUrl(modelUrl, quality)
    const cacheKey = `${modelUrl}_${quality}`

    // Return cached model if available
    if (this.preloadedModels.has(cacheKey)) {
      return this.preloadedModels.get(cacheKey)!
    }

    // Return existing loading promise if in progress
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey)!
    }

    // Start preloading
    const loadingPromise = this.loadModelData(optimizedUrl)
      .then(data => {
        this.preloadedModels.set(cacheKey, data)
        this.loadingPromises.delete(cacheKey)
        return data
      })
      .catch(error => {
        this.loadingPromises.delete(cacheKey)
        throw error
      })

    this.loadingPromises.set(cacheKey, loadingPromise)
    return loadingPromise
  }

  private async loadModelData(url: string): Promise<string> {
    // In production, implement actual model loading
    // This could involve fetching the model file and caching it
    return new Promise((resolve) => {
      setTimeout(() => resolve(url), 1000)
    })
  }

  getPreloadedModel(modelUrl: string, quality: ModelQuality): string | null {
    const cacheKey = `${modelUrl}_${quality}`
    return this.preloadedModels.get(cacheKey) || null
  }

  clearCache(): void {
    this.preloadedModels.clear()
    this.loadingPromises.clear()
  }
}

// Fallback 2D Images for 3D Models
export const model3DFallbacks = {
  brain: '/images/fallback/brain-2d.jpg',
  anatomy: '/images/fallback/anatomy-2d.jpg',
  organs: '/images/fallback/organs-2d.jpg',
  skeleton: '/images/fallback/skeleton-2d.jpg',
  tumor: '/images/fallback/tumor-2d.jpg',
}

// Performance Monitoring
export function monitor3DPerformance() {
  if (typeof window === 'undefined') return null

  // Add memory monitoring
  const memoryInfo = (performance as any).memory
  if (memoryInfo) {
    const usedHeapSize = memoryInfo.usedJSHeapSize / (1024 * 1024)
    if (usedHeapSize > 500) { // 500MB threshold
      console.warn('High memory usage detected, reducing 3D quality')
      return ModelQuality.LOW
    }
  }
  
  const startTime = performance.now()
  let frameCount = 0
  let lastTime = startTime

  const measureFPS = () => {
    frameCount++
    const currentTime = performance.now()
    
    if (currentTime - lastTime >= 1000) {
      const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
      frameCount = 0
      lastTime = currentTime
      
      // Adjust quality based on performance
      if (fps < 30) {
        console.warn('Low FPS detected, consider reducing 3D model quality')
        return ModelQuality.LOW
      } else if (fps < 45) {
        return ModelQuality.MEDIUM
      } else {
        return ModelQuality.HIGH
      }
    }
    
    requestAnimationFrame(measureFPS)
    return null
  }

  requestAnimationFrame(measureFPS)
  
  return {
    startTime,
    measureFPS
  }
}

