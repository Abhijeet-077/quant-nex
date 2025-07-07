"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Shield,
  Bell,
  Eye,
  Lock,
  Download,
  Upload,
  Edit,
  Save,
  Camera,
  Activity,
  Clock,
  Award,
} from "lucide-react"

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  role: string
  department: string
  hospital: string
  specialization: string
  licenseNumber: string
  experience: number
  avatar?: string
  bio: string
  address: string
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  preferences: {
    notifications: boolean
    emailUpdates: boolean
    dataSharing: boolean
    theme: "light" | "dark" | "auto"
    language: string
  }
  medicalHistory: {
    allergies: string[]
    medications: string[]
    conditions: string[]
    lastCheckup: string
  }
}

interface ActivityLog {
  id: string
  action: string
  timestamp: string
  details: string
  type: "login" | "report" | "diagnosis" | "treatment" | "system"
}

export function ProfileManagement() {
  const [activeTab, setActiveTab] = useState("personal")
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    id: "user1",
    name: "Dr. Kavya Sharma",
    email: "kavya.sharma@apollohospital.com",
    phone: "+91 98765 43210",
    role: "Senior Radiologist",
    department: "Medical Imaging",
    hospital: "Apollo Hospital, Delhi",
    specialization: "Neuroradiology",
    licenseNumber: "MCI-12345-2018",
    experience: 8,
    bio: "Experienced radiologist specializing in neuroimaging and brain tumor diagnosis. Passionate about leveraging AI technology to improve patient outcomes.",
    address: "123 Medical District, New Delhi, India 110001",
    emergencyContact: {
      name: "Dr. Rajesh Sharma",
      phone: "+91 98765 43211",
      relationship: "Spouse",
    },
    preferences: {
      notifications: true,
      emailUpdates: true,
      dataSharing: false,
      theme: "dark",
      language: "English",
    },
    medicalHistory: {
      allergies: ["Penicillin"],
      medications: ["Vitamin D3"],
      conditions: [],
      lastCheckup: "2024-01-15",
    },
  })

  const [activityLog] = useState<ActivityLog[]>([
    {
      id: "act1",
      action: "Generated comprehensive report",
      timestamp: "2024-02-20 14:30",
      details: "Created medical report for patient Rajesh Kumar",
      type: "report",
    },
    {
      id: "act2",
      action: "Completed AI diagnosis",
      timestamp: "2024-02-20 13:45",
      details: "Analyzed brain MRI scan using AI diagnostic tools",
      type: "diagnosis",
    },
    {
      id: "act3",
      action: "Updated treatment plan",
      timestamp: "2024-02-20 12:15",
      details: "Modified chemotherapy schedule for patient Priya Sharma",
      type: "treatment",
    },
    {
      id: "act4",
      action: "System login",
      timestamp: "2024-02-20 09:00",
      details: "Logged in from IP: 192.168.1.100",
      type: "login",
    },
  ])

  const handleSave = () => {
    setIsEditing(false)
    console.log("Profile saved:", profile)
  }

  const handleAvatarUpload = () => {
    console.log("Avatar upload triggered")
  }

  const exportProfile = () => {
    const profileData = {
      profile,
      achievements,
      recentActivity,
      timestamp: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(profileData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'quantnex-profile.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "login": return <User className="h-4 w-4 text-blue-400" />
      case "report": return <Download className="h-4 w-4 text-green-400" />
      case "diagnosis": return <Activity className="h-4 w-4 text-purple-400" />
      case "treatment": return <Calendar className="h-4 w-4 text-yellow-400" />
      default: return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="card-glow">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback className="text-lg bg-teal-600">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                onClick={handleAvatarUpload}
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
                  <p className="text-teal-400">{profile.role}</p>
                  <p className="text-gray-400">{profile.hospital}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={isEditing ? "default" : "outline"}
                    onClick={() => setIsEditing(!isEditing)}
                    className={isEditing ? "btn-glow-primary" : "glow-hover bg-transparent"}
                  >
                    {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                    {isEditing ? "Save" : "Edit"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={exportProfile}
                    className="glow-hover bg-transparent"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-300">{profile.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-300">{profile.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-300">{profile.experience} years experience</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="text-teal-400">Profile Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5 bg-teal-900/20 mb-6">
              <TabsTrigger value="personal" className="data-[state=active]:bg-teal-600 text-xs">
                Personal
              </TabsTrigger>
              <TabsTrigger value="professional" className="data-[state=active]:bg-teal-600 text-xs">
                Professional
              </TabsTrigger>
              <TabsTrigger value="medical" className="data-[state=active]:bg-teal-600 text-xs">
                Medical History
              </TabsTrigger>
              <TabsTrigger value="preferences" className="data-[state=active]:bg-teal-600 text-xs">
                Preferences
              </TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:bg-teal-600 text-xs">
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Full Name</label>
                    <Input
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                      className="bg-slate-800/50 border-slate-700/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Email Address</label>
                    <Input
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                      className="bg-slate-800/50 border-slate-700/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Phone Number</label>
                    <Input
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      className="bg-slate-800/50 border-slate-700/50"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Address</label>
                    <Textarea
                      value={profile.address}
                      onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                      disabled={!isEditing}
                      className="bg-slate-800/50 border-slate-700/50"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Bio</label>
                    <Textarea
                      value={profile.bio}
                      onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                      disabled={!isEditing}
                      className="bg-slate-800/50 border-slate-700/50"
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Name</label>
                    <Input
                      value={profile.emergencyContact.name}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        emergencyContact: { ...prev.emergencyContact, name: e.target.value }
                      }))}
                      disabled={!isEditing}
                      className="bg-slate-700/50 border-slate-600/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Phone</label>
                    <Input
                      value={profile.emergencyContact.phone}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
                      }))}
                      disabled={!isEditing}
                      className="bg-slate-700/50 border-slate-600/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Relationship</label>
                    <Input
                      value={profile.emergencyContact.relationship}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        emergencyContact: { ...prev.emergencyContact, relationship: e.target.value }
                      }))}
                      disabled={!isEditing}
                      className="bg-slate-700/50 border-slate-600/50"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="professional" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Role/Position</label>
                    <Input
                      value={profile.role}
                      onChange={(e) => setProfile(prev => ({ ...prev, role: e.target.value }))}
                      disabled={!isEditing}
                      className="bg-slate-800/50 border-slate-700/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Department</label>
                    <Input
                      value={profile.department}
                      onChange={(e) => setProfile(prev => ({ ...prev, department: e.target.value }))}
                      disabled={!isEditing}
                      className="bg-slate-800/50 border-slate-700/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Hospital/Institution</label>
                    <Input
                      value={profile.hospital}
                      onChange={(e) => setProfile(prev => ({ ...prev, hospital: e.target.value }))}
                      disabled={!isEditing}
                      className="bg-slate-800/50 border-slate-700/50"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Specialization</label>
                    <Input
                      value={profile.specialization}
                      onChange={(e) => setProfile(prev => ({ ...prev, specialization: e.target.value }))}
                      disabled={!isEditing}
                      className="bg-slate-800/50 border-slate-700/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">License Number</label>
                    <Input
                      value={profile.licenseNumber}
                      onChange={(e) => setProfile(prev => ({ ...prev, licenseNumber: e.target.value }))}
                      disabled={!isEditing}
                      className="bg-slate-800/50 border-slate-700/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Years of Experience</label>
                    <Input
                      type="number"
                      value={profile.experience}
                      onChange={(e) => setProfile(prev => ({ ...prev, experience: parseInt(e.target.value) || 0 }))}
                      disabled={!isEditing}
                      className="bg-slate-800/50 border-slate-700/50"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="medical" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-lg">Allergies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profile.medicalHistory.allergies.map((allergy, index) => (
                        <Badge key={index} variant="destructive" className="text-xs">
                          {allergy}
                        </Badge>
                      ))}
                      {profile.medicalHistory.allergies.length === 0 && (
                        <p className="text-gray-400 text-sm">No known allergies</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-lg">Current Medications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profile.medicalHistory.medications.map((medication, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {medication}
                        </Badge>
                      ))}
                      {profile.medicalHistory.medications.length === 0 && (
                        <p className="text-gray-400 text-sm">No current medications</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">Medical Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.medicalHistory.conditions.map((condition, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {condition}
                      </Badge>
                    ))}
                    {profile.medicalHistory.conditions.length === 0 && (
                      <p className="text-gray-400 text-sm">No known medical conditions</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Last Medical Checkup</label>
                <Input
                  type="date"
                  value={profile.medicalHistory.lastCheckup}
                  onChange={(e) => setProfile(prev => ({
                    ...prev,
                    medicalHistory: { ...prev.medicalHistory, lastCheckup: e.target.value }
                  }))}
                  disabled={!isEditing}
                  className="bg-slate-800/50 border-slate-700/50 max-w-xs"
                />
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-lg">Notifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-gray-400" />
                        <span className="text-white">Push Notifications</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={profile.preferences.notifications}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, notifications: e.target.checked }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-white">Email Updates</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={profile.preferences.emailUpdates}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, emailUpdates: e.target.checked }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-gray-400" />
                        <span className="text-white">Data Sharing</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={profile.preferences.dataSharing}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, dataSharing: e.target.checked }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-lg">Display Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Theme</label>
                      <select
                        value={profile.preferences.theme}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, theme: e.target.value as any }
                        }))}
                        disabled={!isEditing}
                        className="w-full p-2 rounded bg-slate-700/50 border border-slate-600/50 text-white"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Language</label>
                      <select
                        value={profile.preferences.language}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, language: e.target.value }
                        }))}
                        disabled={!isEditing}
                        className="w-full p-2 rounded bg-slate-700/50 border border-slate-600/50 text-white"
                      >
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Tamil">Tamil</option>
                        <option value="Bengali">Bengali</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activityLog.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/30"
                      >
                        {getActivityIcon(activity.type)}
                        <div className="flex-1">
                          <h4 className="text-white font-medium text-sm">{activity.action}</h4>
                          <p className="text-gray-400 text-xs">{activity.details}</p>
                          <p className="text-gray-500 text-xs mt-1">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {isEditing && (
            <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-slate-700/50">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="glow-hover bg-transparent"
              >
                Cancel
              </Button>
              <Button onClick={handleSave} className="btn-glow-primary">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
