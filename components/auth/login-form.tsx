"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Fingerprint, KeyRound, Loader2, LogIn, Mail, ShieldCheck, User } from "lucide-react"
import { ParticleBackground } from "../ui-effects/particle-background"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { indianBackendService } from "@/lib/indian-backend-service"

export function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("login")

  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Register form state
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [role, setRole] = useState("")
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await indianBackendService.login({ email: loginEmail, password: loginPassword })

      if (response.success && response.user) {
        login(response.user, response.token)
        toast({
          title: "Login successful",
          description: "Welcome back to Quant-NEX!",
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Login failed",
          description: response.error || "Invalid credentials. Please try again.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate passwords match
    if (registerPassword !== confirmPassword) {
      toast({
        title: "Registration failed",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Validate terms agreement
    if (!agreeToTerms) {
      toast({
        title: "Registration failed",
        description: "You must agree to the Terms of Service and Privacy Policy.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const userData = {
        firstName,
        lastName,
        role,
      }

      // For now, just show a message that registration is not implemented
      toast({
        title: "Registration not available",
        description: "Please contact your administrator to create an account.",
        variant: "destructive",
      })
      setIsLoading(false)
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Registration failed",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center p-4">
      {/* Particle Background */}
      <div className="fixed inset-0 z-0">
        <ParticleBackground />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-black/30 backdrop-blur-sm border border-purple-900/30 rounded-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
              Quant-NEX
            </h1>
            <p className="text-gray-400 mt-2">Advanced Oncology Platform</p>
          </div>

          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger value="login" className="data-[state=active]:bg-purple-900/50">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-purple-900/50">
                <User className="h-4 w-4 mr-2" />
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="doctor@hospital.com"
                      className="pl-10"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="#" className="text-xs text-purple-400 hover:text-purple-300">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm">
                    Remember me
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </>
                  )}
                </Button>

                <div className="relative flex items-center justify-center mt-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative px-4 bg-black/30 text-sm text-gray-400">Or continue with</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" type="button" className="w-full">
                    <Fingerprint className="h-4 w-4 mr-2" />
                    Biometric
                  </Button>
                  <Button variant="outline" type="button" className="w-full">
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    SSO
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registerEmail">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="registerEmail"
                      type="email"
                      placeholder="doctor@hospital.com"
                      className="pl-10"
                      required
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registerPassword">Password</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="registerPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      required
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="">Select a role</option>
                    <option value="doctor">Doctor</option>
                    <option value="researcher">Researcher</option>
                    <option value="administrator">Administrator</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    required
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the{" "}
                    <Link href="#" className="text-purple-400 hover:text-purple-300">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-purple-400 hover:text-purple-300">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <User className="h-4 w-4 mr-2" />
                      Create Account
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  )
}
