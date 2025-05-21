import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative py-12 md:py-24 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 rounded-xl overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Shop Anywhere, Anytime
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Our PWA works online and offline. Browse products, add to cart, and sync when you're back online.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
                <Link href="/products">Shop Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative h-full">
              <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[500px] aspect-square rounded-full bg-orange-500/20 blur-3xl" />
              <div className="relative z-10 p-6">
                <div className="aspect-[4/3] overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-2xl">
                  <div className="h-full w-full bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900 dark:to-orange-800 flex items-center justify-center">
                    <div className="text-center p-6">
                      <div className="inline-block rounded-full bg-orange-600 p-4 mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white"
                        >
                          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                          <path d="M3 6h18" />
                          <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold mb-2">Summer Sale</h3>
                      <p className="text-muted-foreground mb-4">Up to 50% off on selected items</p>
                      <Button className="bg-orange-600 hover:bg-orange-700">View Deals</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
