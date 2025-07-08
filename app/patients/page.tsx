"use client"

import { PatientsPage } from "@/components/patients/patients-page"
import { NewMainLayout } from "@/components/layout/new-main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function Patients() {
  return (
    <ProtectedRoute>
      <NewMainLayout>
        <PatientsPage />
      </NewMainLayout>
    </ProtectedRoute>
  )
}
