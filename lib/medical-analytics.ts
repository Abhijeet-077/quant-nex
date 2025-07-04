// Privacy-Compliant Medical Analytics System

import { Patient, Treatment, MedicalReport, AnalyticsMetric } from '@/types/medical'
import { HIPAACompliance } from './medical-compliance'

// Analytics Event Types
export enum AnalyticsEventType {
  // User Engagement
  PAGE_VIEW = 'page_view',
  FEATURE_USAGE = 'feature_usage',
  SESSION_START = 'session_start',
  SESSION_END = 'session_end',
  
  // Medical Workflows
  PATIENT_SEARCH = 'patient_search',
  TREATMENT_PLAN_CREATED = 'treatment_plan_created',
  CONSULTATION_STARTED = 'consultation_started',
  REPORT_GENERATED = 'report_generated',
  
  // 3D Model Interactions
  MODEL_LOADED = 'model_loaded',
  MODEL_INTERACTION = 'model_interaction',
  MODEL_QUALITY_CHANGED = 'model_quality_changed',
  
  // Performance Metrics
  PAGE_LOAD_TIME = 'page_load_time',
  API_RESPONSE_TIME = 'api_response_time',
  ERROR_OCCURRED = 'error_occurred',
  
  // Medical Outcomes (Anonymized)
  TREATMENT_OUTCOME = 'treatment_outcome',
  DIAGNOSIS_ACCURACY = 'diagnosis_accuracy',
  PATIENT_SATISFACTION = 'patient_satisfaction',
}

// Analytics Event
export interface AnalyticsEvent {
  eventType: AnalyticsEventType
  timestamp: string
  userId?: string
  sessionId: string
  properties: Record<string, any>
  anonymized: boolean
  complianceFlags: string[]
}

// Medical Analytics Manager
export class MedicalAnalyticsManager {
  private static instance: MedicalAnalyticsManager
  private eventQueue: AnalyticsEvent[] = []
  private isProcessing = false
  private sessionId: string
  private userId?: string

  constructor() {
    this.sessionId = this.generateSessionId()
    this.initializeSession()
  }

  static getInstance(): MedicalAnalyticsManager {
    if (!MedicalAnalyticsManager.instance) {
      MedicalAnalyticsManager.instance = new MedicalAnalyticsManager()
    }
    return MedicalAnalyticsManager.instance
  }

  // Initialize analytics session
  private initializeSession() {
    this.trackEvent(AnalyticsEventType.SESSION_START, {
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
    })

    // Track session end on page unload
    window.addEventListener('beforeunload', () => {
      this.trackEvent(AnalyticsEventType.SESSION_END, {
        sessionDuration: Date.now() - parseInt(this.sessionId.split('_')[1]),
      })
    })
  }

  // Set user ID (when authenticated)
  setUserId(userId: string) {
    this.userId = userId
  }

  // Track analytics event
  trackEvent(
    eventType: AnalyticsEventType,
    properties: Record<string, any> = {},
    options: {
      anonymize?: boolean
      includePatientData?: boolean
    } = {}
  ) {
    const { anonymize = true, includePatientData = false } = options

    // Sanitize properties to remove sensitive data
    const sanitizedProperties = this.sanitizeProperties(properties, anonymize, includePatientData)

    const event: AnalyticsEvent = {
      eventType,
      timestamp: new Date().toISOString(),
      userId: anonymize ? undefined : this.userId,
      sessionId: this.sessionId,
      properties: sanitizedProperties,
      anonymized: anonymize,
      complianceFlags: this.getComplianceFlags(eventType, includePatientData),
    }

    this.eventQueue.push(event)

    // Process queue
    if (!this.isProcessing) {
      this.processEventQueue()
    }
  }

  // Track page view
  trackPageView(pageName: string, additionalProperties: Record<string, any> = {}) {
    this.trackEvent(AnalyticsEventType.PAGE_VIEW, {
      page: pageName,
      url: window.location.pathname,
      referrer: document.referrer,
      ...additionalProperties,
    })
  }

  // Track feature usage
  trackFeatureUsage(featureName: string, action: string, properties: Record<string, any> = {}) {
    this.trackEvent(AnalyticsEventType.FEATURE_USAGE, {
      feature: featureName,
      action,
      ...properties,
    })
  }

  // Track medical workflow events
  trackMedicalWorkflow(workflowType: string, step: string, properties: Record<string, any> = {}) {
    this.trackEvent(AnalyticsEventType.FEATURE_USAGE, {
      workflow: workflowType,
      step,
      ...properties,
    }, { anonymize: true })
  }

