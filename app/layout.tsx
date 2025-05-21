import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/header"
import Footer from "@/components/footer"
import RegisterSW from "@/components/register-sw"
import { PwaInstallBanner } from "@/components/pwa-install-banner"
import { NotificationProvider } from "@/components/notification-provider"
import { OfflineProvider } from "@/components/offline-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ShopEase - Your E-Commerce PWA",
  description: "A progressive web app for e-commerce with offline support",
  manifest: "/manifest.json",
  themeColor: "#f97316",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ShopEase",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <OfflineProvider>
            <NotificationProvider>
              <RegisterSW />
              <PwaInstallBanner />
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </NotificationProvider>
          </OfflineProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
