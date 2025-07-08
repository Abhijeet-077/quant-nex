"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { NewMainLayout } from "@/components/layout/new-main-layout"
import { ProfileManagement } from "@/components/profile/profile-management"

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <NewMainLayout>
        <ProfileManagement />
      </NewMainLayout>
    </ProtectedRoute>
  )
}
