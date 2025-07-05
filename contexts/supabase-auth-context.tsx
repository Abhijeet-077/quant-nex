"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  getCurrentUser, 
  onAuthStateChange,
  type RegisterData,
  type LoginData 
} from "@/lib/auth-supabase"

type User = {
  uid: string
  email: string | null
  displayName?: string | null
  photoURL?: string | null
  role?: string
  specialization?: string
  licenseNumber?: string
  department?: string
  permissions?: string[]
} | null

type AuthContextType = {
  user: User
  loading: boolean
  login: (email: string, password: string) => Promise<User>
  register: (email: string, password: string, userData: any) => Promise<User>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => null,
  register: async () => null,
  logout: async () => {},
})

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (currentUser) {
          const user = {
            uid: currentUser.user.id,
            email: currentUser.profile.email,
            displayName: `${currentUser.profile.first_name} ${currentUser.profile.last_name}`,
            photoURL: null,
            role: currentUser.profile.role,
            specialization: currentUser.profile.specialization || "",
            licenseNumber: currentUser.profile.license_number || "",
            department: currentUser.profile.department || "",
            permissions: currentUser.profile.permissions || [],
          }
          setUser(user)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth state changes
    const { data: { subscription } } = onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id)
      
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const currentUser = await getCurrentUser()
          if (currentUser) {
            const user = {
              uid: currentUser.user.id,
              email: currentUser.profile.email,
              displayName: `${currentUser.profile.first_name} ${currentUser.profile.last_name}`,
              photoURL: null,
              role: currentUser.profile.role,
              specialization: currentUser.profile.specialization || "",
              licenseNumber: currentUser.profile.license_number || "",
              department: currentUser.profile.department || "",
              permissions: currentUser.profile.permissions || [],
            }
            setUser(user)
          }
        } catch (error) {
          console.error('Error getting user profile:', error)
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
      
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      
      const result = await loginUser({ email, password })
      
      const user = {
        uid: result.user.id,
        email: result.profile.email,
        displayName: `${result.profile.first_name} ${result.profile.last_name}`,
        photoURL: null,
        role: result.profile.role,
        specialization: result.profile.specialization || "",
        licenseNumber: result.profile.license_number || "",
        department: result.profile.department || "",
        permissions: result.profile.permissions || [],
      }

      setUser(user)
      return user
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true)
      
      const registerData: RegisterData = {
        email,
        password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        specialization: userData.specialization,
        licenseNumber: userData.licenseNumber,
        department: userData.department,
      }

      const result = await registerUser(registerData)
      
      const user = {
        uid: result.user.id,
        email: result.profile.email,
        displayName: `${result.profile.first_name} ${result.profile.last_name}`,
        photoURL: null,
        role: result.profile.role,
        specialization: result.profile.specialization || "",
        licenseNumber: result.profile.license_number || "",
        department: result.profile.department || "",
        permissions: result.profile.permissions || [],
      }

      setUser(user)
      return user
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await logoutUser()
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useSupabaseAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider')
  }
  return context
}

// For backward compatibility, export as useAuth as well
export const useAuth = useSupabaseAuth
