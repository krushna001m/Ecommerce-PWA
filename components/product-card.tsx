import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface ProductCardProps {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  isNew?: boolean
  isSale?: boolean
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  rating,
  isNew = false,
  isSale = false,
}: ProductCardProps) {
  return (
    <Card className="overflow-hidden group">
      <div className="relative">
        <Link href={`/product/${id}`}>
          <div className="overflow-hidden aspect-square">
            <Image
              src={image || "/placeholder.svg"}
              alt={name}
              width={300}
              height={300}
              className="object-cover w-full h-full transition-transform group-hover:scale-105"
            />
          </div>
        </Link>
        <div className="absolute top-2 right-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90 dark:bg-black/80 dark:hover:bg-black/90"
          >
            <Heart className="h-4 w-4" />
            <span className="sr-only">Add to wishlist</span>
          </Button>
        </div>
        {isNew && <Badge className="absolute top-2 left-2 bg-green-600 hover:bg-green-700">New</Badge>}
        {isSale && <Badge className="absolute top-2 left-2 bg-red-600 hover:bg-red-700">Sale</Badge>}
      </div>
      <CardContent className="p-4">
        <Link href={`/product/${id}`}>
          <h3 className="font-medium line-clamp-1 hover:underline">{name}</h3>
        </Link>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < rating ? "fill-primary text-primary" : "fill-muted text-muted-foreground"}`}
                />
              ))}
          </div>
          <span className="text-xs text-muted-foreground">({rating.toFixed(1)})</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-medium">${price.toFixed(2)}</span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">${originalPrice.toFixed(2)}</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" size="sm">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
