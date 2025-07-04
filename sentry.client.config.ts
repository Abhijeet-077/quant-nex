import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Performance monitoring
  profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Session replay for debugging
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.01 : 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // Environment configuration
  environment: process.env.NODE_ENV || 'development',
  
  // Release tracking
  release: process.env.npm_package_version || '1.0.0',
  
  // Medical application specific configuration
  beforeSend(event, hint) {
    // Filter out sensitive medical data from error reports
    if (event.exception) {
      const error = hint.originalException
      
      // Remove PHI (Protected Health Information) from error messages
      if (event.message) {
        event.message = sanitizeErrorMessage(event.message)
      }
      
      // Remove sensitive data from extra context
      if (event.extra) {
        event.extra = sanitizeSentryData(event.extra)
      }
      
      // Remove sensitive data from user context
      if (event.user) {
        event.user = {
          id: event.user.id,
          role: event.user.role,
          department: event.user.department,
          // Remove email, name, and other PII
        }
      }
    }
    
    return event
  },
  
  // Custom tags for medical application
  initialScope: {
    tags: {
      component: 'medical-frontend',
      application: 'quant-nex',
      compliance: 'hipaa'
    }
  },
  
  // Integration configuration
  integrations: [
    new Sentry.Replay({
      // Mask all text and input content for privacy
      maskAllText: true,
      maskAllInputs: true,
      blockAllMedia: true,
    }),
    new Sentry.BrowserTracing({
      // Performance monitoring for medical workflows
      tracePropagationTargets: [
        'localhost',
        /^https:\/\/.*\.quantnex\.com/,
        /^https:\/\/.*\.supabase\.co/,
      ],
    }),
  ],
  
  // Error filtering
  ignoreErrors: [
    // Browser extensions
    'Non-Error promise rejection captured',
    'ResizeObserver loop limit exceeded',
    'Script error.',
    
    // Network errors that are not actionable
    'NetworkError',
    'Failed to fetch',
    'Load failed',
    
    // Medical device integration errors (if any)
    'Device not found',
    'Permission denied',
  ],
  
  // URL filtering for privacy
  denyUrls: [
    // Don't capture errors from browser extensions
    /extensions\//i,
    /^chrome:\/\//i,
    /^moz-extension:\/\//i,
  ],
})

// Utility function to sanitize error messages
function sanitizeErrorMessage(message: string): string {
  // Remove potential PHI patterns
  return message
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN-REDACTED]') // SSN
    .replace(/\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/g, '[CARD-REDACTED]') // Credit card
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL-REDACTED]') // Email
    .replace(/\b\d{10,}\b/g, '[PHONE-REDACTED]') // Phone numbers
    .replace(/\bPT-\d{4}-\d+\b/g, '[MRN-REDACTED]') // Medical record numbers
}

// Utility function to sanitize Sentry data
function sanitizeSentryData(data: any): any {
  if (typeof data === 'string') {
    return sanitizeErrorMessage(data)
  }
  
  if (Array.isArray(data)) {
    return data.map(sanitizeSentryData)
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized: any = {}
    
    for (const [key, value] of Object.entries(data)) {
      // Skip sensitive fields entirely
      if (sensitiveFields.includes(key.toLowerCase())) {
        sanitized[key] = '[REDACTED]'
        continue
      }
      
      sanitized[key] = sanitizeSentryData(value)
    }
    
    return sanitized
  }
  
  return data
}

// List of sensitive field names to redact
const sensitiveFields = [
  'password',
  'ssn',
  'social',
  'medical_history',
  'diagnosis',
  'treatment',
  'medication',
  'allergy',
  'phone',
  'email',
  'address',
  'dob',
  'date_of_birth',
  'emergency_contact',
  'insurance',
  'genetic',
  'lab_result',
  'pathology',
  'radiology',
]

// Export utility functions for manual error reporting
export function captureUserAction(action: string, context?: Record<string, any>) {
  Sentry.addBreadcrumb({
    message: action,
    category: 'user-action',
    level: 'info',
    data: context ? sanitizeSentryData(context) : undefined,
  })
}

export function captureMedicalEvent(event: string, patientId?: string, context?: Record<string, any>) {
  Sentry.addBreadcrumb({
    message: event,
    category: 'medical-event',
    level: 'info',
    data: {
      patientId: patientId ? '[PATIENT-ID-REDACTED]' : undefined,
      ...context ? sanitizeSentryData(context) : {},
    },
  })
}

export function capturePerformanceMetric(metric: string, value: number, unit: string) {
  Sentry.addBreadcrumb({
    message: `Performance: ${metric}`,
    category: 'performance',
    level: 'info',
    data: {
      metric,
      value,
      unit,
      timestamp: Date.now(),
    },
  })
}
