"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Share2, Link2, FileText, ImageIcon } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ShareTargetPage() {
  const [sharedData, setSharedData] = useState<{
    title?: string
    text?: string
    url?: string
    image?: File | null
  }>({})
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const processSharedData = async () => {
      try {
        // Get URL parameters (for GET requests)
        const urlParams = new URLSearchParams(window.location.search)
        const title = urlParams.get("title")
        const text = urlParams.get("text")
        const url = urlParams.get("url")

        // For POST requests with FormData
        // In a real app, you would need server-side handling for this
        // This is a simplified client-side simulation
        let image: File | null = null
        let imageUrl: string | null = null

        // Simulate getting an image from the share
        if (Math.random() > 0.5) {
          // Create a mock image for demonstration
          const canvas = document.createElement("canvas")
          canvas.width = 300
          canvas.height = 300
          const ctx = canvas.getContext("2d")
          if (ctx) {
            ctx.fillStyle = "#f97316"
            ctx.fillRect(0, 0, 300, 300)
            ctx.fillStyle = "white"
            ctx.font = "24px Arial"
            ctx.textAlign = "center"
            ctx.fillText("Shared Image", 150, 150)

            // Convert canvas to blob
            const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), "image/png"))

            // Create file from blob
            image = new File([blob], "shared-image.png", { type: "image/png" })
            imageUrl = URL.createObjectURL(blob)
          }
        }

        setSharedData({
          title: title || "Shared Content",
          text: text || "This is shared content from another app.",
          url: url || "https://example.com/shared-item",
          image,
        })

        if (imageUrl) {
          setImagePreview(imageUrl)
        }

        setIsProcessing(false)

        toast({
          title: "Content received",
          description: "Shared content has been processed",
        })
      } catch (error) {
        console.error("Error processing shared data:", error)
        setIsProcessing(false)

        toast({
          title: "Processing error",
          description: "There was an error processing the shared content",
          variant: "destructive",
        })
      }
    }

    processSharedData()
  }, [toast])

  const handleSaveContent = () => {
    // In a real app, you would save the content to your database
    toast({
      title: "Content saved",
      description: "The shared content has been saved to your account",
    })

    // Redirect to home page
    setTimeout(() => {
      router.push("/")
    }, 1500)
  }

  const handleDiscard = () => {
    toast({
      title: "Content discarded",
      description: "The shared content has been discarded",
    })

    // Redirect to home page
    router.push("/")
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Shared Content</h1>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              {isProcessing ? "Processing Shared Content..." : "Shared Content Received"}
            </CardTitle>
            <CardDescription>
              {isProcessing
                ? "Please wait while we process the content you shared with ShopEase."
                : "Review the content you shared with ShopEase."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isProcessing ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {sharedData.title && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      Title
                    </div>
                    <p className="font-medium">{sharedData.title}</p>
                  </div>
                )}

                {sharedData.text && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      Text
                    </div>
                    <p>{sharedData.text}</p>
                  </div>
                )}

                {sharedData.url && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Link2 className="h-4 w-4" />
                      URL
                    </div>
                    <a
                      href={sharedData.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline break-all"
                    >
                      {sharedData.url}
                    </a>
                  </div>
                )}

                {imagePreview && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <ImageIcon className="h-4 w-4" />
                      Image
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <img src={imagePreview || "/placeholder.svg"} alt="Shared" className="max-w-full h-auto" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleDiscard} disabled={isProcessing}>
              Discard
            </Button>
            <Button onClick={handleSaveContent} disabled={isProcessing}>
              Save Content
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
