"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { NewMainLayout } from "@/components/layout/new-main-layout"
import { LifeAnalysisModule } from "@/components/analysis/life-analysis-module"

export default function AnalysisPage() {
  return (
    <ProtectedRoute>
      <NewMainLayout>
        <LifeAnalysisModule />
      </NewMainLayout>
    </ProtectedRoute>
  )
}
