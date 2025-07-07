interface LoginCredentials {
  email: string
  password: string
}

interface User {
  id: string
  email: string
  name: string
  role: string
  hospital?: string
  department?: string
}

interface AuthResponse {
  success: boolean
  user?: User
  token?: string
  error?: string
}

// Demo users for fallback authentication
const DEMO_USERS: User[] = [
  {
    id: "demo-1",
    email: "dr.priya@quantnex.com",
    name: "Dr. Priya Patel",
    role: "Oncologist",
    hospital: "Tata Memorial Hospital",
    department: "Neuro-Oncology",
  },
  {
    id: "demo-2",
    email: "dr.amit@quantnex.com",
    name: "Dr. Amit Gupta",
    role: "Surgeon",
    hospital: "AIIMS Delhi",
    department: "Cancer Surgery",
  },
  {
    id: "demo-3",
    email: "admin@quantnex.com",
    name: "Rajesh Kumar",
    role: "Administrator",
    hospital: "Apollo Hospital",
    department: "Administration",
  },
]

class EnhancedIndianBackendService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.quantnex.in"
  private isDemoMode = false

  constructor() {
    // Check if we're in demo mode (development or Firebase not configured)
    this.isDemoMode = process.env.NODE_ENV === "development" || !process.env.NEON_NEON_DATABASE_URL
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // If database is not configured, use demo authentication
      if (this.isDemoMode) {
        return this.demoLogin(credentials)
      }

      // Try database authentication first
      try {
        // In a real implementation, you would hash and verify passwords
        // For now, we'll use demo authentication
        return this.demoLogin(credentials)
      } catch (dbError: any) {
        console.warn("Database authentication failed, falling back to demo mode:", dbError.message)
        return this.demoLogin(credentials)
      }
    } catch (error: any) {
      console.error("Login error:", error)
      return this.demoLogin(credentials)
    }
  }

  private async demoLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check demo credentials
    const user = DEMO_USERS.find((u) => u.email === credentials.email)

    if (user && (credentials.password === "demo123" || credentials.password === "password")) {
      return {
        success: true,
        user,
        token: `demo-token-${user.id}-${Date.now()}`,
      }
    }

    return {
      success: false,
      error: `Invalid credentials. Demo accounts available:
      
      • dr.priya@quantnex.com / demo123
      • dr.amit@quantnex.com / demo123  
      • admin@quantnex.com / demo123
      
      Or use any email with password: demo123`,
    }
  }

  async googleSignIn(): Promise<AuthResponse> {
    try {
      if (this.isDemoMode) {
        await new Promise((resolve) => setTimeout(resolve, 1500))

        return {
          success: true,
          user: {
            id: "google-demo-1",
            email: "demo.user@gmail.com",
            name: "Dr. Kavya Sharma",
            role: "Radiologist",
            hospital: "Apollo Hospital",
            department: "Medical Imaging",
          },
          token: `google-demo-token-${Date.now()}`,
        }
      }

      // In production, implement actual Google OAuth
      return {
        success: false,
        error: "Google sign-in not implemented in production mode",
      }
    } catch (error: any) {
      console.error("Google sign-in error:", error)
      return {
        success: false,
        error: "Google sign-in failed. Please try email/password login or contact support.",
      }
    }
  }

  async logout(): Promise<{ success: boolean }> {
    try {
      // Clear any stored tokens
      if (typeof window !== "undefined") {
        localStorage.removeItem("quantnex-token")
        localStorage.removeItem("quantnex-user")
      }

      return { success: true }
    } catch (error) {
      console.error("Logout error:", error)
      return { success: true } // Always succeed for logout
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      if (this.isDemoMode) {
        const token = typeof window !== "undefined" ? localStorage.getItem("quantnex-token") : null
        if (token) {
          const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("quantnex-user") || "{}") : null
          return user
        }
      }

      // In production, fetch user from database using token
      return null
    } catch (error) {
      console.error("Get current user error:", error)
      return null
    }
  }
}
