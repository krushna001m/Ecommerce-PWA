"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { MapPin, Navigation, Store, RefreshCw } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Location {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: number
}

interface NearbyStore {
  id: string
  name: string
  distance: number
  address: string
}

export default function LocationPage() {
  const [location, setLocation] = useState<Location | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null)
  const [nearbyStores, setNearbyStores] = useState<NearbyStore[]>([])
  const { toast } = useToast()

  // Check if geolocation is supported
  const isGeolocationSupported = typeof navigator !== "undefined" && "geolocation" in navigator

  // Get current location
  const getCurrentLocation = () => {
    if (!isGeolocationSupported) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support location services",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords
        setLocation({
          latitude,
          longitude,
          accuracy,
          timestamp: position.timestamp,
        })
        setHasLocationPermission(true)
        setIsLoading(false)

        // Find nearby stores
        findNearbyStores(latitude, longitude)

        toast({
          title: "Location updated",
          description: "Your current location has been found",
        })
      },
      (error) => {
        console.error("Error getting location:", error)
        setHasLocationPermission(false)
        setIsLoading(false)

        toast({
          title: "Location access denied",
          description: "Please allow location access to use this feature",
          variant: "destructive",
        })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    )
  }

  // Find nearby stores (mock data)
  const findNearbyStores = (latitude: number, longitude: number) => {
    // In a real app, this would call an API with the coordinates
    // This is mock data for demonstration
    setTimeout(() => {
      const mockStores: NearbyStore[] = [
        {
          id: "store-1",
          name: "ShopEase Downtown",
          distance: 1.2,
          address: "123 Main St, Downtown",
        },
        {
          id: "store-2",
          name: "ShopEase Mall",
          distance: 3.5,
          address: "456 Market Ave, Shopping Mall",
        },
        {
          id: "store-3",
          name: "ShopEase Express",
          distance: 4.8,
          address: "789 Express Way, Business District",
        },
      ]

      setNearbyStores(mockStores)
    }, 1000)
  }

  // Get directions to a store
  const getDirections = (store: NearbyStore) => {
    if (!location) return

    // Open in Google Maps or Apple Maps
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${location.latitude},${location.longitude}&destination=${store.address}&travelmode=driving`
    window.open(mapsUrl, "_blank")
  }

  // Get location on component mount
  useEffect(() => {
    if (isGeolocationSupported) {
      getCurrentLocation()
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Location Services</h1>

        {!isGeolocationSupported ? (
          <Card>
            <CardHeader>
              <CardTitle>Location Not Supported</CardTitle>
              <CardDescription>Your browser doesn't support location services.</CardDescription>
            </CardHeader>
          </Card>
        ) : hasLocationPermission === false ? (
          <Card>
            <CardHeader>
              <CardTitle>Location Access Denied</CardTitle>
              <CardDescription>
                Please allow location access in your browser settings to use this feature.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={getCurrentLocation}>Try Again</Button>
            </CardFooter>
          </Card>
        ) : (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Your Location</CardTitle>
                <CardDescription>Find stores and services near you</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ) : location ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="font-medium">Current Coordinates</p>
                        <p className="text-sm text-muted-foreground">
                          {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm">
                      <p>Accuracy: ±{Math.round(location.accuracy)} meters</p>
                      <p>Updated: {new Date(location.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Waiting for location data...</p>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={getCurrentLocation} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      Getting Location...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Update Location
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nearby Stores</CardTitle>
                <CardDescription>Find ShopEase stores in your area</CardDescription>
              </CardHeader>
              <CardContent>
                {nearbyStores.length > 0 ? (
                  <div className="space-y-4">
                    {nearbyStores.map((store) => (
                      <div key={store.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{store.name}</h3>
                            <p className="text-sm text-muted-foreground">{store.address}</p>
                            <p className="text-sm mt-1">{store.distance.toFixed(1)} miles away</p>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => getDirections(store)}>
                            <Navigation className="h-4 w-4 mr-2" />
                            Directions
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : location ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Store className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-medium text-lg mb-2">Finding stores near you</h3>
                    <p className="text-sm text-muted-foreground text-center">
                      We're searching for stores in your area...
                    </p>
                    <div className="mt-4 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-medium text-lg mb-2">Location needed</h3>
                    <p className="text-sm text-muted-foreground text-center">
                      Please share your location to find nearby stores
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
