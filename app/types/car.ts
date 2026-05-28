export type PriceBadge = string

export type FuelType = string

export type Transmission = string

export interface Seller {
  name: string
  type: 'Дилер' | 'Частный продавец'
  rating: number
  phone: string
  responseTime: string
}

export interface Car {
  id: string
  brand: string
  model: string
  title: string
  price: number
  year: number
  mileage: number
  fuel: FuelType
  transmission: Transmission
  city: string
  priceBadge: PriceBadge
  images: string[]
  engine: string
  drivetrain: string
  power: number
  color: string
  description: string
  seller: Seller
  isFeatured: boolean
}

export interface CarSearchFilters {
  query: string
  vehicleType: string
  brand: string
  model: string
  description: string
  maxPrice: string
  yearFrom: string
  maxMileage: string
  fuel: string
  city: string
}

export interface AdminCarPayload {
  brand: string
  model: string
  title: string
  price: number
  year: number
  mileage: number
  fuel: string
  transmission: string
  city: string
  engine: string
  drivetrain: string
  power: number
  color: string
  description: string
  sellerName: string
  sellerType: Seller['type']
  sellerPhone: string
  images: string[]
  isFeatured: boolean
}

export interface HomeCategory {
  id: string
  title: string
  image: string
  sortOrder: number
  isActive: boolean
}

export interface AdminCategoryPayload {
  title: string
  image: string
  sortOrder: number
  isActive: boolean
}
