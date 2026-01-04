<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { theme } from 'ant-design-vue'
import { RouterView } from 'vue-router'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

const themeConfig = computed(() => ({
  algorithm: themeStore.isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
  token: {
    colorPrimary: themeStore.isDark ? '#14b8a6' : '#0d9488',
    colorSuccess: '#10b981',
    colorInfo: themeStore.isDark ? '#14b8a6' : '#0d9488',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    borderRadius: 8,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',

    colorBgContainer: themeStore.isDark ? '#1f2937' : '#ffffff',
    colorBgElevated: themeStore.isDark ? '#374151' : '#ffffff',
    colorBgLayout: themeStore.isDark ? '#111827' : '#f9fafb',
    colorBorder: themeStore.isDark ? '#374151' : '#e5e7eb',
    colorText: themeStore.isDark ? '#f3f4f6' : '#1f2937',
    colorTextSecondary: themeStore.isDark ? '#9ca3af' : '#6b7280',

    colorPrimaryBg: themeStore.isDark ? '#134e4a' : '#f0fdfa',
    colorPrimaryBgHover: themeStore.isDark ? '#115e59' : '#ccfbf1',
    colorPrimaryBorder: themeStore.isDark ? '#0f766e' : '#99f6e4',
    colorPrimaryBorderHover: themeStore.isDark ? '#0d9488' : '#5eead4',
    colorPrimaryHover: themeStore.isDark ? '#14b8a6' : '#14b8a6',
    colorPrimaryActive: themeStore.isDark ? '#0f766e' : '#0f766e',
    colorPrimaryTextHover: themeStore.isDark ? '#14b8a6' : '#0f766e',
    colorPrimaryText: themeStore.isDark ? '#14b8a6' : '#0d9488',
    colorPrimaryTextActive: themeStore.isDark ? '#0f766e' : '#0f766e',
  },
}))

// Force apply the current theme to ensure the dark class is set
onMounted(() => {
  themeStore.setTheme(themeStore.theme)
})
</script>

<template>
  <a-config-provider :theme="themeConfig">
    <RouterView />
  </a-config-provider>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
</style>
