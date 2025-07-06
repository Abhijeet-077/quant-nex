"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MainLayout } from "@/components/layout/main-layout"
import {
  Brain,
  Heart,
  Target,
  Eye,
  Activity,
  RotateCcw,
  ZoomIn,
  Settings,
  Play,
  Pause,
  RefreshCw,
  Circle,
  Square,
  Triangle
} from "lucide-react"

// Dynamic import for reliable 3D system
const Reliable3DSystem = dynamic(() => import("@/components/medical-3d/reliable-3d-system").then(mod => ({ default: mod.Reliable3DSystem })), {
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900/50 to-blue-900/50 rounded-lg">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue-300">Loading Medical Visualization...</p>
      </div>
    </div>
  ),
  ssr: false
})

interface ModelConfig {
  type: "brain" | "heart" | "tumor" | "liver" | "kidney" | "lung" | "spine"
  title: string
  description: string
  icon: any
  color: string
  features: string[]
}

const medicalModels: ModelConfig[] = [
  {
    type: "brain",
    title: "Brain Anatomy",
    description: "Interactive brain model with detailed neural pathways, hemispheres, and anatomical structures",
    icon: Brain,
    color: "blue",
    features: ["Cortex visualization", "Neural pathways", "Hemisphere separation", "Brain stem", "Cerebellum"]
  },
  {
    type: "heart",
    title: "Cardiovascular System",
    description: "Beating heart model with chambers, vessels, and coronary arteries",
    icon: Heart,
    color: "red",
    features: ["Beating animation", "Chamber visualization", "Blood vessels", "Coronary arteries", "Valve mechanics"]
  },
  {
    type: "tumor",
    title: "Tumor Analysis",
    description: "Cancer tumor model with growth stages, metastasis, and treatment zones",
    icon: Target,
    color: "purple",
    features: ["Growth stages", "Metastasis tracking", "Radiation zones", "Vascular supply", "Treatment planning"]
  },
  {
    type: "liver",
    title: "Liver Structure",
    description: "Detailed liver anatomy with lobes and vascular system",
    icon: Circle,
    color: "green",
    features: ["Liver lobes", "Portal system", "Bile ducts", "Hepatic vessels", "Functional segments"]
  },
  {
    type: "kidney",
    title: "Renal System",
    description: "Kidney model with cortex, medulla, and nephron structures",
    icon: Square,
    color: "yellow",
    features: ["Cortex structure", "Medulla visualization", "Nephron units", "Vascular supply", "Filtration system"]
  },
  {
    type: "lung",
    title: "Respiratory System",
    description: "Lung model with bronchi, alveoli, and respiratory pathways",
    icon: Triangle,
    color: "cyan",
    features: ["Bronchial tree", "Alveolar structure", "Gas exchange", "Pulmonary vessels", "Respiratory mechanics"]
  }
]

export default function Medical3DModelsPage() {
  const [selectedModel, setSelectedModel] = useState<ModelConfig>(medicalModels[0])
  const [modelSettings, setModelSettings] = useState({
    autoRotate: true,
    showControls: true,
    interactive: true,
    showAnalysis: true
  })

  const handleModelClick = (part: string) => {
    console.log(`${selectedModel.type} part clicked:`, part)
    // Handle model part interaction
  }

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'border-blue-500/30 bg-blue-900/20 text-blue-400'
      case 'red': return 'border-red-500/30 bg-red-900/20 text-red-400'
      case 'purple': return 'border-purple-500/30 bg-purple-900/20 text-purple-400'
      case 'green': return 'border-green-500/30 bg-green-900/20 text-green-400'
      case 'yellow': return 'border-yellow-500/30 bg-yellow-900/20 text-yellow-400'
      case 'cyan': return 'border-cyan-500/30 bg-cyan-900/20 text-cyan-400'
      default: return 'border-gray-500/30 bg-gray-900/20 text-gray-400'
    }
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6 bg-black min-h-screen">
        <div>
          <h1 className="text-3xl font-bold text-white glow-text">Advanced 3D Medical Models</h1>
          <p className="text-gray-300 mt-2">Interactive medical visualization with production-ready 3D technology</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Model Selection Panel */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-blue-400" />
                  Medical Models
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {medicalModels.map((model) => {
                  const Icon = model.icon
                  return (
                    <Button
                      key={model.type}
                      onClick={() => setSelectedModel(model)}
                      className={`w-full justify-start p-3 h-auto ${
                        selectedModel.type === model.type
                          ? `${getColorClasses(model.color)} border`
                          : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">{model.title}</div>
                        <div className="text-xs opacity-70">{model.type.toUpperCase()}</div>
                      </div>
                    </Button>
                  )
                })}
              </CardContent>
            </Card>

            {/* Model Settings */}
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-gray-400" />
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Auto Rotate</span>
                  <Button
                    size="sm"
                    onClick={() => setModelSettings(prev => ({ ...prev, autoRotate: !prev.autoRotate }))}
                    className={modelSettings.autoRotate ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'}
                  >
                    {modelSettings.autoRotate ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Interactive</span>
                  <Button
                    size="sm"
                    onClick={() => setModelSettings(prev => ({ ...prev, interactive: !prev.interactive }))}
                    className={modelSettings.interactive ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}
                  >
                    {modelSettings.interactive ? <ZoomIn className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Show Analysis</span>
                  <Button
                    size="sm"
                    onClick={() => setModelSettings(prev => ({ ...prev, showAnalysis: !prev.showAnalysis }))}
                    className={modelSettings.showAnalysis ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-600 hover:bg-gray-700'}
                  >
                    {modelSettings.showAnalysis ? <Activity className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main 3D Viewer */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <selectedModel.icon className={`w-6 h-6 mr-3 text-${selectedModel.color}-400`} />
                    {selectedModel.title}
                  </div>
                  <Badge className={getColorClasses(selectedModel.color)}>
                    {selectedModel.type.toUpperCase()}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[600px] rounded-lg overflow-hidden">
                  <Reliable3DSystem
                    modelType={selectedModel.type}
                    title={selectedModel.title}
                    showControls={modelSettings.showControls}
                    autoRotate={modelSettings.autoRotate}
                    interactive={modelSettings.interactive}
                    showAnalysis={modelSettings.showAnalysis}
                    className="w-full h-full"
                    onModelClick={handleModelClick}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Model Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {selectedModel.description}
                  </p>
                </CardContent>
              </Card>

              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedModel.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full bg-${selectedModel.color}-400`}></div>
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
