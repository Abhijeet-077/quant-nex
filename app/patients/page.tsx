"use client"

import { PatientsPage } from "@/components/patients/patients-page"
import { NewMainLayout } from "@/components/layout"
import { ProtectedRoute } from "@/components/auth"

export default function Patients() {
  return (
    <ProtectedRoute>
      <NewMainLayout>
        <PatientsPage />
      </NewMainLayout>
    </ProtectedRoute>
  )
}
