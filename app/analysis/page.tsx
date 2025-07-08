"use client"

import { ProtectedRoute } from "@/components/auth"
import { NewMainLayout } from "@/components/layout"
import { AdvancedBrainAnalysis } from "@/components/analysis"

export default function AnalysisPage() {
  return (
    <ProtectedRoute>
      <NewMainLayout>
        <AdvancedBrainAnalysis />
      </NewMainLayout>
    </ProtectedRoute>
  )
}
