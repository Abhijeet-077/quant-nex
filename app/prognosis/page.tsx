"use client"

import { PrognosisPage } from "@/components/prognosis/prognosis-page"
import { MainLayout } from "@/components/layout/main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function Prognosis() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <PrognosisPage />
      </MainLayout>
    </ProtectedRoute>
  )
}
