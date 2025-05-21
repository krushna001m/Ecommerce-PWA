import Link from "next/link"
import { Smartphone, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Smartphone className="h-5 w-5 text-orange-600" />
              <span className="font-bold">ShopEase</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Your one-stop e-commerce PWA for all your shopping needs, available online and offline.
            </p>
            <div className="flex gap-4">
              <Link href="https://www.facebook.com/krushna001m" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="https://x.com/krushna001m" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="https://www.instagram.com/krushna001m/" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-4">Shop</h3>
            <ul className="grid gap-2 text-sm">
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/category/electronics"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Electronics
                </Link>
              </li>
              <li>
                <Link
                  href="/category/clothing"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clothing
                </Link>
              </li>
              <li>
                <Link href="/category/home" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home & Kitchen
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-muted-foreground hover:text-foreground transition-colors">
                  Deals & Offers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-4">Account</h3>
            <ul className="grid gap-2 text-sm">
              <li>
                <Link href="/profile" className="text-muted-foreground hover:text-foreground transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-muted-foreground hover:text-foreground transition-colors">
                  Orders
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-muted-foreground hover:text-foreground transition-colors">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link href="/settings" className="text-muted-foreground hover:text-foreground transition-colors">
                  Settings
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-4">Contact</h3>
            <ul className="grid gap-4 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">123 Commerce St, Shopping City, SC 12345</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <Link href="tel:+15551234567" className="text-muted-foreground hover:text-foreground transition-colors">
                  +91 9699050043
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <Link
                  href="mailto:support@shopease.com"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  krushnamengal46@gmail.com
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} ShopEase. All rights reserved.</p>
          <div className="flex gap-4 text-sm">
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
