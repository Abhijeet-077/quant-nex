// Medical Compliance and Audit Logging System
// HIPAA, GDPR, and Indian Medical Data Protection Compliance

import { Patient, MedicalProfessional } from '@/types/medical'

// Audit Event Types
export enum AuditEventType {
  // Patient Data Access
  PATIENT_VIEW = 'patient_view',
  PATIENT_CREATE = 'patient_create',
  PATIENT_UPDATE = 'patient_update',
  PATIENT_DELETE = 'patient_delete',
  PATIENT_EXPORT = 'patient_export',
  
  // Medical Records
  RECORD_VIEW = 'record_view',
  RECORD_CREATE = 'record_create',
  RECORD_UPDATE = 'record_update',
  RECORD_DELETE = 'record_delete',
  RECORD_SHARE = 'record_share',
  
  // Authentication & Authorization
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAILURE = 'login_failure',
  LOGOUT = 'logout',
  PERMISSION_DENIED = 'permission_denied',
  
  // System Events
  DATA_BREACH_ATTEMPT = 'data_breach_attempt',
  UNAUTHORIZED_ACCESS = 'unauthorized_access',
  SYSTEM_ERROR = 'system_error',
  
  // Compliance Events
  DATA_EXPORT_REQUEST = 'data_export_request',
  DATA_DELETION_REQUEST = 'data_deletion_request',
  CONSENT_GIVEN = 'consent_given',
  CONSENT_WITHDRAWN = 'consent_withdrawn',
}

// Audit Event Severity
export enum AuditSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Audit Log Entry
export interface AuditLogEntry {
  id: string
  timestamp: string
  eventType: AuditEventType
  severity: AuditSeverity
  userId: string
  userRole: string
  patientId?: string
  resourceId?: string
  resourceType?: string
  action: string
  outcome: 'success' | 'failure' | 'partial'
  ipAddress: string
  userAgent: string
  sessionId: string
  details?: Record<string, any>
  complianceFlags: string[]
}

// Medical Compliance Manager
export class MedicalComplianceManager {
  private static instance: MedicalComplianceManager
  private auditQueue: AuditLogEntry[] = []
  private isProcessing = false

  static getInstance(): MedicalComplianceManager {
    if (!MedicalComplianceManager.instance) {
      MedicalComplianceManager.instance = new MedicalComplianceManager()
    }
    return MedicalComplianceManager.instance
  }

  // Log audit event
  async logAuditEvent(event: Omit<AuditLogEntry, 'id' | 'timestamp' | 'ipAddress' | 'userAgent' | 'sessionId'>) {
    const auditEntry: AuditLogEntry = {
      ...event,
      id: this.generateAuditId(),
      timestamp: new Date().toISOString(),
      ipAddress: await this.getClientIP(),
      userAgent: this.sanitizeUserAgent(navigator.userAgent),
      sessionId: this.getSessionId(),
    }

    // Add to queue for processing
    this.auditQueue.push(auditEntry)

    // Process queue if not already processing
    if (!this.isProcessing) {
      this.processAuditQueue()
    }

    // For critical events, send immediately
    if (event.severity === AuditSeverity.CRITICAL) {
      await this.sendAuditEntry(auditEntry)
    }

    return auditEntry.id
  }

  // Process audit queue
  private async processAuditQueue() {
    if (this.isProcessing || this.auditQueue.length === 0) return

    this.isProcessing = true

    try {
      const batch = this.auditQueue.splice(0, 10) // Process in batches of 10
      
      for (const entry of batch) {
        await this.sendAuditEntry(entry)
      }
    } catch (error) {
      console.error('Failed to process audit queue:', error)
      // Re-add failed entries to queue
      this.auditQueue.unshift(...batch)
    } finally {
      this.isProcessing = false
      
      // Continue processing if more entries exist
      if (this.auditQueue.length > 0) {
        setTimeout(() => this.processAuditQueue(), 1000)
      }
    }
  }

  // Send audit entry to secure logging service
  private async sendAuditEntry(entry: AuditLogEntry) {
    try {
      // In production, send to secure audit logging service
      const response = await fetch('/api/audit/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Audit-Token': process.env.NEXT_PUBLIC_AUDIT_TOKEN || '',
        },
        body: JSON.stringify(entry),
      })

      if (!response.ok) {
        throw new Error(`Audit logging failed: ${response.statusText}`)
      }

