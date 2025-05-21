"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2, BellRing, Moon, Sun, Shield, Smartphone, RefreshCw, Trash2 } from "lucide-react"
import { useTheme } from "next-themes"
import { Separator } from "@/components/ui/separator"
import { useNotifications } from "@/components/notification-provider"
import { useOffline } from "@/components/offline-provider"
import { Progress } from "@/components/ui/progress"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const {
    isSupported: notificationsSupported,
    isSubscribed: notificationsEnabled,
    isPending: notificationsPending,
    subscribe: enableNotifications,
    unsubscribe: disableNotifications,
    sendTestNotification,
  } = useNotifications()

  const { isOfflineCapable, offlineData, syncData, clearOfflineData } = useOffline()

  const [isSaving, setIsSaving] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  const [settings, setSettings] = useState({
    notifications: {
      pushEnabled: notificationsEnabled,
      emailEnabled: true,
      orderUpdates: true,
      promotions: false,
    },
    privacy: {
      dataCollection: "minimal",
      cookiePreference: "essential",
    },
    appearance: {
      theme: theme || "system",
      highContrast: false,
      reducedMotion: false,
    },
    offline: {
      autoDownload: true,
      dataUsage: "wifi-only",
    },
  })

  const handleSaveSettings = async () => {
    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Save theme
    setTheme(settings.appearance.theme)

    // Handle notifications
    if (settings.notifications.pushEnabled && !notificationsEnabled) {
      await enableNotifications()
    } else if (!settings.notifications.pushEnabled && notificationsEnabled) {
      await disableNotifications()
    }

    // Save other settings to localStorage
    localStorage.setItem("userSettings", JSON.stringify(settings))

    setIsSaving(false)
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated",
    })
  }

  const handleClearCache = async () => {
    setIsClearing(true)

    try {
      // Clear caches
      if ("caches" in window) {
        const cacheNames = await caches.keys()
        await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)))
      }

      // Clear IndexedDB data
      await clearOfflineData()

      toast({
        title: "Cache cleared",
        description: "All cached data has been removed",
      })
    } catch (error) {
      console.error("Error clearing cache:", error)
      toast({
        title: "Error clearing cache",
        description: "There was a problem clearing the cache",
        variant: "destructive",
      })
    } finally {
      setIsClearing(false)
    }
  }

  const handleSyncData = async () => {
    setIsSyncing(true)

    try {
      await syncData()
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <div className="grid gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center">
              <div className="flex-1">
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </div>
              <BellRing className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications even when you're not using the app
                    </p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={settings.notifications.pushEnabled}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          pushEnabled: checked,
                        },
                      })
                    }
                    disabled={!notificationsSupported || notificationsPending}
                  />
                </div>

                {notificationsSupported && notificationsEnabled && (
                  <div className="mt-2">
                    <Button variant="outline" size="sm" onClick={sendTestNotification} className="w-full sm:w-auto">
                      Send Test Notification
                    </Button>
                  </div>
                )}

                {!notificationsSupported && (
                  <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 p-3 rounded-md">
                    Your browser doesn't support push notifications.
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.notifications.emailEnabled}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          emailEnabled: checked,
                        },
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="order-updates">Order Updates</Label>
                    <p className="text-sm text-muted-foreground">Get notified about status changes to your orders</p>
                  </div>
                  <Switch
                    id="order-updates"
                    checked={settings.notifications.orderUpdates}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          orderUpdates: checked,
                        },
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="promotions">Promotions & Offers</Label>
                    <p className="text-sm text-muted-foreground">Receive information about deals and special offers</p>
                  </div>
                  <Switch
                    id="promotions"
                    checked={settings.notifications.promotions}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          promotions: checked,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center">
              <div className="flex-1">
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how the app looks</CardDescription>
              </div>
              {settings.appearance.theme === "dark" ? (
                <Moon className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Sun className="h-5 w-5 text-muted-foreground" />
              )}
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <RadioGroup
                    value={settings.appearance.theme}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        appearance: {
                          ...settings.appearance,
                          theme: value,
                        },
                      })
                    }
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="theme-light" />
                      <Label htmlFor="theme-light">Light</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dark" id="theme-dark" />
                      <Label htmlFor="theme-dark">Dark</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="system" id="theme-system" />
                      <Label htmlFor="theme-system">System</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="high-contrast">High Contrast</Label>
                    <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                  </div>
                  <Switch
                    id="high-contrast"
                    checked={settings.appearance.highContrast}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        appearance: {
                          ...settings.appearance,
                          highContrast: checked,
                        },
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="reduced-motion">Reduced Motion</Label>
                    <p className="text-sm text-muted-foreground">Minimize animations throughout the app</p>
                  </div>
                  <Switch
                    id="reduced-motion"
                    checked={settings.appearance.reducedMotion}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        appearance: {
                          ...settings.appearance,
                          reducedMotion: checked,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center">
              <div className="flex-1">
                <CardTitle>Offline Mode</CardTitle>
                <CardDescription>Manage how the app works without internet</CardDescription>
              </div>
              <Smartphone className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-download">Auto-Download Content</Label>
                    <p className="text-sm text-muted-foreground">Automatically download content for offline use</p>
                  </div>
                  <Switch
                    id="auto-download"
                    checked={settings.offline.autoDownload}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        offline: {
                          ...settings.offline,
                          autoDownload: checked,
                        },
                      })
                    }
                    disabled={!isOfflineCapable}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Data Usage</Label>
                  <RadioGroup
                    value={settings.offline.dataUsage}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        offline: {
                          ...settings.offline,
                          dataUsage: value,
                        },
                      })
                    }
                    className="flex flex-col space-y-1"
                    disabled={!isOfflineCapable}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="always" id="data-always" />
                      <Label htmlFor="data-always">Always download</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="wifi-only" id="data-wifi" />
                      <Label htmlFor="data-wifi">Wi-Fi only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="manual" id="data-manual" />
                      <Label htmlFor="data-manual">Manual only</Label>
                    </div>
                  </RadioGroup>
                </div>

                {isOfflineCapable && (
                  <>
                    <Separator />

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label>Offline Storage</Label>
                        <span className="text-sm text-muted-foreground">
                          {offlineData.products + offlineData.cart + offlineData.orders} items
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Products</span>
                          <span>{offlineData.products}</span>
                        </div>
                        <Progress value={Math.min(offlineData.products / 2, 100)} className="h-1" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Cart</span>
                          <span>{offlineData.cart}</span>
                        </div>
                        <Progress value={Math.min(offlineData.cart * 20, 100)} className="h-1" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Orders</span>
                          <span>{offlineData.orders}</span>
                        </div>
                        <Progress value={Math.min(offlineData.orders * 20, 100)} className="h-1" />
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleSyncData}
                          disabled={isSyncing}
                          className="w-full sm:w-auto"
                        >
                          {isSyncing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {!isSyncing && <RefreshCw className="mr-2 h-4 w-4" />}
                          Sync Data
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleClearCache}
                          disabled={isClearing}
                          className="w-full sm:w-auto"
                        >
                          {isClearing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {!isClearing && <Trash2 className="mr-2 h-4 w-4" />}
                          Clear Cache
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                {!isOfflineCapable && (
                  <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 p-3 rounded-md">
                    Your browser doesn't support offline storage features.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center">
              <div className="flex-1">
                <CardTitle>Privacy</CardTitle>
                <CardDescription>Manage your data and privacy preferences</CardDescription>
              </div>
              <Shield className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Data Collection</Label>
                  <RadioGroup
                    value={settings.privacy.dataCollection}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        privacy: {
                          ...settings.privacy,
                          dataCollection: value,
                        },
                      })
                    }
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="full" id="data-full" />
                      <Label htmlFor="data-full">Full analytics</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="minimal" id="data-minimal" />
                      <Label htmlFor="data-minimal">Minimal analytics</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="none" id="data-none" />
                      <Label htmlFor="data-none">No analytics</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Cookie Preferences</Label>
                  <RadioGroup
                    value={settings.privacy.cookiePreference}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        privacy: {
                          ...settings.privacy,
                          cookiePreference: value,
                        },
                      })
                    }
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="cookies-all" />
                      <Label htmlFor="cookies-all">Accept all cookies</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="essential" id="cookies-essential" />
                      <Label htmlFor="cookies-essential">Essential cookies only</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
