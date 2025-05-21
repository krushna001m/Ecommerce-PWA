// This is a service worker file for the PWA

const CACHE_NAME = "shopease-v1"
const DYNAMIC_CACHE = "shopease-dynamic-v1"
const STATIC_CACHE = "shopease-static-v1"
const OFFLINE_DB_NAME = "shopease-offline"
const OFFLINE_DB_VERSION = 1

// Assets to cache on install
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/offline.html",
  "/favicon.ico",
]

// Open IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(OFFLINE_DB_NAME, OFFLINE_DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = request.result

      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains("cart")) {
        db.createObjectStore("cart", { keyPath: "id" })
      }

      if (!db.objectStoreNames.contains("orders")) {
        db.createObjectStore("orders", { keyPath: "id" })
      }

      if (!db.objectStoreNames.contains("products")) {
        db.createObjectStore("products", { keyPath: "id" })
      }

      if (!db.objectStoreNames.contains("user")) {
        db.createObjectStore("user", { keyPath: "id" })
      }

      if (!db.objectStoreNames.contains("pendingRequests")) {
        db.createObjectStore("pendingRequests", { keyPath: "id", autoIncrement: true })
      }
    }
  })
}

// Store data in IndexedDB
async function storeInDB(storeName, data) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite")
    const store = transaction.objectStore(storeName)
    const request = store.put(data)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

// Get data from IndexedDB
async function getFromDB(storeName, key) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly")
    const store = transaction.objectStore(storeName)
    const request = key ? store.get(key) : store.getAll()

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

// Delete data from IndexedDB
async function deleteFromDB(storeName, key) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite")
    const store = transaction.objectStore(storeName)
    const request = store.delete(key)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

// Store pending API requests for later sync
async function storePendingRequest(request, requestData) {
  const timestamp = Date.now()
  const url = request.url
  const method = request.method
  const headers = {}

  request.headers.forEach((value, key) => {
    headers[key] = value
  })

  const pendingRequest = {
    url,
    method,
    headers,
    timestamp,
    data: requestData,
    attempts: 0,
  }

  await storeInDB("pendingRequests", pendingRequest)
}

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log("Caching static assets")
        return cache.addAll(STATIC_ASSETS)
      }),
      openDB(),
    ]).then(() => self.skipWaiting()),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => {
              return name !== STATIC_CACHE && name !== DYNAMIC_CACHE
            })
            .map((name) => {
              console.log("Deleting old cache:", name)
              return caches.delete(name)
            }),
        )
      }),
      // Claim clients so the service worker is in control without reload
      self.clients.claim(),
    ]),
  )
})

// Helper function to determine if a request should be cached
function shouldCache(url) {
  // Don't cache API requests with authentication
  if (url.includes("/api/auth/") || url.includes("/api/user/")) {
    return false
  }

  // Cache static assets and product data
  return (
    url.includes("/icons/") ||
    url.includes("/images/") ||
    url.includes("/api/products") ||
    url.includes("/api/categories") ||
    url.includes(".js") ||
    url.includes(".css") ||
    url.includes(".png") ||
    url.includes(".jpg") ||
    url.includes(".svg") ||
    url.includes(".json")
  )
}

// Fetch event - serve from cache or network
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    // For POST requests to API endpoints, handle offline case
    if (event.request.method === "POST" && event.request.url.includes("/api/")) {
      event.respondWith(
        fetch(event.request.clone()).catch((error) => {
          // If offline, store the request for later sync
          return event.request
            .clone()
            .text()
            .then((requestData) => {
              storePendingRequest(event.request, requestData)
              return new Response(
                JSON.stringify({
                  success: false,
                  offline: true,
                  message: "Your request has been saved and will be processed when you're back online.",
                }),
                {
                  headers: { "Content-Type": "application/json" },
                },
              )
            })
        }),
      )
    }
    return
  }

  // Skip browser-extension requests and non-http requests
  if (!event.request.url.startsWith("http")) return

  // Handle API requests (network first, then cache)
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Only cache successful responses
          if (!response || response.status !== 200) {
            return response
          }

          // Clone the response to store in cache
          const clonedResponse = response.clone()

          // Store in cache if it should be cached
          if (shouldCache(event.request.url)) {
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(event.request, clonedResponse)
            })

            // Also store product data in IndexedDB for offline access
            if (event.request.url.includes("/api/products")) {
              clonedResponse
                .clone()
                .json()
                .then((data) => {
                  // Store each product in IndexedDB
                  if (Array.isArray(data)) {
                    data.forEach((product) => {
                      storeInDB("products", product)
                    })
                  } else if (data && data.id) {
                    storeInDB("products", data)
                  }
                })
                .catch((err) => console.error("Error storing product data in IndexedDB:", err))
            }
          }

          return response
        })
        .catch(async () => {
          // If network fails, try to serve from cache
          const cachedResponse = await caches.match(event.request)
          if (cachedResponse) {
            return cachedResponse
          }

          // For product API requests, try to get from IndexedDB
          if (event.request.url.includes("/api/products")) {
            // Extract product ID from URL if present
            const urlParts = event.request.url.split("/")
            const productId = urlParts[urlParts.length - 1]

            try {
              // If URL has a specific product ID
              if (productId && !isNaN(productId)) {
                const product = await getFromDB("products", productId)
                if (product) {
                  return new Response(JSON.stringify(product), {
                    headers: { "Content-Type": "application/json" },
                  })
                }
              } else {
                // Return all products
                const products = await getFromDB("products")
                if (products && products.length > 0) {
                  return new Response(JSON.stringify(products), {
                    headers: { "Content-Type": "application/json" },
                  })
                }
              }
            } catch (error) {
              console.error("Error retrieving from IndexedDB:", error)
            }
          }

          // If no cached or IndexedDB data, return appropriate offline response
          if (event.request.headers.get("Accept").includes("text/html")) {
            return caches.match("/offline.html")
          }

          if (event.request.headers.get("Accept").includes("image")) {
            return caches.match("/icons/icon-192x192.png")
          }

          return new Response(
            JSON.stringify({
              error: "You are offline and this content is not available.",
            }),
            {
              status: 503,
              headers: { "Content-Type": "application/json" },
            },
          )
        }),
    )
    return
  }

  // For HTML navigation requests - use a network-first approach
  if (
    event.request.mode === "navigate" ||
    (event.request.method === "GET" && event.request.headers.get("accept").includes("text/html"))
  ) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request).then((response) => {
          return response || caches.match("/offline.html")
        })
      }),
    )
    return
  }

  // For other requests, try cache first, then network with dynamic caching
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response if found
      if (response) {
        return response
      }

      // Otherwise fetch from network
      return fetch(event.request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200) {
            return response
          }

          // Clone the response to store in cache
          const clonedResponse = response.clone()

          // Cache the resource if it should be cached
          if (shouldCache(event.request.url)) {
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(event.request, clonedResponse)
            })
          }

          return response
        })
        .catch(() => {
          // If both cache and network fail, show offline page for HTML requests
          if (event.request.headers.get("Accept").includes("text/html")) {
            return caches.match("/offline.html")
          }

          // For image requests, return a placeholder
          if (event.request.headers.get("Accept").includes("image")) {
            return caches.match("/icons/icon-192x192.png")
          }

          // Otherwise just return the error
          return new Response("Network error", {
            status: 408,
            headers: { "Content-Type": "text/plain" },
          })
        })
    }),
  )
})

