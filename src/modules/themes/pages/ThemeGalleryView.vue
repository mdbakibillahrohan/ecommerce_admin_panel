<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { themesApi, type Theme } from '@/modules/themes/api/themes'
import { EyeOutlined, ThunderboltOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const loading = ref(false)
const themes = ref<Theme[]>([])
const activeThemeId = ref<number | null>(null) // Would fetch from current store theme config

onMounted(() => {
  fetchThemes()
})

async function fetchThemes() {
  loading.value = true
  try {
    themes.value = await themesApi.getAll()
    // Placeholder: Fetch active store theme to set activeThemeId
  } catch (error) {
    console.error('Failed to fetch themes', error)
  } finally {
    loading.value = false
  }
}

async function handleActivate(theme: Theme) {
  try {
    await themesApi.updateMyStoreTheme({ theme_id: theme.id, is_active: true })
    message.success(`Activated theme: ${theme.name}`)
    activeThemeId.value = theme.id
  } catch (error) {
    message.error('Failed to activate theme')
  }
}
</script>

<template>
  <div class="theme-gallery">
    <div class="page-header">
      <div class="header-left">
        <h1>Theme Gallery</h1>
        <p>Choose a look for your store</p>
      </div>
    </div>

    <a-spin :spinning="loading">
      <div class="themes-grid">
        <div v-for="theme in themes" :key="theme.id" class="theme-card">
          <div class="theme-preview">
            <div class="preview-placeholder">
              <span class="theme-name-preview">{{ theme.name }}</span>
            </div>
            <div class="theme-overlay">
              <a-button type="primary" size="large" @click="handleActivate(theme)">
                <ThunderboltOutlined /> Activate
              </a-button>
              <a-button size="large">
                <EyeOutlined /> Live Preview
              </a-button>
            </div>
          </div>

          <div class="theme-info">
            <div class="info-top">
              <h3 class="name">{{ theme.name }}</h3>
              <a-tag v-if="theme.is_premium" color="gold">Premium</a-tag>
              <a-tag v-else color="green">Free</a-tag>
            </div>
            <p class="author">by {{ theme.author }}</p>
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<style scoped>
.theme-gallery {
  min-height: 100%;
}

.page-header {
  margin-bottom: 24px;
}

.themes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 32px;
}

.theme-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s;
}

.theme-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.theme-preview {
  height: 240px;
  background: #f0f2f5;
  position: relative;
  overflow: hidden;
}

.preview-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #bfbfbf;
  font-size: 24px;
  background: linear-gradient(45deg,
      #f5f5f5 25%,
      #fff 25%,
      #fff 50%,
      #f5f5f5 50%,
      #f5f5f5 75%,
      #fff 75%,
      #fff 100%);
  background-size: 20px 20px;
}

.theme-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  opacity: 0;
  transition: opacity 0.3s;
}

.theme-card:hover .theme-overlay {
  opacity: 1;
}

.theme-info {
  padding: 16px;
}

.info-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.author {
  color: #8c8c8c;
  margin: 0;
}
</style>
