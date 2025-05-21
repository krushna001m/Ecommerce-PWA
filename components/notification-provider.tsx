"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

interface NotificationContextType {
  isSupported: boolean
  isSubscribed: boolean
  isPending: boolean
  subscription: PushSubscription | null
  subscribe: () => Promise<void>
  unsubscribe: () => Promise<void>
  sendTestNotification: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType>({
  isSupported: false,
  isSubscribed: false,
  isPending: true,
  subscription: null,
  subscribe: async () => {},
  unsubscribe: async () => {},
  sendTestNotification: async () => {},
})

export const useNotifications = () => useContext(NotificationContext)

interface NotificationProviderProps {
  children: ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [isSupported, setIsSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isPending, setIsPending] = useState(true)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const { toast } = useToast()

  // Check if push notifications are supported
  useEffect(() => {
    const checkSupport = async () => {
      const supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window

      setIsSupported(supported)

      if (supported) {
        try {
          // Wait for service worker to be ready
          const registration = await navigator.serviceWorker.ready

          // Check if already subscribed
          const existingSubscription = await registration.pushManager.getSubscription()

          if (existingSubscription) {
            setIsSubscribed(true)
            setSubscription(existingSubscription)
          }
        } catch (error) {
          console.error("Error checking push subscription:", error)
        }
      }

      setIsPending(false)
    }

    checkSupport()
  }, [])

  // Subscribe to push notifications
  const subscribe = async () => {
    if (!isSupported) {
      toast({
        title: "Push notifications not supported",
        description: "Your browser doesn't support push notifications.",
        variant: "destructive",
      })
      return
    }

    try {
      // Request notification permission
      const permission = await Notification.requestPermission()

      if (permission !== "granted") {
        toast({
          title: "Permission denied",
          description: "You need to allow notification permission to receive updates.",
          variant: "destructive",
        })
        return
      }

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready

      // Generate VAPID key (in a real app, this would come from your server)
      // This is a placeholder public key - in production you'd use your own
      const vapidPublicKey = "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U"

      // Convert VAPID key to Uint8Array
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey)

      // Subscribe to push notifications
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      })

      // In a real app, you would send this subscription to your server
      console.log("Push subscription:", JSON.stringify(newSubscription))

      // Save subscription locally
      setSubscription(newSubscription)
      setIsSubscribed(true)

      toast({
        title: "Notifications enabled",
        description: "You'll now receive updates and offers.",
      })

      // Store subscription in localStorage for demo purposes
      // In a real app, this would be stored on your server
      localStorage.setItem("pushSubscription", JSON.stringify(newSubscription))
    } catch (error) {
      console.error("Error subscribing to push notifications:", error)
      toast({
        title: "Subscription failed",
        description: "There was an error enabling notifications.",
        variant: "destructive",
      })
    }
  }

  // Unsubscribe from push notifications
  const unsubscribe = async () => {
    if (!subscription) return

    try {
      await subscription.unsubscribe()

      // In a real app, you would notify your server

      setSubscription(null)
      setIsSubscribed(false)

      toast({
        title: "Notifications disabled",
        description: "You won't receive any more notifications.",
      })

      // Remove from localStorage
      localStorage.removeItem("pushSubscription")
    } catch (error) {
      console.error("Error unsubscribing from push notifications:", error)
      toast({
        title: "Error disabling notifications",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  // Send a test notification
  const sendTestNotification = async () => {
    if (!isSubscribed || !subscription) {
      toast({
        title: "Not subscribed",
        description: "You need to enable notifications first.",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would be handled by your server
    // This is a client-side simulation for demo purposes

    // Check if service worker is active
    if (!navigator.serviceWorker.controller) {
      toast({
        title: "Service worker not active",
        description: "Please refresh the page and try again.",
        variant: "destructive",
      })
      return
    }

    try {
      // Simulate a push notification by sending a message to the service worker
      navigator.serviceWorker.controller.postMessage({
        type: "SHOW_NOTIFICATION",
        payload: {
          title: "Test Notification",
          body: "This is a test notification from ShopEase!",
          icon: "/icons/icon-192x192.png",
          data: {
            url: "/settings",
          },
          actions: [
            {
              action: "view_cart",
              title: "View Cart",
            },
          ],
        },
      })

      toast({
        title: "Test notification sent",
        description: "You should receive it shortly.",
      })
    } catch (error) {
      console.error("Error sending test notification:", error)
      toast({
        title: "Error sending notification",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  return (
    <NotificationContext.Provider
      value={{
        isSupported,
        isSubscribed,
        isPending,
        subscription,
        subscribe,
        unsubscribe,
        sendTestNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

// Helper function to convert base64 to Uint8Array
// (Required for applicationServerKey)
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}
