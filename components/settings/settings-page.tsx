"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Settings, User, Bell, Shield, Database, Globe, Save, RefreshCw, Download, Upload } from "lucide-react"

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [settings, setSettings] = useState({
    // Profile settings
    name: "Dr. Rajesh Kumar Sharma",
    email: "rajesh.sharma@quantnex.com",
    phone: "+91 98765 43210",
    department: "Neurology",
    specialization: "Brain Tumor Surgery",
    bio: "Experienced neurosurgeon specializing in brain tumor treatment with over 15 years of clinical experience.",

    // Notification settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
    criticalAlerts: true,
    appointmentReminders: true,

    // Security settings
    twoFactorAuth: true,
    sessionTimeout: "30",
    passwordExpiry: "90",

    // System settings
    language: "en",
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    theme: "dark",

    // Data settings
    autoBackup: true,
    backupFrequency: "daily",
    dataRetention: "365",
    exportFormat: "pdf",
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const saveSettings = () => {
    // Save settings logic here
    console.log("Settings saved:", settings)
  }

  const resetSettings = () => {
    // Reset to default settings
    console.log("Settings reset to defaults")
  }

  const exportSettings = () => {
    const settingsData = {
      notifications: settings.notifications,
      privacy: settings.privacy,
      display: settings.display,
      timestamp: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(settingsData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'quantnex-settings.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importSettings = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const importedSettings = JSON.parse(e.target?.result as string)
            setSettings(prev => ({ ...prev, ...importedSettings }))
            alert('Settings imported successfully!')
          } catch (error) {
            alert('Error importing settings. Please check the file format.')
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-teal-400 flex items-center gap-3">
              <Settings className="h-8 w-8" />
              System Settings
            </h1>
            <p className="text-gray-300 mt-2">Configure your preferences and system settings</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportSettings} className="glow-hover bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" onClick={importSettings} className="glow-hover bg-transparent">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button onClick={saveSettings} className="btn-glow-primary">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-teal-900/20">
            <TabsTrigger value="profile" className="data-[state=active]:bg-teal-600">
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-teal-600">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-teal-600">
              Security
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-teal-600">
              System
            </TabsTrigger>
            <TabsTrigger value="data" className="data-[state=active]:bg-teal-600">
              Data
            </TabsTrigger>
            <TabsTrigger value="advanced" className="data-[state=active]:bg-teal-600">
              Advanced
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-teal-400 flex items-center gap-2">
                  <User className="h-6 w-6" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={settings.name}
                      onChange={(e) => handleSettingChange("name", e.target.value)}
                      className="bg-teal-900/20 border-teal-500/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => handleSettingChange("email", e.target.value)}
                      className="bg-teal-900/20 border-teal-500/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={settings.phone}
                      onChange={(e) => handleSettingChange("phone", e.target.value)}
                      className="bg-teal-900/20 border-teal-500/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={settings.department}
                      onValueChange={(value) => handleSettingChange("department", value)}
                    >
                      <SelectTrigger className="bg-teal-900/20 border-teal-500/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="neurology">Neurology</SelectItem>
                        <SelectItem value="oncology">Oncology</SelectItem>
                        <SelectItem value="radiology">Radiology</SelectItem>
                        <SelectItem value="pathology">Pathology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      value={settings.specialization}
                      onChange={(e) => handleSettingChange("specialization", e.target.value)}
                      className="bg-teal-900/20 border-teal-500/30"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    value={settings.bio}
                    onChange={(e) => handleSettingChange("bio", e.target.value)}
                    className="bg-teal-900/20 border-teal-500/30 min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-teal-400 flex items-center gap-2">
                  <Bell className="h-6 w-6" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-teal-900/10">
                    <div>
                      <h4 className="font-medium text-white">Email Notifications</h4>
                      <p className="text-sm text-gray-400">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-teal-900/10">
                    <div>
                      <h4 className="font-medium text-white">SMS Notifications</h4>
                      <p className="text-sm text-gray-400">Receive notifications via SMS</p>
                    </div>
                    <Switch
                      checked={settings.smsNotifications}
                      onCheckedChange={(checked) => handleSettingChange("smsNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-teal-900/10">
                    <div>
                      <h4 className="font-medium text-white">Push Notifications</h4>
                      <p className="text-sm text-gray-400">Receive browser push notifications</p>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-teal-900/10">
                    <div>
                      <h4 className="font-medium text-white">Weekly Reports</h4>
                      <p className="text-sm text-gray-400">Receive weekly summary reports</p>
                    </div>
                    <Switch
                      checked={settings.weeklyReports}
                      onCheckedChange={(checked) => handleSettingChange("weeklyReports", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-teal-900/10">
                    <div>
                      <h4 className="font-medium text-white">Critical Alerts</h4>
                      <p className="text-sm text-gray-400">Immediate alerts for critical events</p>
                    </div>
                    <Switch
                      checked={settings.criticalAlerts}
                      onCheckedChange={(checked) => handleSettingChange("criticalAlerts", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-teal-900/10">
                    <div>
                      <h4 className="font-medium text-white">Appointment Reminders</h4>
                      <p className="text-sm text-gray-400">Reminders for upcoming appointments</p>
                    </div>
                    <Switch
                      checked={settings.appointmentReminders}
                      onCheckedChange={(checked) => handleSettingChange("appointmentReminders", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-teal-400 flex items-center gap-2">
                  <Shield className="h-6 w-6" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-teal-900/10">
                  <div>
                    <h4 className="font-medium text-white">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(checked) => handleSettingChange("twoFactorAuth", checked)}
                    />
                    {settings.twoFactorAuth && (
                      <Badge variant="default" className="bg-green-600">
                        Enabled
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Select
                      value={settings.sessionTimeout}
                      onValueChange={(value) => handleSettingChange("sessionTimeout", value)}
                    >
                      <SelectTrigger className="bg-teal-900/20 border-teal-500/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                    <Select
                      value={settings.passwordExpiry}
                      onValueChange={(value) => handleSettingChange("passwordExpiry", value)}
                    >
                      <SelectTrigger className="bg-teal-900/20 border-teal-500/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button variant="outline" className="w-full glow-hover bg-transparent">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full glow-hover bg-transparent">
                    View Login History
                  </Button>
                  <Button variant="outline" className="w-full glow-hover bg-transparent">
                    Manage API Keys
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-teal-400 flex items-center gap-2">
                  <Globe className="h-6 w-6" />
                  System Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={settings.language} onValueChange={(value) => handleSettingChange("language", value)}>
                      <SelectTrigger className="bg-teal-900/20 border-teal-500/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                        <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                        <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                        <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={settings.timezone} onValueChange={(value) => handleSettingChange("timezone", value)}>
                      <SelectTrigger className="bg-teal-900/20 border-teal-500/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                        <SelectItem value="Asia/Mumbai">Asia/Mumbai (IST)</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select
                      value={settings.dateFormat}
                      onValueChange={(value) => handleSettingChange("dateFormat", value)}
                    >
                      <SelectTrigger className="bg-teal-900/20 border-teal-500/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select value={settings.theme} onValueChange={(value) => handleSettingChange("theme", value)}>
                      <SelectTrigger className="bg-teal-900/20 border-teal-500/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="auto">Auto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-teal-400 flex items-center gap-2">
                  <Database className="h-6 w-6" />
                  Data Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-teal-900/10">
                  <div>
                    <h4 className="font-medium text-white">Automatic Backup</h4>
                    <p className="text-sm text-gray-400">Automatically backup your data</p>
                  </div>
                  <Switch
                    checked={settings.autoBackup}
                    onCheckedChange={(checked) => handleSettingChange("autoBackup", checked)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="backupFrequency">Backup Frequency</Label>
                    <Select
                      value={settings.backupFrequency}
                      onValueChange={(value) => handleSettingChange("backupFrequency", value)}
                    >
                      <SelectTrigger className="bg-teal-900/20 border-teal-500/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dataRetention">Data Retention (days)</Label>
                    <Select
                      value={settings.dataRetention}
                      onValueChange={(value) => handleSettingChange("dataRetention", value)}
                    >
                      <SelectTrigger className="bg-teal-900/20 border-teal-500/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                        <SelectItem value="forever">Forever</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="exportFormat">Export Format</Label>
                    <Select
                      value={settings.exportFormat}
                      onValueChange={(value) => handleSettingChange("exportFormat", value)}
                    >
                      <SelectTrigger className="bg-teal-900/20 border-teal-500/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="xml">XML</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="glow-hover bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="outline" className="glow-hover bg-transparent">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                  </Button>
                  <Button variant="outline" className="glow-hover bg-transparent">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-teal-400 flex items-center gap-2">
                  <Settings className="h-6 w-6" />
                  Advanced Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-lg bg-yellow-900/20 border border-yellow-500/30">
                  <h4 className="font-medium text-yellow-400 mb-2">⚠️ Warning</h4>
                  <p className="text-sm text-gray-300">
                    These are advanced settings that can affect system performance and functionality. Please proceed
                    with caution and consult with your system administrator if needed.
                  </p>
                </div>

                <div className="space-y-4">
                  <Button variant="outline" className="w-full glow-hover bg-transparent">
                    Database Maintenance
                  </Button>
                  <Button variant="outline" className="w-full glow-hover bg-transparent">
                    Clear Cache
                  </Button>
                  <Button variant="outline" className="w-full glow-hover bg-transparent">
                    System Diagnostics
                  </Button>
                  <Button variant="outline" className="w-full glow-hover bg-transparent">
                    API Configuration
                  </Button>
                  <Button variant="outline" className="w-full glow-hover bg-transparent">
                    Integration Settings
                  </Button>
                </div>

                <div className="pt-4 border-t border-teal-500/30">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-white">Danger Zone</h4>
                  </div>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      onClick={resetSettings}
                      className="w-full border-red-500/50 text-red-400 hover:bg-red-900/20 bg-transparent"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reset All Settings
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-red-500/50 text-red-400 hover:bg-red-900/20 bg-transparent"
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
