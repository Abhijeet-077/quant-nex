"use client"

import { useState } from "react"
import { Bell, Key, Save, Shield, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { MainLayout } from "../layout/main-layout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"

export function SettingsPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  // Extract user data with fallbacks
  const firstName = user?.displayName?.split(' ')[0] || 'User'
  const lastName = user?.displayName?.split(' ').slice(1).join(' ') || ''
  const email = user?.email || ''
  const role = user?.role || 'User'
  const specialization = user?.specialization || ''
  const department = user?.department || ''
  const licenseNumber = user?.licenseNumber || ''

  // Generate initials for avatar
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      })
    }, 1000)
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-black p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white glow-text">Settings</h1>
              <p className="text-gray-300 mt-1">Manage your account and preferences</p>
            </div>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 button-glow hover:from-blue-600 hover:to-cyan-600"
            >
              {isSaving ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <Card className="card-glow border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white glow-text">Navigation</CardTitle>
                  <CardDescription className="text-gray-300">Choose a section to configure</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {[
                      { id: "profile", label: "Profile", icon: User },
                      { id: "account", label: "Account", icon: Key },
                      { id: "security", label: "Security", icon: Shield },
                      { id: "notifications", label: "Notifications", icon: Bell },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
                          activeTab === item.id
                            ? "bg-blue-500/20 text-blue-300 border-r-2 border-blue-400 neon-glow"
                            : "text-gray-300 hover:bg-black/30 hover:text-white"
                        }`}
                      >
                        <item.icon className="h-4 w-4 mr-3" />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
              <Card className="card-glow border-blue-500/30">
                {/* Profile Tab */}
                {activeTab === "profile" && (
                  <>
                    <CardHeader>
                      <CardTitle className="text-white glow-text">Profile Information</CardTitle>
                      <CardDescription className="text-gray-300">
                        Update your personal details and professional information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      {/* Avatar Section */}
                      <div className="flex flex-col items-center space-y-4 pb-6 border-b border-blue-500/20">
                        <Avatar className="h-24 w-24 ring-4 ring-blue-500/30 neon-glow">
                          <AvatarImage src={user?.photoURL || "/placeholder.svg?height=96&width=96"} alt={user?.displayName || "User"} />
                          <AvatarFallback className="bg-blue-600 text-white text-xl">{initials}</AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm" className="bg-black/30 border-blue-500/30 text-blue-300 hover:bg-blue-500/20">
                          Change Avatar
                        </Button>
                      </div>

                      {/* Form Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-white">
                            First Name
                          </Label>
                          <Input
                            id="firstName"
                            defaultValue={firstName}
                            className="bg-black/30 border-blue-500/30 text-white focus:border-blue-400 focus:ring-blue-400"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-white">
                            Last Name
                          </Label>
                          <Input
                            id="lastName"
                            defaultValue={lastName}
                            className="bg-black/30 border-blue-500/30 text-white focus:border-blue-400 focus:ring-blue-400"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          defaultValue={email}
                          className="bg-black/30 border-blue-500/30 text-white focus:border-blue-400 focus:ring-blue-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role" className="text-white">
                          Professional Role
                        </Label>
                        <Input
                          id="role"
                          defaultValue={`${role}${specialization ? ` - ${specialization}` : ''}`}
                          disabled
                          className="bg-black/30 border-blue-500/30 text-gray-400"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="department" className="text-white">
                            Department
                          </Label>
                          <Input
                            id="department"
                            defaultValue={department}
                            disabled
                            className="bg-black/30 border-blue-500/30 text-gray-400"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="licenseNumber" className="text-white">
                            License Number
                          </Label>
                          <Input
                            id="licenseNumber"
                            defaultValue={licenseNumber}
                            disabled
                            className="bg-black/30 border-blue-500/30 text-gray-400"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio" className="text-white">
                          Professional Bio
                        </Label>
                        <textarea
                          id="bio"
                          rows={4}
                          className="flex w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                          placeholder="Tell us about your medical expertise and experience"
                          defaultValue={`${role}${specialization ? ` specializing in ${specialization}` : ''} with expertise in advanced treatment protocols and AI-assisted diagnostics.`}
                        />
                      </div>
                    </CardContent>
                  </>
                )}

                {/* Account Tab */}
                {activeTab === "account" && (
                  <>
                    <CardHeader>
                      <CardTitle className="text-white">Account Settings</CardTitle>
                      <CardDescription className="text-slate-300">
                        Manage your account preferences and regional settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-white">
                          Username
                        </Label>
                        <Input
                          id="username"
                          defaultValue={email.split('@')[0]}
                          className="bg-white/5 border-white/20 text-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="language" className="text-white">
                            Language
                          </Label>
                          <select
                            id="language"
                            className="flex h-10 w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
                          >
                            <option value="en" className="bg-slate-800">
                              English
                            </option>
                            <option value="es" className="bg-slate-800">
                              Spanish
                            </option>
                            <option value="fr" className="bg-slate-800">
                              French
                            </option>
                            <option value="de" className="bg-slate-800">
                              German
                            </option>
                            <option value="zh" className="bg-slate-800">
                              Chinese
                            </option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="timezone" className="text-white">
                            Timezone
                          </Label>
                          <select
                            id="timezone"
                            className="flex h-10 w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
                          >
                            <option value="utc-8" className="bg-slate-800">
                              Pacific Time (UTC-8)
                            </option>
                            <option value="utc-5" className="bg-slate-800">
                              Eastern Time (UTC-5)
                            </option>
                            <option value="utc+0" className="bg-slate-800">
                              Greenwich Mean Time (UTC+0)
                            </option>
                            <option value="utc+1" className="bg-slate-800">
                              Central European Time (UTC+1)
                            </option>
                            <option value="utc+8" className="bg-slate-800">
                              China Standard Time (UTC+8)
                            </option>
                          </select>
                        </div>
                      </div>

                      {/* Danger Zone */}
                      <div className="mt-8 pt-6 border-t border-white/10">
                        <h3 className="text-lg font-medium text-white mb-4">Danger Zone</h3>
                        <div className="p-4 border border-red-500/20 rounded-lg bg-red-500/5">
                          <h4 className="text-red-400 font-medium mb-2">Delete Account</h4>
                          <p className="text-sm text-slate-300 mb-4">
                            Once you delete your account, there is no going back. Please be certain.
                          </p>
                          <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </>
                )}

                {/* Security Tab */}
                {activeTab === "security" && (
                  <>
                    <CardHeader>
                      <CardTitle className="text-white">Security Settings</CardTitle>
                      <CardDescription className="text-slate-300">
                        Manage your password and security preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      {/* Password Change */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-white">Change Password</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword" className="text-white">
                              Current Password
                            </Label>
                            <Input
                              id="currentPassword"
                              type="password"
                              className="bg-white/5 border-white/20 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="newPassword" className="text-white">
                              New Password
                            </Label>
                            <Input id="newPassword" type="password" className="bg-white/5 border-white/20 text-white" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-white">
                              Confirm New Password
                            </Label>
                            <Input
                              id="confirmPassword"
                              type="password"
                              className="bg-white/5 border-white/20 text-white"
                            />
                          </div>
                          <Button className="bg-purple-600 hover:bg-purple-700">Update Password</Button>
                        </div>
                      </div>

                      {/* Two-Factor Authentication */}
                      <div className="space-y-4 pt-6 border-t border-white/10">
                        <h3 className="text-lg font-medium text-white">Two-Factor Authentication</h3>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                          <div>
                            <p className="font-medium text-white">Enable 2FA</p>
                            <p className="text-sm text-slate-300">Add an extra layer of security to your account</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>

                      {/* Active Sessions */}
                      <div className="space-y-4 pt-6 border-t border-white/10">
                        <h3 className="text-lg font-medium text-white">Active Sessions</h3>
                        <div className="space-y-3">
                          <div className="p-4 bg-white/5 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-white">Current Session</p>
                                <p className="text-sm text-slate-300">Windows 11 • Chrome • New York, USA</p>
                                <p className="text-xs text-slate-400 mt-1">Started 2 hours ago</p>
                              </div>
                              <div className="flex items-center">
                                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                <span className="text-xs text-slate-300">Active</span>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 bg-white/5 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-white">Mobile Session</p>
                                <p className="text-sm text-slate-300">iOS 16 • Safari • New York, USA</p>
                                <p className="text-xs text-slate-400 mt-1">Started 1 day ago</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              >
                                <X className="h-4 w-4 mr-1" />
                                Revoke
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </>
                )}

                {/* Notifications Tab */}
                {activeTab === "notifications" && (
                  <>
                    <CardHeader>
                      <CardTitle className="text-white">Notification Preferences</CardTitle>
                      <CardDescription className="text-slate-300">
                        Choose how you want to be notified about important events
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      {/* Email Notifications */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-white">Email Notifications</h3>
                        <div className="space-y-4">
                          {[
                            {
                              id: "patient-updates",
                              label: "Patient Updates",
                              description: "Receive updates about your patients",
                              defaultChecked: true,
                            },
                            {
                              id: "treatment-alerts",
                              label: "Treatment Alerts",
                              description: "Receive alerts about treatment progress",
                              defaultChecked: true,
                            },
                            {
                              id: "system-updates",
                              label: "System Updates",
                              description: "Receive updates about system changes",
                              defaultChecked: false,
                            },
                            {
                              id: "marketing",
                              label: "Marketing",
                              description: "Receive marketing and promotional emails",
                              defaultChecked: false,
                            },
                          ].map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                              <div>
                                <p className="font-medium text-white">{item.label}</p>
                                <p className="text-sm text-slate-300">{item.description}</p>
                              </div>
                              <Switch defaultChecked={item.defaultChecked} />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Push Notifications */}
                      <div className="space-y-4 pt-6 border-t border-white/10">
                        <h3 className="text-lg font-medium text-white">Push Notifications</h3>
                        <div className="space-y-4">
                          {[
                            {
                              id: "critical-alerts",
                              label: "Critical Alerts",
                              description: "Receive critical alerts about patients",
                              defaultChecked: true,
                            },
                            {
                              id: "ai-insights",
                              label: "AI Insights",
                              description: "Receive notifications about new AI insights",
                              defaultChecked: true,
                            },
                            {
                              id: "collaboration",
                              label: "Collaboration",
                              description: "Receive notifications about collaboration requests",
                              defaultChecked: true,
                            },
                          ].map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                              <div>
                                <p className="font-medium text-white">{item.label}</p>
                                <p className="text-sm text-slate-300">{item.description}</p>
                              </div>
                              <Switch defaultChecked={item.defaultChecked} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
