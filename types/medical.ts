// Medical Data Types for Quant-NEX Oncology Platform

import { z } from 'zod'

// Base types for medical entities
export type UUID = string
export type ISODateString = string
export type MedicalLicenseNumber = string
export type PatientID = string
export type DoctorID = string

// Medical professional roles
export const MedicalRole = z.enum(['doctor', 'nurse', 'admin', 'researcher', 'technician'])
export type MedicalRole = z.infer<typeof MedicalRole>

// Cancer types and stages
export const CancerType = z.enum([
  'Glioblastoma',
  'Lung Carcinoma', 
  'Breast Cancer',
  'Melanoma',
  'Lymphoma',
  'Prostate Cancer',
  'Ovarian Cancer',
  'Colorectal Cancer',
  'Pancreatic Cancer',
  'Liver Cancer',
  'Kidney Cancer',
  'Bladder Cancer',
  'Thyroid Cancer',
  'Leukemia',
  'Brain Tumor',
  'Bone Cancer',
  'Skin Cancer',
  'Stomach Cancer',
  'Esophageal Cancer',
  'Cervical Cancer'
])
export type CancerType = z.infer<typeof CancerType>

export const CancerStage = z.enum(['I', 'II', 'III', 'IV'])
export type CancerStage = z.infer<typeof CancerStage>

export const PatientStatus = z.enum(['active', 'remission', 'critical', 'deceased', 'inactive'])
export type PatientStatus = z.infer<typeof PatientStatus>

export const Gender = z.enum(['male', 'female', 'other'])
export type Gender = z.infer<typeof Gender>

// Medical measurements
export const VitalSigns = z.object({
  heartRate: z.number().min(30).max(250), // bpm
  bloodPressureSystolic: z.number().min(50).max(300), // mmHg
  bloodPressureDiastolic: z.number().min(30).max(200), // mmHg
  temperature: z.number().min(30).max(45), // Celsius
  oxygenSaturation: z.number().min(70).max(100), // percentage
  respiratoryRate: z.number().min(8).max(60), // breaths per minute
  weight: z.number().min(0.1).max(1000).optional(), // kg
  height: z.number().min(10).max(300).optional(), // cm
  timestamp: z.string().datetime(),
})
export type VitalSigns = z.infer<typeof VitalSigns>

// Patient data structure
export const Patient = z.object({
  id: z.string().uuid(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  age: z.number().int().min(0).max(150),
  gender: Gender,
  dateOfBirth: z.string().datetime().optional(),
  cancerType: CancerType,
  stage: CancerStage,
  status: PatientStatus,
  treatmentProgress: z.number().min(0).max(100),
  lastVisit: z.string().datetime(),
  
  // Medical history
  medicalHistory: z.string().max(5000).optional(),
  allergies: z.array(z.string()).default([]),
  medications: z.array(z.string()).default([]),
  familyHistory: z.string().max(2000).optional(),
  
  // Contact information
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().default('India'),
  }).optional(),
  
  // Emergency contact
  emergencyContact: z.object({
    name: z.string(),
    relationship: z.string(),
    phone: z.string(),
    email: z.string().email().optional(),
  }).optional(),
  
  // Metadata
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdBy: z.string().uuid(),
  lastModifiedBy: z.string().uuid(),
})
export type Patient = z.infer<typeof Patient>

// Medical professional data
export const MedicalProfessional = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  role: MedicalRole,
  specialization: z.string().optional(),
  licenseNumber: z.string(),
  department: z.string(),
  permissions: z.array(z.string()),
  isActive: z.boolean().default(true),
  lastLogin: z.string().datetime().optional(),
  
  // Professional details
  qualifications: z.array(z.string()).default([]),
  experience: z.number().min(0).optional(), // years
  languages: z.array(z.string()).default(['English', 'Hindi']),
  
  // Contact information
  phone: z.string().optional(),
  officeLocation: z.string().optional(),
  
  // Metadata
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})
export type MedicalProfessional = z.infer<typeof MedicalProfessional>

// Treatment types and data
export const TreatmentType = z.enum([
  'chemotherapy',
  'radiation',
  'immunotherapy',
  'surgery',
  'targeted_therapy',
  'hormone_therapy',
  'stem_cell_transplant',
  'clinical_trial',
  'palliative_care',
  'supportive_care'
])
export type TreatmentType = z.infer<typeof TreatmentType>

export const TreatmentStatus = z.enum([
  'planned',
  'active',
  'completed',
  'paused',
  'cancelled',
  'failed'
])
export type TreatmentStatus = z.infer<typeof TreatmentStatus>

