"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { NewMainLayout } from "@/components/layout/new-main-layout"
import { DownloadManager } from "@/components/downloads/download-manager"

export default function DownloadsPage() {
  return (
    <ProtectedRoute>
      <NewMainLayout>
        <DownloadManager />
      </NewMainLayout>
    </ProtectedRoute>
  )
}
