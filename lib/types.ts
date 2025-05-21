export interface UserProfile {
  name: string
  email: string
  avatar: string
  memberSince: string
  orderCount: number
  phone: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  images?: string[]
  rating: number
  reviewCount: number
  category: string
  tags: string[]
  stock: number
  isNew?: boolean
  isSale?: boolean
}

export interface Order {
  id: string
  date: string
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled"
  total: number
  items: OrderItem[]
  shippingAddress: Address
  paymentMethod: PaymentMethod
}

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface Address {
  id: string
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  zip: string
  country: string
  phone: string
  isDefault: boolean
}

export interface PaymentMethod {
  id: string
  type: "Credit Card" | "PayPal" | "Apple Pay" | "Google Pay"
  details: string
  isDefault: boolean
}
