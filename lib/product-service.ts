import type { Product } from "@/lib/types"

// Mock product service functions
export async function getProducts(limit = 10): Promise<Product[]> {
  // In a real app, this would fetch from an API
  return new Promise((resolve) => {
    setTimeout(() => {
      const products: Product[] = Array(limit)
        .fill(0)
        .map((_, i) => ({
          id: `prod-${i + 1}`,
          name: getRandomProductName(),
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, diam quis aliquam ultricies, nisl nunc ultricies nunc, quis ultricies nisl nunc quis ultricies.",
          price: Math.floor(Math.random() * 500) + 20,
          originalPrice: Math.random() > 0.5 ? Math.floor(Math.random() * 600) + 50 : undefined,
          image: `/placeholder.svg?height=300&width=300`,
          rating: Math.floor(Math.random() * 5 * 10) / 10 + 1,
          reviewCount: Math.floor(Math.random() * 500),
          category: getRandomCategory(),
          tags: ["tag1", "tag2"],
          stock: Math.floor(Math.random() * 100),
          isNew: Math.random() > 0.8,
          isSale: Math.random() > 0.7,
        }))

      resolve(products)
    }, 800)
  })
}

export async function getProductById(id: string): Promise<Product | null> {
  // In a real app, this would fetch from an API
  return new Promise((resolve) => {
    setTimeout(() => {
      if (Math.random() > 0.1) {
        // Simulate occasional 404
        resolve({
          id,
          name: getRandomProductName(),
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, diam quis aliquam ultricies, nisl nunc ultricies nunc, quis ultricies nisl nunc quis ultricies.",
          price: Math.floor(Math.random() * 500) + 20,
          originalPrice: Math.random() > 0.5 ? Math.floor(Math.random() * 600) + 50 : undefined,
          image: `/placeholder.svg?height=300&width=300`,
          images: Array(4)
            .fill(0)
            .map(() => `/placeholder.svg?height=600&width=600`),
          rating: Math.floor(Math.random() * 5 * 10) / 10 + 1,
          reviewCount: Math.floor(Math.random() * 500),
          category: getRandomCategory(),
          tags: ["tag1", "tag2"],
          stock: Math.floor(Math.random() * 100),
          isNew: Math.random() > 0.8,
          isSale: Math.random() > 0.7,
        })
      } else {
        resolve(null)
      }
    }, 800)
  })
}

// Helper functions
function getRandomProductName(): string {
  const adjectives = ["Premium", "Ultra", "Deluxe", "Essential", "Modern", "Classic", "Smart", "Eco-Friendly"]
  const products = ["Headphones", "Smartphone", "Laptop", "Watch", "Camera", "Speaker", "Tablet", "Monitor"]

  return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${products[Math.floor(Math.random() * products.length)]}`
}

function getRandomCategory(): string {
  const categories = ["Electronics", "Clothing", "Home & Kitchen", "Beauty"]
  return categories[Math.floor(Math.random() * categories.length)]
}
