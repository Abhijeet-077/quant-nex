import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { auditLogOperations } from '@/lib/database'

// GET /api/auth/session - Get current session
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No active session' },
        { status: 401 }
      )
    }

    // Log session check for audit trail
    await auditLogOperations.create({
      userId: session.user.id,
      userEmail: session.user.email,
      action: 'session_check',
      resourceType: 'session',
      resourceId: session.user.id,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      sessionId: 'session_check',
      outcome: 'SUCCESS',
      details: { 
        role: session.user.role,
        department: session.user.department 
      },
      phiAccessed: false,
      dataClassification: 'INTERNAL',
    })

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          role: session.user.role,
          specialization: session.user.specialization,
          department: session.user.department,
          permissions: session.user.permissions,
        },
        expires: session.expires,
      },
      message: 'Session retrieved successfully',
    })
  } catch (error) {
    console.error('Session check error:', error)
    
    return NextResponse.json(
      { success: false, error: 'Failed to check session' },
      { status: 500 }
    )
  }
}

// DELETE /api/auth/session - Logout/invalidate session
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (session) {
      // Log logout for audit trail
      await auditLogOperations.create({
        userId: session.user.id,
        userEmail: session.user.email,
        action: 'user_logout',
        resourceType: 'session',
        resourceId: session.user.id,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        sessionId: 'logout',
        outcome: 'SUCCESS',
        details: { 
          role: session.user.role,
          department: session.user.department 
        },
        phiAccessed: false,
        dataClassification: 'INTERNAL',
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Session invalidated successfully',
    })
  } catch (error) {
    console.error('Logout error:', error)
    
    return NextResponse.json(
      { success: false, error: 'Failed to logout' },
      { status: 500 }
    )
  }
}
