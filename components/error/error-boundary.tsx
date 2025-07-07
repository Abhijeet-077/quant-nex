"use client"

import { Component, ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: any
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({ error, errorInfo })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full bg-slate-800 border-red-500/50">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-red-900/20 rounded-full w-fit">
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
              <CardTitle className="text-red-400">Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 text-center">
                We encountered an unexpected error. Our team has been notified and is working on a fix.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="bg-slate-900/50 p-3 rounded border border-slate-700">
                  <summary className="text-sm text-gray-400 cursor-pointer mb-2">
                    Error Details (Development)
                  </summary>
                  <pre className="text-xs text-red-300 overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
              
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => window.location.reload()}
                  className="btn-glow-primary"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload Page
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/'}
                  className="glow-hover bg-transparent"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </div>
              
              <div className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const errorReport = {
                      error: this.state.error?.toString(),
                      stack: this.state.error?.stack,
                      userAgent: navigator.userAgent,
                      timestamp: new Date().toISOString(),
                      url: window.location.href,
                    }
                    console.log('Error Report:', errorReport)
                    // In a real app, send this to your error reporting service
                  }}
                  className="text-gray-400 hover:text-gray-300"
                >
                  <Bug className="h-4 w-4 mr-2" />
                  Report Issue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export function ErrorFallback({ 
  error, 
  resetError, 
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again."
}: {
  error?: Error
  resetError?: () => void
  title?: string
  description?: string
}) {
  return (
    <Card className="bg-slate-800 border-red-500/50">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-red-900/20 rounded-full w-fit">
          <AlertTriangle className="h-6 w-6 text-red-400" />
        </div>
        <CardTitle className="text-red-400">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-300 text-center text-sm">{description}</p>
        
        {process.env.NODE_ENV === 'development' && error && (
          <details className="bg-slate-900/50 p-3 rounded border border-slate-700">
            <summary className="text-sm text-gray-400 cursor-pointer mb-2">
              Error Details
            </summary>
            <pre className="text-xs text-red-300 overflow-auto max-h-32">
              {error.toString()}
            </pre>
          </details>
        )}
        
        <div className="flex gap-2 justify-center">
          {resetError && (
            <Button onClick={resetError} size="sm" className="btn-glow-primary">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="glow-hover bg-transparent"
          >
            Reload Page
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function NetworkErrorFallback({ onRetry }: { onRetry?: () => void }) {
  return (
    <Card className="bg-slate-800 border-yellow-500/50">
      <CardContent className="p-6 text-center">
        <div className="mx-auto mb-4 p-3 bg-yellow-900/20 rounded-full w-fit">
          <AlertTriangle className="h-6 w-6 text-yellow-400" />
        </div>
        <h3 className="text-yellow-400 font-medium mb-2">Connection Error</h3>
        <p className="text-gray-300 text-sm mb-4">
          Unable to connect to the server. Please check your internet connection.
        </p>
        {onRetry && (
          <Button onClick={onRetry} size="sm" className="btn-glow-accent">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
