"use client"

import { ProtectedRoute } from "@/components/auth"
import { NewMainLayout } from "@/components/layout"
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
