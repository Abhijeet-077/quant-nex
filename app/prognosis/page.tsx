"use client"

import { PrognosisPage } from "@/components/prognosis/prognosis-page"
import { NewMainLayout } from "@/components/layout/new-main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function Prognosis() {
  return (
    <ProtectedRoute>
      <NewMainLayout>
        <PrognosisPage />
      </NewMainLayout>
    </ProtectedRoute>
  )
}
