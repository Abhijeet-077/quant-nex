// Medical Data Caching System with HIPAA Compliance

interface CacheItem<T> {
  data: T
  timestamp: number
  expiresAt: number
  encrypted: boolean
  patientId?: string
  accessCount: number
  lastAccessed: number
}

interface CacheOptions {
  ttl?: number // Time to live in milliseconds
  encrypt?: boolean // Whether to encrypt sensitive data
  maxSize?: number // Maximum cache size
  patientSpecific?: boolean // Whether this is patient-specific data
}

// Medical Data Cache with HIPAA compliance
export class MedicalDataCache {
  private cache: Map<string, CacheItem<any>> = new Map()
  private maxSize: number
  private defaultTTL: number
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor(maxSize: number = 1000, defaultTTL: number = 5 * 60 * 1000) { // 5 minutes default
    this.maxSize = maxSize
    this.defaultTTL = defaultTTL
    this.startCleanup()
  }

  // Set data in cache with medical compliance
  set<T>(
    key: string, 
    data: T, 
    options: CacheOptions = {}
  ): void {
    const {
      ttl = this.defaultTTL,
      encrypt = false,
      patientSpecific = false
    } = options

    // Enforce shorter TTL for patient-specific data (HIPAA compliance)
    const actualTTL = patientSpecific ? Math.min(ttl, 10 * 60 * 1000) : ttl // Max 10 minutes for patient data

    const now = Date.now()
    const item: CacheItem<T> = {
      data: encrypt ? this.encryptData(data) : data,
      timestamp: now,
      expiresAt: now + actualTTL,
      encrypted: encrypt,
      patientId: patientSpecific ? this.extractPatientId(key) : undefined,
      accessCount: 0,
      lastAccessed: now
    }

    // Evict oldest items if cache is full
    if (this.cache.size >= this.maxSize) {
      this.evictOldest()
    }

    this.cache.set(key, item)
    this.auditCacheAccess('SET', key, item.patientId)
  }

  // Get data from cache
  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }

    // Check if expired
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key)
      this.auditCacheAccess('EXPIRED', key, item.patientId)
      return null
    }

    // Update access statistics
    item.accessCount++
    item.lastAccessed = Date.now()

    this.auditCacheAccess('GET', key, item.patientId)

    // Decrypt if necessary
    return item.encrypted ? this.decryptData(item.data) : item.data
  }

  // Check if key exists and is not expired
  has(key: string): boolean {
    const item = this.cache.get(key)
    if (!item) return false
    
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key)
      return false
    }
    
    return true
  }

  // Delete specific key
  delete(key: string): boolean {
    const item = this.cache.get(key)
    if (item) {
      this.auditCacheAccess('DELETE', key, item.patientId)
    }
    return this.cache.delete(key)
  }

  // Clear all patient-specific data (HIPAA compliance)
  clearPatientData(patientId: string): void {
    const keysToDelete: string[] = []
    
    for (const [key, item] of this.cache.entries()) {
      if (item.patientId === patientId) {
        keysToDelete.push(key)
      }
    }
    
    keysToDelete.forEach(key => {
      this.cache.delete(key)
      this.auditCacheAccess('CLEAR_PATIENT', key, patientId)
    })
  }

  // Clear all cache
  clear(): void {
    this.auditCacheAccess('CLEAR_ALL', 'ALL', undefined)
    this.cache.clear()
  }

  // Get cache statistics
  getStats() {
    const now = Date.now()
    let expiredCount = 0
    let patientDataCount = 0
    let encryptedCount = 0
    let totalAccessCount = 0

    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) expiredCount++
      if (item.patientId) patientDataCount++
      if (item.encrypted) encryptedCount++
      totalAccessCount += item.accessCount
    }

    return {
      totalItems: this.cache.size,
      expiredItems: expiredCount,
      patientDataItems: patientDataCount,
      encryptedItems: encryptedCount,
      totalAccesses: totalAccessCount,
      maxSize: this.maxSize,
      utilizationPercent: (this.cache.size / this.maxSize) * 100
    }
  }

  // Private methods
  private evictOldest(): void {
    let oldestKey = ''
    let oldestTime = Date.now()

    for (const [key, item] of this.cache.entries()) {
      if (item.lastAccessed < oldestTime) {
        oldestTime = item.lastAccessed
        oldestKey = key
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey)
      this.auditCacheAccess('EVICTED', oldestKey, this.cache.get(oldestKey)?.patientId)
    }
  }

  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now()
      const keysToDelete: string[] = []

      for (const [key, item] of this.cache.entries()) {
        if (now > item.expiresAt) {
          keysToDelete.push(key)
        }
      }

      keysToDelete.forEach(key => this.cache.delete(key))
    }, 60000) // Cleanup every minute
  }

  private encryptData<T>(data: T): string {
    // In production, use proper encryption (AES-256)
    return Buffer.from(JSON.stringify(data)).toString('base64')
  }

  private decryptData<T>(encryptedData: string): T {
    // In production, use proper decryption
    return JSON.parse(Buffer.from(encryptedData, 'base64').toString())
  }

  private extractPatientId(key: string): string | undefined {
    // Extract patient ID from cache key (e.g., "patient:123:reports")
    const match = key.match(/patient:([^:]+)/)
    return match ? match[1] : undefined
  }

  private auditCacheAccess(action: string, key: string, patientId?: string): void {
    // HIPAA compliance: audit all cache access
    const auditEntry = {
      timestamp: new Date().toISOString(),
      action,
      cacheKey: key,
      patientId,
      userId: 'system', // In production, get from session
    }
    
    // In production, send to secure audit logging system
    console.log('CACHE_AUDIT:', auditEntry)
  }

  // Cleanup on destruction
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
    this.clear()
  }
}

