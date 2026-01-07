/**
 * Content Module Interfaces
 */

export interface Slider {
  id: number
  name: string
  code: string
  is_active: boolean
  items: SliderItem[]
}

export interface SliderItem {
  id: number
  title?: string
  subtitle?: string
  link?: string
  image_url: string
  order: number
}

export interface Page {
  id: number
  title: string
  slug: string
  content: string
  is_published: boolean
  updated_at: string
}

export interface CreateSliderDto {
  name: string
  code: string
  is_active?: boolean
  items?: SliderItemDto[]
}

export interface SliderItemDto {
  title?: string
  subtitle?: string
  link?: string
  image_url: string
  order?: number
}

export interface CreatePageDto {
  title: string
  slug?: string
  content: string
  is_published?: boolean
}

export interface UpdatePageDto extends Partial<CreatePageDto> {}
