"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import type { UserProfile } from "@/lib/types"
import { getUserProfile, updateUserProfile } from "@/lib/user-service"
import { OrderHistory } from "@/components/order-history"
import { SavedItems } from "@/components/saved-items"
import { Addresses } from "@/components/addresses"
import { Loader2 } from "lucide-react"

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        // In a real app, this would check authentication status
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"

        if (!isLoggedIn) {
          router.push("/login")
          return
        }

        // Simulate fetching user profile
        const userData = await getUserProfile()
        setProfile(userData)
      } catch (error) {
        toast({
          title: "Error loading profile",
          description: "Please try again later",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, toast])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setIsSaving(true)
    try {
      await updateUserProfile(profile)
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was an error updating your profile",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        <div className="md:w-1/4">
          <Card>
            <CardHeader>
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={profile?.avatar || ""} alt={profile?.name} />
                  <AvatarFallback className="text-2xl bg-orange-100 text-orange-600">
                    {profile?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{profile?.name}</CardTitle>
                <CardDescription>{profile?.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p>Member since: {profile?.memberSince}</p>
                <p className="mt-1">Orders: {profile?.orderCount}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  localStorage.removeItem("isLoggedIn")
                  router.push("/login")
                }}
              >
                Sign Out
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="md:w-3/4">
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="saved">Saved Items</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate}>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profile?.name || ""}
                          onChange={(e) => setProfile((prev) => (prev ? { ...prev, name: e.target.value } : prev))}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile?.email || ""}
                          onChange={(e) => setProfile((prev) => (prev ? { ...prev, email: e.target.value } : prev))}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={profile?.phone || ""}
                          onChange={(e) => setProfile((prev) => (prev ? { ...prev, phone: e.target.value } : prev))}
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button type="submit" disabled={isSaving}>
                          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="orders" className="mt-6">
              <OrderHistory />
            </TabsContent>
            <TabsContent value="saved" className="mt-6">
              <SavedItems />
            </TabsContent>
            <TabsContent value="addresses" className="mt-6">
              <Addresses />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
