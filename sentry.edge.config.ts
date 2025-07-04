import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  // Lower sampling rate for edge functions
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.05 : 0.5,
  
  // Environment configuration
  environment: process.env.NODE_ENV || 'development',
  
  // Release tracking
  release: process.env.npm_package_version || '1.0.0',
  
  // Edge-specific configuration
  beforeSend(event, hint) {
    // Basic sanitization for edge functions
    if (event.message) {
      event.message = sanitizeEdgeMessage(event.message)
    }
    
    if (event.extra) {
      event.extra = sanitizeEdgeData(event.extra)
    }
    
    return event
  },
  
  // Custom tags for edge functions
  initialScope: {
    tags: {
      component: 'medical-edge',
      application: 'quant-nex',
      compliance: 'hipaa',
      runtime: 'edge'
    }
  },
  
  // Minimal integrations for edge
  integrations: [],
  
  // Error filtering for edge functions
  ignoreErrors: [
    'Network request failed',
    'Fetch failed',
    'AbortError',
  ],
})

function sanitizeEdgeMessage(message: string): string {
  return message
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL-REDACTED]')
    .replace(/\bPT-\d{4}-\d+\b/g, '[MRN-REDACTED]')
    .replace(/token[=:]\s*[^\s,}]+/gi, 'token=[REDACTED]')
}

function sanitizeEdgeData(data: any): any {
  if (typeof data === 'string') {
    return sanitizeEdgeMessage(data)
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(data)) {
      if (['authorization', 'token', 'key', 'password'].includes(key.toLowerCase())) {
        sanitized[key] = '[REDACTED]'
      } else {
        sanitized[key] = sanitizeEdgeData(value)
      }
    }
    return sanitized
  }
  
  return data
}
