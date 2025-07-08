"use client"

import { MonitoringPage } from "@/components/monitoring/monitoring-page"
import { NewMainLayout } from "@/components/layout"
import { ProtectedRoute } from "@/components/auth"

export default function Monitoring() {
  return (
    <ProtectedRoute>
      <NewMainLayout>
        <MonitoringPage />
      </NewMainLayout>
    </ProtectedRoute>
  )
}
