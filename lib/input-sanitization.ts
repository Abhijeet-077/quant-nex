import DOMPurify from 'isomorphic-dompurify'
import { z } from 'zod'

// Medical-specific input sanitization
export class MedicalInputSanitizer {
  private static instance: MedicalInputSanitizer
  
  private constructor() {}
  
  public static getInstance(): MedicalInputSanitizer {
    if (!MedicalInputSanitizer.instance) {
      MedicalInputSanitizer.instance = new MedicalInputSanitizer()
    }
    return MedicalInputSanitizer.instance
  }
  
  // Sanitize HTML content for medical reports
  sanitizeHtml(input: string): string {
    const config = {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote',
        'table', 'thead', 'tbody', 'tr', 'td', 'th'
      ],
      ALLOWED_ATTR: ['class', 'id'],
      FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input'],
      FORBID_ATTR: ['onclick', 'onload', 'onerror', 'style'],
    }
    
    return DOMPurify.sanitize(input, config)
  }
  
  // Sanitize patient names (Indian names with proper validation)
  sanitizePatientName(name: string): string {
    // Remove any non-alphabetic characters except spaces, hyphens, and apostrophes
    const cleaned = name.replace(/[^a-zA-Z\s\-']/g, '')
    
    // Trim and normalize spaces
    const normalized = cleaned.replace(/\s+/g, ' ').trim()
    
    // Capitalize first letter of each word (proper case for Indian names)
    return normalized.replace(/\b\w/g, char => char.toUpperCase())
  }
  
  // Sanitize medical text (case notes, symptoms, etc.)
  sanitizeMedicalText(text: string): string {
    // Remove potentially dangerous characters while preserving medical terminology
    const cleaned = text.replace(/[<>\"'&]/g, '')
    
    // Normalize whitespace
    return cleaned.replace(/\s+/g, ' ').trim()
  }
  
  // Sanitize phone numbers (Indian format)
  sanitizePhoneNumber(phone: string): string {
    // Remove all non-numeric characters
    const digits = phone.replace(/\D/g, '')
    
    // Validate Indian phone number format
    if (digits.length === 10 && /^[6-9]/.test(digits)) {
      return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`
    } else if (digits.length === 12 && digits.startsWith('91')) {
      const number = digits.slice(2)
      if (/^[6-9]/.test(number)) {
        return `+91 ${number.slice(0, 5)} ${number.slice(5)}`
      }
    }
    
    throw new Error('Invalid Indian phone number format')
  }
  
  // Sanitize email addresses
  sanitizeEmail(email: string): string {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const cleaned = email.toLowerCase().trim()
    
    if (!emailRegex.test(cleaned)) {
      throw new Error('Invalid email format')
    }
    
    return cleaned
  }
  
  // Sanitize medical IDs (patient ID, license numbers, etc.)
  sanitizeMedicalId(id: string): string {
    // Allow alphanumeric characters, hyphens, and underscores
    const cleaned = id.replace(/[^a-zA-Z0-9\-_]/g, '').toUpperCase()
    
    if (cleaned.length < 3) {
      throw new Error('Medical ID too short')
    }
    
    return cleaned
  }
  
  // Sanitize file names for medical documents
  sanitizeFileName(fileName: string): string {
    // Remove dangerous characters and normalize
    const cleaned = fileName.replace(/[^a-zA-Z0-9\-_\.]/g, '_')
    
    // Ensure it doesn't start with a dot
    const normalized = cleaned.replace(/^\.+/, '')
    
    // Limit length
    return normalized.slice(0, 100)
  }
}

// Validation schemas with sanitization
export const SanitizedPatientSchema = z.object({
  firstName: z.string()
    .min(1, "First name is required")
    .max(50, "First name too long")
    .transform(name => MedicalInputSanitizer.getInstance().sanitizePatientName(name)),
    
  lastName: z.string()
    .min(1, "Last name is required")
    .max(50, "Last name too long")
    .transform(name => MedicalInputSanitizer.getInstance().sanitizePatientName(name)),
    
  email: z.string()
    .email("Invalid email format")
    .transform(email => MedicalInputSanitizer.getInstance().sanitizeEmail(email)),
    
  phone: z.string()
    .min(10, "Phone number too short")
    .transform(phone => MedicalInputSanitizer.getInstance().sanitizePhoneNumber(phone)),
    
  medicalHistory: z.string()
    .max(5000, "Medical history too long")
    .transform(text => MedicalInputSanitizer.getInstance().sanitizeMedicalText(text))
    .optional(),
    
  notes: z.string()
    .max(2000, "Notes too long")
    .transform(text => MedicalInputSanitizer.getInstance().sanitizeMedicalText(text))
    .optional(),
})

export const SanitizedReportSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(200, "Title too long")
    .transform(title => MedicalInputSanitizer.getInstance().sanitizeMedicalText(title)),
    
  content: z.string()
    .min(1, "Content is required")
    .max(10000, "Content too long")
    .transform(content => MedicalInputSanitizer.getInstance().sanitizeHtml(content)),
    
  patientId: z.string()
    .min(1, "Patient ID is required")
    .transform(id => MedicalInputSanitizer.getInstance().sanitizeMedicalId(id)),
})

// CSRF protection utilities
export function generateCSRFToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
  // In production, implement proper CSRF token validation
  // This is a simplified version
  return token === sessionToken && token.length === 64
}

// SQL injection prevention (for raw queries)
export function escapeSQLString(input: string): string {
  return input.replace(/'/g, "''").replace(/\\/g, "\\\\")
}

// XSS prevention utilities
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

// Medical data anonymization for logs
export function anonymizePatientData(data: Record<string, unknown>): Record<string, unknown> {
  const anonymized = { ...data }
  
  // Remove or hash sensitive fields
  if (anonymized.firstName) {
    anonymized.firstName = anonymized.firstName.charAt(0) + '***'
  }
  
  if (anonymized.lastName) {
    anonymized.lastName = anonymized.lastName.charAt(0) + '***'
  }
  
  if (anonymized.email) {
    const [local, domain] = anonymized.email.split('@')
    anonymized.email = local.charAt(0) + '***@' + domain
  }
  
  if (anonymized.phone) {
    anonymized.phone = anonymized.phone.replace(/\d(?=\d{4})/g, '*')
  }
  
  // Remove sensitive medical data
  delete anonymized.medicalHistory
  delete anonymized.geneticData
  delete anonymized.socialSecurityNumber
  
  return anonymized
}

// Input validation for medical measurements
export const MedicalMeasurementSchema = z.object({
  weight: z.number().min(0.1).max(1000), // kg
  height: z.number().min(10).max(300), // cm
  bloodPressureSystolic: z.number().min(50).max(300), // mmHg
  bloodPressureDiastolic: z.number().min(30).max(200), // mmHg
  heartRate: z.number().min(30).max(250), // bpm
  temperature: z.number().min(30).max(45), // Celsius
  oxygenSaturation: z.number().min(70).max(100), // percentage
})

// Export singleton instance
export const sanitizer = MedicalInputSanitizer.getInstance()
