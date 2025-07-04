"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

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

// Mock users from lib/auth.ts
const mockUsers = [
  {
    uid: "1",
    email: "dr.sharma@quantnex.com",
    displayName: "Dr. Rajesh Sharma",
    photoURL: null,
    role: "doctor",
    specialization: "Oncology",
    licenseNumber: "MCI-12345",
    department: "Oncology",
    permissions: ["read_patients", "write_patients", "read_reports", "write_reports"],
  },
  {
    uid: "2",
    email: "dr.patel@quantnex.com",
    displayName: "Dr. Priya Patel",
    photoURL: null,
    role: "doctor",
    specialization: "Radiology",
    licenseNumber: "MCI-67890",
    department: "Radiology",
    permissions: ["read_patients", "read_reports", "write_reports"],
  },
  {
    uid: "3",
    email: "107197773+Abhijeet-077@users.noreply.github.com",
    displayName: "Abhijeet",
    photoURL: null,
    role: "administrator",
    specialization: "System Administration",
    licenseNumber: "ADMIN-001",
    department: "IT Administration",
    permissions: ["read_patients", "write_patients", "read_reports", "write_reports", "admin_access", "system_config"],
  },
  {
    uid: "4",
    email: "admin@quantnex.com",
    displayName: "Admin User",
    photoURL: null,
    role: "administrator",
    specialization: "System Administration",
    licenseNumber: "ADMIN-002",
    department: "IT Administration",
    permissions: ["read_patients", "write_patients", "read_reports", "write_reports", "admin_access", "system_config"],
  },
]

// Mock passwords (in production, these would be hashed)
const mockPasswords: Record<string, string> = {
  "dr.sharma@quantnex.com": "password123",
  "dr.patel@quantnex.com": "password123",
  "107197773+Abhijeet-077@users.noreply.github.com": "admin123",
  "admin@quantnex.com": "admin123",
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('quantnex-user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('quantnex-user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // Find user by email
      const foundUser = mockUsers.find(u => u.email === email)
      if (!foundUser) {
        throw new Error("Invalid email or password")
      }

      // Check password
      const expectedPassword = mockPasswords[email]
      if (!expectedPassword || password !== expectedPassword) {
        throw new Error("Invalid email or password")
      }

      // Set user and save to localStorage
      setUser(foundUser)
      localStorage.setItem('quantnex-user', JSON.stringify(foundUser))

      return foundUser
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const register = async (email: string, password: string, userData: any) => {
    try {
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === email)
      if (existingUser) {
        throw new Error("User already exists")
      }

      // Create new user
      const newUser = {
        uid: `${mockUsers.length + 1}`,
        email,
        displayName: `${userData.firstName} ${userData.lastName}`,
        photoURL: null,
        role: userData.role,
        specialization: userData.specialization || "",
        licenseNumber: userData.licenseNumber || "",
        department: userData.department || "",
        permissions: ["read_patients", "read_reports"],
      }

      // Add to mock users and passwords
      mockUsers.push(newUser)
      mockPasswords[email] = password

      // Set user and save to localStorage
      setUser(newUser)
      localStorage.setItem('quantnex-user', JSON.stringify(newUser))

      return newUser
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      setUser(null)
      localStorage.removeItem('quantnex-user')
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    }
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
