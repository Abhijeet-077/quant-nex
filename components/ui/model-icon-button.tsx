"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Heart, Users, Maximize2 } from "lucide-react"

interface ModelIconButtonProps {
  type: "anatomy" | "brain" | "organs"
  title: string
  description: string
  onClick: () => void
}

export function ModelIconButton({ type, title, description, onClick }: ModelIconButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getIcon = () => {
    switch (type) {
      case "anatomy":
        return <Users className="h-6 w-6 text-blue-400" />
      case "brain":
        return <Brain className="h-6 w-6 text-purple-400" />
      case "organs":
        return <Heart className="h-6 w-6 text-red-400" />
      default:
        return <Users className="h-6 w-6 text-blue-400" />
    }
  }

  const getBadgeColor = () => {
    switch (type) {
      case "anatomy":
        return "bg-blue-500/20 text-blue-300"
      case "brain":
        return "bg-purple-500/20 text-purple-300"
      case "organs":
        return "bg-red-500/20 text-red-300"
      default:
        return "bg-blue-500/20 text-blue-300"
    }
  }

  return (
    <div
      className="relative group cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              {getIcon()}
              <h3 className="text-lg font-medium text-white">{title}</h3>
            </div>
            <Badge variant="secondary" className={getBadgeColor()}>
              3D Model
            </Badge>
          </div>
          <p className="text-sm text-gray-400 mb-4">{description}</p>
          <div className="flex justify-end">
            <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Maximize2 className="h-4 w-4 mr-1" />
              Expand View
            </Button>
          </div>
        </div>
      </div>

      {/* Hover Preview */}
      {isHovered && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center transform scale-100 animate-pulse z-10">
          <Maximize2 className="h-3 w-3 text-white" />
        </div>
      )}
    </div>
  )
}
