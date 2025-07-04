import { NextRequest, NextResponse } from 'next/server'
import { withApiSecurity, AppointmentDataSchema } from '@/lib/api-security'
import { appointmentOperations, auditLogOperations } from '@/lib/database'

// GET /api/appointments - Get appointments with filtering
async function handleGetAppointments(request: NextRequest, context: { user: { id: string; email: string; sessionId?: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const doctorId = searchParams.get('doctorId')

    if (!startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: 'Start date and end date are required' },
        { status: 400 }
      )
    }

    const appointments = await appointmentOperations.getByDateRange(
      new Date(startDate),
      new Date(endDate),
      doctorId || undefined
    )

    // Log audit trail
    await auditLogOperations.create({
      userId: context.user.id,
      userEmail: context.user.email,
      action: 'appointment_list_view',
      resourceType: 'appointment',
      resourceId: 'multiple',
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      sessionId: context.user.sessionId || 'unknown',
      outcome: 'SUCCESS',
      details: { 
        dateRange: { startDate, endDate },
        doctorId,
        resultCount: appointments.length 
      },
      phiAccessed: true,
      dataClassification: 'RESTRICTED',
    })

    return NextResponse.json({
      success: true,
      data: appointments,
      message: `Found ${appointments.length} appointments`,
    })
  } catch (error) {
    console.error('Error fetching appointments:', error)
    
    // Log failed attempt
    await auditLogOperations.create({
      userId: context.user.id,
      userEmail: context.user.email,
      action: 'appointment_list_view',
      resourceType: 'appointment',
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
      { success: false, error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}

// POST /api/appointments - Create new appointment
async function handleCreateAppointment(request: NextRequest, context: { user: any }) {
  try {
    const body = await request.json()
    
    // Validate input data
    const validatedData = AppointmentDataSchema.parse(body)

    // Convert data for database
    const appointmentData = {
      ...validatedData,
      appointmentDate: new Date(validatedData.appointmentDate),
      type: validatedData.type.toUpperCase() as 'CONSULTATION' | 'FOLLOW_UP' | 'TREATMENT' | 'TELEMEDICINE' | 'EMERGENCY',
      createdById: context.user.id,
    }

    const appointment = await appointmentOperations.create(appointmentData)

    // Log audit trail
    await auditLogOperations.create({
      userId: context.user.id,
      userEmail: context.user.email,
      action: 'appointment_create',
      resourceType: 'appointment',
      resourceId: appointment.id,
      patientId: appointment.patientId,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      sessionId: context.user.sessionId || 'unknown',
      outcome: 'SUCCESS',
      details: { 
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTime,
        type: appointment.type,
        patientName: appointment.patient ? `${appointment.patient.firstName} ${appointment.patient.lastName}` : 'Unknown'
      },
      phiAccessed: true,
      dataClassification: 'RESTRICTED',
    })

    return NextResponse.json({
      success: true,
      data: appointment,
      message: 'Appointment created successfully',
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating appointment:', error)
    
    // Log failed attempt
    await auditLogOperations.create({
      userId: context.user.id,
      userEmail: context.user.email,
      action: 'appointment_create',
      resourceType: 'appointment',
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
        { success: false, error: 'Invalid appointment data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create appointment' },
      { status: 500 }
    )
  }
}

// GET handler
export async function GET(request: NextRequest) {
  return withApiSecurity(request, handleGetAppointments, {
    requireAuth: true,
    requiredPermissions: ['appointment_read'],
    rateLimit: 'appointments',
  })
}

// POST handler
export async function POST(request: NextRequest) {
  return withApiSecurity(request, handleCreateAppointment, {
    requireAuth: true,
    requiredPermissions: ['appointment_write'],
    validateSchema: AppointmentDataSchema,
    rateLimit: 'appointments',
  })
}
