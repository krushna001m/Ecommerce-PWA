"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

interface OfflineContextType {
  isOnline: boolean
  isOfflineCapable: boolean
  offlineData: {
    products: number
    cart: number
    orders: number
  }
  syncData: () => Promise<void>
  clearOfflineData: () => Promise<void>
}

const OfflineContext = createContext<OfflineContextType>({
  isOnline: true,
  isOfflineCapable: false,
  offlineData: {
    products: 0,
    cart: 0,
    orders: 0,
  },
  syncData: async () => {},
  clearOfflineData: async () => {},
})

export const useOffline = () => useContext(OfflineContext)

interface OfflineProviderProps {
  children: ReactNode
}

export function OfflineProvider({ children }: OfflineProviderProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [isOfflineCapable, setIsOfflineCapable] = useState(false)
  const [offlineData, setOfflineData] = useState({
    products: 0,
    cart: 0,
    orders: 0,
  })
  const { toast } = useToast()

  // Check online status and offline capability
  useEffect(() => {
    // Set initial online status
    setIsOnline(navigator.onLine)

    // Check if IndexedDB is supported
    const isIDBSupported = "indexedDB" in window
    setIsOfflineCapable(isIDBSupported && "serviceWorker" in navigator)

    // Event listeners for online/offline status
    const handleOnline = () => {
      setIsOnline(true)
      toast({
        title: "You're back online",
        description: "Your changes will now be synchronized",
      })

      // Trigger sync when coming back online
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready
          .then((registration) => {
            registration.sync.register("sync-pending-requests")
          })
          .catch((err) => console.error("Error registering sync:", err))
      }
    }

    const handleOffline = () => {
      setIsOnline(false)
      toast({
        title: "You're offline",
        description: "The app will continue to work with limited functionality",
        variant: "destructive",
      })
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Check offline data stats periodically
    const checkOfflineData = async () => {
      if (!isIDBSupported) return

      try {
        const db = await openDB()

        // Count items in each store
        const products = await countItems(db, "products")
        const cart = await countItems(db, "cart")
        const orders = await countItems(db, "orders")

        setOfflineData({ products, cart, orders })
      } catch (error) {
        console.error("Error checking offline data:", error)
      }
    }

    // Initial check
    checkOfflineData()

    // Set up periodic check
    const interval = setInterval(checkOfflineData, 30000) // Every 30 seconds

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      clearInterval(interval)
    }
  }, [toast])

  // Sync data with server
  const syncData = async () => {
    if (!isOnline) {
      toast({
        title: "You're offline",
        description: "Cannot sync data while offline",
        variant: "destructive",
      })
      return
    }

    if (!isOfflineCapable) {
      toast({
        title: "Offline capability not available",
        description: "Your browser doesn't support offline features",
        variant: "destructive",
      })
      return
    }

    try {
      // Trigger background sync
      if (navigator.serviceWorker.controller) {
        await navigator.serviceWorker.ready

        // Register sync task
        await (await navigator.serviceWorker.ready).sync.register("sync-pending-requests")

        toast({
          title: "Sync started",
          description: "Your data is being synchronized",
        })
      } else {
        toast({
          title: "Service worker not active",
          description: "Please refresh the page and try again",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error syncing data:", error)
      toast({
        title: "Sync failed",
        description: "There was an error synchronizing your data",
        variant: "destructive",
      })
    }
  }

  // Clear offline data
  const clearOfflineData = async () => {
    if (!isOfflineCapable) return

    try {
      const db = await openDB()

      // Clear all object stores except pendingRequests
      await clearStore(db, "products")
      await clearStore(db, "cart")
      await clearStore(db, "orders")
      await clearStore(db, "user")

      // Update counts
      setOfflineData({
        products: 0,
        cart: 0,
        orders: 0,
      })

      toast({
        title: "Offline data cleared",
        description: "All cached data has been removed",
      })
    } catch (error) {
      console.error("Error clearing offline data:", error)
      toast({
        title: "Error clearing data",
        description: "There was a problem clearing the offline data",
        variant: "destructive",
      })
    }
  }

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        isOfflineCapable,
        offlineData,
        syncData,
        clearOfflineData,
      }}
    >
      {children}
    </OfflineContext.Provider>
  )
}

// Helper functions for IndexedDB operations

// Open IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("shopease-offline", 1)

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

// Count items in a store
function countItems(db: IDBDatabase, storeName: string): Promise<number> {
  return new Promise((resolve, reject) => {
    if (!db.objectStoreNames.contains(storeName)) {
      resolve(0)
      return
    }

    const transaction = db.transaction(storeName, "readonly")
    const store = transaction.objectStore(storeName)
    const countRequest = store.count()

    countRequest.onsuccess = () => resolve(countRequest.result)
    countRequest.onerror = () => reject(countRequest.error)
  })
}

// Clear a store
function clearStore(db: IDBDatabase, storeName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!db.objectStoreNames.contains(storeName)) {
      resolve()
      return
    }

    const transaction = db.transaction(storeName, "readwrite")
    const store = transaction.objectStore(storeName)
    const clearRequest = store.clear()

    clearRequest.onsuccess = () => resolve()
    clearRequest.onerror = () => reject(clearRequest.error)
  })
}
