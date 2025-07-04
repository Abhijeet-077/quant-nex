'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to your analytics service
    console.error('Global error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="error-container">
          <h2>Something went wrong!</h2>
          <p>We've logged this issue and will fix it soon.</p>
          <button onClick={() => reset()}>Try again</button>
        </div>
      </body>
    </html>
  )
}