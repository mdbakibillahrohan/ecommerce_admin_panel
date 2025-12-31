<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { AppstoreOutlined, PlusOutlined, CheckCircleFilled } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useStoreStore } from '@/stores/store/store'
import type { IStore } from '@/intefaces/store/store.interface'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)

const storeStore = useStoreStore();

const activeStoreName = computed(() => authStore.activeStore?.name || 'Select Store')


function handleStoreSelect(store: IStore) {
  authStore.setActiveStore(store)
  message.success(`Switched to ${store.name}`)
  storeStore.setActiveStore(store);
  // window.location.reload() // Reload to ensure all data is refreshed for new store context
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
.store-dropdown {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
  min-width: 320px;
  max-width: 400px;
}

:global(.dark) .store-dropdown {
  background: #1f2937;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.4);
}

.store-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

:global(.dark) .store-header {
  border-bottom-color: #374151;
}

.store-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

:global(.dark) .store-header h3 {
  color: #f3f4f6;
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

:global(.dark) .store-item:hover {
  background-color: #374151;
}

.store-item.active {
  background-color: #e6f7ff;
}

:global(.dark) .store-item.active {
  background-color: rgba(99, 102, 241, 0.2);
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

:global(.dark) .add-icon {
  background-color: #374151 !important;
  color: #9ca3af !important;
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

:global(.dark) .store-name {
  color: #d1d5db;
}

.check-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 16px;
  color: #1890ff;
}

:global(.dark) .check-icon {
  color: #6366f1;
}

/* Scrollbar Styling */
.store-grid::-webkit-scrollbar {
  width: 6px;
}

.store-grid::-webkit-scrollbar-track {
  background: #f0f0f0;
  border-radius: 3px;
}

:global(.dark) .store-grid::-webkit-scrollbar-track {
  background: #1f2937;
}

.store-grid::-webkit-scrollbar-thumb {
  background: #bfbfbf;
  border-radius: 3px;
}

:global(.dark) .store-grid::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.store-grid::-webkit-scrollbar-thumb:hover {
  background: #8c8c8c;
}

:global(.dark) .store-grid::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>
