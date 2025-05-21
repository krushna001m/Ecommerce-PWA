"use client"

import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export default function RegisterSW() {
  const { toast } = useToast()

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", async () => {
        try {
          const registration = await navigator.serviceWorker.register("/sw.js")
          console.log("Service Worker registered with scope:", registration.scope)

          // Set up periodic sync if supported
          if ("periodicSync" in registration) {
            const status = await navigator.permissions.query({
              name: "periodic-background-sync" as any,
            })

            if (status.state === "granted") {
              try {
                // Register periodic sync to update cache every day
                await (registration as any).periodicSync.register("content-sync", {
                  minInterval: 24 * 60 * 60 * 1000, // 1 day
                })
                console.log("Periodic sync registered")
              } catch (error) {
                console.error("Periodic sync could not be registered:", error)
              }
            }
          }

          // Check for service worker updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  toast({
                    title: "App update available",
                    description: "Refresh to update to the latest version",
                    action: (
                      <button
                        className="bg-primary text-white px-3 py-1 rounded-md text-xs"
                        onClick={() => window.location.reload()}
                      >
                        Update
                      </button>
                    ),
                    duration: 10000,
                  })
                }
              })
            }
          })
        } catch (error) {
          console.error("Service Worker registration failed:", error)
        }
      })

      // Handle controller change (when a new service worker takes over)
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        console.log("New service worker controller")
      })
    }
  }, [toast])

  return null
}
