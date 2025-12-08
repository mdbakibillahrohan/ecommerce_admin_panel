<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { contentApi, type Page } from '@/api/content'
import { PlusOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const pages = ref<Page[]>([])

const activeStoreId = computed(() => authStore.activeStore?.id)

onMounted(() => {
  if (activeStoreId.value) {
    fetchPages()
  }
})

async function fetchPages() {
  if (!activeStoreId.value) return
  loading.value = true
  try {
    pages.value = await contentApi.getPages(activeStoreId.value)
  } catch (error) {
    message.error('Failed to fetch pages')
    console.error(error)
  } finally {
    loading.value = false
  }
}

function handleCreate() {
  router.push('/content/pages/create')
}

function handleEdit(id: number) {
  router.push(`/content/pages/${id}/edit`)
}

const columns = [
  { title: 'Title', dataIndex: 'title', key: 'title' },
  { title: 'URL Slug', dataIndex: 'slug', key: 'slug' },
  { title: 'Type', dataIndex: 'page_type', key: 'type', width: 120 },
  { title: 'Status', key: 'status', width: 100, align: 'center' as const },
  { title: 'Last Updated', key: 'date', width: 200 },
  { title: 'Actions', key: 'actions', width: 120, align: 'center' as const },
]
</script>

<template>
  <div class="page-list">
    <div class="page-header">
      <div class="header-left">
        <h1>Pages</h1>
        <p>Manage static pages and content</p>
      </div>
      <div class="header-right">
        <a-button type="primary" @click="handleCreate">
          <template #icon><PlusOutlined /></template>
          Create Page
        </a-button>
      </div>
    </div>

    <a-card :bordered="false" class="table-card">
      <a-table
        :columns="columns"
        :data-source="pages"
        :loading="loading"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'slug'">
            <code>/{{ record.slug }}</code>
          </template>

          <template v-if="column.key === 'status'">
            <a-tag :color="record.is_published ? 'green' : 'orange'">
              {{ record.is_published ? 'Published' : 'Draft' }}
            </a-tag>
          </template>

          <template v-if="column.key === 'date'">
            {{ dayjs(record.updated_at).format('MMM D, YYYY h:mm A') }}
          </template>

          <template v-if="column.key === 'actions'">
            <a-space>
              <a-button type="text" size="small" @click="handleEdit(record.id)">
                <template #icon><EditOutlined /></template>
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<style scoped>
.page-list {
  min-height: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.header-left h1 {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
}

.header-left p {
  color: #8c8c8c;
  margin: 0;
}

.table-card :deep(.ant-card-body) {
  padding: 0;
}
</style>
