"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { indianBackendService, type User } from "@/lib/indian-backend-service"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (user: User, token?: string) => void
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing user session
    const checkAuth = async () => {
      try {
        // First check localStorage for existing user
        if (typeof window !== "undefined") {
          const storedUser = localStorage.getItem("quantnex-user")
          const storedToken = localStorage.getItem("quantnex-token")

          if (storedUser && storedToken) {
            const userData = JSON.parse(storedUser)
            setUser(userData)
            // Ensure cookie is set
            document.cookie = `quantnex-token=${storedToken}; path=/; max-age=86400; SameSite=Lax`
            setIsLoading(false)
            return
          }
        }

        // If no stored data, try to get current user from service
        const currentUser = await indianBackendService.getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
        }
      } catch (error) {
        console.error("Auth check error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = (userData: User, token?: string) => {
    setUser(userData)
    if (typeof window !== "undefined") {
      localStorage.setItem("quantnex-user", JSON.stringify(userData))
      if (token) {
        localStorage.setItem("quantnex-token", token)
        // Also set cookie for middleware
        document.cookie = `quantnex-token=${token}; path=/; max-age=86400; SameSite=Lax`
      }
    }
  }

  const logout = async () => {
    try {
      await indianBackendService.logout()
      setUser(null)
      if (typeof window !== "undefined") {
        localStorage.removeItem("quantnex-user")
        localStorage.removeItem("quantnex-token")
        // Clear cookie
        document.cookie = "quantnex-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      }
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
