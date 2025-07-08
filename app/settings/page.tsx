"use client"

import { SettingsPage } from "@/components/settings/settings-page"
import { NewMainLayout } from "@/components/layout"
import { ProtectedRoute } from "@/components/auth"

export default function Settings() {
  return (
    <ProtectedRoute>
      <NewMainLayout>
        <SettingsPage />
      </NewMainLayout>
    </ProtectedRoute>
  )
}
