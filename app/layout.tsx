import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0d9488',
}

export const metadata: Metadata = {
  title: "Quant-NEX - AI-Powered Medical Diagnosis Platform",
  description:
    "Revolutionary AI-powered platform for brain tumor diagnosis, treatment planning, and patient monitoring. Trusted by healthcare professionals worldwide.",
  keywords:
    "AI medical diagnosis, brain tumor detection, healthcare technology, medical AI, patient monitoring, treatment planning",
  authors: [{ name: "Quant-NEX Team" }],
  robots: "index, follow",
  metadataBase: new URL('https://quant-nex-git-master-abhijeetswami077gmailcoms-projects.vercel.app'),
  openGraph: {
    title: "Quant-NEX - AI-Powered Medical Diagnosis Platform",
    description:
      "Revolutionary AI-powered platform for brain tumor diagnosis, treatment planning, and patient monitoring.",
    type: "website",
    url: "https://quantnex.com",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Quant-NEX AI Medical Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quant-NEX - AI-Powered Medical Diagnosis Platform",
    description:
      "Revolutionary AI-powered platform for brain tumor diagnosis, treatment planning, and patient monitoring.",
    images: ["/og-image.jpg"],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${inter.className} antialiased dark`} suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
