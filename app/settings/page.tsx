"use client"

import { SettingsPage } from "@/components/settings/settings-page"
import { NewMainLayout } from "@/components/layout/new-main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function Settings() {
  return (
    <ProtectedRoute>
      <NewMainLayout>
        <SettingsPage />
      </NewMainLayout>
    </ProtectedRoute>
  )
}
