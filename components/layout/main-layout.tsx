"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  LayoutDashboard,
  Stethoscope,
  Activity,
  Syringe,
  Users,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Download,
  User,
  BarChart3,
  TrendingUp,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { BreadcrumbNavigation } from "@/components/navigation/breadcrumb-navigation"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, current: false },
    { name: "Diagnosis", href: "/diagnosis", icon: Stethoscope, current: false },
    { name: "Prognosis", href: "/prognosis", icon: Activity, current: false },
    { name: "Treatment", href: "/treatment", icon: Syringe, current: false },
    { name: "Life Analysis", href: "/analysis", icon: TrendingUp, current: false },
    { name: "Monitoring", href: "/monitoring", icon: BarChart3, current: false },
    { name: "Patients", href: "/patients", icon: Users, current: false },
    { name: "Reports", href: "/reports", icon: FileText, current: false },
    { name: "Downloads", href: "/downloads", icon: Download, current: false },
    { name: "Profile", href: "/profile", icon: User, current: false },
    { name: "Settings", href: "/settings", icon: Settings, current: false },
    { name: "Support", href: "/support", icon: HelpCircle, current: false },
  ]

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-black/50 backdrop-blur-xl border-r border-teal-500/30 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-teal-500/30">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-teal-400" />
            <span className="text-xl font-bold text-teal-400">Quant-NEX</span>
          </div>
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 text-gray-300 rounded-lg hover:bg-teal-500/20 hover:text-teal-400 transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User info at bottom */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-teal-900/20 rounded-lg p-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="bg-teal-500 text-white">{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name || "User"}</p>
                <p className="text-xs text-teal-300 truncate">{user?.role || "Doctor"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-black/50 backdrop-blur-xl border-b border-teal-500/30">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients, reports..."
                  className="pl-10 pr-4 py-2 bg-teal-900/20 border border-teal-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-teal-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-500 text-xs">3</Badge>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-avatar.jpg" />
                      <AvatarFallback className="bg-teal-500 text-white">{user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-black/90 backdrop-blur-xl border-teal-500/30" align="end">
                  <DropdownMenuLabel className="text-teal-400">{user?.name || "User"}</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-teal-500/30" />
                  <DropdownMenuItem className="text-gray-300 hover:text-teal-400">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-300 hover:text-teal-400">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Support
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-teal-500/30" />
                  <DropdownMenuItem className="text-red-400 hover:text-red-300" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="min-h-screen bg-slate-900">
          <div className="p-6">
            <BreadcrumbNavigation />
          </div>
          {children}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
