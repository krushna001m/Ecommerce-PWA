import type { UserProfile } from "@/lib/types"

// Mock user service functions
export async function getUserProfile(): Promise<UserProfile> {
  // In a real app, this would fetch from an API
  return new Promise((resolve) => {
    setTimeout(() => {
      // Try to get from localStorage first
      const storedData = localStorage.getItem("userData")

      if (storedData) {
        resolve(JSON.parse(storedData))
      } else {
        // Fallback mock data
        resolve({
          name: "Krushna Mengal",
          email: "krushnamengal46@gmail.com",
          avatar: "",
          memberSince: "Jan 2023",
          orderCount: 5,
          phone: "+91 9699050043",
        })
      }
    }, 500)
  })
}

export async function updateUserProfile(profile: UserProfile): Promise<UserProfile> {
  // In a real app, this would update via an API
  return new Promise((resolve) => {
    setTimeout(() => {
      // Store in localStorage for demo purposes
      localStorage.setItem("userData", JSON.stringify(profile))
      resolve(profile)
    }, 800)
  })
}
