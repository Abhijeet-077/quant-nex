import { NextRequest, NextResponse } from 'next/server'
import { withApiSecurity } from '@/lib/api-security'
import { patientOperations, auditLogOperations } from '@/lib/database'

// GET /api/patients/[id] - Get specific patient
async function handleGetPatient(
  request: NextRequest,
  context: { user: any, params: { id: string } }
) {
  try {
    const patientId = context.params.id

    if (!patientId) {
      return NextResponse.json(
        { success: false, error: 'Patient ID is required' },
        { status: 400 }
      )
    }

    const patient = await patientOperations.getById(patientId)

    if (!patient) {
      // Log unauthorized access attempt
      await auditLogOperations.create({
        userId: context.user.id,
        userEmail: context.user.email,
        action: 'patient_view_attempt',
        resourceType: 'patient',
        resourceId: patientId,
        patientId: patientId,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        sessionId: context.user.sessionId || 'unknown',
        outcome: 'FAILURE',
        details: { reason: 'Patient not found' },
        phiAccessed: false,
        dataClassification: 'RESTRICTED',
      })

      return NextResponse.json(
        { success: false, error: 'Patient not found' },
        { status: 404 }
      )
    }

    // Check if user has access to this patient
    const hasAccess = 
      context.user.role === 'ADMIN' ||
      patient.assignedDoctorId === context.user.id ||
      context.user.permissions.includes('patient_read_all')

    if (!hasAccess) {
      // Log unauthorized access attempt
      await auditLogOperations.create({
        userId: context.user.id,
        userEmail: context.user.email,
        action: 'patient_view_attempt',
        resourceType: 'patient',
        resourceId: patientId,
        patientId: patientId,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        sessionId: context.user.sessionId || 'unknown',
        outcome: 'UNAUTHORIZED',
        details: { reason: 'Insufficient permissions' },
        phiAccessed: false,
        dataClassification: 'RESTRICTED',
      })

      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      )
    }

    // Log successful access
    await auditLogOperations.create({
      userId: context.user.id,
      userEmail: context.user.email,
      action: 'patient_view',
      resourceType: 'patient',
      resourceId: patientId,
      patientId: patientId,
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
      message: 'Patient retrieved successfully',
    })
  } catch (error) {
    console.error('Error fetching patient:', error)
    
    // Log error
    await auditLogOperations.create({
      userId: context.user.id,
      userEmail: context.user.email,
      action: 'patient_view',
      resourceType: 'patient',
      resourceId: params.id,
      patientId: params.id,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      sessionId: context.user.sessionId || 'unknown',
      outcome: 'FAILURE',
      details: { error: error instanceof Error ? error.message : String(error) },
      phiAccessed: false,
      dataClassification: 'RESTRICTED',
    })

    return NextResponse.json(
      { success: false, error: 'Failed to fetch patient' },
      { status: 500 }
    )
  }
}

// PUT /api/patients/[id] - Update patient
async function handleUpdatePatient(
  request: NextRequest,
  context: { user: any, params: { id: string } }
) {
  try {
    const patientId = context.params.id
    const body = await request.json()

    if (!patientId) {
      return NextResponse.json(
        { success: false, error: 'Patient ID is required' },
        { status: 400 }
      )
    }

    // Check if patient exists and user has access
    const existingPatient = await patientOperations.getById(patientId)
    
    if (!existingPatient) {
      return NextResponse.json(
        { success: false, error: 'Patient not found' },
        { status: 404 }
      )
    }

    const hasAccess = 
      context.user.role === 'ADMIN' ||
      existingPatient.assignedDoctorId === context.user.id ||
      context.user.permissions.includes('patient_write_all')

    if (!hasAccess) {
      // Log unauthorized access attempt
      await auditLogOperations.create({
        userId: context.user.id,
        userEmail: context.user.email,
        action: 'patient_update_attempt',
        resourceType: 'patient',
        resourceId: patientId,
        patientId: patientId,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        sessionId: context.user.sessionId || 'unknown',
        outcome: 'UNAUTHORIZED',
        details: { reason: 'Insufficient permissions' },
        phiAccessed: false,
        dataClassification: 'RESTRICTED',
      })

      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      )
    }

    // Prepare update data
    const updateData = { ...body }
    if (updateData.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateData.dateOfBirth)
    }
    if (updateData.diagnosisDate) {
      updateData.diagnosisDate = new Date(updateData.diagnosisDate)
    }
    if (updateData.lastVisit) {
      updateData.lastVisit = new Date(updateData.lastVisit)
    }

    const updatedPatient = await patientOperations.update(patientId, updateData)

    // Log successful update
    await auditLogOperations.create({
      userId: context.user.id,
      userEmail: context.user.email,
      action: 'patient_update',
      resourceType: 'patient',
      resourceId: patientId,
      patientId: patientId,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      sessionId: context.user.sessionId || 'unknown',
      outcome: 'SUCCESS',
      details: { 
        updatedFields: Object.keys(body),
        patientName: `${updatedPatient.firstName} ${updatedPatient.lastName}` 
      },
      phiAccessed: true,
      dataClassification: 'RESTRICTED',
    })

    return NextResponse.json({
      success: true,
      data: updatedPatient,
      message: 'Patient updated successfully',
    })
  } catch (error) {
    console.error('Error updating patient:', error)
    
    // Log error
    await auditLogOperations.create({
      userId: context.user.id,
      userEmail: context.user.email,
      action: 'patient_update',
      resourceType: 'patient',
      resourceId: params.id,
      patientId: params.id,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      sessionId: context.user.sessionId || 'unknown',
      outcome: 'FAILURE',
      details: { error: error instanceof Error ? error.message : String(error) },
      phiAccessed: false,
      dataClassification: 'RESTRICTED',
    })

    return NextResponse.json(
      { success: false, error: 'Failed to update patient' },
      { status: 500 }
    )
  }
}

// GET handler
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  return withApiSecurity(request, (req, context) => handleGetPatient(req, { ...context, params: resolvedParams }), {
    requireAuth: true,
    requiredPermissions: ['patient_read'],
    rateLimit: 'patients',
  })
}

// PUT handler
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  return withApiSecurity(request, (req, context) => handleUpdatePatient(req, { ...context, params: resolvedParams }), {
    requireAuth: true,
    requiredPermissions: ['patient_write'],
    rateLimit: 'patients',
  })
}
