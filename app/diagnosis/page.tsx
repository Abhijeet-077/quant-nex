"use client"

import { DiagnosisPage } from "@/components/diagnosis/diagnosis-page"
import { NewMainLayout } from "@/components/layout/new-main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function Diagnosis() {
  return (
    <ProtectedRoute>
      <NewMainLayout>
        <DiagnosisPage />
      </NewMainLayout>
    </ProtectedRoute>
  )
}
