import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { z } from "zod"

// Input validation schemas for medical data
export const PatientDataSchema = z.object({
  id: z.string().uuid().optional(),
  firstName: z.string().min(1).max(50).regex(/^[a-zA-Z\s]+$/, "Only letters and spaces allowed"),
  lastName: z.string().min(1).max(50).regex(/^[a-zA-Z\s]+$/, "Only letters and spaces allowed"),
  age: z.number().int().min(0).max(150),
  gender: z.enum(["male", "female", "other"]),
  cancerType: z.string().min(1).max(100),
  stage: z.enum(["I", "II", "III", "IV"]),
  status: z.enum(["active", "remission", "critical", "deceased", "inactive"]),
  treatmentProgress: z.number().min(0).max(100),
  lastVisit: z.string().datetime(),
  medicalHistory: z.string().max(5000).optional(),
  allergies: z.array(z.string()).optional(),
  medications: z.array(z.string()).optional(),
})

export const AppointmentSchema = z.object({
  id: z.string().uuid().optional(),
  patientId: z.string().uuid(),
  doctorId: z.string().uuid(),
  appointmentDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date'),
  appointmentTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  durationMinutes: z.number().min(15).max(480).optional().default(60),
  type: z.enum(["consultation", "follow-up", "treatment", "telemedicine"]),
  status: z.enum(["scheduled", "confirmed", "completed", "cancelled"]),
  notes: z.string().max(1000).optional(),
  location: z.string().max(100).optional(),
})

// Alias for API routes
export const AppointmentDataSchema = AppointmentSchema

export const ReportSchema = z.object({
  id: z.string().uuid().optional(),
  patientId: z.string().uuid(),
  type: z.enum(["lab", "imaging", "pathology", "treatment", "progress"]),
  title: z.string().min(1).max(200),
  content: z.string().max(10000),
  authorId: z.string().uuid(),
  date: z.string().datetime(),
  attachments: z.array(z.string()).optional(),
})

// Medical record schema for API routes
export const MedicalRecordDataSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  recordType: z.enum(['lab_result', 'imaging', 'pathology', 'treatment_note', 'progress_note', 'discharge_summary']),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  recordDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date'),
  attachments: z.array(z.string().url()).optional(),
  isConfidential: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  relatedAppointmentId: z.string().uuid().optional(),
})

// API Security middleware
interface AuthenticatedUser {
  id: string
  email: string
  role?: string
  permissions?: string[]
  sessionId?: string
}

export async function withApiSecurity(
  request: NextRequest,
  handler: (req: NextRequest, context: { user: AuthenticatedUser }) => Promise<NextResponse>,
  options: {
    requireAuth?: boolean
    requiredPermissions?: string[]
    validateSchema?: z.ZodSchema
  } = {}
) {
  try {
    // CORS headers for medical applications
    const corsHeaders = {
      "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGINS || "https://quantnex.com",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
      "Access-Control-Max-Age": "86400",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    }

    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return new NextResponse(null, { status: 200, headers: corsHeaders })
    }

    // Rate limiting removed for deployment simplicity

    // Authentication check
    let user = null
    if (options.requireAuth !== false) {
      const token = await getToken({ req: request })
      if (!token) {
        return NextResponse.json(
          { error: "Unauthorized", message: "Authentication required" },
          { status: 401, headers: corsHeaders }
        )
      }
      user = token
    }

    // Permission check
    if (options.requiredPermissions && user) {
      const userPermissions = user.permissions as string[]
      const hasRequiredPermission = options.requiredPermissions.some(permission =>
        userPermissions.includes(permission) || userPermissions.includes("admin")
      )
      
      if (!hasRequiredPermission) {
        return NextResponse.json(
          { error: "Forbidden", message: "Insufficient permissions" },
          { status: 403, headers: corsHeaders }
        )
      }
    }

    // Input validation
    if (options.validateSchema && request.method !== "GET") {
      try {
        const body = await request.json()
        options.validateSchema.parse(body)
      } catch (error) {
        if (error instanceof z.ZodError) {
          return NextResponse.json(
            {
              error: "Validation Error",
              message: "Invalid input data",
              details: error.errors,
            },
            { status: 400, headers: corsHeaders }
          )
        }
        throw error
      }
    }

    // Call the actual handler
    const response = await handler(request, { user })
    
    // Add security headers to response
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error) {
    console.error("API Security Error:", error)
    
    // Don't expose internal errors in production
    const isDevelopment = process.env.NODE_ENV === "development"
    
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: isDevelopment ? error.message : "An unexpected error occurred",
      },
      { status: 500 }
    )
  }
}

// HIPAA compliance utilities
export function sanitizePatientData(data: any): any {
  // Remove or mask sensitive fields for logging
  const sanitized = { ...data }
  
  // Remove sensitive medical information from logs
  delete sanitized.ssn
  delete sanitized.medicalHistory
  delete sanitized.geneticData
  
  // Mask partial information
  if (sanitized.email) {
    sanitized.email = sanitized.email.replace(/(.{2}).*(@.*)/, "$1***$2")
  }
  
  if (sanitized.phone) {
    sanitized.phone = sanitized.phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")
  }
  
  return sanitized
}

// Audit logging for HIPAA compliance
export function auditLog(action: string, userId: string, patientId?: string, details?: any) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    action,
    userId,
    patientId,
    details: details ? sanitizePatientData(details) : undefined,
    ipAddress: "masked", // In production, get from request headers
    userAgent: "masked", // In production, get from request headers
  }
  
  // In production, send to secure audit logging system
  console.log("AUDIT:", JSON.stringify(logEntry))
}

// Data encryption utilities (placeholder - implement with proper encryption in production)
export function encryptSensitiveData(data: string): string {
  // In production, use proper encryption like AES-256
  return Buffer.from(data).toString("base64")
}

export function decryptSensitiveData(encryptedData: string): string {
  // In production, use proper decryption
  return Buffer.from(encryptedData, "base64").toString()
}
