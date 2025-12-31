<template>
  <div class="page-list">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Pages</h1>
      <a-button type="primary" @click="router.push('/content/pages/create')">
        <PlusOutlined /> Create Page
      </a-button>
    </div>

    <a-card :bordered="false" class="shadow-sm rounded-lg">
      <a-table :columns="columns" :dataSource="pages" :loading="loading" rowKey="id">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'title'">
            <span class="font-medium">{{ record.title }}</span>
          </template>

          <template v-if="column.key === 'status'">
            <a-tag :color="record.is_published ? 'green' : 'orange'">
              {{ record.is_published ? 'Published' : 'Draft' }}
            </a-tag>
          </template>

          <template v-if="column.key === 'updated'">
            {{ formatDate(record.updated_at) }}
          </template>

          <template v-if="column.key === 'actions'">
            <div class="flex gap-2">
              <a-button size="small" @click="router.push(`/content/pages/${record.id}/edit`)">Edit</a-button>
              <a-popconfirm title="Delete page?" @confirm="handleDelete(record.id)">
                <a-button size="small" danger type="text">Delete</a-button>
              </a-popconfirm>
            </div>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { contentService, type Page } from '@/services/content.service'
import dayjs from 'dayjs'

const router = useRouter()
const loading = ref(false)
const pages = ref<Page[]>([])

const columns = [
  { title: 'Title', key: 'title' },
  { title: 'Slug', dataIndex: 'slug', key: 'slug' },
  { title: 'Status', key: 'status' },
  { title: 'Last Updated', key: 'updated' },
  { title: 'Actions', key: 'actions', width: 150 },
]

const fetchPages = async () => {
  loading.value = true
  try {
    const data = await contentService.getPages()
    pages.value = data
  } catch (error) {
    message.error('Failed to load pages')
  } finally {
    loading.value = false
  }
}

const handleDelete = async (id: number) => {
  try {
    await contentService.deletePage(id)
    message.success('Page deleted')
    fetchPages()
  } catch (error) {
    message.error('Failed to delete page')
  }
}

const formatDate = (date: string) => {
  return dayjs(date).format('MMM D, YYYY')
}

onMounted(() => {
  fetchPages()
})
</script>
