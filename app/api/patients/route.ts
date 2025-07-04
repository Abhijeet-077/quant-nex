import { NextRequest, NextResponse } from 'next/server'
import { withApiSecurity, PatientDataSchema } from '@/lib/api-security'
import { patientOperations, auditLogOperations } from '@/lib/database'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/patients - Get all patients with filtering
async function handleGetPatients(request: NextRequest, context: { user: any }) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters = {
      search: searchParams.get('search') || undefined,
      cancerType: searchParams.get('cancerType') || undefined,
      cancerStage: searchParams.get('cancerStage') || undefined,
      treatmentStatus: searchParams.get('treatmentStatus') || undefined,
      assignedDoctorId: searchParams.get('assignedDoctorId') || undefined,
      limit: parseInt(searchParams.get('limit') || '20'),
      offset: parseInt(searchParams.get('offset') || '0'),
    }

    const result = await patientOperations.search(filters)

    // Log audit trail
    await auditLogOperations.create({
      userId: context.user.id,
      userEmail: context.user.email,
      action: 'patient_list_view',
      resourceType: 'patient',
      resourceId: 'multiple',
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      sessionId: context.user.sessionId || 'unknown',
      outcome: 'SUCCESS',
      details: { filters, resultCount: result.patients.length },
      phiAccessed: true,
      dataClassification: 'RESTRICTED',
    })

    return NextResponse.json({
      success: true,
      data: result,
      message: `Found ${result.patients.length} patients`,
    })
  } catch (error) {
    console.error('Error fetching patients:', error)
    
    // Log failed attempt
    await auditLogOperations.create({
      userId: context.user.id,
      userEmail: context.user.email,
      action: 'patient_list_view',
      resourceType: 'patient',
      resourceId: 'multiple',
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      sessionId: context.user.sessionId || 'unknown',
      outcome: 'FAILURE',
      details: { error: error.message },
      phiAccessed: false,
      dataClassification: 'RESTRICTED',
    })

    return NextResponse.json(
      { success: false, error: 'Failed to fetch patients' },
      { status: 500 }
    )
  }
}

// POST /api/patients - Create new patient
async function handleCreatePatient(request: NextRequest, context: { user: any }) {
  try {
    const body = await request.json()
    
    // Validate input data
    const validatedData = PatientDataSchema.parse(body)

    // Generate medical record number if not provided
    if (!validatedData.medicalRecordNumber) {
      const timestamp = Date.now().toString().slice(-6)
      validatedData.medicalRecordNumber = `PT-${new Date().getFullYear()}-${timestamp}`
    }

    // Convert date strings to Date objects
    const patientData = {
      ...validatedData,
      dateOfBirth: new Date(validatedData.dateOfBirth),
      diagnosisDate: validatedData.diagnosisDate ? new Date(validatedData.diagnosisDate) : undefined,
      lastVisit: validatedData.lastVisit ? new Date(validatedData.lastVisit) : undefined,
      gender: validatedData.gender.toUpperCase() as 'MALE' | 'FEMALE' | 'OTHER',
      cancerStage: validatedData.cancerStage as 'I' | 'II' | 'III' | 'IV' | undefined,
    }

    const patient = await patientOperations.create(patientData)

    // Log audit trail
    await auditLogOperations.create({
      userId: context.user.id,
      userEmail: context.user.email,
      action: 'patient_create',
      resourceType: 'patient',
      resourceId: patient.id,
      patientId: patient.id,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      sessionId: context.user.sessionId || 'unknown',
      outcome: 'SUCCESS',
      details: { 
        patientName: `${patient.firstName} ${patient.lastName}`,
        medicalRecordNumber: patient.medicalRecordNumber 
      },
      phiAccessed: true,
      dataClassification: 'RESTRICTED',
    })

    return NextResponse.json({
      success: true,
      data: patient,
      message: 'Patient created successfully',
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating patient:', error)
    
    // Log failed attempt
    await auditLogOperations.create({
      userId: context.user.id,
      userEmail: context.user.email,
      action: 'patient_create',
      resourceType: 'patient',
      resourceId: 'unknown',
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      sessionId: context.user.sessionId || 'unknown',
      outcome: 'FAILURE',
      details: { error: error.message },
      phiAccessed: false,
      dataClassification: 'RESTRICTED',
    })

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid patient data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create patient' },
      { status: 500 }
    )
  }
}

// GET handler
export async function GET(request: NextRequest) {
  return withApiSecurity(request, handleGetPatients, {
    requireAuth: true,
    requiredPermissions: ['patient_read'],
    rateLimit: 'patients',
  })
}

// POST handler
export async function POST(request: NextRequest) {
  return withApiSecurity(request, handleCreatePatient, {
    requireAuth: true,
    requiredPermissions: ['patient_write'],
    validateSchema: PatientDataSchema,
    rateLimit: 'patients',
  })
}
