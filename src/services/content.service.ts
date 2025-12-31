/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/config/http.config"

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

export const contentService = {
  // Sliders
  async getSliders() {
    const response = await api.get('/content/sliders')
    return response.data
  },

  async createSlider(data: any) {
    const response = await api.post('/content/sliders', data)
    return response.data
  },

  async updateSlider(id: number, data: any) {
    const response = await api.patch(`/content/sliders/${id}`, data)
    return response.data
  },

  async deleteSlider(id: number) {
    await api.delete(`/content/sliders/${id}`)
  },

  // Pages
  async getPages() {
    const response = await api.get('/content/pages')
    return response.data
  },

  async getPage(id: number) {
    const response = await api.get(`/content/pages/${id}`)
    return response.data
  },

  async createPage(data: any) {
    const response = await api.post('/content/pages', data)
    return response.data
  },

  async updatePage(id: number, data: any) {
    const response = await api.patch(`/content/pages/${id}`, data)
    return response.data
  },

  async deletePage(id: number) {
    await api.delete(`/content/pages/${id}`)
  }
}
