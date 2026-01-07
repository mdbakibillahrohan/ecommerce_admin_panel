import api from '@/modules/shared/config/http.config'

// Import and re-export all interfaces
export type {
  Slider,
  SliderItem,
  Page,
  CreateSliderDto,
  SliderItemDto,
  CreatePageDto,
  UpdatePageDto,
} from '../interfaces'

import type { CreateSliderDto, CreatePageDto, UpdatePageDto } from '../interfaces'

export const contentService = {
  // Sliders
  async getSliders() {
    const response = await api.get('/content/sliders')
    return response.data
  },

  async createSlider(data: CreateSliderDto) {
    const response = await api.post('/content/sliders', data)
    return response.data
  },

  async updateSlider(id: number, data: CreateSliderDto) {
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

  async createPage(data: CreatePageDto) {
    const response = await api.post('/content/pages', data)
    return response.data
  },

  async updatePage(id: number, data: UpdatePageDto) {
    const response = await api.patch(`/content/pages/${id}`, data)
    return response.data
  },

  async deletePage(id: number) {
    await api.delete(`/content/pages/${id}`)
  },
}
