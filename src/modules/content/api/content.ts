import api from '@/modules/shared/config/http.config'

export interface Page {
  id: number
  store_id: number
  title: string
  slug: string
  page_type: 'HOME' | 'ABOUT' | 'CONTACT' | 'POLICY' | 'CUSTOM'
  content?: string
  meta_title?: string
  meta_description?: string
  is_published: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface CreatePageDto {
  title: string
  slug: string
  page_type: 'HOME' | 'ABOUT' | 'CONTACT' | 'POLICY' | 'CUSTOM'
  content?: string
  meta_title?: string
  meta_description?: string
  is_published?: boolean
  sort_order?: number
}

export interface Menu {
  id: number
  store_id: number
  name: string
  slug: string
  items: MenuItem[]
  is_active: boolean
}

export interface MenuItem {
  label: string
  url?: string
  page_id?: number
  target?: '_self' | '_blank'
  children?: MenuItem[]
}

export interface CreateMenuDto {
  name: string
  slug: string
  items: MenuItem[]
  is_active: boolean
}

export const contentApi = {
  // Pages
  getPages(storeId: number) {
    return api.get<Page[]>(`/store-content/store/${storeId}/pages`).then((res) => res.data)
  },

  getPage(storeId: number, slug: string) {
    return api.get<Page>(`/store-content/store/${storeId}/pages/${slug}`).then((res) => res.data)
  },

  createPage(data: CreatePageDto) {
    // Note: Request interceptor adds active_store_id header if needed, but endpoint uses body/param logic mostly
    // The controller uses req.user.active_store_id for creation
    return api.post<Page>('/store-content/pages', data).then((res) => res.data)
  },

  // Menus
  getMenus(storeId: number) {
    return api.get<Menu[]>(`/store-content/store/${storeId}/menus`).then((res) => res.data)
  },

  createMenu(data: CreateMenuDto) {
    return api.post<Menu>('/store-content/menus', data).then((res) => res.data)
  },
}
