"use client"

import { SupportPage } from "@/components/support/support-page"
import { NewMainLayout } from "@/components/layout/new-main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function Support() {
  return (
    <ProtectedRoute>
      <NewMainLayout>
        <SupportPage />
      </NewMainLayout>
    </ProtectedRoute>
  )
}
