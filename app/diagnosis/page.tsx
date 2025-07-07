"use client"

import { DiagnosisPage } from "@/components/diagnosis/diagnosis-page"
import { MainLayout } from "@/components/layout/main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function Diagnosis() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <DiagnosisPage />
      </MainLayout>
    </ProtectedRoute>
  )
}
