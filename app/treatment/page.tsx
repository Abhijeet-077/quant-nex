"use client"

import { TreatmentPage } from "@/components/treatment/treatment-page"
import { NewMainLayout } from "@/components/layout"
import { ProtectedRoute } from "@/components/auth"

export default function Treatment() {
  return (
    <ProtectedRoute>
      <NewMainLayout>
        <TreatmentPage />
      </NewMainLayout>
    </ProtectedRoute>
  )
}