      // Also log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('AUDIT LOG:', entry)
      }
    } catch (error) {
      console.error('Failed to send audit entry:', error)
      
      // Store in localStorage as backup
      this.storeAuditBackup(entry)
      throw error
    }
  }

  // Store audit entry in localStorage as backup
  private storeAuditBackup(entry: AuditLogEntry) {
    try {
      const backup = localStorage.getItem('audit-backup')
      const entries = backup ? JSON.parse(backup) : []
      entries.push(entry)
      
      // Keep only last 100 entries
      if (entries.length > 100) {
        entries.splice(0, entries.length - 100)
      }
      
      localStorage.setItem('audit-backup', JSON.stringify(entries))
    } catch (error) {
      console.error('Failed to store audit backup:', error)
    }
  }

  // Generate unique audit ID
  private generateAuditId(): string {
    return `AUD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Get client IP (in production, this would be handled server-side)
  private async getClientIP(): Promise<string> {
    try {
      // In production, get from server-side headers
      return 'masked' // Mask IP for privacy
    } catch {
      return 'unknown'
    }
  }

  // Sanitize user agent for logging
  private sanitizeUserAgent(userAgent: string): string {
    // Remove potentially sensitive information
    return userAgent.replace(/\([^)]*\)/g, '(...)').substring(0, 200)
  }

  // Get session ID
  private getSessionId(): string {
    // In production, get from authentication session
    return sessionStorage.getItem('session-id') || 'unknown'
  }
}

// HIPAA Compliance Utilities
export class HIPAACompliance {
  // Check if data access is authorized
  static isAuthorizedAccess(
    user: MedicalProfessional,
    patient: Patient,
    action: string
  ): boolean {
    // Minimum necessary standard - user should only access data necessary for their role
    const rolePermissions = {
      doctor: ['read', 'write', 'delete'],
      nurse: ['read', 'write'],
      admin: ['read', 'write', 'delete', 'export'],
      researcher: ['read'], // Only anonymized data
    }

    const allowedActions = rolePermissions[user.role] || []
    return allowedActions.includes(action)
  }

  // Anonymize patient data for research/analytics
  static anonymizePatientData(patient: Patient): Partial<Patient> {
    return {
      age: patient.age,
      gender: patient.gender,
      cancerType: patient.cancerType,
      stage: patient.stage,
      status: patient.status,
      treatmentProgress: patient.treatmentProgress,
      // Remove all identifying information
    }
  }

  // Generate data breach notification
  static generateBreachNotification(incident: {
    type: string
    affectedPatients: number
    dataTypes: string[]
    discoveredAt: Date
    containedAt?: Date
  }) {
    return {
      id: `BREACH_${Date.now()}`,
      ...incident,
      reportedAt: new Date(),
      status: 'reported',
      requiresNotification: incident.affectedPatients > 500, // HIPAA threshold
    }
  }
}

// Data Retention Policy
export class DataRetentionPolicy {
  // Medical record retention periods (in years)
  private static retentionPeriods = {
    adult_medical_records: 7,
    pediatric_medical_records: 25,
    mental_health_records: 7,
    audit_logs: 7,
    system_logs: 2,
    user_sessions: 1,
  }

  // Check if data should be retained
  static shouldRetainData(dataType: string, createdAt: Date): boolean {
    const retentionYears = this.retentionPeriods[dataType] || 7
    const retentionDate = new Date(createdAt)
    retentionDate.setFullYear(retentionDate.getFullYear() + retentionYears)
    
    return new Date() < retentionDate
  }

  // Get data expiration date
  static getExpirationDate(dataType: string, createdAt: Date): Date {
    const retentionYears = this.retentionPeriods[dataType] || 7
    const expirationDate = new Date(createdAt)
    expirationDate.setFullYear(expirationDate.getFullYear() + retentionYears)
    
    return expirationDate
  }

  // Schedule data deletion
  static scheduleDataDeletion(dataId: string, dataType: string, createdAt: Date) {
    const expirationDate = this.getExpirationDate(dataType, createdAt)
    
    // In production, this would schedule a background job
    console.log(`Data ${dataId} scheduled for deletion on ${expirationDate.toISOString()}`)
    
    return {
      dataId,
      dataType,
      scheduledDeletion: expirationDate,
      status: 'scheduled',
    }
  }
}

// Consent Management
export class ConsentManager {
  // Record patient consent
  static async recordConsent(
    patientId: string,
    consentType: string,
    granted: boolean,
    details?: Record<string, any>
  ) {
    const consent = {
      id: `CONSENT_${Date.now()}`,
      patientId,
      consentType,
      granted,
      timestamp: new Date().toISOString(),
      details,
      ipAddress: 'masked',
      userAgent: 'masked',
    }

    // Log audit event
    const compliance = MedicalComplianceManager.getInstance()
    await compliance.logAuditEvent({
      eventType: granted ? AuditEventType.CONSENT_GIVEN : AuditEventType.CONSENT_WITHDRAWN,
      severity: AuditSeverity.MEDIUM,
      userId: 'system',
      userRole: 'system',
      patientId,
      action: `consent_${granted ? 'granted' : 'withdrawn'}`,
      outcome: 'success',
      details: consent,
      complianceFlags: ['HIPAA', 'GDPR'],
    })

    return consent
  }

  // Check if patient has given consent
  static hasConsent(patientId: string, consentType: string): boolean {
    // In production, check against consent database
    return true // Placeholder
  }
}

// Export singleton instance
export const medicalCompliance = MedicalComplianceManager.getInstance()
