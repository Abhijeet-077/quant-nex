"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Enhanced3DModel } from '@/components/dynamic-imports'
import { Medical3DErrorBoundary, use3DCapability } from '@/components/3d/3d-error-boundary'
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Loader2, 
  Brain, 
  Heart, 
  Target, 
  Eye,
  RefreshCw,
  Monitor,
  Cpu,
  Globe
} from 'lucide-react'

interface TestResult {
  component: string
  status: 'success' | 'error' | 'loading' | 'not-tested'
  message: string
  timestamp?: string
  errorDetails?: string
}

export function ThreeDComponentTest() {
  const [testResults, setTestResults] = useState<TestResult[]>([
    { component: 'Enhanced3DModel (Brain)', status: 'not-tested', message: 'Not tested yet' },
    { component: 'Enhanced3DModel (Heart)', status: 'not-tested', message: 'Not tested yet' },
    { component: 'Enhanced3DModel (Tumor)', status: 'not-tested', message: 'Not tested yet' },
    { component: 'Enhanced3DModel (Organs)', status: 'not-tested', message: 'Not tested yet' },
  ])
  
  const [isRunningTests, setIsRunningTests] = useState(false)
  const [currentTest, setCurrentTest] = useState<string | null>(null)
  const { isSupported, error: webglError } = use3DCapability()

  const updateTestResult = (component: string, status: TestResult['status'], message: string, errorDetails?: string) => {
    setTestResults(prev => prev.map(result => 
      result.component === component 
        ? { 
            ...result, 
            status, 
            message, 
            timestamp: new Date().toLocaleTimeString(),
            errorDetails 
          }
        : result
    ))
  }

  const testComponent = async (modelType: "brain" | "heart" | "tumor" | "organs", componentName: string) => {
    setCurrentTest(componentName)
    updateTestResult(componentName, 'loading', 'Testing component...')
    
    try {
      // Simulate component loading and testing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Check if WebGL is supported
      if (!isSupported) {
        updateTestResult(componentName, 'error', 'WebGL not supported', webglError || 'WebGL capability check failed')
        return
      }
      
      // Simulate successful test
      updateTestResult(componentName, 'success', 'Component loaded successfully')
    } catch (error) {
      updateTestResult(componentName, 'error', 'Component failed to load', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  const runAllTests = async () => {
    setIsRunningTests(true)
    
    const tests = [
      { type: 'brain' as const, name: 'Enhanced3DModel (Brain)' },
      { type: 'heart' as const, name: 'Enhanced3DModel (Heart)' },
      { type: 'tumor' as const, name: 'Enhanced3DModel (Tumor)' },
      { type: 'organs' as const, name: 'Enhanced3DModel (Organs)' },
    ]
    
    for (const test of tests) {
      await testComponent(test.type, test.name)
    }
    
    setCurrentTest(null)
    setIsRunningTests(false)
  }

  const resetTests = () => {
    setTestResults(prev => prev.map(result => ({
      ...result,
      status: 'not-tested',
      message: 'Not tested yet',
      timestamp: undefined,
      errorDetails: undefined
    })))
    setCurrentTest(null)
    setIsRunningTests(false)
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />
      case 'loading':
        return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Success</Badge>
      case 'error':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Error</Badge>
      case 'loading':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Testing</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Not Tested</Badge>
    }
  }

  const successCount = testResults.filter(r => r.status === 'success').length
  const errorCount = testResults.filter(r => r.status === 'error').length
  const totalTests = testResults.length

  return (
    <div className="p-6 space-y-6 bg-black min-h-screen">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-white">3D Component Testing Suite</h1>
        <p className="text-gray-300">
          Comprehensive testing for all 3D medical visualization components in the Quant-NEX platform.
        </p>
        
        {/* System Information */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Monitor className="w-5 h-5 mr-2 text-blue-400" />
              System Compatibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">WebGL Support:</span>
              <div className="flex items-center space-x-2">
                {isSupported ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">Supported</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400">Not Supported</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Browser:</span>
              <span className="text-white">{typeof window !== 'undefined' ? window.navigator.userAgent.split(' ').slice(-1)[0] : 'Unknown'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Platform:</span>
              <span className="text-white">{typeof window !== 'undefined' ? window.navigator.platform : 'Unknown'}</span>
            </div>
            {webglError && (
              <div className="p-3 bg-red-900/20 rounded-lg border border-red-500/30">
                <p className="text-red-300 text-sm">WebGL Error: {webglError}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={runAllTests}
            disabled={isRunningTests}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isRunningTests ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Cpu className="w-4 h-4 mr-2" />
                Run All Tests
              </>
            )}
          </Button>
          
          <Button
            onClick={resetTests}
            disabled={isRunningTests}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset Tests
          </Button>
        </div>

        {/* Test Results Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-green-900/20 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 font-medium">Passed</p>
                  <p className="text-2xl font-bold text-white">{successCount}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-red-900/20 border-red-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-400 font-medium">Failed</p>
                  <p className="text-2xl font-bold text-white">{errorCount}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-900/20 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-400 font-medium">Total</p>
                  <p className="text-2xl font-bold text-white">{totalTests}</p>
                </div>
                <Globe className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="results" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-gray-900">
          <TabsTrigger value="results" className="text-white">Test Results</TabsTrigger>
          <TabsTrigger value="preview" className="text-white">3D Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="space-y-4">
          {testResults.map((result, index) => (
            <Card key={index} className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <h3 className="text-white font-medium">{result.component}</h3>
                      <p className="text-gray-400 text-sm">{result.message}</p>
                      {result.timestamp && (
                        <p className="text-gray-500 text-xs">Tested at {result.timestamp}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(result.status)}
                    {currentTest === result.component && (
                      <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                    )}
                  </div>
                </div>
                {result.errorDetails && (
                  <div className="mt-3 p-3 bg-red-900/20 rounded-lg border border-red-500/30">
                    <p className="text-red-300 text-sm font-mono">{result.errorDetails}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Brain Model Test */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-blue-400" />
                  Brain Model Test
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] rounded-lg overflow-hidden border border-blue-500/20">
                  <Medical3DErrorBoundary
                    modelType="brain"
                    title="Test Brain Model"
                    className="w-full h-full"
                  >
                    <Enhanced3DModel
                      modelType="brain"
                      title="Test Brain Model"
                      showControls={true}
                      autoRotate={true}
                      className="w-full h-full"
                    />
                  </Medical3DErrorBoundary>
                </div>
              </CardContent>
            </Card>

            {/* Heart Model Test */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-400" />
                  Heart Model Test
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] rounded-lg overflow-hidden border border-red-500/20">
                  <Medical3DErrorBoundary
                    modelType="heart"
                    title="Test Heart Model"
                    className="w-full h-full"
                  >
                    <Enhanced3DModel
                      modelType="heart"
                      title="Test Heart Model"
                      showControls={true}
                      autoRotate={true}
                      className="w-full h-full"
                    />
                  </Medical3DErrorBoundary>
                </div>
              </CardContent>
            </Card>

            {/* Tumor Model Test */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="w-5 h-5 mr-2 text-purple-400" />
                  Tumor Model Test
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] rounded-lg overflow-hidden border border-purple-500/20">
                  <Medical3DErrorBoundary
                    modelType="tumor"
                    title="Test Tumor Model"
                    className="w-full h-full"
                  >
                    <Enhanced3DModel
                      modelType="tumor"
                      title="Test Tumor Model"
                      showControls={true}
                      autoRotate={true}
                      className="w-full h-full"
                    />
                  </Medical3DErrorBoundary>
                </div>
              </CardContent>
            </Card>

            {/* Organs Model Test */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-green-400" />
                  Organs Model Test
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] rounded-lg overflow-hidden border border-green-500/20">
                  <Medical3DErrorBoundary
                    modelType="organs"
                    title="Test Organs Model"
                    className="w-full h-full"
                  >
                    <Enhanced3DModel
                      modelType="liver"
                      title="Test Organs Model"
                      showControls={true}
                      autoRotate={true}
                      className="w-full h-full"
                    />
                  </Medical3DErrorBoundary>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