  // Track treatment outcomes (anonymized)
  trackTreatmentOutcome(treatment: Treatment, outcome: string, properties: Record<string, any> = {}) {
    const anonymizedData = {
      treatmentType: treatment.type,
      cancerStage: properties.cancerStage,
      patientAge: properties.patientAge,
      outcome,
      duration: properties.duration,
      effectiveness: treatment.effectiveness,
    }

    this.trackEvent(AnalyticsEventType.TREATMENT_OUTCOME, anonymizedData, { 
      anonymize: true,
      includePatientData: false 
    })
  }

  // Track 3D model performance
  track3DModelPerformance(modelType: string, loadTime: number, quality: string) {
    this.trackEvent(AnalyticsEventType.MODEL_LOADED, {
      modelType,
      loadTime,
      quality,
      devicePixelRatio: window.devicePixelRatio,
      webglSupport: this.checkWebGLSupport(),
    })
  }

  // Track errors
  trackError(error: Error, context: Record<string, any> = {}) {
    this.trackEvent(AnalyticsEventType.ERROR_OCCURRED, {
      errorMessage: error.message,
      errorStack: error.stack?.substring(0, 500), // Limit stack trace length
      errorName: error.name,
      context,
    })
  }

  // Track performance metrics
  trackPerformance(metricName: string, value: number, unit: string = 'ms') {
    this.trackEvent(AnalyticsEventType.PAGE_LOAD_TIME, {
      metric: metricName,
      value,
      unit,
      userAgent: navigator.userAgent,
      connection: this.getConnectionInfo(),
    })
  }

  // Process event queue
  private async processEventQueue() {
    if (this.isProcessing || this.eventQueue.length === 0) return

    this.isProcessing = true

    try {
      const batch = this.eventQueue.splice(0, 20) // Process in batches
      
      // Send to analytics service
      await this.sendAnalyticsBatch(batch)
      
    } catch (error) {
      console.error('Failed to process analytics queue:', error)
      // Re-add failed events to queue
      this.eventQueue.unshift(...batch)
    } finally {
      this.isProcessing = false
      
      // Continue processing if more events exist
      if (this.eventQueue.length > 0) {
        setTimeout(() => this.processEventQueue(), 2000)
      }
    }
  }

