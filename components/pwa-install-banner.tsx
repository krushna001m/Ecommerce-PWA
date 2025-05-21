"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, Smartphone, Laptop, Share2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

export function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallDialog, setShowInstallDialog] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [installPlatform, setInstallPlatform] = useState<"android" | "ios" | "desktop" | "unknown">("unknown")
  const { toast } = useToast()

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
      return
    }

    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase()
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setInstallPlatform("ios")
    } else if (/android/.test(userAgent)) {
      setInstallPlatform("android")
    } else {
      setInstallPlatform("desktop")
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
      // Show the install dialog after a delay
      setTimeout(() => {
        setShowInstallDialog(true)
      }, 3000)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Listen for app installed event
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
      setShowInstallDialog(false)

      toast({
        title: "App installed successfully",
        description: "You can now access ShopEase from your home screen",
      })
    })

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", () => {})
    }
  }, [toast])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt()

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice

      // We've used the prompt, and can't use it again, discard it
      setDeferredPrompt(null)
      setShowInstallDialog(false)

      if (outcome === "accepted") {
        toast({
          title: "Installing app",
          description: "ShopEase is being installed on your device",
        })
      }
    } else if (installPlatform === "ios") {
      // For iOS, we need to show manual instructions
      setShowInstallDialog(true)
    }
  }

  if (isInstalled) return null

  return (
    <>
      {/* Floating install button */}
      {!showInstallDialog && deferredPrompt && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            onClick={handleInstallClick}
            className="rounded-full shadow-lg bg-orange-600 hover:bg-orange-700"
            size="lg"
          >
            <Download className="mr-2 h-4 w-4" />
            Install App
          </Button>
        </div>
      )}

      {/* Install dialog */}
      <Dialog open={showInstallDialog} onOpenChange={setShowInstallDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Install ShopEase</DialogTitle>
            <DialogDescription>
              Install our app for a better experience with offline access and faster loading times.
            </DialogDescription>
          </DialogHeader>

          {installPlatform === "ios" ? (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900">
                  <Share2 className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-medium">Install on iOS</h4>
                  <ol className="text-sm text-muted-foreground mt-1 list-decimal pl-5 space-y-1">
                    <li>Tap the Share button in Safari</li>
                    <li>Scroll down and tap "Add to Home Screen"</li>
                    <li>Tap "Add" in the top right corner</li>
                  </ol>
                </div>
              </div>
            </div>
          ) : installPlatform === "android" ? (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900">
                  <Smartphone className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-medium">Install on Android</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Install ShopEase on your home screen for quick and easy access.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900">
                  <Laptop className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-medium">Install on your computer</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Install ShopEase as a desktop app for quick access anytime.
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
            <Button variant="outline" onClick={() => setShowInstallDialog(false)}>
              Maybe later
            </Button>
            {deferredPrompt ? (
              <Button onClick={handleInstallClick}>
                <Download className="mr-2 h-4 w-4" />
                Install App
              </Button>
            ) : installPlatform === "ios" ? (
              <Button onClick={() => setShowInstallDialog(false)}>Got it</Button>
            ) : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
