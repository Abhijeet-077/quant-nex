"use client"

import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  placeholder?: "blur" | "empty"
  blurDataURL?: string
  sizes?: string
  fill?: boolean
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down"
  loading?: "lazy" | "eager"
  onLoad?: () => void
  onError?: () => void
  fallbackSrc?: string
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 85,
  placeholder = "empty",
  blurDataURL,
  sizes,
  fill = false,
  objectFit = "cover",
  loading = "lazy",
  onLoad,
  onError,
  fallbackSrc = "/images/placeholder-medical.jpg",
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
    setImgSrc(fallbackSrc)
    onError?.()
  }

  // Generate blur data URL for medical images
  const generateBlurDataURL = (width: number, height: number) => {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (ctx) {
      // Create a subtle medical-themed blur
      ctx.fillStyle = '#1a1a1a' // Dark background
      ctx.fillRect(0, 0, width, height)
      ctx.fillStyle = '#3b82f6' // Blue accent
      ctx.globalAlpha = 0.1
      ctx.fillRect(0, 0, width, height)
    }
    return canvas.toDataURL()
  }

  const defaultBlurDataURL = blurDataURL || (width && height ? generateBlurDataURL(width, height) : undefined)

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse rounded-lg">
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">Image not available</p>
          </div>
        </div>
      )}

      <Image
        src={imgSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={defaultBlurDataURL}
        sizes={sizes || (fill ? "100vw" : undefined)}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          fill && `object-${objectFit}`
        )}
        {...props}
      />
    </div>
  )
}

// Specialized components for medical images
export function MedicalScanImage({
  src,
  alt,
  className,
  ...props
}: Omit<OptimizedImageProps, "quality" | "placeholder">) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={cn("rounded-lg border border-blue-500/20", className)}
      quality={95} // Higher quality for medical scans
      placeholder="blur"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      {...props}
    />
  )
}

export function PatientPhotoImage({
  src,
  alt,
  className,
  ...props
}: Omit<OptimizedImageProps, "quality" | "objectFit">) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={cn("rounded-full", className)}
      quality={80}
      objectFit="cover"
      sizes="(max-width: 768px) 96px, 128px"
      {...props}
    />
  )
}

export function Medical3DModelPreview({
  src,
  alt,
  className,
  ...props
}: Omit<OptimizedImageProps, "quality" | "loading">) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={cn("rounded-lg bg-black", className)}
      quality={90}
      loading="lazy" // Always lazy load 3D previews
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      {...props}
    />
  )
}

// Hook for responsive image sizes
export function useResponsiveImageSizes() {
  return {
    avatar: "(max-width: 768px) 48px, 64px",
    card: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    hero: "(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw",
    thumbnail: "(max-width: 768px) 25vw, 20vw",
    fullscreen: "100vw",
  }
}

// Utility for generating optimized image URLs
export function getOptimizedImageUrl(
  src: string,
  width: number,
  height: number,
  quality: number = 85
): string {
  // In production, this would integrate with your CDN
  const params = new URLSearchParams({
    w: width.toString(),
    h: height.toString(),
    q: quality.toString(),
    f: "webp", // Prefer WebP format
  })
  
  return `${src}?${params.toString()}`
}
