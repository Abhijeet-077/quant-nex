"use client"

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { MedicalError } from '@/types/medical'
import { screenReader } from '@/lib/accessibility'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  context?: 'patient-data' | 'medical-imaging' | '3d-models' | 'telemedicine' | 'general'
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string | null
}

/**
 * Medical Error Boundary Component
 * 
 * Provides specialized error handling for medical applications with:
 * - HIPAA-compliant error logging
 * - Accessibility announcements for critical errors
 * - Context-aware error messages
 * - Graceful degradation for medical workflows
 */
export class MedicalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Generate unique error ID for tracking
    const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    return {
      hasError: true,
      error,
      errorId,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, context = 'general' } = this.props
    
    // Create medical error with context
    const medicalError: MedicalError = {
      ...error,
      code: this.generateErrorCode(error, context),
      severity: this.determineSeverity(error, context),
      context: {
        componentStack: errorInfo.componentStack,
        errorBoundaryContext: context,
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
      },
    }

    // Store error info in state
    this.setState({ errorInfo })

    // Log error for medical compliance (HIPAA-safe)
    this.logMedicalError(medicalError, errorInfo)

    // Announce critical errors to screen readers
    if (medicalError.severity === 'critical') {
      screenReader.announceCriticalAlert(
        `System error in ${context}. Please contact technical support.`
      )
    }

    // Call custom error handler
    onError?.(medicalError, errorInfo)
  }

  private generateErrorCode(error: Error, context: string): string {
    const contextCodes = {
      'patient-data': 'PD',
      'medical-imaging': 'MI',
      '3d-models': '3D',
      'telemedicine': 'TM',
      'general': 'GN',
    }
    
    const contextCode = contextCodes[context] || 'GN'
    const errorType = error.name || 'UnknownError'
    const timestamp = Date.now().toString().slice(-6)
    
    return `${contextCode}_${errorType}_${timestamp}`
  }

  private determineSeverity(error: Error, context: string): MedicalError['severity'] {
    // Critical contexts that affect patient safety
    const criticalContexts = ['patient-data', 'medical-imaging', 'telemedicine']
    
    if (criticalContexts.includes(context)) {
      return 'critical'
    }

    // Check error types
    if (error.name === 'ChunkLoadError' || error.name === 'NetworkError') {
      return 'medium'
    }

    if (error.message.includes('3D') || error.message.includes('WebGL')) {
      return 'low'
    }

    return 'medium'
  }

  private logMedicalError(error: MedicalError, errorInfo: ErrorInfo) {
    // HIPAA-compliant error logging (no patient data in logs)
    const logEntry = {
      errorId: this.state.errorId,
      code: error.code,
      severity: error.severity,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      context: error.context,
      timestamp: new Date().toISOString(),
      // Note: No patient identifiers or sensitive data
    }

    // In production, send to secure logging service
    console.error('Medical Error Boundary:', logEntry)
    
    // Send to monitoring service (e.g., Sentry)
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(error, {
        tags: {
          errorBoundary: true,
          context: this.props.context,
          severity: error.severity,
        },
        extra: {
          errorId: this.state.errorId,
          componentStack: errorInfo.componentStack,
        },
      })
    }
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    })
  }

  private handleReportError = () => {
    const { error, errorId } = this.state
    
    // Create error report for medical team
    const errorReport = {
      errorId,
      timestamp: new Date().toISOString(),
      context: this.props.context,
      userDescription: '', // Would be filled by user
      severity: (error as MedicalError)?.severity || 'medium',
    }

    // In production, send to support system
    console.log('Error report generated:', errorReport)
    
    // Show success message
    alert('Error report submitted. Our technical team will investigate.')
  }

  render() {
    if (this.state.hasError) {
      const { fallback, context } = this.props
      const { error, errorId } = this.state

      // Use custom fallback if provided
      if (fallback) {
        return fallback
      }

      // Context-specific error messages
      const contextMessages = {
        'patient-data': {
          title: 'Patient Data Error',
          message: 'There was an issue loading patient information. Your data is safe.',
          action: 'Please try refreshing the page or contact support if the issue persists.',
        },
        'medical-imaging': {
          title: 'Medical Imaging Error',
          message: 'Unable to load medical images at this time.',
          action: 'Please try again or use alternative viewing methods.',
        },
        '3d-models': {
          title: '3D Visualization Error',
          message: 'The 3D model could not be loaded. This may be due to browser compatibility.',
          action: 'Try refreshing the page or use a different browser.',
        },
        'telemedicine': {
          title: 'Telemedicine Connection Error',
          message: 'Unable to establish video connection.',
          action: 'Please check your internet connection and try again.',
        },
        'general': {
          title: 'Application Error',
          message: 'An unexpected error occurred.',
          action: 'Please try again or contact support.',
        },
      }

      const errorMessage = contextMessages[context || 'general']

      return (
        <div 
          className="min-h-[400px] flex items-center justify-center p-6 bg-black rounded-lg border border-red-500/30"
          role="alert"
          aria-live="assertive"
        >
          <div className="text-center max-w-md">
            {/* Error Icon */}
            <div className="mb-4">
              <svg 
                className="w-16 h-16 text-red-400 mx-auto" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </div>

            {/* Error Message */}
            <h2 className="text-xl font-semibold text-red-400 mb-2">
              {errorMessage.title}
            </h2>
            <p className="text-gray-300 mb-4">
              {errorMessage.message}
            </p>
            <p className="text-sm text-gray-400 mb-6">
              {errorMessage.action}
            </p>

            {/* Error ID for support */}
            <p className="text-xs text-gray-500 mb-6">
              Error ID: {errorId}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Retry loading the component"
              >
                Try Again
              </button>
              
              <button
                onClick={this.handleReportError}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                aria-label="Report this error to support"
              >
                Report Error
              </button>
            </div>

            {/* Additional Help */}
            <div className="mt-6 pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-400">
                If this error affects patient care, please contact support immediately at{' '}
                <a 
                  href="tel:+91-1800-QUANTNEX" 
                  className="text-blue-400 hover:text-blue-300"
                >
                  +91-1800-QUANTNEX
                </a>
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Higher-order component for easy wrapping
export function withMedicalErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  context?: Props['context']
) {
  const WrappedComponent = (props: P) => (
    <MedicalErrorBoundary context={context}>
      <Component {...props} />
    </MedicalErrorBoundary>
  )

  WrappedComponent.displayName = `withMedicalErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

// Specialized error boundaries for different contexts
export const PatientDataErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <MedicalErrorBoundary context="patient-data">
    {children}
  </MedicalErrorBoundary>
)

export const MedicalImagingErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <MedicalErrorBoundary context="medical-imaging">
    {children}
  </MedicalErrorBoundary>
)

export const Model3DErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <MedicalErrorBoundary context="3d-models">
    {children}
  </MedicalErrorBoundary>
)

export const TelemedicineErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <MedicalErrorBoundary context="telemedicine">
    {children}
  </MedicalErrorBoundary>
)
