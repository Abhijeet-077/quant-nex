"use client"

import React, { Component, ErrorInfo, ReactNode } from 'react'
import * as Sentry from '@sentry/nextjs'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorId: string | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorId: null }
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, errorId: null }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to Sentry with medical application context
    const errorId = Sentry.withScope((scope) => {
      scope.setTag('component', 'error_boundary')
      scope.setTag('error_type', 'react_error')
      scope.setContext('error_boundary', {
        componentStack: errorInfo.componentStack,
        errorBoundary: this.constructor.name,
      })
      
      // Remove any potential PHI from error info
      const sanitizedErrorInfo = {
        ...errorInfo,
        componentStack: errorInfo.componentStack?.replace(
          /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, 
          '[EMAIL-REDACTED]'
        ),
      }
      
      scope.setContext('react_error_info', sanitizedErrorInfo)
      
      return Sentry.captureException(error)
    })

    this.setState({ errorId })

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    console.error('Error Boundary caught an error:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorId: null })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default medical application error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-black/40 backdrop-blur-sm rounded-xl border border-red-500/30 p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-500/20 rounded-full">
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-white mb-2">
              Medical System Error
            </h2>
            
            <p className="text-gray-300 mb-4">
              An unexpected error occurred in the medical application. 
              Patient data remains secure and unaffected.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-4 p-3 bg-red-900/20 rounded-lg border border-red-500/30">
                <p className="text-red-300 text-sm font-mono">
                  {this.state.error.message}
                </p>
              </div>
            )}
            
            {this.state.errorId && (
              <div className="mb-4 p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
                <p className="text-blue-300 text-xs">
                  Error ID: {this.state.errorId}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  This error has been automatically reported to our technical team.
                </p>
              </div>
            )}
            
            <div className="space-y-3">
              <Button
                onClick={this.handleRetry}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              
              <Button
                onClick={this.handleGoHome}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <Home className="h-4 w-4 mr-2" />
                Return to Dashboard
              </Button>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-500">
                If this error persists, please contact IT support.
                <br />
                All patient data remains secure and protected.
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Higher-order component for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

// Specialized error boundary for medical components
export function MedicalErrorBoundary({ 
  children, 
  componentName 
}: { 
  children: ReactNode
  componentName: string 
}) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Enhanced logging for medical components
        Sentry.withScope((scope) => {
          scope.setTag('medical_component', componentName)
          scope.setTag('error_type', 'medical_component_error')
          scope.setContext('medical_context', {
            component: componentName,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
          })
          Sentry.captureException(error)
        })
      }}
      fallback={
        <div className="p-4 bg-red-900/20 rounded-lg border border-red-500/30">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <h3 className="text-red-300 font-semibold">Medical Component Error</h3>
          </div>
          <p className="text-gray-300 text-sm">
            The {componentName} component encountered an error. 
            Please refresh the page or contact support if the issue persists.
          </p>
          <Button
            onClick={() => window.location.reload()}
            size="sm"
            className="mt-3 bg-red-600 hover:bg-red-700 text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Page
          </Button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}

// Hook for manual error reporting
export function useErrorReporting() {
  const reportError = (error: Error, context?: Record<string, any>) => {
    Sentry.withScope((scope) => {
      if (context) {
        scope.setContext('manual_report', context)
      }
      scope.setTag('error_type', 'manual_report')
      Sentry.captureException(error)
    })
  }

  const reportMessage = (message: string, level: 'info' | 'warning' | 'error' = 'error') => {
    Sentry.captureMessage(message, level)
  }

  return { reportError, reportMessage }
}