// Background sync for offline form submissions
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-pending-requests") {
    event.waitUntil(syncPendingRequests())
  }
})

// Periodic background sync
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "content-sync") {
    event.waitUntil(updateCache())
  }
})

// Push notification event handler
self.addEventListener("push", (event) => {
  let data = { title: "New Notification", body: "Something happened in the app" }

  try {
    if (event.data) {
      data = event.data.json()
    }
  } catch (e) {
    console.error("Error parsing push notification data:", e)
  }

  const options = {
    body: data.body,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/badge-72x72.png",
    vibrate: [100, 50, 100],
    data: {
      url: data.url || "/",
      actions: data.actions || [],
    },
    actions: data.actions || [],
  }

  event.waitUntil(self.registration.showNotification(data.title, options))
})

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  // Handle action buttons if clicked
  if (event.action) {
    // Custom handling for different actions
    console.log("Notification action clicked:", event.action)

    // You can add specific handling for different actions here
    if (event.action === "view_cart") {
      event.waitUntil(clients.openWindow("/cart"))
      return
    } else if (event.action === "view_order") {
      event.waitUntil(clients.openWindow("/orders"))
      return
    }
  }

  // Default behavior - open the specified URL or root
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      // Check if there's already a window/tab open with the target URL
      for (const client of clientList) {
        if (client.url === event.notification.data.url && "focus" in client) {
          return client.focus()
        }
      }
      // If no window/tab is open or URL doesn't match, open a new one
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url)
      }
    }),
  )
})

// Helper function for background sync
async function syncPendingRequests() {
  try {
    const pendingRequests = await getFromDB("pendingRequests")

    if (!pendingRequests || pendingRequests.length === 0) {
      return
    }

    console.log(`Found ${pendingRequests.length} pending requests to sync`)

    for (const request of pendingRequests) {
      try {
        // Skip if too many failed attempts
        if (request.attempts >= 5) {
          console.log(`Removing request after ${request.attempts} failed attempts:`, request.url)
          await deleteFromDB("pendingRequests", request.id)
          continue
        }

        // Increment attempt counter
        request.attempts++
        await storeInDB("pendingRequests", request)

        // Attempt to send the request
        const response = await fetch(request.url, {
          method: request.method,
          headers: request.headers,
          body: request.data,
          credentials: "include",
        })

        if (response.ok) {
          console.log("Successfully synced request:", request.url)
          await deleteFromDB("pendingRequests", request.id)

          // Notify the user if we have permission
          if (self.Notification && self.Notification.permission === "granted") {
            const title = "Sync Complete"
            const options = {
              body: "Your offline changes have been saved.",
              icon: "/icons/icon-192x192.png",
            }
            self.registration.showNotification(title, options)
          }
        } else {
          console.error("Failed to sync request:", request.url, response.status)
        }
      } catch (error) {
        console.error("Error syncing request:", error)
      }
    }
  } catch (error) {
    console.error("Error in syncPendingRequests:", error)
  }
}

// Helper function for periodic background sync
async function updateCache() {
  try {
    // Update critical resources
    const criticalUrls = ["/", "/api/products", "/api/categories"]

    for (const url of criticalUrls) {
      try {
        const response = await fetch(url, { cache: "no-cache" })

        if (response.ok) {
          const cache = await caches.open(DYNAMIC_CACHE)
          await cache.put(new Request(url), response)
          console.log("Updated cache for:", url)

          // For API responses, also update IndexedDB
          if (url.includes("/api/products")) {
            const data = await response.clone().json()
            if (Array.isArray(data)) {
              for (const product of data) {
                await storeInDB("products", product)
              }
              console.log("Updated IndexedDB with latest products")
            }
          }
        }
      } catch (error) {
        console.error("Error updating cache for:", url, error)
      }
    }
  } catch (error) {
    console.error("Error in updateCache:", error)
  }
}
