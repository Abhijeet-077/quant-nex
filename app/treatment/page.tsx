"use client"

import { TreatmentPage } from "@/components/treatment/treatment-page"
import { NewMainLayout } from "@/components/layout/new-main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function Treatment() {
  return (
    <ProtectedRoute>
      <NewMainLayout>
        <TreatmentPage />
      </NewMainLayout>
    </ProtectedRoute>
  )
}
