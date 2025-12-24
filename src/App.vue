<script setup lang="ts">
import { computed } from 'vue'
import { theme } from 'ant-design-vue'
import { RouterView } from 'vue-router'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

// Dynamic theme algorithm based on user preference
const themeConfig = computed(() => ({
  algorithm: themeStore.isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
  token: {
    colorPrimary: '#6366f1',
    borderRadius: 5,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    // Dark mode specific tokens
    ...(themeStore.isDark && {
      colorBgContainer: '#1f2937',
      colorBgElevated: '#374151',
      colorBgLayout: '#111827',
      colorBorder: '#374151',
      colorText: '#f3f4f6',
      colorTextSecondary: '#9ca3af',
    }),
  },
}))
</script>

<template>
  <a-config-provider :theme="themeConfig">
    <RouterView />
  </a-config-provider>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
</style>
