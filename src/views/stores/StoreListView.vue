<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { PlusOutlined, EditOutlined, TeamOutlined, SettingOutlined } from '@ant-design/icons-vue'
import { useStoreStore } from '@/stores/store'

const router = useRouter()
const loading = ref(false)

const storeStore = useStoreStore();

const getUserStoreList = async () => {
  loading.value = true;
  try {
    await storeStore.fetchCurrentUserStores()
  } catch (err: any) {
    console.error(err)
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await getUserStoreList();
})



function handleCreate() {
  router.push('/stores/create')
}

function handleEdit(id: number) {
  router.push(`/stores/${id}/edit`)
}

function handleManage(id: number) {
  // Can redirect to store settings or dashboard context if simpler
  router.push(`/stores/${id}/edit`)
}
</script>

<template>
  <div class="store-list">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-left">
        <h1>My Stores</h1>
        <p>Manage your online stores</p>
      </div>
      <div class="header-right">
        <a-button type="primary" @click="handleCreate">
          <template #icon>
            <PlusOutlined />
          </template>
          Create Store
        </a-button>
      </div>
    </div>

    <a-spin :spinning="loading">
      <div class="stores-grid">
        <a-card v-for="store in storeStore.stores" :key="store.id" class="store-card" hoverable>
          <template #actions>
            <a-tooltip title="Settings">
              <SettingOutlined key="setting" @click="handleEdit(store.id)" />
            </a-tooltip>
            <a-tooltip title="Members">
              <TeamOutlined key="members" @click="handleManage(store.id)" />
            </a-tooltip>
            <a-tooltip title="Edit">
              <EditOutlined key="edit" @click="handleEdit(store.id)" />
            </a-tooltip>
          </template>
          <a-card-meta :title="store.name">
            <template #description>
              <div>{{ store.slug }}</div>
              <div style="margin-top: 8px">
                <a-tag :color="store.status === 'ACTIVE' ? 'green' : 'orange'">
                  {{ store.status }}
                </a-tag>
              </div>
            </template>
            <template #avatar>
              <a-avatar shape="square" size="large" :style="{ backgroundColor: '#722ed1', verticalAlign: 'middle' }">
                {{ store.name.charAt(0) }}
              </a-avatar>
            </template>
          </a-card-meta>
        </a-card>

        <!-- Empty State -->
        <a-empty v-if="!loading && storeStore.stores.length === 0"
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg" :image-style="{ height: '60px' }"
          description="You haven't created any stores yet">
          <a-button type="primary" @click="handleCreate">Create Now</a-button>
        </a-empty>
      </div>
    </a-spin>
  </div>
</template>

<style scoped>
.store-list {
  min-height: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
}

.header-left h1 {
  font-size: 28px;
  font-weight: 700;
  color: #262626;
  margin: 0 0 4px 0;
}

.header-left p {
  color: #8c8c8c;
  margin: 0;
}

.stores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.store-card {
  border-radius: 8px;
  overflow: hidden;
}

.store-card :deep(.ant-card-actions) {
  background: #fafafa;
}
</style>
