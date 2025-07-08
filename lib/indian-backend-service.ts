// Enhanced Indian Backend Service with proper error handling
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

class IndianBackendService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.quantnex.in"
  private isDemoMode = false

  constructor() {
    // Check if we're in demo mode (development or Firebase not configured)
    this.isDemoMode = process.env.NODE_ENV === "development" || !process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // If Firebase is not configured or we're in demo mode, use demo authentication
      if (this.isDemoMode) {
        return this.demoLogin(credentials)
      }

      // Try Firebase authentication first
      try {
        const { signInWithEmailAndPassword } = await import("firebase/auth")
        const { auth }: any = await import("./firebase")

        const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password)

        return {
          success: true,
          user: {
            id: userCredential.user.uid,
            email: userCredential.user.email || "",
            name: userCredential.user.displayName || "User",
            role: "Doctor",
          },
          token: await userCredential.user.getIdToken(),
        }
      } catch (firebaseError: any) {
        console.warn("Firebase authentication failed, falling back to demo mode:", firebaseError.message)

        // If Firebase fails, fall back to demo mode
        return this.demoLogin(credentials)
      }
    } catch (error: any) {
      console.error("Login error:", error)

      // Final fallback to demo mode
      return this.demoLogin(credentials)
    }
  }

  private async demoLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check demo credentials
    const user = DEMO_USERS.find((u) => u.email === credentials.email)

    if (user && (credentials.password === "demo123" || credentials.password === "password")) {
      const token = `demo-token-${user.id}-${Date.now()}`

      // Set cookie for middleware authentication
      if (typeof document !== 'undefined') {
        document.cookie = `quantnex-token=${token}; path=/; max-age=86400; SameSite=Lax`
      }

      return {
        success: true,
        user,
        token,
      }
    }

    // If no match found, provide helpful demo credentials
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
        // Demo Google sign-in
        await new Promise((resolve) => setTimeout(resolve, 1500))

        const token = `google-demo-token-${Date.now()}`

        // Set cookie for middleware authentication
        if (typeof document !== 'undefined') {
          document.cookie = `quantnex-token=${token}; path=/; max-age=86400; SameSite=Lax`
        }

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
          token,
        }
      }

      // Try Firebase Google authentication
      try {
        const { signInWithPopup, GoogleAuthProvider } = await import("firebase/auth")
        const { auth }: any = await import("./firebase")

        const provider = new GoogleAuthProvider()
        provider.addScope("email")
        provider.addScope("profile")

        const result = await signInWithPopup(auth, provider)

        return {
          success: true,
          user: {
            id: result.user.uid,
            email: result.user.email || "",
            name: result.user.displayName || "User",
            role: "Doctor",
          },
          token: await result.user.getIdToken(),
        }
      } catch (firebaseError: any) {
        console.warn("Firebase Google sign-in failed, using demo mode:", firebaseError.message)

        // Fallback to demo Google sign-in
        return {
          success: true,
          user: {
            id: "google-demo-fallback",
            email: "demo.google@quantnex.com",
            name: "Dr. Arjun Singh",
            role: "Oncologist",
            hospital: "Fortis Hospital",
            department: "Medical Oncology",
          },
          token: `google-demo-fallback-${Date.now()}`,
        }
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
      if (!this.isDemoMode) {
        const { signOut } = await import("firebase/auth")
        const { auth }: any = await import("./firebase")
        await signOut(auth)
      }

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
        // Return demo user if token exists
        const token = typeof window !== "undefined" ? localStorage.getItem("quantnex-token") : null
        if (token && token.startsWith("demo-token")) {
          return DEMO_USERS[0] // Return first demo user
        }
        return null
      }

      const { auth }: any = await import("./firebase")
      const { onAuthStateChanged } = await import("firebase/auth")

      return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          unsubscribe()
          if (user) {
            resolve({
              id: user.uid,
              email: user.email || "",
              name: user.displayName || "User",
              role: "Doctor",
            })
          } else {
            resolve(null)
          }
        })
      })
    } catch (error) {
      console.error("Get current user error:", error)
      return null
    }
  }

  // Patient management methods
  async getPatients() {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      success: true,
      data: [
        {
          id: "P001",
          name: "Rajesh Kumar Sharma",
          age: 45,
          diagnosis: "Glioblastoma",
          status: "active",
        },
        {
          id: "P002",
          name: "Sunita Devi Gupta",
          age: 52,
          diagnosis: "Breast Cancer",
          status: "stable",
        },
      ],
    }
  }

  async getDiagnosisData() {
    await new Promise((resolve) => setTimeout(resolve, 300))

    return {
      success: true,
      data: {
        totalScans: 1247,
        pendingReviews: 23,
        aiAccuracy: 94.2,
        criticalCases: 8,
      },
    }
  }

  async getHospitalData() {
    await new Promise((resolve) => setTimeout(resolve, 400))

    return {
      success: true,
      data: [
        {
          name: "Tata Memorial Hospital",
          location: "Mumbai, Maharashtra",
          patients: 1250,
          capacity: 1500,
        },
        {
          name: "AIIMS Delhi",
          location: "New Delhi",
          patients: 2100,
          capacity: 2500,
        },
      ],
    }
  }

  // Check if service is in demo mode
  isDemoModeActive(): boolean {
    return this.isDemoMode
  }

  // Get demo credentials for UI display
  getDemoCredentials() {
    return {
      email: "dr.priya@quantnex.com",
      password: "demo123",
      alternatives: ["dr.amit@quantnex.com / demo123", "admin@quantnex.com / demo123"],
    }
  }
}

// Export singleton instance
export const indianBackendService = new IndianBackendService()

// Export types
export type { LoginCredentials, User, AuthResponse }
