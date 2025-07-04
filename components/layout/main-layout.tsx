"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Activity,
  BarChart3,
  BrainCircuit,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileText,
  FlaskConical,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Syringe,
  User,
  Users,
  X,
} from "lucide-react"
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleProfileAction = (action: string) => {
    switch (action) {
      case "profile":
        router.push("/profile")
        break
      case "settings":
        router.push("/settings")
        break
      case "logout":
        // Handle logout logic here
        console.log("Logging out...")
        router.push("/login")
        break
      default:
        console.log(`Unknown profile action: ${action}`)
    }
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Diagnosis", href: "/diagnosis", icon: FlaskConical },
    { name: "Prognosis", href: "/prognosis", icon: Activity },
    { name: "Treatment", href: "/treatment", icon: Syringe },
    { name: "Monitoring", href: "/monitoring", icon: Activity },
    { name: "Patients", href: "/patients", icon: Users },
    { name: "Schedule", href: "/schedule", icon: Calendar },
    { name: "Consultation", href: "/consultation", icon: MessageSquare },
    { name: "Reports", href: "/reports", icon: FileText },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
  ]

  const secondaryNavigation = [
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Help & Support", href: "/support", icon: MessageSquare },
  ]

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Skip Navigation Links */}
      <nav aria-label="Skip navigation" className="sr-only focus-within:not-sr-only">
        <a
          href="#main-content"
          className="absolute top-4 left-4 z-50 px-4 py-2 bg-blue-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span>Skip to main content</span>
        </a>
        <a
          href="#navigation"
          className="absolute top-4 left-32 z-50 px-4 py-2 bg-blue-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span>Skip to navigation</span>
        </a>
      </nav>
      {/* Desktop Sidebar */}
      <aside
        id="navigation"
        className={`hidden md:flex flex-col ${
          isSidebarOpen ? "w-64" : "w-20"
        } card-glow border-r border-blue-500/30 transition-all duration-300`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
          <div className={`flex items-center ${isSidebarOpen ? "" : "justify-center w-full"}`}>
            {isSidebarOpen ? (
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
                Quant-NEX
              </h1>
            ) : (
              <BrainCircuit className="h-8 w-8 text-purple-500" />
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-gray-400 hover:text-white">
            {isSidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2" aria-label="Primary navigation">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center ${isSidebarOpen ? "px-3" : "justify-center"} py-2 rounded-md ${
                    isActive ? "bg-purple-900/50 text-white" : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                  } transition-colors`}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {isSidebarOpen && <span className="ml-3"><span>{item.name}</span></span>}
                </Link>
              )
            })}
          </nav>

          <div className="mt-8">
            <h3
              className={`${
                isSidebarOpen ? "px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider" : "sr-only"
              }`}
            >
              <span>Support</span>
            </h3>
            <nav className="mt-2 space-y-1 px-2">
              {secondaryNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center ${isSidebarOpen ? "px-3" : "justify-center"} py-2 rounded-md ${
                      isActive ? "bg-purple-900/50 text-white" : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                    } transition-colors`}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {isSidebarOpen && <span className="ml-3"><span>{item.name}</span></span>}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>

        <div className={`p-4 border-t border-white/10 ${isSidebarOpen ? "" : "flex justify-center"}`}>
          {isSidebarOpen ? (
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Dr. Rajesh Sharma" />
                <AvatarFallback>RS</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium"><span>Dr. Rajesh Sharma</span></p>
                <p className="text-xs text-gray-500"><span>Oncologist</span></p>
              </div>
            </div>
          ) : (
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Dr. Rajesh Sharma" />
              <AvatarFallback>RS</AvatarFallback>
            </Avatar>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden absolute top-4 left-4 z-50">
            <Menu className="h-6 w-6" />
            <span className="sr-only"><span>Toggle menu</span></span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-black/95 border-r border-white/10">
          <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
              Quant-NEX
            </h1>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </Button>
            </SheetTrigger>
          </div>

          <div className="py-4">
            <nav className="space-y-1 px-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md ${
                      isActive ? "bg-purple-900/50 text-white" : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                    } transition-colors`}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="ml-3"><span>{item.name}</span></span>
                  </Link>
                )
              })}
            </nav>

            <div className="mt-8">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"><span>Support</span></h3>
              <nav className="mt-2 space-y-1 px-2">
                {secondaryNavigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-3 py-2 rounded-md ${
                        isActive ? "bg-purple-900/50 text-white" : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                      } transition-colors`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="ml-3"><span>{item.name}</span></span>
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Dr. Rajesh Sharma" />
                <AvatarFallback>RS</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium"><span>Dr. Rajesh Sharma</span></p>
                <p className="text-xs text-gray-500"><span>Oncologist</span></p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="sr-only" id="main-content-label"><span>Main content area</span></div>
        {/* Top Navigation */}
        <header className="h-16 bg-black/30 backdrop-blur-sm border-b border-white/10 flex items-center justify-end px-4">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="hidden md:flex">
              <ClipboardList className="h-4 w-4 mr-2" />
              <span>New Patient</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Dr. Rajesh Sharma" />
                    <AvatarFallback>RS</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-black/95 border-blue-500/30">
                <DropdownMenuLabel className="text-white"><span>My Account</span></DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-blue-500/30" />
                <DropdownMenuItem
                  className="text-white hover:bg-blue-500/20 cursor-pointer"
                  onClick={() => handleProfileAction("profile")}
                >
                  <User className="h-4 w-4 mr-2" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-white hover:bg-blue-500/20 cursor-pointer"
                  onClick={() => handleProfileAction("settings")}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-blue-500/30" />
                <DropdownMenuItem
                  className="text-white hover:bg-red-500/20 cursor-pointer"
                  onClick={() => handleProfileAction("logout")}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto"
          role="main"
          aria-labelledby="main-content-label"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
