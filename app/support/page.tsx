"use client"

import { SupportPage } from "@/components/support/support-page"
import { NewMainLayout } from "@/components/layout"
import { ProtectedRoute } from "@/components/auth"

export default function Support() {
  return (
    <ProtectedRoute>
      <NewMainLayout>
        <SupportPage />
      </NewMainLayout>
    </ProtectedRoute>
  )
}
