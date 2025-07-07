"use client"

import { MonitoringPage } from "@/components/monitoring/monitoring-page"
import { NewMainLayout } from "@/components/layout/new-main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function Monitoring() {
  return (
    <ProtectedRoute>
      <NewMainLayout>
        <MonitoringPage />
      </NewMainLayout>
    </ProtectedRoute>
  )
}
