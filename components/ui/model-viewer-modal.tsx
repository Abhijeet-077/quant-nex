"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, ZoomIn, ZoomOut, RotateCw, RotateCcw, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ModelViewerModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  modelType: "anatomy" | "brain" | "organs"
  children: React.ReactNode
}

export function ModelViewerModal({ isOpen, onClose, title, modelType, children }: ModelViewerModalProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [showLabels, setShowLabels] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [activeTab, setActiveTab] = useState("view")

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y
    setRotation({
      x: rotation.x + deltaY * 0.5,
      y: rotation.y + deltaX * 0.5,
    })
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5))
  }

  const handleRotateLeft = () => {
    setRotation((prev) => ({ ...prev, y: prev.y - 45 }))
  }

  const handleRotateRight = () => {
    setRotation((prev) => ({ ...prev, y: prev.y + 45 }))
  }

  const toggleLabels = () => {
    setShowLabels((prev) => !prev)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-[90vw] max-w-6xl h-[80vh] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-xl overflow-hidden shadow-2xl border border-blue-500/30 relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-blue-500/30">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            {modelType === "anatomy" && (
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                Layered Anatomy
              </Badge>
            )}
            {modelType === "brain" && (
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                Neural Structure
              </Badge>
            )}
            {modelType === "organs" && (
              <Badge variant="secondary" className="bg-red-500/20 text-red-300">
                Organ System
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="p-4 border-b border-blue-500/30">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 max-w-md">
              <TabsTrigger value="view">View</TabsTrigger>
              <TabsTrigger value="analyze">Analyze</TabsTrigger>
              <TabsTrigger value="measure">Measure</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content Area */}
        <div className="flex h-[calc(80vh-120px)]">
          {/* Model Viewer */}
          <div
            className="flex-1 relative overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                transform: `scale(${zoom}) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                transition: isDragging ? "none" : "transform 0.2s ease",
              }}
            >
              {children}
            </div>

            {/* Interaction Hint */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white text-xs py-2 px-4 rounded-full backdrop-blur-sm">
              Click and drag to rotate • Scroll to zoom
            </div>
          </div>

          {/* Controls Panel */}
          <div className="w-64 bg-black/50 backdrop-blur-sm border-l border-blue-500/30 p-4 overflow-y-auto">
            <div className="space-y-6">
              {/* View Controls */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-white">View Controls</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomIn}
                    className="flex items-center justify-center"
                  >
                    <ZoomIn className="h-4 w-4 mr-1" />
                    Zoom In
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomOut}
                    className="flex items-center justify-center"
                  >
                    <ZoomOut className="h-4 w-4 mr-1" />
                    Zoom Out
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRotateLeft}
                    className="flex items-center justify-center"
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Rotate L
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRotateRight}
                    className="flex items-center justify-center"
                  >
                    <RotateCw className="h-4 w-4 mr-1" />
                    Rotate R
                  </Button>
                </div>
                <Button
                  variant={showLabels ? "default" : "outline"}
                  size="sm"
                  onClick={toggleLabels}
                  className="w-full flex items-center justify-center"
                >
                  {showLabels ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-1" />
                      Hide Labels
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-1" />
                      Show Labels
                    </>
                  )}
                </Button>
              </div>

              {/* Zoom Level */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-white">Zoom Level</span>
                  <span className="text-xs text-white">{Math.round(zoom * 100)}%</span>
                </div>
                <Slider
                  value={[zoom]}
                  min={0.5}
                  max={2}
                  step={0.1}
                  onValueChange={(value) => setZoom(value[0])}
                  className="w-full"
                />
              </div>

              {/* Model-specific controls */}
              {modelType === "anatomy" && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-white">Layer Visibility</h3>
                  <div className="space-y-2">
                    {["Skin", "Muscles", "Skeleton", "Organs", "Nerves", "Circulatory"].map((layer) => (
                      <div key={layer} className="flex items-center">
                        <input type="checkbox" id={layer} className="mr-2" defaultChecked />
                        <label htmlFor={layer} className="text-xs text-gray-300">
                          {layer}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {modelType === "brain" && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-white">Tumor Analysis</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-white">Tumor Intensity</span>
                      <span className="text-xs text-white">75%</span>
                    </div>
                    <Slider value={[0.75]} min={0} max={1} step={0.05} className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-white">Neural Activity</span>
                      <span className="text-xs text-white">60%</span>
                    </div>
                    <Slider value={[0.6]} min={0} max={1} step={0.05} className="w-full" />
                  </div>
                </div>
              )}

              {modelType === "organs" && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-white">Damage Assessment</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-white">Radiation Dose</span>
                      <span className="text-xs text-white">45 Gy</span>
                    </div>
                    <Slider value={[0.7]} min={0} max={1} step={0.05} className="w-full" />
                  </div>
                  <div className="p-2 bg-red-900/20 rounded border border-red-500/30 text-xs text-gray-300">
                    <div className="font-medium text-white mb-1">Critical Organs:</div>
                    <div>• Lungs: High Risk</div>
                    <div>• Heart: Moderate Risk</div>
                    <div>• Liver: Low Risk</div>
                  </div>
                </div>
              )}

              {/* Model Information */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-white">Information</h3>
                <div className="text-xs text-gray-300 space-y-1">
                  {modelType === "anatomy" && (
                    <>
                      <p>• Complete anatomical model</p>
                      <p>• 6 distinct body systems</p>
                      <p>• High-resolution textures</p>
                      <p>• Medical-grade accuracy</p>
                    </>
                  )}
                  {modelType === "brain" && (
                    <>
                      <p>• Glioblastoma Grade IV</p>
                      <p>• 4.2cm diameter tumor</p>
                      <p>• High vascularization</p>
                      <p>• Neural pathway disruption</p>
                    </>
                  )}
                  {modelType === "organs" && (
                    <>
                      <p>• Radiation pneumonitis</p>
                      <p>• Cardiac toxicity risk</p>
                      <p>• Dose: 45 Gy</p>
                      <p>• Treatment: Week 3/6</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