// Specialized caches for different data types
export const patientDataCache = new MedicalDataCache(500, 5 * 60 * 1000) // 5 minutes
export const reportCache = new MedicalDataCache(200, 15 * 60 * 1000) // 15 minutes
export const imageCache = new MedicalDataCache(100, 30 * 60 * 1000) // 30 minutes
export const analyticsCache = new MedicalDataCache(50, 60 * 60 * 1000) // 1 hour

// Cache key generators
export const CacheKeys = {
  patient: (id: string) => `patient:${id}`,
  patientReports: (patientId: string) => `patient:${patientId}:reports`,
  patientImages: (patientId: string) => `patient:${patientId}:images`,
  patientTreatment: (patientId: string) => `patient:${patientId}:treatment`,
  analytics: (type: string, period: string) => `analytics:${type}:${period}`,
  userPreferences: (userId: string) => `user:${userId}:preferences`,
  systemConfig: () => 'system:config',
}

// React hooks for cache integration
export function useCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Try cache first
        const cached = patientDataCache.get<T>(key)
        if (cached) {
          setData(cached)
          setLoading(false)
          return
        }

        // Fetch fresh data
        setLoading(true)
        const freshData = await fetcher()
        
        // Cache the result
        patientDataCache.set(key, freshData, options)
        setData(freshData)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [key, fetcher, options])

  const invalidate = useCallback(() => {
    patientDataCache.delete(key)
    setData(null)
    setLoading(true)
  }, [key])

  return { data, loading, error, invalidate }
}

// Service Worker Cache for offline support
export function setupServiceWorkerCache() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered:', registration)
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error)
      })
  }
}

// HTTP Cache headers for API responses
export const CacheHeaders = {
  noCache: {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
  shortCache: {
    'Cache-Control': 'public, max-age=300', // 5 minutes
  },
  mediumCache: {
    'Cache-Control': 'public, max-age=1800', // 30 minutes
  },
  longCache: {
    'Cache-Control': 'public, max-age=86400', // 24 hours
  },
  patientData: {
    'Cache-Control': 'private, max-age=300, must-revalidate', // 5 minutes, private
  },
}
