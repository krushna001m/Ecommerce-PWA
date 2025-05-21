import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Smartphone, Shirt, Home, Sparkles } from "lucide-react"

export function Categories() {
  const categories = [
    {
      name: "Electronics",
      icon: <Smartphone className="h-6 w-6" />,
      href: "/category/electronics",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
    },
    {
      name: "Clothing",
      icon: <Shirt className="h-6 w-6" />,
      href: "/category/clothing",
      color: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
    },
    {
      name: "Home & Kitchen",
      icon: <Home className="h-6 w-6" />,
      href: "/category/home",
      color: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
    },
    {
      name: "Deals",
      icon: <Sparkles className="h-6 w-6" />,
      href: "/deals",
      color: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
    },
  ]

  return (
    <section className="my-10">
      <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link key={category.name} href={category.href}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                <div className={`p-3 rounded-full ${category.color}`}>{category.icon}</div>
                <span className="font-medium">{category.name}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
