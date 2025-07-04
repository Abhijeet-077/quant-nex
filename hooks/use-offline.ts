import { useState, useEffect, useCallback } from 'react'

// Offline detection and management hook for medical applications
export function useOffline() {
  const [isOnline, setIsOnline] = useState(true)
  const [wasOffline, setWasOffline] = useState(false)
  const [offlineDuration, setOfflineDuration] = useState(0)
  const [lastOnlineTime, setLastOnlineTime] = useState<Date | null>(null)

  useEffect(() => {
    // Initialize online status
    setIsOnline(navigator.onLine)

    let offlineStartTime: Date | null = null
    let offlineTimer: NodeJS.Timeout | null = null

    const handleOnline = () => {
      setIsOnline(true)
      setWasOffline(true)
      setLastOnlineTime(new Date())
      
      // Calculate offline duration
      if (offlineStartTime) {
        const duration = Date.now() - offlineStartTime.getTime()
        setOfflineDuration(duration)
        offlineStartTime = null
      }

      // Clear offline timer
      if (offlineTimer) {
        clearInterval(offlineTimer)
        offlineTimer = null
      }

      // Reset wasOffline flag after 5 seconds
      setTimeout(() => setWasOffline(false), 5000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      offlineStartTime = new Date()
      
      // Start offline duration timer
      offlineTimer = setInterval(() => {
        if (offlineStartTime) {
          setOfflineDuration(Date.now() - offlineStartTime.getTime())
        }
      }, 1000)
    }

    // Add event listeners
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      if (offlineTimer) {
        clearInterval(offlineTimer)
      }
    }
  }, [])

  // Format offline duration for display
  const formatOfflineDuration = useCallback((duration: number) => {
    const seconds = Math.floor(duration / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`
    } else {
      return `${seconds}s`
    }
  }, [])

  return {
    isOnline,
    isOffline: !isOnline,
    wasOffline,
    offlineDuration,
    formattedOfflineDuration: formatOfflineDuration(offlineDuration),
    lastOnlineTime,
  }
}

// Hook for managing offline data queue
export function useOfflineQueue() {
  const [queuedRequests, setQueuedRequests] = useState<any[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const { isOnline } = useOffline()

  // Add request to offline queue
  const queueRequest = useCallback((request: {
    url: string
    method: string
    data?: any
    headers?: Record<string, string>
    priority?: 'low' | 'medium' | 'high' | 'critical'
  }) => {
    const queuedRequest = {
      ...request,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      priority: request.priority || 'medium',
    }

    setQueuedRequests(prev => {
      const updated = [...prev, queuedRequest]
      // Sort by priority (critical > high > medium > low)
      return updated.sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      })
    })

    // Store in localStorage for persistence
    const stored = localStorage.getItem('quantnex-offline-queue')
    const existingQueue = stored ? JSON.parse(stored) : []
    existingQueue.push(queuedRequest)
    localStorage.setItem('quantnex-offline-queue', JSON.stringify(existingQueue))

    return queuedRequest.id
  }, [])

  // Process queued requests when online
  const processQueue = useCallback(async () => {
    if (!isOnline || isProcessing || queuedRequests.length === 0) {
      return
    }

    setIsProcessing(true)

    try {
      const results = []
      
      for (const request of queuedRequests) {
        try {
          const response = await fetch(request.url, {
            method: request.method,
            headers: {
              'Content-Type': 'application/json',
              ...request.headers,
            },
            body: request.data ? JSON.stringify(request.data) : undefined,
          })

          if (response.ok) {
            results.push({ id: request.id, success: true, response })
            
            // Remove successful request from queue
            setQueuedRequests(prev => prev.filter(r => r.id !== request.id))
          } else {
            results.push({ id: request.id, success: false, error: response.statusText })
          }
        } catch (error) {
          results.push({ id: request.id, success: false, error: error.message })
        }
      }

      // Update localStorage
      const remainingRequests = queuedRequests.filter(
        request => !results.some(result => result.id === request.id && result.success)
      )
      localStorage.setItem('quantnex-offline-queue', JSON.stringify(remainingRequests))

      return results
    } finally {
      setIsProcessing(false)
    }
  }, [isOnline, isProcessing, queuedRequests])

  // Load queued requests from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('quantnex-offline-queue')
    if (stored) {
      try {
        const queue = JSON.parse(stored)
        setQueuedRequests(queue)
      } catch (error) {
        console.error('Failed to load offline queue:', error)
        localStorage.removeItem('quantnex-offline-queue')
      }
    }
  }, [])

  // Auto-process queue when coming online
  useEffect(() => {
    if (isOnline && queuedRequests.length > 0) {
      processQueue()
    }
  }, [isOnline, queuedRequests.length, processQueue])

  // Clear queue
  const clearQueue = useCallback(() => {
    setQueuedRequests([])
    localStorage.removeItem('quantnex-offline-queue')
  }, [])

  // Remove specific request from queue
  const removeFromQueue = useCallback((requestId: string) => {
    setQueuedRequests(prev => {
      const updated = prev.filter(r => r.id !== requestId)
      localStorage.setItem('quantnex-offline-queue', JSON.stringify(updated))
      return updated
    })
  }, [])

  return {
    queuedRequests,
    queueRequest,
    processQueue,
    clearQueue,
    removeFromQueue,
    isProcessing,
    queueSize: queuedRequests.length,
  }
}

// Hook for offline-capable medical data fetching
export function useOfflineCapableData<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    cacheTime?: number
    staleTime?: number
    retryOnReconnect?: boolean
  } = {}
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [isStale, setIsStale] = useState(false)
  
  const { isOnline, wasOffline } = useOffline()
  const { queueRequest } = useOfflineQueue()

  const {
    cacheTime = 24 * 60 * 60 * 1000, // 24 hours for offline data
    staleTime = 5 * 60 * 1000, // 5 minutes
    retryOnReconnect = true,
  } = options

  // Load data from cache
  const loadFromCache = useCallback(() => {
    try {
      const cached = localStorage.getItem(`quantnex-cache-${key}`)
      if (cached) {
        const { data: cachedData, timestamp } = JSON.parse(cached)
        const age = Date.now() - timestamp
        
        if (age < cacheTime) {
          setData(cachedData)
          setIsStale(age > staleTime)
          return true
        }
      }
    } catch (error) {
      console.error('Failed to load from cache:', error)
    }
    return false
  }, [key, cacheTime, staleTime])

  // Save data to cache
  const saveToCache = useCallback((data: T) => {
    try {
      const cacheEntry = {
        data,
        timestamp: Date.now(),
      }
      localStorage.setItem(`quantnex-cache-${key}`, JSON.stringify(cacheEntry))
    } catch (error) {
      console.error('Failed to save to cache:', error)
    }
  }, [key])

  // Fetch data
  const fetchData = useCallback(async () => {
    if (!isOnline) {
      // Try to load from cache when offline
      const hasCache = loadFromCache()
      if (!hasCache) {
        setError(new Error('No cached data available offline'))
      }
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const result = await fetcher()
      setData(result)
      setIsStale(false)
      saveToCache(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
      
      // Try to load from cache on error
      loadFromCache()
    } finally {
      setLoading(false)
    }
  }, [isOnline, fetcher, loadFromCache, saveToCache])

  // Initial load
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Retry when coming back online
  useEffect(() => {
    if (wasOffline && retryOnReconnect) {
      fetchData()
    }
  }, [wasOffline, retryOnReconnect, fetchData])

  // Mutate data (for optimistic updates)
  const mutate = useCallback((newData: T) => {
    setData(newData)
    saveToCache(newData)
    setIsStale(false)
  }, [saveToCache])

  return {
    data,
    loading,
    error,
    isStale,
    refetch: fetchData,
    mutate,
  }
}