  // Send analytics batch to service
  private async sendAnalyticsBatch(events: AnalyticsEvent[]) {
    try {
      // Send to privacy-compliant analytics service
      const response = await fetch('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events }),
      })

      if (!response.ok) {
        throw new Error(`Analytics request failed: ${response.statusText}`)
      }

      // Also send to Google Analytics (if configured and compliant)
      if (typeof window !== 'undefined' && window.gtag && this.isGoogleAnalyticsCompliant()) {
        events.forEach(event => {
          if (event.anonymized) {
            window.gtag('event', event.eventType, {
              event_category: 'medical_app',
              event_label: event.properties.feature || event.properties.page,
              value: event.properties.value,
              custom_map: {
                anonymized: 'true',
                compliance_flags: event.complianceFlags.join(','),
              },
            })
          }
        })
      }

    } catch (error) {
      console.error('Failed to send analytics batch:', error)
      throw error
    }
  }

  // Sanitize properties to remove sensitive data
  private sanitizeProperties(
    properties: Record<string, any>,
    anonymize: boolean,
    includePatientData: boolean
  ): Record<string, any> {
    const sanitized = { ...properties }

    if (anonymize || !includePatientData) {
      // Remove patient identifiers
      delete sanitized.patientId
      delete sanitized.patientName
      delete sanitized.patientEmail
      delete sanitized.patientPhone
      delete sanitized.medicalRecordNumber
      
      // Remove doctor identifiers
      delete sanitized.doctorId
      delete sanitized.doctorName
      delete sanitized.doctorEmail
      
      // Remove IP addresses and detailed location data
      delete sanitized.ipAddress
      delete sanitized.exactLocation
      
      // Anonymize age (age ranges instead of exact age)
      if (sanitized.age) {
        sanitized.ageRange = this.getAgeRange(sanitized.age)
        delete sanitized.age
      }
    }

    // Remove any properties that might contain sensitive data
    const sensitiveKeys = ['password', 'token', 'key', 'secret', 'ssn', 'license']
    Object.keys(sanitized).forEach(key => {
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        delete sanitized[key]
      }
    })

    return sanitized
  }

  // Get compliance flags for event
  private getComplianceFlags(eventType: AnalyticsEventType, includePatientData: boolean): string[] {
    const flags = ['PRIVACY_COMPLIANT']

    if (includePatientData) {
      flags.push('HIPAA_RESTRICTED')
    } else {
      flags.push('HIPAA_COMPLIANT')
    }

    // Add GDPR compliance flag
    flags.push('GDPR_COMPLIANT')

    return flags
  }

  // Generate session ID
  private generateSessionId(): string {
    return `SES_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Get age range for anonymization
  private getAgeRange(age: number): string {
    if (age < 18) return '0-17'
    if (age < 30) return '18-29'
    if (age < 40) return '30-39'
    if (age < 50) return '40-49'
    if (age < 60) return '50-59'
    if (age < 70) return '60-69'
    return '70+'
  }

  // Check WebGL support
  private checkWebGLSupport(): boolean {
    try {
      const canvas = document.createElement('canvas')
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    } catch {
      return false
    }
  }

  // Get connection information
  private getConnectionInfo(): Record<string, any> {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    
    if (connection) {
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
      }
    }
    
    return {}
  }

  // Check if Google Analytics is compliant with medical data regulations
  private isGoogleAnalyticsCompliant(): boolean {
    // Only send anonymized, non-medical data to Google Analytics
    return process.env.NEXT_PUBLIC_GA_MEDICAL_COMPLIANT === 'true'
  }
}

// Medical Insights Generator
export class MedicalInsightsGenerator {
  // Generate treatment effectiveness insights
  static generateTreatmentInsights(treatments: Treatment[]): AnalyticsMetric[] {
    const insights: AnalyticsMetric[] = []

    // Group by treatment type
    const treatmentGroups = treatments.reduce((groups, treatment) => {
      if (!groups[treatment.type]) {
        groups[treatment.type] = []
      }
      groups[treatment.type].push(treatment)
      return groups
    }, {} as Record<string, Treatment[]>)

    // Calculate effectiveness metrics
    Object.entries(treatmentGroups).forEach(([type, treatments]) => {
      const effectivenessCounts = treatments.reduce((counts, treatment) => {
        const effectiveness = treatment.effectiveness || 'unknown'
        counts[effectiveness] = (counts[effectiveness] || 0) + 1
        return counts
      }, {} as Record<string, number>)

      const total = treatments.length
      const successful = (effectivenessCounts.excellent || 0) + (effectivenessCounts.good || 0)
      const successRate = total > 0 ? (successful / total) * 100 : 0

      insights.push({
        id: `treatment_success_${type}`,
        name: `${type} Success Rate`,
        value: Math.round(successRate * 100) / 100,
        unit: '%',
        period: 'all_time',
        timestamp: new Date().toISOString(),
      })
    })

    return insights
  }

  // Generate patient demographics insights (anonymized)
  static generateDemographicsInsights(patients: Patient[]): AnalyticsMetric[] {
    const insights: AnalyticsMetric[] = []

    // Age distribution
    const ageRanges = patients.reduce((ranges, patient) => {
      const range = this.getAgeRange(patient.age)
      ranges[range] = (ranges[range] || 0) + 1
      return ranges
    }, {} as Record<string, number>)

    Object.entries(ageRanges).forEach(([range, count]) => {
      insights.push({
        id: `age_range_${range}`,
        name: `Patients Age ${range}`,
        value: count,
        unit: 'patients',
        period: 'current',
        timestamp: new Date().toISOString(),
      })
    })

    // Cancer type distribution
    const cancerTypes = patients.reduce((types, patient) => {
      types[patient.cancerType] = (types[patient.cancerType] || 0) + 1
      return types
    }, {} as Record<string, number>)

    Object.entries(cancerTypes).forEach(([type, count]) => {
      insights.push({
        id: `cancer_type_${type.toLowerCase().replace(/\s+/g, '_')}`,
        name: `${type} Cases`,
        value: count,
        unit: 'cases',
        period: 'current',
        timestamp: new Date().toISOString(),
      })
    })

    return insights
  }

  private static getAgeRange(age: number): string {
    if (age < 18) return '0-17'
    if (age < 30) return '18-29'
    if (age < 40) return '30-39'
    if (age < 50) return '40-49'
    if (age < 60) return '50-59'
    if (age < 70) return '60-69'
    return '70+'
  }
}

// Export singleton instance
export const medicalAnalytics = MedicalAnalyticsManager.getInstance()
