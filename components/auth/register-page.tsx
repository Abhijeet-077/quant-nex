"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
  User,
  Chrome,
  Shield,
  Stethoscope,
  Brain,
  Heart,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
} from "lucide-react"
import { ParticleBackground } from "../ui-effects/particle-background"

export function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    hospital: "",
    specialization: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    try {
      // Simulate registration
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setSuccess("Account created successfully! Redirecting to login...")
      
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err) {
      setError("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    setError("")
    
    try {
      // Simulate Google sign up
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSuccess("Google account created successfully! Redirecting...")
      
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (err) {
      setError("Google sign-up failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-teal-950 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <ParticleBackground />
      
      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
              <Brain className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-teal-400">Quant-NEX</h1>
              <p className="text-sm text-teal-300">Cancer Diagnosis System</p>
            </div>
          </div>
          <p className="text-gray-400">Create your medical professional account</p>
        </div>

        {/* Back to Login */}
        <div className="flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/login')}
            className="text-teal-400 hover:text-teal-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Button>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <Alert className="border-red-500/30 bg-red-900/20">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-300">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-500/30 bg-green-900/20">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-green-300">{success}</AlertDescription>
          </Alert>
        )}

        {/* Registration Form */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="text-teal-400 text-center">Create Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Dr. John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="pl-10 bg-teal-900/20 border-teal-500/30"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="doctor@hospital.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="pl-10 bg-teal-900/20 border-teal-500/30"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hospital" className="text-gray-300">Hospital</Label>
                  <Input
                    id="hospital"
                    type="text"
                    placeholder="AIIMS Delhi"
                    value={formData.hospital}
                    onChange={(e) => setFormData({...formData, hospital: e.target.value})}
                    className="bg-teal-900/20 border-teal-500/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization" className="text-gray-300">Specialization</Label>
                  <Input
                    id="specialization"
                    type="text"
                    placeholder="Oncology"
                    value={formData.specialization}
                    onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                    className="bg-teal-900/20 border-teal-500/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="pl-10 pr-10 bg-teal-900/20 border-teal-500/30"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="pl-10 pr-10 bg-teal-900/20 border-teal-500/30"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full btn-glow-primary"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full bg-teal-500/30" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-950 px-2 text-gray-400">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full glow-hover bg-transparent"
                onClick={handleGoogleSignUp}
                disabled={isLoading}
              >
                <Chrome className="h-4 w-4 mr-2" />
                Sign up with Google
              </Button>
            </form>
          </CardContent>
        </Card>

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
