"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Chrome,
  Shield,
  Stethoscope,
  Brain,
  Heart,
  AlertCircle,
  Info,
  CheckCircle,
} from "lucide-react"
import { indianBackendService } from "@/lib/indian-backend-service"
import { useAuth } from "@/contexts/auth-context"

export function EnhancedIndianLogin() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, isAuthenticated } = useAuth()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Get redirect URL from search params
  const redirectUrl = searchParams.get('redirect') || '/dashboard'

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectUrl)
    }
  }, [isAuthenticated, router, redirectUrl])

  // Get demo credentials for display
  const demoCredentials = indianBackendService.getDemoCredentials()
  const isDemoMode = indianBackendService.isDemoModeActive()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear errors when user starts typing
    if (error) setError("")
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await indianBackendService.login(formData)

      if (response.success && response.user) {
        setSuccess(`Welcome back, ${response.user.name}!`)

        // Store user data
        if (typeof window !== "undefined") {
          localStorage.setItem("quantnex-user", JSON.stringify(response.user))
          if (response.token) {
            localStorage.setItem("quantnex-token", response.token)
          }
        }

        // Update auth context
        login(response.user, response.token)

        // Redirect to intended page or dashboard
        setTimeout(() => {
          router.push(redirectUrl)
        }, 1000)
      } else {
        setError(response.error || "Login failed. Please try again.")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await indianBackendService.googleSignIn()

      if (response.success && response.user) {
        setSuccess(`Welcome, ${response.user.name}!`)

        // Store user data
        if (typeof window !== "undefined") {
          localStorage.setItem("quantnex-user", JSON.stringify(response.user))
          if (response.token) {
            localStorage.setItem("quantnex-token", response.token)
          }
        }

        // Update auth context
        login(response.user, response.token)

        // Redirect to intended page or dashboard
        setTimeout(() => {
          router.push(redirectUrl)
        }, 1000)
      } else {
        setError(response.error || "Google sign-in failed. Please try again.")
      }
    } catch (error: any) {
      console.error("Google sign-in error:", error)
      setError("Google sign-in failed. Please try email/password login.")
    } finally {
      setIsLoading(false)
    }
  }

  const fillDemoCredentials = () => {
    setFormData({
      email: demoCredentials.email,
      password: demoCredentials.password,
    })
    setError("")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 grid-pattern">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center animate-pulse-glow">
              <Brain className="h-6 w-6 text-teal-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-teal-400">Quant-NEX</h1>
              <p className="text-sm text-teal-300">Cancer Diagnosis System</p>
            </div>
          </div>
          <p className="text-gray-400">Sign in to access the medical dashboard</p>
        </div>

        {/* Demo Mode Alert */}
        {isDemoMode && (
          <Alert className="border-teal-500/30 bg-teal-900/20">
            <Info className="h-4 w-4 text-teal-400" />
            <AlertDescription className="text-teal-300">
              <div className="space-y-2">
                <p className="font-medium">Demo Mode Active</p>
                <p className="text-sm">Firebase not configured. Using demo authentication.</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fillDemoCredentials}
                  className="mt-2 text-teal-400 border-teal-500/30 hover:bg-teal-500/10 bg-transparent"
                >
                  Use Demo Credentials
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Login Form */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="text-center text-teal-400">Welcome Back</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-teal-300">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 bg-teal-900/20 border-teal-500/30 focus:border-teal-400"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-teal-300">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 bg-teal-900/20 border-teal-500/30 focus:border-teal-400"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert className="border-red-500/30 bg-red-900/20">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-300 whitespace-pre-line">{error}</AlertDescription>
                </Alert>
              )}

              {/* Success Alert */}
              {success && (
                <Alert className="border-green-500/30 bg-green-900/20">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <AlertDescription className="text-green-300">{success}</AlertDescription>
                </Alert>
              )}

              {/* Login Button */}
              <Button type="submit" className="w-full btn-glow-primary" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing In...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Sign In
                  </div>
                )}
              </Button>

              {/* Divider */}
              <div className="relative">
                <Separator className="bg-teal-500/30" />
                <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-sm text-gray-400">
                  or
                </span>
              </div>

              {/* Google Sign In */}
              <Button
                type="button"
                variant="outline"
                className="w-full glow-hover bg-transparent border-teal-500/30"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <Chrome className="h-4 w-4 mr-2" />
                Continue with Google
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials Info */}
        {isDemoMode && (
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="text-sm text-teal-400 flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                Demo Accounts Available
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Dr. Priya Patel (Oncologist)</span>
                  <Badge variant="outline" className="text-xs">
                    Tata Memorial
                  </Badge>
                </div>
                <p className="text-xs text-gray-400">dr.priya@quantnex.com / demo123</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Dr. Amit Gupta (Surgeon)</span>
                  <Badge variant="outline" className="text-xs">
                    AIIMS Delhi
                  </Badge>
                </div>
                <p className="text-xs text-gray-400">dr.amit@quantnex.com / demo123</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Rajesh Kumar (Admin)</span>
                  <Badge variant="outline" className="text-xs">
                    Apollo Hospital
                  </Badge>
                </div>
                <p className="text-xs text-gray-400">admin@quantnex.com / demo123</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto">
              <Brain className="h-5 w-5 text-teal-400" />
            </div>
            <p className="text-xs text-gray-400">AI Diagnosis</p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto">
              <Heart className="h-5 w-5 text-teal-400" />
            </div>
            <p className="text-xs text-gray-400">Patient Care</p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto">
              <Shield className="h-5 w-5 text-teal-400" />
            </div>
            <p className="text-xs text-gray-400">Secure Access</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>© 2024 Quant-NEX. Advanced Cancer Diagnosis System.</p>
          <p className="mt-1">Powered by AI • Trusted by Indian Hospitals</p>
        </div>
      </div>
    </div>
  )
}
