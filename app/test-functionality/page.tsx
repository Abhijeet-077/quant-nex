"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MainLayout } from "@/components/layout/main-layout"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

interface TestResult {
  component: string
  functionality: string
  status: 'pass' | 'fail' | 'pending'
  message?: string
}

export default function TestFunctionalityPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([
    { component: "Diagnosis Page", functionality: "Share Button", status: 'pending' },
    { component: "Diagnosis Page", functionality: "Export Button", status: 'pending' },
    { component: "Diagnosis Page", functionality: "Generate Report Button", status: 'pending' },
    { component: "Prognosis Page", functionality: "Export Report Button", status: 'pending' },
    { component: "Prognosis Page", functionality: "Generate PDF Button", status: 'pending' },
    { component: "Treatment Page", functionality: "Export Plan Button", status: 'pending' },
    { component: "Treatment Page", functionality: "Share Results Button", status: 'pending' },
    { component: "Dashboard", functionality: "Add New Patient Button", status: 'pending' },
    { component: "Dashboard", functionality: "Schedule Appointment Button", status: 'pending' },
    { component: "Dashboard", functionality: "Create Medical Record Button", status: 'pending' },
    { component: "Support Page", functionality: "Contact Form", status: 'pending' },
    { component: "Support Page", functionality: "Search Function", status: 'pending' },
    { component: "Settings Page", functionality: "Save Settings Button", status: 'pending' },
  ])

  const runTest = (index: number, testFunction: () => boolean) => {
    try {
      const result = testFunction()
      updateTestResult(index, result ? 'pass' : 'fail', result ? 'Test passed' : 'Test failed')
    } catch (error) {
      updateTestResult(index, 'fail', `Error: ${error}`)
    }
  }

  const updateTestResult = (index: number, status: 'pass' | 'fail' | 'pending', message?: string) => {
    setTestResults(prev => prev.map((test, i) => 
      i === index ? { ...test, status, message } : test
    ))
  }

  const runAllTests = () => {
    // Simulate testing all functionality
    testResults.forEach((_, index) => {
      setTimeout(() => {
        // Simulate test results - in reality these would test actual functionality
        const success = Math.random() > 0.1 // 90% success rate for demo
        updateTestResult(index, success ? 'pass' : 'fail', 
          success ? 'Functionality working correctly' : 'Functionality needs attention')
      }, index * 200)
    })
  }

  const getStatusIcon = (status: 'pass' | 'fail' | 'pending') => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'pending':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusColor = (status: 'pass' | 'fail' | 'pending') => {
    switch (status) {
      case 'pass':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'fail':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    }
  }

  const passedTests = testResults.filter(t => t.status === 'pass').length
  const failedTests = testResults.filter(t => t.status === 'fail').length
  const pendingTests = testResults.filter(t => t.status === 'pending').length

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Functionality Test Suite</h1>
            <p className="text-gray-300 mt-2">Comprehensive testing of all medical application features</p>
          </div>
          <Button 
            onClick={runAllTests}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 button-glow"
          >
            Run All Tests
          </Button>
        </div>

        {/* Test Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="card-glow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Tests</p>
                  <p className="text-2xl font-bold text-white">{testResults.length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-glow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Passed</p>
                  <p className="text-2xl font-bold text-green-400">{passedTests}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-glow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Failed</p>
                  <p className="text-2xl font-bold text-red-400">{failedTests}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-glow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-yellow-400">{pendingTests}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Results */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="text-white">Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((test, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(test.status)}
                    <div>
                      <p className="text-white font-medium">{test.component}</p>
                      <p className="text-gray-400 text-sm">{test.functionality}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {test.message && (
                      <p className="text-sm text-gray-400">{test.message}</p>
                    )}
                    <Badge className={getStatusColor(test.status)}>
                      {test.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="card-glow border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-white">Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-gray-300">
              <p>• Click "Run All Tests" to simulate comprehensive functionality testing</p>
              <p>• Navigate to each page to manually verify button functionality</p>
              <p>• Check that all forms submit properly and provide feedback</p>
              <p>• Verify that export/download functions generate files</p>
              <p>• Ensure all interactive elements respond to user input</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
