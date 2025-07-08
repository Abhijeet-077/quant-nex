"use client"

import { ProtectedRoute } from "@/components/auth"
import { NewMainLayout } from "@/components/layout"
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
