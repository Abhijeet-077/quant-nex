"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { NewMainLayout } from "@/components/layout/new-main-layout"
import { AdvancedBrainAnalysis } from "@/components/analysis/advanced-brain-analysis"

export default function AnalysisPage() {
  return (
    <ProtectedRoute>
      <NewMainLayout>
        <AdvancedBrainAnalysis />
      </NewMainLayout>
    </ProtectedRoute>
  )
}
