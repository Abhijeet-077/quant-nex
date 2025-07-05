"use client"

import { supabase, supabaseAdmin } from './supabase'
import { z } from 'zod'

// User registration schema
const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.enum(['doctor', 'nurse', 'admin', 'researcher']),
  specialization: z.string().optional(),
  licenseNumber: z.string().optional(),
  department: z.string().optional(),
})

// Login schema
const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type RegisterData = z.infer<typeof RegisterSchema>
export type LoginData = z.infer<typeof LoginSchema>

// User registration function
export async function registerUser(data: RegisterData) {
  try {
    // Validate input data
    const validatedData = RegisterSchema.parse(data)

    console.log('Starting user registration for:', validatedData.email)

    // Step 1: Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          first_name: validatedData.firstName,
          last_name: validatedData.lastName,
          role: validatedData.role,
          specialization: validatedData.specialization || '',
          license_number: validatedData.licenseNumber || '',
          department: validatedData.department || '',
        }
      }
    })

    if (authError) {
      console.error('Supabase Auth Error:', authError)
      throw new Error(`Registration failed: ${authError.message}`)
    }

    if (!authData.user) {
      throw new Error('User creation failed - no user data returned')
    }

    console.log('User created in auth:', authData.user.id)

    // Step 2: Create user profile in profiles table using admin client
    const profileData = {
      id: authData.user.id,
      email: validatedData.email,
      first_name: validatedData.firstName,
      last_name: validatedData.lastName,
      role: validatedData.role,
      specialization: validatedData.specialization || null,
      license_number: validatedData.licenseNumber || null,
      department: validatedData.department || null,
      permissions: ['read_patients', 'read_reports'], // Default permissions
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data: profileResult, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert(profileData)
      .select()
      .single()

    if (profileError) {
      console.error('Profile creation error:', profileError)
      
      // If profile creation fails, clean up the auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      
      throw new Error(`Profile creation failed: ${profileError.message}`)
    }

    console.log('Profile created successfully:', profileResult)

    return {
      user: authData.user,
      profile: profileResult,
      session: authData.session
    }

  } catch (error) {
    console.error('Registration error:', error)
    
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`)
    }
    
    throw error
  }
}

// User login function
export async function loginUser(data: LoginData) {
  try {
    // Validate input data
    const validatedData = LoginSchema.parse(data)

    console.log('Starting user login for:', validatedData.email)

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    })

    if (authError) {
      console.error('Login error:', authError)
      throw new Error(`Login failed: ${authError.message}`)
    }

    if (!authData.user || !authData.session) {
      throw new Error('Login failed - no user or session data returned')
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .eq('is_active', true)
      .single()

    if (profileError || !profile) {
      console.error('Profile fetch error:', profileError)
      throw new Error('User profile not found or inactive')
    }

    // Update last login
    await supabase
      .from('profiles')
      .update({ 
        last_login: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', authData.user.id)

    console.log('Login successful for user:', profile.email)

    return {
      user: authData.user,
      profile,
      session: authData.session
    }

  } catch (error) {
    console.error('Login error:', error)
    
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`)
    }
    
    throw error
  }
}

// User logout function
export async function logoutUser() {
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Logout error:', error)
      throw new Error(`Logout failed: ${error.message}`)
    }

    console.log('User logged out successfully')
    return true

  } catch (error) {
    console.error('Logout error:', error)
    throw error
  }
}

// Get current user session
export async function getCurrentUser() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      console.error('Session error:', error)
      return null
    }

    if (!session?.user) {
      return null
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .eq('is_active', true)
      .single()

    if (profileError || !profile) {
      console.error('Profile fetch error:', profileError)
      return null
    }

    return {
      user: session.user,
      profile,
      session
    }

  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

// Check if user exists
export async function checkUserExists(email: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('User check error:', error)
      return false
    }

    return !!data

  } catch (error) {
    console.error('User existence check error:', error)
    return false
  }
}

// Password reset function
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      console.error('Password reset error:', error)
      throw new Error(`Password reset failed: ${error.message}`)
    }

    return true

  } catch (error) {
    console.error('Password reset error:', error)
    throw error
  }
}

// Update user profile
export async function updateUserProfile(userId: string, updates: Partial<RegisterData>) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Profile update error:', error)
      throw new Error(`Profile update failed: ${error.message}`)
    }

    return data

  } catch (error) {
    console.error('Profile update error:', error)
    throw error
  }
}

// Auth state change listener
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(callback)
}
