"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { NewMainLayout } from "@/components/layout/new-main-layout"
import { ReportGenerationSystem } from "@/components/reports/report-generation-system"

export default function Reports() {
  return (
    <ProtectedRoute>
      <NewMainLayout>
        <ReportGenerationSystem />
      </NewMainLayout>
    </ProtectedRoute>
  )
}
