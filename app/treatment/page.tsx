"use client"

import { TreatmentPage } from "@/components/treatment/treatment-page"
import { MainLayout } from "@/components/layout/main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function Treatment() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <TreatmentPage />
      </MainLayout>
    </ProtectedRoute>
  )
}
