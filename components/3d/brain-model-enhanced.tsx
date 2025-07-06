import { useRef, useEffect } from 'react'
import * as THREE from 'three'

export default function BrainModelEnhanced() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    mountRef.current.appendChild(renderer.domElement)

    // Brain model
    const brainGeometry = new THREE.SphereGeometry(5, 64, 64)
    const brainMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x333333,
      transparent: true,
      opacity: 0.9
    })
    const brain = new THREE.Mesh(brainGeometry, brainMaterial)
    scene.add(brain)

    // Highlighted regions
    const regions = [
      { position: new THREE.Vector3(2, 1, 1), color: 0x00ffff },
      { position: new THREE.Vector3(-1, 2, 0.5), color: 0x00ffff },
      { position: new THREE.Vector3(0.5, -1, 1.5), color: 0x00ffff }
    ]

    regions.forEach(region => {
      const regionGeometry = new THREE.SphereGeometry(0.5, 32, 32)
      const regionMaterial = new THREE.MeshStandardMaterial({ 
        color: region.color,
        emissive: region.color,
        emissiveIntensity: 0.5
      })
      const regionMesh = new THREE.Mesh(regionGeometry, regionMaterial)
      regionMesh.position.copy(region.position)
      scene.add(regionMesh)
    })

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040)
    scene.add(ambientLight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    camera.position.z = 10

    // Animation
    const animate = () => {
      requestAnimationFrame(animate)
      brain.rotation.x += 0.005
      brain.rotation.y += 0.005
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      mountRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full rounded-xl overflow-hidden border border-cyan-500/30"
    />
  )
}