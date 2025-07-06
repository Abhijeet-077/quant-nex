"use client"

import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'

export default function BrainModelEnhanced() {
  const mountRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)
  const [hasWebGL, setHasWebGL] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)

    // Check WebGL support
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      setHasWebGL(!!gl)
    } catch (e) {
      setHasWebGL(false)
      setError('WebGL not supported')
    }
  }, [])

  useEffect(() => {
    if (!isClient || !hasWebGL || !mountRef.current) return

    let renderer: THREE.WebGLRenderer | null = null
    let animationId: number | null = null

    try {
      // Scene setup with error handling
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      })

      const container = mountRef.current
      const width = container.clientWidth || 400
      const height = container.clientHeight || 400

      renderer.setSize(width, height)
      renderer.setClearColor(0x000000, 0)
      container.appendChild(renderer.domElement)

      // Brain model
      const brainGeometry = new THREE.SphereGeometry(2, 32, 32)
      const brainMaterial = new THREE.MeshStandardMaterial({
        color: 0xff6b6b,
        transparent: true,
        opacity: 0.8
      })
      const brain = new THREE.Mesh(brainGeometry, brainMaterial)
      scene.add(brain)

      // Highlighted regions
      const regions = [
        { position: new THREE.Vector3(1, 0.5, 0.5), color: 0x00ffff },
        { position: new THREE.Vector3(-0.5, 1, 0.3), color: 0x00ffff },
        { position: new THREE.Vector3(0.3, -0.5, 0.8), color: 0x00ffff }
      ]

      regions.forEach(region => {
        const regionGeometry = new THREE.SphereGeometry(0.2, 16, 16)
        const regionMaterial = new THREE.MeshStandardMaterial({
          color: region.color,
          emissive: region.color,
          emissiveIntensity: 0.3
        })
        const regionMesh = new THREE.Mesh(regionGeometry, regionMaterial)
        regionMesh.position.copy(region.position)
        scene.add(regionMesh)
      })

      // Lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
      scene.add(ambientLight)
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
      directionalLight.position.set(1, 1, 1)
      scene.add(directionalLight)

      camera.position.z = 5

      // Animation loop
      const animate = () => {
        if (!renderer) return
        animationId = requestAnimationFrame(animate)
        brain.rotation.x += 0.005
        brain.rotation.y += 0.005
        renderer.render(scene, camera)
      }
      animate()

    } catch (err) {
      console.error('3D Model Error:', err)
      setError('Failed to initialize 3D model')
    }

    // Cleanup function
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      if (renderer && mountRef.current && renderer.domElement.parentNode) {
        mountRef.current.removeChild(renderer.domElement)
        renderer.dispose()
      }
    }
  }, [isClient, hasWebGL])

  // Don't render anything on server side
  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900/50 rounded-xl border border-cyan-500/30">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-cyan-400 text-sm">Initializing 3D Model...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error || !hasWebGL) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900/50 rounded-xl border border-red-500/30">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
            <span className="text-red-400 text-xl">⚠</span>
          </div>
          <p className="text-red-400 text-sm">{error || 'WebGL not supported'}</p>
          <p className="text-gray-400 text-xs">3D visualization unavailable</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={mountRef}
      className="w-full h-full rounded-xl overflow-hidden border border-cyan-500/30 bg-black/20"
      style={{ minHeight: '300px' }}
    />
  )
}