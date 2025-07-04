import { NextRequest, NextResponse } from 'next/server'
import { withApiSecurity, MedicalRecordDataSchema } from '@/lib/api-security'
import { medicalRecordOperations, auditLogOperations } from '@/lib/database'

// GET /api/medical-records - Get medical records with filtering
async function handleGetMedicalRecords(request: NextRequest, context: { user: any }) {
  try {
    const { searchParams } = new URL(request.url)
    
    const patientId = searchParams.get('patientId')
    const limit = parseInt(searchParams.get('limit') || '50')

    if (!patientId) {
      return NextResponse.json(
        { success: false, error: 'Patient ID is required' },
        { status: 400 }
      )
    }

    const records = await medicalRecordOperations.getByPatientId(patientId, limit)

    // Log audit trail
    await auditLogOperations.create({
      userId: context.user.id,
      userEmail: context.user.email,
      action: 'medical_record_list_view',
      resourceType: 'medical_record',
      resourceId: 'multiple',
      patientId: patientId,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      sessionId: context.user.sessionId || 'unknown',
      outcome: 'SUCCESS',
      details: { 
        patientId,
        limit,
        resultCount: records.length 
      },
      phiAccessed: true,
      dataClassification: 'RESTRICTED',
    })

    return NextResponse.json({
      success: true,
      data: records,
      message: `Found ${records.length} medical records`,
    })
  } catch (error) {
    console.error('Error fetching medical records:', error)
    
    // Log failed attempt
    await auditLogOperations.create({
      userId: context.user.id,
      userEmail: context.user.email,
      action: 'medical_record_list_view',
      resourceType: 'medical_record',
      resourceId: 'multiple',
      patientId: request.url.includes('patientId') ? new URL(request.url).searchParams.get('patientId') : undefined,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      sessionId: context.user.sessionId || 'unknown',
      outcome: 'FAILURE',
      details: { error: error.message },
      phiAccessed: false,
      dataClassification: 'RESTRICTED',
    })

    return NextResponse.json(
      { success: false, error: 'Failed to fetch medical records' },
      { status: 500 }
    )
  }
}

// POST /api/medical-records - Create new medical record
async function handleCreateMedicalRecord(request: NextRequest, context: { user: any }) {
  try {
    const body = await request.json()
    
    // Validate input data
    const validatedData = MedicalRecordDataSchema.parse(body)

    // Convert data for database
    const recordData = {
      ...validatedData,
      recordType: validatedData.recordType.toUpperCase() as 'LAB_RESULT' | 'IMAGING' | 'PATHOLOGY' | 'TREATMENT_NOTE' | 'PROGRESS_NOTE' | 'DISCHARGE_SUMMARY',
      recordDate: new Date(validatedData.recordDate),
      authorId: context.user.id,
      authorName: `${context.user.firstName} ${context.user.lastName}`,
      attachments: validatedData.attachments || [],
      tags: validatedData.tags || [],
      isConfidential: validatedData.isConfidential || false,
    }

    const record = await medicalRecordOperations.create(recordData)

    // Log audit trail
    await auditLogOperations.create({
      userId: context.user.id,
      userEmail: context.user.email,
      action: 'medical_record_create',
      resourceType: 'medical_record',
      resourceId: record.id,
      patientId: record.patientId,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      sessionId: context.user.sessionId || 'unknown',
      outcome: 'SUCCESS',
      details: { 
        recordType: record.recordType,
        title: record.title,
        isConfidential: record.isConfidential,
        patientName: record.patient ? `${record.patient.firstName} ${record.patient.lastName}` : 'Unknown'
      },
      phiAccessed: true,
      dataClassification: record.isConfidential ? 'RESTRICTED' : 'CONFIDENTIAL',
    })

    return NextResponse.json({
      success: true,
      data: record,
      message: 'Medical record created successfully',
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating medical record:', error)
    
    // Log failed attempt
    await auditLogOperations.create({
      userId: context.user.id,
      userEmail: context.user.email,
      action: 'medical_record_create',
      resourceType: 'medical_record',
      resourceId: 'unknown',
      patientId: body?.patientId,
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
        { success: false, error: 'Invalid medical record data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create medical record' },
      { status: 500 }
    )
  }
}

// GET handler
export async function GET(request: NextRequest) {
  return withApiSecurity(request, handleGetMedicalRecords, {
    requireAuth: true,
    requiredPermissions: ['medical_record_read'],
    rateLimit: 'medical_records',
  })
}

// POST handler
export async function POST(request: NextRequest) {
  return withApiSecurity(request, handleCreateMedicalRecord, {
    requireAuth: true,
    requiredPermissions: ['medical_record_write'],
    validateSchema: MedicalRecordDataSchema,
    rateLimit: 'medical_records',
  })
}
