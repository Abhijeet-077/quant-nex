"use client"

import { PrognosisPage } from "@/components/prognosis/prognosis-page"
import { NewMainLayout } from "@/components/layout"
import { ProtectedRoute } from "@/components/auth"

export default function Prognosis() {
  return (
    <ProtectedRoute>
      <NewMainLayout>
        <PrognosisPage />
      </NewMainLayout>
    </ProtectedRoute>
  )
}
