// Quant-NEX Medical Application Service Worker
// Provides offline functionality for critical medical data

const CACHE_NAME = 'quantnex-medical-v1'
const OFFLINE_URL = '/offline'

// Critical medical data that should be cached
const CRITICAL_CACHE_URLS = [
  '/',
  '/dashboard',
  '/patients',
  '/offline',
  '/manifest.json',
  // Static assets
  '/_next/static/css/',
  '/_next/static/js/',
  // Medical icons and images
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/images/logo.png',
]

// Medical data patterns that should be cached
const MEDICAL_DATA_PATTERNS = [
  /^\/api\/patients\/[^\/]+$/,  // Individual patient data
  /^\/api\/patients\/[^\/]+\/vitals$/,  // Patient vitals
  /^\/api\/emergency-contacts$/,  // Emergency contacts
  /^\/api\/medical-alerts$/,  // Critical medical alerts
]

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('Quant-NEX Service Worker installing...')
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching critical medical resources')
        return cache.addAll(CRITICAL_CACHE_URLS)
      })
      .then(() => {
        // Skip waiting to activate immediately
        return self.skipWaiting()
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Quant-NEX Service Worker activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        // Take control of all pages immediately
        return self.clients.claim()
      })
  )
})

// Fetch event - handle network requests with medical data priority
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return
  }

  // Handle different types of requests
  if (isMedicalDataRequest(url.pathname)) {
    event.respondWith(handleMedicalDataRequest(request))
  } else if (isStaticAsset(url.pathname)) {
    event.respondWith(handleStaticAssetRequest(request))
  } else if (isPageRequest(request)) {
    event.respondWith(handlePageRequest(request))
  }
})

// Check if request is for critical medical data
function isMedicalDataRequest(pathname) {
  return MEDICAL_DATA_PATTERNS.some(pattern => pattern.test(pathname))
}

// Check if request is for static assets
function isStaticAsset(pathname) {
  return pathname.startsWith('/_next/static/') ||
         pathname.startsWith('/icons/') ||
         pathname.startsWith('/images/') ||
         pathname.endsWith('.css') ||
         pathname.endsWith('.js') ||
         pathname.endsWith('.png') ||
         pathname.endsWith('.jpg') ||
         pathname.endsWith('.svg')
}

// Check if request is for a page
function isPageRequest(request) {
  return request.mode === 'navigate' ||
         (request.method === 'GET' && request.headers.get('accept').includes('text/html'))
}

// Handle medical data requests - Cache First strategy for critical data
async function handleMedicalDataRequest(request) {
  try {
    const cache = await caches.open(CACHE_NAME)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      console.log('Serving medical data from cache:', request.url)
      
      // Try to update cache in background
      fetch(request)
        .then(response => {
          if (response.ok) {
            cache.put(request, response.clone())
          }
        })
        .catch(() => {
          // Network failed, but we have cached data
        })
      
      return cachedResponse
    }

    // No cache, try network
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // Cache successful medical data responses
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
    
  } catch (error) {
    console.error('Medical data request failed:', error)
    
    // Return offline medical data response
    return new Response(
      JSON.stringify({
        error: 'offline',
        message: 'Medical data unavailable offline. Please check your connection.',
        timestamp: new Date().toISOString()
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

// Handle static assets - Cache First strategy
async function handleStaticAssetRequest(request) {
  try {
    const cache = await caches.open(CACHE_NAME)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }

    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
    
  } catch (error) {
    console.error('Static asset request failed:', error)
    
    // Return a fallback response for critical assets
    if (request.url.includes('icon') || request.url.includes('logo')) {
      return new Response('', { status: 404 })
    }
    
    throw error
  }
}

// Handle page requests - Network First with offline fallback
async function handlePageRequest(request) {
  try {
    // Try network first for pages
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // Cache successful page responses
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
    
  } catch (error) {
    console.log('Page request failed, trying cache:', request.url)
    
    // Try cache
    const cache = await caches.open(CACHE_NAME)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline page
    const offlineResponse = await cache.match(OFFLINE_URL)
    if (offlineResponse) {
      return offlineResponse
    }
    
    // Fallback offline HTML
    return new Response(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Quant-NEX - Offline</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #000;
            color: #fff;
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }
          .container {
            text-align: center;
            max-width: 400px;
            padding: 2rem;
          }
          .logo {
            font-size: 2rem;
            font-weight: bold;
            color: #3b82f6;
            margin-bottom: 1rem;
          }
          .message {
            margin-bottom: 2rem;
            color: #d1d5db;
          }
          .retry-btn {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            cursor: pointer;
            font-size: 1rem;
          }
          .retry-btn:hover {
            background: #2563eb;
          }
          .offline-indicator {
            display: inline-block;
            width: 8px;
            height: 8px;
            background: #ef4444;
            border-radius: 50%;
            margin-right: 0.5rem;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">Quant-NEX</div>
          <div class="message">
            <div><span class="offline-indicator"></span>You are currently offline</div>
            <p>Some medical data may be available from cache. Please check your internet connection for the latest information.</p>
          </div>
          <button class="retry-btn" onclick="window.location.reload()">
            Try Again
          </button>
        </div>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    })
  }
}

// Background sync for medical data
self.addEventListener('sync', (event) => {
  if (event.tag === 'medical-data-sync') {
    event.waitUntil(syncMedicalData())
  }
})

// Sync medical data when connection is restored
async function syncMedicalData() {
  try {
    console.log('Syncing medical data...')
    
    // Get pending medical data from IndexedDB
    const pendingData = await getPendingMedicalData()
    
    for (const data of pendingData) {
      try {
        await fetch(data.url, {
          method: data.method,
          headers: data.headers,
          body: data.body
        })
        
        // Remove from pending queue
        await removePendingMedicalData(data.id)
        
      } catch (error) {
        console.error('Failed to sync medical data:', error)
      }
    }
    
  } catch (error) {
    console.error('Medical data sync failed:', error)
  }
}

// Placeholder functions for IndexedDB operations
async function getPendingMedicalData() {
  // In a real implementation, this would query IndexedDB
  return []
}

async function removePendingMedicalData(id) {
  // In a real implementation, this would remove from IndexedDB
  console.log('Removing pending medical data:', id)
}

// Push notifications for critical medical alerts
self.addEventListener('push', (event) => {
  if (!event.data) return

  const data = event.data.json()
  
  // Only show notifications for critical medical alerts
  if (data.severity === 'critical') {
    const options = {
      body: data.message,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      tag: 'medical-alert',
      requireInteraction: true,
      actions: [
        {
          action: 'view',
          title: 'View Details'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    }

    event.waitUntil(
      self.registration.showNotification('Quant-NEX Medical Alert', options)
    )
  }
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/dashboard?alert=true')
    )
  }
})
