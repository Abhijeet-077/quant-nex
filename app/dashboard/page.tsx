"use client"

import { IndianComprehensiveDashboard } from "@/components/dashboard/indian-comprehensive-dashboard"
import { NewMainLayout } from "@/components/layout/new-main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <NewMainLayout>
        <IndianComprehensiveDashboard />
      </NewMainLayout>
    </ProtectedRoute>
  )
}
