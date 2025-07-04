import { PrismaClient } from '@prisma/client'
import { supabaseAdmin } from './supabase'

// Global Prisma client instance
declare global {
  var prisma: PrismaClient | undefined
}

// Initialize Prisma client with connection pooling for Vercel deployment
export const prisma = globalThis.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Vercel-specific optimizations
  errorFormat: 'minimal',
  // Connection pool settings for serverless
  ...(process.env.VERCEL && {
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  }),
})

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

// Database utility functions for medical data

// Patient operations
export const patientOperations = {
  // Create a new patient
  async create(data: {
    firstName: string
    lastName: string
    email?: string
    phone?: string
    dateOfBirth: Date
    gender: 'MALE' | 'FEMALE' | 'OTHER'
    address?: string
    emergencyContactName?: string
    emergencyContactPhone?: string
    medicalRecordNumber: string
    cancerType?: string
    cancerStage?: 'I' | 'II' | 'III' | 'IV'
    diagnosisDate?: Date
    assignedDoctorId?: string
    medicalHistory?: string
    allergies?: string[]
    currentMedications?: string[]
    familyHistory?: string
    insuranceProvider?: string
    insurancePolicyNumber?: string
  }) {
    return await prisma.patient.create({
      data: {
        ...data,
        allergies: data.allergies || [],
        currentMedications: data.currentMedications || [],
      },
      include: {
        assignedDoctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialization: true,
          }
        }
      }
    })
  },

  // Get patient by ID with related data
  async getById(id: string) {
    return await prisma.patient.findUnique({
      where: { id },
      include: {
        assignedDoctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialization: true,
            department: true,
          }
        },
        appointments: {
          orderBy: { appointmentDate: 'desc' },
          take: 5,
          include: {
            doctor: {
              select: {
                firstName: true,
                lastName: true,
                specialization: true,
              }
            }
          }
        },
        medicalRecords: {
          orderBy: { recordDate: 'desc' },
          take: 10,
          include: {
            author: {
              select: {
                firstName: true,
                lastName: true,
                specialization: true,
              }
            }
          }
        }
      }
    })
  },

  // Search patients with filters
  async search(filters: {
    search?: string
    cancerType?: string
    cancerStage?: string
    treatmentStatus?: string
    assignedDoctorId?: string
    limit?: number
    offset?: number
  }) {
    const {
      search,
      cancerType,
      cancerStage,
      treatmentStatus,
      assignedDoctorId,
      limit = 20,
      offset = 0
    } = filters

    const where: any = {}

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { medicalRecordNumber: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (cancerType) {
      where.cancerType = { contains: cancerType, mode: 'insensitive' }
    }

    if (cancerStage) {
      where.cancerStage = cancerStage
    }

    if (treatmentStatus) {
      where.treatmentStatus = treatmentStatus
    }

    if (assignedDoctorId) {
      where.assignedDoctorId = assignedDoctorId
    }

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        include: {
          assignedDoctor: {
            select: {
              firstName: true,
              lastName: true,
              specialization: true,
            }
          }
        },
        orderBy: { updatedAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.patient.count({ where })
    ])

    return { patients, total, hasMore: offset + limit < total }
  },

  // Update patient information
  async update(id: string, data: any) {
    return await prisma.patient.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        assignedDoctor: {
          select: {
            firstName: true,
            lastName: true,
            specialization: true,
          }
        }
      }
    })
  },

  // Get patient statistics
  async getStatistics() {
    const [
      totalPatients,
      activePatients,
      criticalPatients,
      remissionPatients,
      recentPatients
    ] = await Promise.all([
      prisma.patient.count(),
      prisma.patient.count({ where: { treatmentStatus: 'ACTIVE' } }),
      prisma.patient.count({ where: { treatmentStatus: 'CRITICAL' } }),
      prisma.patient.count({ where: { treatmentStatus: 'REMISSION' } }),
      prisma.patient.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        }
      })
    ])

    return {
      totalPatients,
      activePatients,
      criticalPatients,
      remissionPatients,
      recentPatients,
    }
  }
}

