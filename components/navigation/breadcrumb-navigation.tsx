"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href: string
  current?: boolean
}

export function BreadcrumbNavigation() {
  const pathname = usePathname()

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname.split('/').filter(segment => segment !== '')
    
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/' }
    ]

    // Map path segments to readable labels
    const pathLabels: Record<string, string> = {
      'dashboard': 'Dashboard',
      'diagnosis': 'AI Diagnosis',
      'prognosis': 'Prognosis Analysis',
      'treatment': 'Treatment Planning',
      'analysis': 'Life Analysis',
      'monitoring': 'Patient Monitoring',
      'patients': 'Patient Management',
      'reports': 'Medical Reports',
      'downloads': 'Download Center',
      'profile': 'User Profile',
      'settings': 'Settings',
      'support': 'Support Center',
      'login': 'Login',
    }

    let currentPath = ''
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const label = pathLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
      const isLast = index === pathSegments.length - 1
      
      breadcrumbs.push({
        label,
        href: currentPath,
        current: isLast
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  // Don't show breadcrumbs on landing page or login page
  if (pathname === '/' || pathname === '/login') {
    return null
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-400 mb-6">
      {breadcrumbs.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-2 text-gray-500" />}
          
          {index === 0 ? (
            <Link
              href={item.href}
              className="flex items-center gap-1 hover:text-teal-400 transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          ) : item.current ? (
            <span className="text-teal-400 font-medium">{item.label}</span>
          ) : (
            <Link
              href={item.href}
              className="hover:text-teal-400 transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}
