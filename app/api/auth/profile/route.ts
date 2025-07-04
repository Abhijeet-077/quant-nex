import { NextRequest, NextResponse } from 'next/server'
import { withApiSecurity } from '@/lib/api-security'
import { supabaseAdmin } from '@/lib/supabase'
import { auditLogOperations } from '@/lib/database'

// GET /api/auth/profile - Get user profile
async function handleGetProfile(request: NextRequest, context: { user: any }) {
  try {
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', context.user.id)
      .single()

    if (error || !user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Log profile access
    await auditLogOperations.create({
      userId: context.user.id,
      userEmail: context.user.email,
      action: 'profile_view',
      resourceType: 'user',
      resourceId: context.user.id,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      sessionId: context.user.sessionId || 'unknown',
      outcome: 'SUCCESS',
      details: { role: user.role },
      phiAccessed: false,
      dataClassification: 'INTERNAL',
    })

    // Remove sensitive data
    const { ...profileData } = user
    delete profileData.password_hash

    return NextResponse.json({
      success: true,
      data: profileData,
      message: 'Profile retrieved successfully',
    })
  } catch (error) {
    console.error('Error fetching profile:', error)
    
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// PUT /api/auth/profile - Update user profile
async function handleUpdateProfile(request: NextRequest, context: { user: any }) {
  try {
    const body = await request.json()
    
    // Only allow updating certain fields
    const allowedFields = ['first_name', 'last_name', 'phone', 'specialization']
    const updateData: any = {}
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    updateData.updated_at = new Date().toISOString()

    const { data: updatedUser, error } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', context.user.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    // Log profile update
    await auditLogOperations.create({
      userId: context.user.id,
      userEmail: context.user.email,
      action: 'profile_update',
      resourceType: 'user',
      resourceId: context.user.id,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      sessionId: context.user.sessionId || 'unknown',
      outcome: 'SUCCESS',
      details: { updatedFields: Object.keys(updateData) },
      phiAccessed: false,
      dataClassification: 'INTERNAL',
    })

    // Remove sensitive data
    const { ...profileData } = updatedUser
    delete profileData.password_hash

    return NextResponse.json({
      success: true,
      data: profileData,
      message: 'Profile updated successfully',
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    
    // Log failed update
    await auditLogOperations.create({
      userId: context.user.id,
      userEmail: context.user.email,
      action: 'profile_update',
      resourceType: 'user',
      resourceId: context.user.id,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      sessionId: context.user.sessionId || 'unknown',
      outcome: 'FAILURE',
      details: { error: error.message },
      phiAccessed: false,
      dataClassification: 'INTERNAL',
    })

    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

// GET handler
export async function GET(request: NextRequest) {
  return withApiSecurity(request, handleGetProfile, {
    requireAuth: true,
    rateLimit: 'auth',
  })
}

// PUT handler
export async function PUT(request: NextRequest) {
  return withApiSecurity(request, handleUpdateProfile, {
    requireAuth: true,
    rateLimit: 'auth',
  })
}
