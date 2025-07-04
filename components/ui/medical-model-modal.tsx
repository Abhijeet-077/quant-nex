"use client"

import React, { useState, useEffect } from "react"
import { X, ZoomIn, ZoomOut, RotateCw, RotateCcw, Eye, EyeOff, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ComprehensiveHumanBody3D } from "../visualization/comprehensive-human-body-3d"
import { BrainModel3D } from "../3d/brain-model-3d"

interface MedicalModelModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  modelType: "anatomy" | "brain" | "organs" | "comprehensive"
  patientData?: {
    name: string
    id: string
    age: number
    condition: string
  }
  children?: React.ReactNode
}

export function MedicalModelModal({ 
  isOpen, 
  onClose, 
  title, 
  modelType, 
  patientData = {
    name: "Priya Sharma",
    id: "PT-2024-0156", 
    age: 54,
    condition: "Glioblastoma Stage IV"
  },
  children 
}: MedicalModelModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [showLabels, setShowLabels] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [activeView, setActiveView] = useState("front")

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "f" || e.key === "F") setIsFullscreen(!isFullscreen)
      if (e.key === "l" || e.key === "L") setShowLabels(!showLabels)
      if (e.key === "r" || e.key === "R") {
        setRotation({ x: 0, y: 0 })
        setZoom(1)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose, isFullscreen, showLabels])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y

    setRotation(prev => ({
      x: prev.x + deltaY * 0.5,
      y: prev.y + deltaX * 0.5
    }))

    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)))
  }

  const resetView = () => {
    setRotation({ x: 0, y: 0 })
    setZoom(1)
  }

  const setPresetView = (view: string) => {
    setActiveView(view)
    switch (view) {
      case "front":
        setRotation({ x: 0, y: 0 })
        break
      case "back":
        setRotation({ x: 0, y: 180 })
        break
      case "left":
        setRotation({ x: 0, y: -90 })
        break
      case "right":
        setRotation({ x: 0, y: 90 })
        break
      case "top":
        setRotation({ x: -90, y: 0 })
        break
      case "bottom":
        setRotation({ x: 90, y: 0 })
        break
    }
  }

  if (!isOpen) return null

  // Use comprehensive model for medical analysis
  if (modelType === "comprehensive") {
    return (
      <ComprehensiveHumanBody3D
        isOpen={isOpen}
        onClose={onClose}
        patientData={patientData}
      />
    )
  }

  // Use specialized brain model
  if (modelType === "brain") {
    return (
      <BrainModel3D
        isOpen={isOpen}
        onClose={onClose}
        patientData={patientData}
      />
    )
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 ${isFullscreen ? 'p-0' : ''}`}>
      <div className={`w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-xl overflow-hidden shadow-2xl border border-blue-500/30 relative flex flex-col ${
        isFullscreen ? 'max-w-none max-h-none rounded-none' : 'max-w-7xl max-h-[95vh]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-blue-500/30 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            {modelType === "anatomy" && (
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                Layered Anatomy
              </Badge>
            )}
            {modelType === "brain" && (
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                Neural Analysis
              </Badge>
            )}
            {modelType === "organs" && (
              <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                Organ Systems
              </Badge>
            )}
            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
              Patient: {patientData.name}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-white hover:bg-white/10"
              title="Toggle Fullscreen (F)"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/10"
              title="Close (Esc)"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-blue-500/30 flex-shrink-0">
          <div className="flex flex-wrap items-center gap-4">
            {/* View Presets */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-300">View:</span>
              <Tabs value={activeView} onValueChange={setPresetView}>
                <TabsList className="bg-black/50">
                  <TabsTrigger value="front" className="text-xs">Front</TabsTrigger>
                  <TabsTrigger value="back" className="text-xs">Back</TabsTrigger>
                  <TabsTrigger value="left" className="text-xs">Left</TabsTrigger>
                  <TabsTrigger value="right" className="text-xs">Right</TabsTrigger>
                  <TabsTrigger value="top" className="text-xs">Top</TabsTrigger>
                  <TabsTrigger value="bottom" className="text-xs">Bottom</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Zoom Control */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(prev => Math.max(0.5, prev - 0.2))}
                className="bg-white/10 border-white/20 text-white"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-300 min-w-[60px] text-center">
                {(zoom * 100).toFixed(0)}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(prev => Math.min(3, prev + 0.2))}
                className="bg-white/10 border-white/20 text-white"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            {/* Labels Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLabels(!showLabels)}
              className="bg-white/10 border-white/20 text-white"
              title="Toggle Labels (L)"
            >
              {showLabels ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              Labels
            </Button>

            {/* Reset View */}
            <Button
              variant="outline"
              size="sm"
              onClick={resetView}
              className="bg-white/10 border-white/20 text-white"
              title="Reset View (R)"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Model Viewer */}
          <div
            className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
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

            {/* Interaction Hints */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs py-2 px-4 rounded-full backdrop-blur-sm border border-blue-500/30">
              <div className="flex items-center space-x-4">
                <span>🖱️ Drag to rotate</span>
                <span>🔍 Scroll to zoom</span>
                <span>⌨️ Press F for fullscreen</span>
                <span>⌨️ Press L for labels</span>
                <span>⌨️ Press R to reset</span>
              </div>
            </div>

            {/* Model Info */}
            <div className="absolute top-4 left-4 bg-black/70 text-white text-sm p-3 rounded-lg backdrop-blur-sm border border-blue-500/30">
              <div className="space-y-1">
                <div className="font-semibold text-blue-300">{patientData.name}</div>
                <div className="text-gray-300">ID: {patientData.id}</div>
                <div className="text-gray-300">Age: {patientData.age}</div>
                <div className="text-gray-300">{patientData.condition}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
