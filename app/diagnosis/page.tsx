"use client"

import { DiagnosisPage } from "@/components/diagnosis/diagnosis-page"
import { NewMainLayout } from "@/components/layout"
import { ProtectedRoute } from "@/components/auth"

export default function Diagnosis() {
  return (
    <ProtectedRoute>
      <NewMainLayout>
        <DiagnosisPage />
      </NewMainLayout>
    </ProtectedRoute>
  )
}
