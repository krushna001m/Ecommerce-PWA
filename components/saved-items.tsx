import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { Heart } from "lucide-react"

export function SavedItems() {
  const savedItems = [
    {
      id: "prod-1",
      name: "Wireless Noise-Cancelling Headphones",
      price: 249.99,
      originalPrice: 299.99,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.5,
      isSale: true,
    },
    {
      id: "prod-2",
      name: "Smart Watch Series 5",
      price: 399.99,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.8,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Items</CardTitle>
        <CardDescription>Items you've saved for later</CardDescription>
      </CardHeader>
      <CardContent>
        {savedItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {savedItems.map((item) => (
              <ProductCard
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                originalPrice={item.originalPrice}
                image={item.image}
                rating={item.rating}
                isSale={item.isSale}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <Heart className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium text-lg mb-2">No saved items</h3>
            <p className="text-muted-foreground mb-4">Items you save will appear here.</p>
            <Button>Browse Products</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
