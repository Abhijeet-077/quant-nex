import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/auth-context"
import { AccessibilityProvider } from "@/components/accessibility/accessibility-provider"
import "./globals.css"

export const metadata = {
  title: "Quant-NEX | Advanced Oncology Platform",
  description:
    "AI-powered cancer detection, quantum-enhanced treatment optimization, and interactive 3D visualization of medical data",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
          storageKey="quant-nex-theme"
        >
          <AccessibilityProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </AccessibilityProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