// Appointment operations
export const appointmentOperations = {
  // Create new appointment
  async create(data: {
    patientId: string
    doctorId: string
    appointmentDate: Date
    appointmentTime: string
    durationMinutes?: number
    type: 'CONSULTATION' | 'FOLLOW_UP' | 'TREATMENT' | 'TELEMEDICINE' | 'EMERGENCY'
    location?: string
    roomNumber?: string
    notes?: string
    preparationInstructions?: string
    createdById: string
  }) {
    return await prisma.appointment.create({
      data,
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            medicalRecordNumber: true,
          }
        },
        doctor: {
          select: {
            firstName: true,
            lastName: true,
            specialization: true,
          }
        }
      }
    })
  },

  // Get appointments for a specific date range
  async getByDateRange(startDate: Date, endDate: Date, doctorId?: string) {
    const where: any = {
      appointmentDate: {
        gte: startDate,
        lte: endDate,
      }
    }

    if (doctorId) {
      where.doctorId = doctorId
    }

    return await prisma.appointment.findMany({
      where,
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            medicalRecordNumber: true,
            phone: true,
          }
        },
        doctor: {
          select: {
            firstName: true,
            lastName: true,
            specialization: true,
          }
        }
      },
      orderBy: [
        { appointmentDate: 'asc' },
        { appointmentTime: 'asc' }
      ]
    })
  },

  // Update appointment status
  async updateStatus(id: string, status: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW') {
    return await prisma.appointment.update({
      where: { id },
      data: { 
        status,
        updatedAt: new Date(),
      }
    })
  }
}

// Medical record operations
export const medicalRecordOperations = {
  // Create new medical record
  async create(data: {
    patientId: string
    recordType: 'LAB_RESULT' | 'IMAGING' | 'PATHOLOGY' | 'TREATMENT_NOTE' | 'PROGRESS_NOTE' | 'DISCHARGE_SUMMARY'
    title: string
    content: string
    authorId: string
    authorName: string
    recordDate: Date
    attachments?: string[]
    isConfidential?: boolean
    tags?: string[]
    relatedAppointmentId?: string
  }) {
    return await prisma.medicalRecord.create({
      data: {
        ...data,
        attachments: data.attachments || [],
        tags: data.tags || [],
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            specialization: true,
          }
        },
        patient: {
          select: {
            firstName: true,
            lastName: true,
            medicalRecordNumber: true,
          }
        }
      }
    })
  },

  // Get medical records for a patient
  async getByPatientId(patientId: string, limit = 50) {
    return await prisma.medicalRecord.findMany({
      where: { patientId },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            specialization: true,
          }
        }
      },
      orderBy: { recordDate: 'desc' },
      take: limit,
    })
  }
}

// Audit log operations for HIPAA compliance
export const auditLogOperations = {
  // Create audit log entry
  async create(data: {
    userId: string
    userEmail: string
    action: string
    resourceType: string
    resourceId: string
    patientId?: string
    ipAddress: string
    userAgent: string
    sessionId: string
    outcome: 'SUCCESS' | 'FAILURE' | 'UNAUTHORIZED'
    details?: any
    phiAccessed?: boolean
    dataClassification: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED'
  }) {
    return await prisma.auditLog.create({
      data: {
        ...data,
        phiAccessed: data.phiAccessed || false,
      }
    })
  },

  // Get audit logs with filters
  async getFiltered(filters: {
    userId?: string
    patientId?: string
    action?: string
    startDate?: Date
    endDate?: Date
    limit?: number
    offset?: number
  }) {
    const {
      userId,
      patientId,
      action,
      startDate,
      endDate,
      limit = 100,
      offset = 0
    } = filters

    const where: any = {}

    if (userId) where.userId = userId
    if (patientId) where.patientId = patientId
    if (action) where.action = { contains: action, mode: 'insensitive' }
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = startDate
      if (endDate) where.createdAt.lte = endDate
    }

    return await prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
          }
        },
        patient: {
          select: {
            firstName: true,
            lastName: true,
            medicalRecordNumber: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })
  }
}

// Database health check
export async function checkDatabaseHealth() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return { status: 'healthy', timestamp: new Date() }
  } catch (error) {
    return { status: 'unhealthy', error: error.message, timestamp: new Date() }
  }
}

// Graceful shutdown
export async function disconnectDatabase() {
  await prisma.$disconnect()
}
