"use client"

import { IndianComprehensiveDashboard } from "@/components/dashboard/indian-comprehensive-dashboard"
import { MainLayout } from "@/components/layout/main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <IndianComprehensiveDashboard />
      </MainLayout>
    </ProtectedRoute>
  )
}
