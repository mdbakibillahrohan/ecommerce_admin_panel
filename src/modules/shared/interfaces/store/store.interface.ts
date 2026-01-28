export interface IStore {
  id: number
  ownerId: number
  name: string
  slug: string
  description: string
  logoUrl: string | null
  logoId: number | null
  email: string
  phone: string
  address: string
  city: string
  country: string
  currency: string
  timezone: string | null
  isActive: boolean
  metaTitle: string | null
  metaDescription: string | null
  metaKeywords: string | null
  defaultLanguage: string
  supportedLanguages: string[] | null
  faviconId: number | null
  faviconUrl: string | null
  primaryColor: string | null
  secondaryColor: string | null
  bannerImageId: number | null
  bannerImageUrl: string | null
  tagline: string | null
  customDomain: string | null
  domainStatus: 'PENDING' | 'ACTIVE' | 'FAILED' // extend if backend has more
  sslEnabled: boolean
  createdAt: string // ISO date string
  updatedAt: string | null
}

export interface BusinessCategory {
  id: number
  name: string
  categoryDescription: string
  mediaFileId: number
  medialFileUrl: string
}
