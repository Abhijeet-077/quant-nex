"use client"

import { IndianComprehensiveDashboard } from "@/components/dashboard"
import { NewMainLayout } from "@/components/layout"
import { ProtectedRoute } from "@/components/auth"

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <NewMainLayout>
        <IndianComprehensiveDashboard />
      </NewMainLayout>
    </ProtectedRoute>
  )
}
