import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { JWT } from "next-auth/jwt"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { supabaseAdmin } from "./supabase"

// Medical professional user schema
const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(["doctor", "nurse", "admin", "researcher"]),
  specialization: z.string().optional(),
  licenseNumber: z.string(),
  department: z.string(),
  permissions: z.array(z.string()),
  lastLogin: z.date().optional(),
  isActive: z.boolean(),
})

export type User = z.infer<typeof UserSchema>

// Login credentials schema
const LoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  mfaCode: z.string().optional(),
})

// Mock user database (replace with actual database in production)
const users: User[] = [
  {
    id: "1",
    email: "dr.sharma@quantnex.com",
    name: "Dr. Rajesh Sharma",
    role: "doctor",
    specialization: "Oncology",
    licenseNumber: "MCI-12345",
    department: "Oncology",
    permissions: ["read_patients", "write_patients", "read_reports", "write_reports"],
    isActive: true,
  },
  {
    id: "2",
    email: "dr.patel@quantnex.com",
    name: "Dr. Priya Patel",
    role: "doctor",
    specialization: "Radiology",
    licenseNumber: "MCI-67890",
    department: "Radiology",
    permissions: ["read_patients", "read_reports", "write_reports"],
    isActive: true,
  },
]

// Password hashes (in production, store these securely in database)
const passwordHashes: Record<string, string> = {
  "dr.sharma@quantnex.com": "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qK", // password123
  "dr.patel@quantnex.com": "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qK", // password123
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        mfaCode: { label: "MFA Code", type: "text" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required")
          }

          // Validate input
          const validatedCredentials = LoginSchema.parse(credentials)

          // Find user in Supabase database
          const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('email', validatedCredentials.email)
            .eq('is_active', true)
            .single()

          if (error || !user) {
            throw new Error("Invalid credentials")
          }

          // For development, use simple password check
          // In production, implement proper password hashing
          const validPasswords: Record<string, string> = {
            'dr.sharma@quantnex.com': 'doctor123',
            'dr.patel@quantnex.com': 'doctor123',
            'admin@quantnex.com': 'admin123'
          }

          const isValidPassword = validPasswords[user.email] === validatedCredentials.password
          if (!isValidPassword) {
            throw new Error("Invalid credentials")
          }

          // In production, implement MFA verification here
          if (validatedCredentials.mfaCode) {
            // Verify MFA code
            // This is a placeholder - implement actual MFA verification
            if (validatedCredentials.mfaCode !== "123456") {
              throw new Error("Invalid MFA code")
            }
          }

          // Update last login in database
          await supabaseAdmin
            .from('users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', user.id)

          // Return user object (will be stored in JWT)
          return {
            id: user.id,
            email: user.email,
            name: `${user.first_name} ${user.last_name}`,
            role: user.role,
            specialization: user.specialization,
            licenseNumber: user.license_number,
            department: user.department,
            permissions: user.permissions || [],
            firstName: user.first_name,
            lastName: user.last_name,
          }
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours for medical applications
  },
  jwt: {
    maxAge: 8 * 60 * 60, // 8 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.specialization = user.specialization
        token.licenseNumber = user.licenseNumber
        token.department = user.department
        token.permissions = user.permissions
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.specialization = token.specialization as string
        session.user.licenseNumber = token.licenseNumber as string
        session.user.department = token.department as string
        session.user.permissions = token.permissions as string[]
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  events: {
    async signIn({ user, account, profile }) {
      // Audit log for medical compliance
      console.log(`Medical professional signed in: ${user.email} at ${new Date().toISOString()}`)
      // In production, log to secure audit system
    },
    async signOut({ token }) {
      // Audit log for medical compliance
      console.log(`Medical professional signed out: ${token.email} at ${new Date().toISOString()}`)
      // In production, log to secure audit system
    },
  },
}

// Permission checking utilities
export function hasPermission(userPermissions: string[], requiredPermission: string): boolean {
  return userPermissions.includes(requiredPermission) || userPermissions.includes("admin")
}

export function hasAnyPermission(userPermissions: string[], requiredPermissions: string[]): boolean {
  return requiredPermissions.some(permission => hasPermission(userPermissions, permission))
}

export function hasAllPermissions(userPermissions: string[], requiredPermissions: string[]): boolean {
  return requiredPermissions.every(permission => hasPermission(userPermissions, permission))
}

// Medical role checking
export function isMedicalProfessional(role: string): boolean {
  return ["doctor", "nurse"].includes(role)
}

export function canAccessPatientData(role: string, permissions: string[]): boolean {
  return isMedicalProfessional(role) && hasPermission(permissions, "read_patients")
}

export function canModifyPatientData(role: string, permissions: string[]): boolean {
  return isMedicalProfessional(role) && hasPermission(permissions, "write_patients")
}
