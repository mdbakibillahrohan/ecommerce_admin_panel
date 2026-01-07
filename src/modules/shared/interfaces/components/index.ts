/**
 * Shared Components Interfaces
 * Interface definitions for shared UI components
 */

export interface MenuItem {
  key: string
  icon?: string
  label: string
  path?: string
  badge?: number | string
  children?: MenuItem[]
}

export interface MenuGroup {
  title: string
  items: MenuItem[]
}

export interface Notification {
  id: number
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  read: boolean
  created_at: string
  link?: string
}
