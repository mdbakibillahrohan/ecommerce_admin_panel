<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storesApi, type Store } from '@/api/stores'
import { AppstoreOutlined, PlusOutlined, CheckCircleFilled } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const stores = ref<Store[]>([])
const loading = ref(false)

const activeStoreName = computed(() => authStore.activeStore?.name || 'Select Store')

onMounted(() => {
  fetchStores()
})

async function fetchStores() {
  loading.value = true
  try {
    const data = await storesApi.getAll()
    stores.value = data

    // Auto-select first store if none selected and stores exist
    if (!authStore.activeStore && data.length > 0) {
      authStore.setActiveStore(data[0])
    }
  } catch (error) {
    console.error('Failed to fetch stores', error)
  } finally {
    loading.value = false
  }
}

function handleStoreSelect(store: Store) {
  authStore.setActiveStore(store)
  message.success(`Switched to ${store.name}`)
  window.location.reload() // Reload to ensure all data is refreshed for new store context
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
    '#1890ff',
    '#52c41a',
    '#fa8c16',
    '#eb2f96',
    '#722ed1',
    '#13c2c2',
    '#faad14',
    '#f5222d',
  ]
  return colors[index % colors.length] || ''
}
</script>

<template>
  <a-dropdown :trigger="['click']" placement="bottomRight">
    <a-button>
      <template #icon><AppstoreOutlined /></template>
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
            <div
              v-for="(store, index) in stores"
              :key="store.id"
              class="store-item"
              :class="{ active: authStore.activeStore?.id === store.id }"
              @click="handleStoreSelect(store)"
            >
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
.store-dropdown {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
  min-width: 320px;
  max-width: 400px;
}

.store-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.store-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
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
  transition: all 0.2s ease;
  position: relative;
}

.store-item:hover {
  background-color: #f5f5f5;
  transform: translateY(-2px);
}

.store-item.active {
  background-color: #e6f7ff;
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.add-icon {
  background-color: #f0f0f0 !important;
  color: #8c8c8c !important;
  font-size: 24px;
}

.add-store:hover .add-icon {
  background-color: #1890ff !important;
  color: #ffffff !important;
}

.store-name {
  font-size: 13px;
  color: #262626;
  text-align: center;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 80px;
}

.check-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 16px;
  color: #1890ff;
}

/* Scrollbar Styling */
.store-grid::-webkit-scrollbar {
  width: 6px;
}

.store-grid::-webkit-scrollbar-track {
  background: #f0f0f0;
  border-radius: 3px;
}

.store-grid::-webkit-scrollbar-thumb {
  background: #bfbfbf;
  border-radius: 3px;
}

.store-grid::-webkit-scrollbar-thumb:hover {
  background: #8c8c8c;
}
</style>
