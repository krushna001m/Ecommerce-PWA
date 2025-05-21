import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FeaturedProducts } from "@/components/featured-products"
import { Categories } from "@/components/categories"
import { HeroSection } from "@/components/hero-section"
import { InstallPWA } from "@/components/install-pwa"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-6">
      <InstallPWA />
      <HeroSection />
      <Categories />
      <section className="my-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Button variant="outline" className="hidden sm:flex">
            View All
          </Button>
        </div>
        <FeaturedProducts />
      </section>
      <section className="my-10">
        <Card className="bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800">
          <CardContent className="p-6 sm:p-10">
            <div className="grid gap-6 md:grid-cols-2 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Shop Offline</h2>
                <p className="text-muted-foreground mb-4">
                  Our PWA works even when you're offline. Browse products, add to cart, and sync when you're back
                  online.
                </p>
                <Button className="bg-orange-600 hover:bg-orange-700">Learn More</Button>
              </div>
              <div className="flex justify-center">
                <div className="w-full max-w-sm aspect-square bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="120"
                    height="120"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-orange-600"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    <path d="M12 8v4" />
                    <path d="M12 16h.01" />
                  </svg>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