export const Treatment = z.object({
  id: z.string().uuid(),
  patientId: z.string().uuid(),
  type: TreatmentType,
  status: TreatmentStatus,
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  
  // Treatment details
  protocol: z.string(),
  dosage: z.string().optional(),
  frequency: z.string().optional(),
  duration: z.string().optional(),
  
  // Progress tracking
  progress: z.number().min(0).max(100),
  effectiveness: z.enum(['excellent', 'good', 'fair', 'poor', 'unknown']).optional(),
  sideEffects: z.array(z.string()).default([]),
  
  // Medical team
  primaryDoctor: z.string().uuid(),
  medicalTeam: z.array(z.string().uuid()).default([]),
  
  // Notes and observations
  notes: z.string().max(5000).optional(),
  
  // Metadata
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdBy: z.string().uuid(),
})
export type Treatment = z.infer<typeof Treatment>

// Appointment types
export const AppointmentType = z.enum([
  'consultation',
  'follow-up',
  'treatment',
  'telemedicine',
  'emergency',
  'surgery',
  'diagnostic',
  'counseling'
])
export type AppointmentType = z.infer<typeof AppointmentType>

export const AppointmentStatus = z.enum([
  'scheduled',
  'confirmed',
  'in-progress',
  'completed',
  'cancelled',
  'no-show',
  'rescheduled'
])
export type AppointmentStatus = z.infer<typeof AppointmentStatus>

export const Appointment = z.object({
  id: z.string().uuid(),
  patientId: z.string().uuid(),
  doctorId: z.string().uuid(),
  type: AppointmentType,
  status: AppointmentStatus,
  
  // Scheduling
  scheduledDate: z.string().datetime(),
  duration: z.number().min(15).max(480), // minutes
  location: z.string().optional(),
  isVirtual: z.boolean().default(false),
  
  // Virtual meeting details
  meetingLink: z.string().url().optional(),
  meetingId: z.string().optional(),
  
  // Appointment details
  reason: z.string().max(500).optional(),
  notes: z.string().max(2000).optional(),
  preparation: z.string().max(1000).optional(),
  
  // Follow-up
  followUpRequired: z.boolean().default(false),
  followUpDate: z.string().datetime().optional(),
  
  // Metadata
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdBy: z.string().uuid(),
})
export type Appointment = z.infer<typeof Appointment>

// Medical reports and documents
export const ReportType = z.enum([
  'lab',
  'imaging',
  'pathology',
  'treatment',
  'progress',
  'discharge',
  'consultation',
  'surgical',
  'genetic',
  'psychological'
])
export type ReportType = z.infer<typeof ReportType>

export const MedicalReport = z.object({
  id: z.string().uuid(),
  patientId: z.string().uuid(),
  type: ReportType,
  title: z.string().min(1).max(200),
  content: z.string().max(10000),
  
  // Report metadata
  authorId: z.string().uuid(),
  reviewedBy: z.string().uuid().optional(),
  approvedBy: z.string().uuid().optional(),
  
  // Dates
  reportDate: z.string().datetime(),
  testDate: z.string().datetime().optional(),
  
  // Attachments and files
  attachments: z.array(z.object({
    id: z.string().uuid(),
    filename: z.string(),
    fileType: z.string(),
    fileSize: z.number(),
    url: z.string().url(),
  })).default([]),
  
  // Clinical data
  findings: z.array(z.string()).default([]),
  recommendations: z.array(z.string()).default([]),
  criticalValues: z.array(z.object({
    parameter: z.string(),
    value: z.string(),
    normalRange: z.string(),
    severity: z.enum(['low', 'high', 'critical']),
  })).default([]),
  
  // Metadata
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  version: z.number().default(1),
})
export type MedicalReport = z.infer<typeof MedicalReport>

// Analytics and metrics
export const AnalyticsMetric = z.object({
  id: z.string(),
  name: z.string(),
  value: z.union([z.number(), z.string()]),
  unit: z.string().optional(),
  change: z.number().optional(), // percentage change
  trend: z.enum(['up', 'down', 'stable']).optional(),
  period: z.string(), // e.g., "last_30_days", "this_month"
  timestamp: z.string().datetime(),
})
export type AnalyticsMetric = z.infer<typeof AnalyticsMetric>

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: unknown
  }
  metadata?: {
    total?: number
    page?: number
    limit?: number
    hasMore?: boolean
  }
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  metadata: {
    total: number
    page: number
    limit: number
    hasMore: boolean
    totalPages: number
  }
}

// Error types
export interface MedicalError extends Error {
  code: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  patientId?: string
  context?: Record<string, unknown>
}

// Type guards
export function isPatient(obj: unknown): obj is Patient {
  return Patient.safeParse(obj).success
}

export function isMedicalProfessional(obj: unknown): obj is MedicalProfessional {
  return MedicalProfessional.safeParse(obj).success
}

export function isAppointment(obj: unknown): obj is Appointment {
  return Appointment.safeParse(obj).success
}

export function isTreatment(obj: unknown): obj is Treatment {
  return Treatment.safeParse(obj).success
}

export function isMedicalReport(obj: unknown): obj is MedicalReport {
  return MedicalReport.safeParse(obj).success
}
