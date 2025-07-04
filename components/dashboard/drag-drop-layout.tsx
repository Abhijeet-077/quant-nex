"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GripVertical, Settings, Maximize2, Minimize2, X, Save, RotateCcw, Layout, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface Widget {
  id: string
  title: string
  component: React.ComponentType<any>
  size: "small" | "medium" | "large" | "xlarge"
  category: string
  isVisible: boolean
  props?: any
}

interface DashboardLayout {
  id: string
  name: string
  widgets: Widget[]
}

const WIDGET_SIZES = {
  small: "col-span-12 md:col-span-6 lg:col-span-3 h-64",
  medium: "col-span-12 md:col-span-6 lg:col-span-6 h-80",
  large: "col-span-12 lg:col-span-8 h-96",
  xlarge: "col-span-12 h-[500px]",
}

export function DragDropLayout({
  availableWidgets,
  onLayoutChange,
}: {
  availableWidgets: Widget[]
  onLayoutChange?: (layout: Widget[]) => void
}) {
  const [widgets, setWidgets] = useState<Widget[]>(availableWidgets)
  const [isEditMode, setIsEditMode] = useState(false)
  const [savedLayouts, setSavedLayouts] = useState<DashboardLayout[]>([])

  // Load saved layouts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("dashboard-layouts")
    if (saved) {
      setSavedLayouts(JSON.parse(saved))
    }
  }, [])

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const newWidgets = Array.from(widgets)
    const [reorderedWidget] = newWidgets.splice(result.source.index, 1)
    newWidgets.splice(result.destination.index, 0, reorderedWidget)

    setWidgets(newWidgets)
    onLayoutChange?.(newWidgets)
  }

  const toggleWidgetVisibility = (widgetId: string) => {
    setWidgets((prev) =>
      prev.map((widget) => (widget.id === widgetId ? { ...widget, isVisible: !widget.isVisible } : widget)),
    )
  }

  const changeWidgetSize = (widgetId: string, newSize: Widget["size"]) => {
    setWidgets((prev) => prev.map((widget) => (widget.id === widgetId ? { ...widget, size: newSize } : widget)))
  }

  const removeWidget = (widgetId: string) => {
    setWidgets((prev) => prev.filter((widget) => widget.id !== widgetId))
  }

  const saveLayout = () => {
    const layoutName = prompt("Enter layout name:")
    if (!layoutName) return

    const newLayout: DashboardLayout = {
      id: Date.now().toString(),
      name: layoutName,
      widgets: [...widgets],
    }

    const updatedLayouts = [...savedLayouts, newLayout]
    setSavedLayouts(updatedLayouts)
    localStorage.setItem("dashboard-layouts", JSON.stringify(updatedLayouts))
  }

  const loadLayout = (layout: DashboardLayout) => {
    setWidgets(layout.widgets)
    onLayoutChange?.(layout.widgets)
  }

  const resetLayout = () => {
    setWidgets(availableWidgets)
    onLayoutChange?.(availableWidgets)
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Controls */}
      <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
        <div className="flex items-center space-x-4">
          <Button
            variant={isEditMode ? "default" : "outline"}
            onClick={() => setIsEditMode(!isEditMode)}
            className="bg-white/10 border-white/20 text-white"
          >
            <Layout className="h-4 w-4 mr-2" />
            {isEditMode ? "Exit Edit" : "Edit Layout"}
          </Button>

          {isEditMode && (
            <>
              <Button variant="outline" onClick={saveLayout} className="bg-white/10 border-white/20 text-white">
                <Save className="h-4 w-4 mr-2" />
                Save Layout
              </Button>

              <Button variant="outline" onClick={resetLayout} className="bg-white/10 border-white/20 text-white">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300">
            {widgets.filter((w) => w.isVisible).length} Active Widgets
          </Badge>
        </div>
      </div>

      {/* Saved Layouts */}
      {savedLayouts.length > 0 && (
        <div className="p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
          <h3 className="text-white font-medium mb-3">Saved Layouts</h3>
          <div className="flex flex-wrap gap-2">
            {savedLayouts.map((layout) => (
              <Button
                key={layout.id}
                variant="outline"
                size="sm"
                onClick={() => loadLayout(layout)}
                className="bg-white/10 border-white/20 text-white"
              >
                {layout.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Dashboard Grid */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="dashboard-grid">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={cn(
                "grid grid-cols-12 gap-6 min-h-[400px] p-4 rounded-xl transition-colors",
                snapshot.isDraggingOver && "bg-white/5",
              )}
            >
              {widgets
                .filter((widget) => widget.isVisible)
                .map((widget, index) => (
                  <Draggable key={widget.id} draggableId={widget.id} index={index} isDragDisabled={!isEditMode}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn(
                          WIDGET_SIZES[widget.size],
                          snapshot.isDragging && "rotate-3 scale-105",
                          "transition-transform duration-200",
                        )}
                      >
                        <Card className="h-full bg-white/5 backdrop-blur-xl border-white/10 overflow-hidden">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-white text-sm flex items-center">
                                {isEditMode && (
                                  <div
                                    {...provided.dragHandleProps}
                                    className="mr-2 cursor-grab active:cursor-grabbing"
                                  >
                                    <GripVertical className="h-4 w-4 text-slate-400" />
                                  </div>
                                )}
                                {widget.title}
                              </CardTitle>

                              {isEditMode && (
                                <div className="flex items-center space-x-1">
                                  <WidgetSizeSelector
                                    currentSize={widget.size}
                                    onSizeChange={(size) => changeWidgetSize(widget.id, size)}
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleWidgetVisibility(widget.id)}
                                    className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                                  >
                                    <EyeOff className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeWidget(widget.id)}
                                    className="h-6 w-6 p-0 text-slate-400 hover:text-red-400"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </CardHeader>

                          <CardContent className="p-4 h-[calc(100%-60px)]">
                            <widget.component {...widget.props} />
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Hidden Widgets Panel */}
      {isEditMode && widgets.some((w) => !w.isVisible) && (
        <div className="p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
          <h3 className="text-white font-medium mb-3">Hidden Widgets</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {widgets
              .filter((widget) => !widget.isVisible)
              .map((widget) => (
                <div key={widget.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white text-sm">{widget.title}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleWidgetVisibility(widget.id)}
                    className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

function WidgetSizeSelector({
  currentSize,
  onSizeChange,
}: {
  currentSize: Widget["size"]
  onSizeChange: (size: Widget["size"]) => void
}) {
  const sizes: { value: Widget["size"]; icon: React.ReactNode }[] = [
    { value: "small", icon: <Minimize2 className="h-3 w-3" /> },
    { value: "medium", icon: <Settings className="h-3 w-3" /> },
    { value: "large", icon: <Maximize2 className="h-3 w-3" /> },
    { value: "xlarge", icon: <Maximize2 className="h-3 w-3" /> },
  ]

  return (
    <div className="flex items-center space-x-1">
      {sizes.map((size) => (
        <Button
          key={size.value}
          variant={currentSize === size.value ? "default" : "ghost"}
          size="sm"
          onClick={() => onSizeChange(size.value)}
          className="h-6 w-6 p-0"
        >
          {size.icon}
        </Button>
      ))}
    </div>
  )
}
