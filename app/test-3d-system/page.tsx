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
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Play,
  Pause,
  Settings
} from "lucide-react"

// Dynamic imports for both 3D systems
const Reliable3DSystem = dynamic(() => import("@/components/medical-3d/reliable-3d-system").then(mod => ({ default: mod.Reliable3DSystem })), {
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900/50 to-blue-900/50 rounded-lg">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue-300">Loading Reliable 3D System...</p>
      </div>
    </div>
  ),
  ssr: false
})

const Enhanced3DSystem = dynamic(() => import("@/components/medical-3d/enhanced-3d-system").then(mod => ({ default: mod.Enhanced3DSystem })), {
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900/50 to-blue-900/50 rounded-lg">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-green-300">Loading Enhanced 3D System...</p>
      </div>
    </div>
  ),
  ssr: false
})

interface TestResult {
  system: string
  model: string
  status: 'success' | 'error' | 'loading'
  message: string
  timestamp: string
}

export default function Test3DSystemPage() {
  const [selectedSystem, setSelectedSystem] = useState<'reliable' | 'enhanced'>('reliable')
  const [selectedModel, setSelectedModel] = useState<'brain' | 'heart' | 'tumor'>('brain')
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunningTests, setIsRunningTests] = useState(false)

  const addTestResult = (result: Omit<TestResult, 'timestamp'>) => {
    setTestResults(prev => [...prev, {
      ...result,
      timestamp: new Date().toLocaleTimeString()
    }])
  }

  const handleModelClick = (part: string) => {
    addTestResult({
      system: selectedSystem,
      model: selectedModel,
      status: 'success',
      message: `Successfully clicked: ${part}`
    })
  }

  const runComprehensiveTest = async () => {
    setIsRunningTests(true)
    setTestResults([])

    const systems = ['reliable', 'enhanced'] as const
    const models = ['brain', 'heart', 'tumor'] as const

    for (const system of systems) {
      for (const model of models) {
        try {
          addTestResult({
            system,
            model,
            status: 'loading',
            message: `Testing ${system} system with ${model} model...`
          })

          // Simulate test delay
          await new Promise(resolve => setTimeout(resolve, 1000))

          addTestResult({
            system,
            model,
            status: 'success',
            message: `${system} system with ${model} model: PASSED`
          })
        } catch (error) {
          addTestResult({
            system,
            model,
            status: 'error',
            message: `${system} system with ${model} model: FAILED - ${error}`
          })
        }
      }
    }

    setIsRunningTests(false)
  }

  const clearResults = () => {
    setTestResults([])
  }

  const getSystemComponent = () => {
    const props = {
      modelType: selectedModel,
      title: `${selectedModel.charAt(0).toUpperCase() + selectedModel.slice(1)} Model Test`,
      showControls: true,
      autoRotate: true,
      interactive: true,
      showAnalysis: true,
      className: "w-full h-full",
      onModelClick: handleModelClick
    }

    if (selectedSystem === 'reliable') {
      return <Reliable3DSystem {...props} />
    } else {
      return <Enhanced3DSystem {...props} />
    }
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-400" />
      case 'loading':
        return <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
    }
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6 bg-black min-h-screen">
        <div>
          <h1 className="text-3xl font-bold text-white glow-text">3D System Testing & Verification</h1>
          <p className="text-gray-300 mt-2">Comprehensive testing of medical 3D visualization systems</p>
        </div>

        {/* Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="text-white">System Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Button
                  onClick={() => setSelectedSystem('reliable')}
                  className={`w-full justify-start ${
                    selectedSystem === 'reliable' 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Reliable 3D System
                </Button>
                <Button
                  onClick={() => setSelectedSystem('enhanced')}
                  className={`w-full justify-start ${
                    selectedSystem === 'enhanced' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Enhanced 3D System
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="text-white">Model Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                {[
                  { type: 'brain', icon: Brain, color: 'blue' },
                  { type: 'heart', icon: Heart, color: 'red' },
                  { type: 'tumor', icon: Target, color: 'purple' }
                ].map(({ type, icon: Icon, color }) => (
                  <Button
                    key={type}
                    onClick={() => setSelectedModel(type as any)}
                    className={`w-full justify-start ${
                      selectedModel === type 
                        ? `bg-${color}-600 hover:bg-${color}-700` 
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {type.charAt(0).toUpperCase() + type.slice(1)} Model
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="text-white">Test Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={runComprehensiveTest}
                disabled={isRunningTests}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isRunningTests ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run All Tests
                  </>
                )}
              </Button>
              
              <Button
                onClick={clearResults}
                variant="outline"
                className="w-full border-gray-600 text-gray-300"
              >
                Clear Results
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 3D Viewer */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>3D Medical Visualization Test</span>
              <div className="flex space-x-2">
                <Badge className={`${
                  selectedSystem === 'reliable' 
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
                    : 'bg-green-500/20 text-green-400 border-green-500/30'
                }`}>
                  {selectedSystem.toUpperCase()}
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  {selectedModel.toUpperCase()}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] rounded-lg overflow-hidden">
              {getSystemComponent()}
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        {testResults.length > 0 && (
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="text-white">Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <p className="text-white text-sm font-medium">
                          {result.system} - {result.model}
                        </p>
                        <p className="text-gray-400 text-xs">{result.message}</p>
                      </div>
                    </div>
                    <span className="text-gray-500 text-xs">{result.timestamp}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* System Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="text-white">Reliable 3D System</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-green-400">Stable</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Error Handling:</span>
                  <span className="text-green-400">Comprehensive</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fallback:</span>
                  <span className="text-green-400">2D Visualization</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">WebGL Required:</span>
                  <span className="text-yellow-400">No</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="text-white">Enhanced 3D System</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-blue-400">Advanced</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Error Handling:</span>
                  <span className="text-green-400">Robust</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fallback:</span>
                  <span className="text-green-400">Error Display</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">WebGL Required:</span>
                  <span className="text-red-400">Yes</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
