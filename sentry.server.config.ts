import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  // Adjust this value in production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Performance monitoring
  profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Environment configuration
  environment: process.env.NODE_ENV || 'development',
  
  // Release tracking
  release: process.env.npm_package_version || '1.0.0',
  
  // Server-specific configuration for medical applications
  beforeSend(event, hint) {
    // Enhanced server-side filtering for medical data
    if (event.exception) {
      // Remove PHI from server errors
      if (event.message) {
        event.message = sanitizeServerErrorMessage(event.message)
      }
      
      // Sanitize request data
      if (event.request) {
        event.request = sanitizeRequestData(event.request)
      }
      
      // Remove sensitive data from extra context
      if (event.extra) {
        event.extra = sanitizeServerData(event.extra)
      }
      
      // Sanitize user context for server-side
      if (event.user) {
        event.user = {
          id: event.user.id ? '[USER-ID-REDACTED]' : undefined,
          role: event.user.role,
          department: event.user.department,
          // Remove all other PII
        }
      }
    }
    
    return event
  },
  
  // Custom tags for medical server
  initialScope: {
    tags: {
      component: 'medical-backend',
      application: 'quant-nex',
      compliance: 'hipaa',
      server: 'nextjs'
    }
  },
  
  // Server-side integrations
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app: undefined }),
  ],
  
  // Error filtering for server
  ignoreErrors: [
    // Database connection errors that are handled
    'Connection terminated',
    'Connection lost',
    
    // Authentication errors (these are expected)
    'Invalid credentials',
    'Authentication required',
    'Insufficient permissions',
    
    // Rate limiting (expected behavior)
    'Rate limit exceeded',
    
    // Validation errors (user input errors)
    'Validation failed',
    'Invalid input data',
  ],
})

// Server-side utility functions
function sanitizeServerErrorMessage(message: string): string {
  return message
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN-REDACTED]')
    .replace(/\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/g, '[CARD-REDACTED]')
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL-REDACTED]')
    .replace(/\b\d{10,}\b/g, '[PHONE-REDACTED]')
    .replace(/\bPT-\d{4}-\d+\b/g, '[MRN-REDACTED]')
    .replace(/password[=:]\s*[^\s,}]+/gi, 'password=[REDACTED]')
    .replace(/token[=:]\s*[^\s,}]+/gi, 'token=[REDACTED]')
    .replace(/key[=:]\s*[^\s,}]+/gi, 'key=[REDACTED]')
}

function sanitizeRequestData(request: any): any {
  const sanitized = { ...request }
  
  // Remove sensitive headers
  if (sanitized.headers) {
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key', 'x-auth-token']
    for (const header of sensitiveHeaders) {
      if (sanitized.headers[header]) {
        sanitized.headers[header] = '[REDACTED]'
      }
    }
  }
  
  // Remove sensitive query parameters
  if (sanitized.query_string) {
    sanitized.query_string = sanitized.query_string
      .replace(/([?&])(password|token|key|ssn|mrn)=[^&]*/gi, '$1$2=[REDACTED]')
  }
  
  // Remove request body if it contains sensitive data
  if (sanitized.data) {
    sanitized.data = sanitizeServerData(sanitized.data)
  }
  
  return sanitized
}

function sanitizeServerData(data: any): any {
  if (typeof data === 'string') {
    return sanitizeServerErrorMessage(data)
  }
  
  if (Array.isArray(data)) {
    return data.map(sanitizeServerData)
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized: any = {}
    
    for (const [key, value] of Object.entries(data)) {
      // Skip sensitive fields entirely
      if (serverSensitiveFields.includes(key.toLowerCase())) {
        sanitized[key] = '[REDACTED]'
        continue
      }
      
      sanitized[key] = sanitizeServerData(value)
    }
    
    return sanitized
  }
  
  return data
}

// Server-side sensitive fields
const serverSensitiveFields = [
  'password',
  'password_hash',
  'ssn',
  'social_security_number',
  'medical_history',
  'diagnosis',
  'treatment_notes',
  'medication_list',
  'allergies',
  'phone',
  'email',
  'address',
  'dob',
  'date_of_birth',
  'emergency_contact',
  'insurance_number',
  'policy_number',
  'genetic_data',
  'lab_results',
  'pathology_report',
  'radiology_report',
  'authorization',
  'token',
  'api_key',
  'secret',
  'private_key',
  'session_id',
  'csrf_token',
]

// Export server-side utility functions
export function captureServerError(error: Error, context?: Record<string, any>) {
  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext('error_context', sanitizeServerData(context))
    }
    scope.setTag('error_type', 'server_error')
    Sentry.captureException(error)
  })
}

export function captureAPIError(
  endpoint: string, 
  method: string, 
  error: Error, 
  userId?: string,
  context?: Record<string, any>
) {
  Sentry.withScope((scope) => {
    scope.setTag('api_endpoint', endpoint)
    scope.setTag('http_method', method)
    scope.setTag('error_type', 'api_error')
    
    if (userId) {
      scope.setUser({ id: '[USER-ID-REDACTED]' })
    }
    
    if (context) {
      scope.setContext('api_context', sanitizeServerData(context))
    }
    
    Sentry.captureException(error)
  })
}

export function captureDatabaseError(
  operation: string, 
  table: string, 
  error: Error,
  context?: Record<string, any>
) {
  Sentry.withScope((scope) => {
    scope.setTag('db_operation', operation)
    scope.setTag('db_table', table)
    scope.setTag('error_type', 'database_error')
    
    if (context) {
      scope.setContext('db_context', sanitizeServerData(context))
    }
    
    Sentry.captureException(error)
  })
}

export function captureSecurityEvent(
  event: string,
  severity: 'low' | 'medium' | 'high' | 'critical',
  userId?: string,
  context?: Record<string, any>
) {
  Sentry.withScope((scope) => {
    scope.setTag('security_event', event)
    scope.setTag('severity', severity)
    scope.setTag('error_type', 'security_event')
    scope.setLevel(severity === 'critical' ? 'fatal' : severity === 'high' ? 'error' : 'warning')
    
    if (userId) {
      scope.setUser({ id: '[USER-ID-REDACTED]' })
    }
    
    if (context) {
      scope.setContext('security_context', sanitizeServerData(context))
    }
    
    Sentry.captureMessage(`Security Event: ${event}`, scope.getLevel())
  })
}

export function capturePerformanceIssue(
  operation: string,
  duration: number,
  threshold: number,
  context?: Record<string, any>
) {
  if (duration > threshold) {
    Sentry.withScope((scope) => {
      scope.setTag('performance_issue', operation)
      scope.setTag('error_type', 'performance')
      scope.setContext('performance_context', {
        operation,
        duration,
        threshold,
        ...context ? sanitizeServerData(context) : {},
      })
      
      Sentry.captureMessage(`Performance Issue: ${operation} took ${duration}ms (threshold: ${threshold}ms)`, 'warning')
    })
  }
}
