<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/modules/auth/store'
import { AppstoreOutlined, PlusOutlined, CheckCircleFilled } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useStoreStore } from '@/modules/stores/store/store'
import type { IStore } from '@/modules/shared/interfaces/store/store.interface'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const storeStore = useStoreStore()

const activeStoreName = computed(() => authStore.activeStore?.name || 'Select Store')

function handleStoreSelect(store: IStore) {
  authStore.setActiveStore(store)
  message.success(`Switched to ${store.name}`)
  storeStore.setActiveStore(store)
}

function handleCreateStore() {
  router.push('/stores/create')
}

function getStoreInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getStoreColor(index: number): string {
  const colors = [
    '#0d9488', // teal
    '#14b8a6', // teal light
    '#0f766e', // teal dark
    '#2dd4bf', // teal lighter
    '#115e59', // teal darker
    '#5eead4', // teal very light
    '#0d9488', // teal repeat
    '#14b8a6', // teal light repeat
  ]
  return colors[index % colors.length] || ''
}

onMounted(() => {
  console.log(storeStore.stores)
})
</script>

<template>
  <a-dropdown :trigger="['click']" placement="bottomRight">
    <a-button class="store-selector-btn">
      <template #icon>
        <AppstoreOutlined />
      </template>
      {{ activeStoreName }}
    </a-button>

    <template #overlay>
      <div class="store-dropdown">
        <div class="store-header">
          <h3>Select Store</h3>
        </div>

        <a-spin :spinning="loading">
          <div class="store-grid">
            <!-- Store Items -->
            <div v-for="(store, index) in storeStore.stores" :key="store.id" class="store-item"
              :class="{ active: authStore.activeStore?.id === store.id }" @click="handleStoreSelect(store)">
              <div class="store-icon" :style="{ backgroundColor: getStoreColor(index) }">
                {{ getStoreInitials(store.name) }}
              </div>
              <div class="store-name">{{ store.name }}</div>
              <CheckCircleFilled v-if="authStore.activeStore?.id === store.id" class="check-icon" />
            </div>

            <!-- Add New Store Button -->
            <div class="store-item add-store" @click="handleCreateStore">
              <div class="store-icon add-icon">
                <PlusOutlined />
              </div>
              <div class="store-name">Add Store</div>
            </div>
          </div>
        </a-spin>
      </div>
    </template>
  </a-dropdown>
</template>

<style scoped>
/* Updated to use CSS variables for proper theme handling */
.store-selector-btn {
  background: var(--background);
  border-color: var(--border);
  color: var(--foreground);
  transition: all 0.3s ease;
}

.store-selector-btn:hover {
  border-color: oklch(0.55 0.15 180);
  color: oklch(0.55 0.15 180);
}

.store-dropdown {
  background: var(--popover);
  border-radius: 8px;
  border: 1px solid var(--border);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  min-width: 320px;
  max-width: 400px;
}

.store-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  background: linear-gradient(135deg, oklch(0.55 0.15 180) 0%, oklch(0.5 0.15 180) 100%);
}

.store-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
}

.store-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.store-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  background: var(--background);
  border: 1px solid transparent;
}

.store-item:hover {
  background: var(--accent);
  transform: translateY(-2px);
  border-color: var(--border);
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.15);
}

.store-item.active {
  background: var(--accent);
  border-color: oklch(0.55 0.15 180);
  box-shadow: 0 0 0 2px oklch(0.55 0.15 180 / 0.2);
}

.store-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.store-item:hover .store-icon {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.add-icon {
  background: var(--muted) !important;
  color: var(--muted-foreground) !important;
  font-size: 24px;
}

.add-store:hover .add-icon {
  background: linear-gradient(135deg, oklch(0.55 0.15 180), oklch(0.6 0.15 180)) !important;
  color: #ffffff !important;
}

.store-name {
  font-size: 13px;
  color: var(--foreground);
  text-align: center;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 80px;
  font-weight: 500;
}

.check-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 16px;
  color: oklch(0.55 0.15 180);
  filter: drop-shadow(0 2px 4px rgba(13, 148, 136, 0.3));
}

/* Scrollbar Styling */
.store-grid::-webkit-scrollbar {
  width: 6px;
}

.store-grid::-webkit-scrollbar-track {
  background: var(--muted);
  border-radius: 3px;
}

.store-grid::-webkit-scrollbar-thumb {
  background: oklch(0.55 0.15 180);
  border-radius: 3px;
}

.store-grid::-webkit-scrollbar-thumb:hover {
  background: oklch(0.5 0.15 180);
}
</style>
