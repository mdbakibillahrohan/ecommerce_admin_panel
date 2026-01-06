export interface IStore {
  id: number
  owner_name: string
  owner_id: number
  store_category: string
  store_category_id: number
  name: string
  slug: string
  logo_path: string
  description: string
  email: string
  phone: string
  tagline: string
  address: string
  currency: string
  is_verified: boolean
  setting: string
  status: string
}

export interface IStoreCategory {
  id: number
  name: string
  slug: string
  description: string
}
