"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Camera, CameraIcon as FlipCamera, QrCode, Aperture, Download, Share2 } from "lucide-react"

export default function CameraPage() {
  const [activeCamera, setActiveCamera] = useState<"user" | "environment">("environment")
  const [hasCamera, setHasCamera] = useState(false)
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [scannedCode, setScannedCode] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [canShare, setCanShare] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const { toast } = useToast()

  // Check for camera support
  useEffect(() => {
    const checkCameraSupport = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter((device) => device.kind === "videoinput")
        setHasCamera(videoDevices.length > 0)

        // Check if we can share files
        setCanShare("share" in navigator)
      } catch (error) {
        console.error("Error checking camera:", error)
        setHasCamera(false)
      }
    }

    checkCameraSupport()
  }, [])

  // Start camera when component mounts
  useEffect(() => {
    if (!hasCamera) return

    const startCamera = async () => {
      try {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop())
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: activeCamera },
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }

        streamRef.current = stream
        setHasCameraPermission(true)
      } catch (error) {
        console.error("Error accessing camera:", error)
        setHasCameraPermission(false)

        toast({
          title: "Camera access denied",
          description: "Please allow camera access to use this feature",
          variant: "destructive",
        })
      }
    }

    startCamera()

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [hasCamera, activeCamera, toast])

  // Switch camera
  const handleSwitchCamera = () => {
    setActiveCamera((prev) => (prev === "user" ? "environment" : "user"))
  }

  // Capture photo
  const handleCapturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Get image data URL
    const imageDataUrl = canvas.toDataURL("image/png")
    setCapturedImage(imageDataUrl)

    toast({
      title: "Photo captured",
      description: "Your photo has been saved",
    })
  }

  // Start QR code scanning
  const handleStartScanning = () => {
    setIsScanning(true)
    setScannedCode(null)

    // In a real app, you would use a library like jsQR to scan QR codes
    // This is a simplified simulation
    const scanInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        clearInterval(scanInterval)
        setIsScanning(false)

        const mockCode = "https://shopease.example.com/product/12345"
        setScannedCode(mockCode)

        toast({
          title: "QR Code detected",
          description: "Code has been scanned successfully",
        })
      }
    }, 1000)

    // Clear interval after 10 seconds if no code found
    setTimeout(() => {
      clearInterval(scanInterval)
      if (isScanning) {
        setIsScanning(false)
        toast({
          title: "No QR code found",
          description: "Please try again with a clearer image",
          variant: "destructive",
        })
      }
    }, 10000)
  }

  // Download captured image
  const handleDownloadImage = () => {
    if (!capturedImage) return

    const link = document.createElement("a")
    link.href = capturedImage
    link.download = `shopease-photo-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Download started",
      description: "Your photo is being downloaded",
    })
  }

  // Share captured image
  const handleShareImage = async () => {
    if (!capturedImage || !canShare) return

    try {
      // Convert data URL to blob
      const response = await fetch(capturedImage)
      const blob = await response.blob()

      // Create file from blob
      const file = new File([blob], `shopease-photo-${Date.now()}.png`, { type: "image/png" })

      // Share file
      await navigator.share({
        title: "ShopEase Photo",
        text: "Check out this photo from ShopEase!",
        files: [file],
      })
    } catch (error) {
      console.error("Error sharing:", error)
      toast({
        title: "Sharing failed",
        description: "There was an error sharing your photo",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Camera</h1>

        {!hasCamera ? (
          <Card>
            <CardHeader>
              <CardTitle>Camera Not Available</CardTitle>
              <CardDescription>Your device doesn't have a camera or access is restricted.</CardDescription>
            </CardHeader>
          </Card>
        ) : hasCameraPermission === false ? (
          <Card>
            <CardHeader>
              <CardTitle>Camera Access Denied</CardTitle>
              <CardDescription>
                Please allow camera access in your browser settings to use this feature.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <Tabs defaultValue="photo">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="photo">
                <Camera className="h-4 w-4 mr-2" />
                Take Photo
              </TabsTrigger>
              <TabsTrigger value="qrcode">
                <QrCode className="h-4 w-4 mr-2" />
                Scan QR Code
              </TabsTrigger>
            </TabsList>

            <TabsContent value="photo" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Take a Photo</CardTitle>
                  <CardDescription>Capture images for product reviews or profile pictures</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {capturedImage ? (
                      <div className="relative rounded-lg overflow-hidden bg-black aspect-video flex items-center justify-center">
                        <img
                          src={capturedImage || "/placeholder.svg"}
                          alt="Captured"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                      </div>
                    )}

                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-wrap gap-2">
                  {capturedImage ? (
                    <>
                      <Button variant="outline" onClick={() => setCapturedImage(null)} className="flex-1">
                        Take Another
                      </Button>
                      <Button onClick={handleDownloadImage} className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      {canShare && (
                        <Button variant="secondary" onClick={handleShareImage} className="flex-1">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      <Button variant="outline" onClick={handleSwitchCamera} className="flex-1">
                        <FlipCamera className="h-4 w-4 mr-2" />
                        Switch Camera
                      </Button>
                      <Button onClick={handleCapturePhoto} className="flex-1">
                        <Aperture className="h-4 w-4 mr-2" />
                        Capture
                      </Button>
                    </>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="qrcode" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Scan QR Code</CardTitle>
                  <CardDescription>Scan product QR codes for quick access</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {scannedCode ? (
                      <div className="p-6 border rounded-lg">
                        <h3 className="font-medium mb-2">Scanned Code:</h3>
                        <p className="text-sm break-all">{scannedCode}</p>
                        <div className="mt-4">
                          <Button onClick={() => window.open(scannedCode, "_blank")} className="w-full">
                            Open Link
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

                        {isScanning && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-48 h-48 border-2 border-white rounded-lg"></div>
                            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500 animate-scan"></div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  {scannedCode ? (
                    <Button onClick={() => setScannedCode(null)} className="w-full">
                      Scan Another Code
                    </Button>
                  ) : (
                    <Button onClick={handleStartScanning} disabled={isScanning} className="w-full">
                      {isScanning ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                          Scanning...
                        </>
                      ) : (
                        <>
                          <QrCode className="h-4 w-4 mr-2" />
                          Start Scanning
                        </>
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
