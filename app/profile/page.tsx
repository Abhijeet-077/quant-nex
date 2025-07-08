"use client"

import { ProtectedRoute } from "@/components/auth"
import { NewMainLayout } from "@/components/layout"
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
