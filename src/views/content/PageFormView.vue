<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { contentApi, type CreatePageDto } from '@/api/content'
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isEdit = computed(() => !!route.params.id)
const pageId = computed(() => route.params.id ? Number(route.params.id) : null)
const activeStoreId = computed(() => authStore.activeStore?.id)

const loading = ref(false)
const saving = ref(false)
const formState = ref<CreatePageDto>({
  title: '',
  slug: '',
  page_type: 'CUSTOM',
  content: '',
  meta_title: '',
  meta_description: '',
  is_published: true,
  sort_order: 0,
})

const rules = {
  title: [{ required: true, message: 'Title is required', trigger: 'blur' }],
  slug: [{ required: true, message: 'Slug is required', trigger: 'blur' }],
}

onMounted(async () => {
  if (isEdit.value && activeStoreId.value && pageId.value) {
    await fetchPage()
  }
})

async function fetchPage() {
  // Logic to fetch page details would go here
  // Currently api.getPages returns list, might need individual fetch or filter
  // Assuming getPage exists or using getPages for now
}

async function handleSubmit() {
  if (!activeStoreId.value) return

  saving.value = true
  try {
    await contentApi.createPage(formState.value)
    message.success('Page saved successfully')
    router.push('/content/pages')
  } catch (error) {
    message.error('Failed to save page')
    console.error(error)
  } finally {
    saving.value = false
  }
}

function generateSlug() {
  if (!formState.value.title) return
  formState.value.slug = formState.value.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
</script>

<template>
  <div class="page-form">
    <div class="page-header">
      <div class="header-left">
        <a-button type="text" @click="router.push('/content/pages')">
          <template #icon><ArrowLeftOutlined /></template>
        </a-button>
        <div>
          <h1>{{ isEdit ? 'Edit Page' : 'Create Page' }}</h1>
        </div>
      </div>
      <div class="header-right">
        <a-button type="primary" :loading="saving" @click="handleSubmit">
          <template #icon><SaveOutlined /></template>
          Save Page
        </a-button>
      </div>
    </div>

    <a-form layout="vertical" :model="formState" :rules="rules">
      <a-row :gutter="24">
        <a-col :span="16">
          <a-card :bordered="false" class="mb-4">
            <a-form-item label="Page Title" name="title">
              <a-input v-model:value="formState.title" @blur="!isEdit && generateSlug()" size="large" />
            </a-form-item>
            <a-form-item label="Content" name="content">
              <a-textarea v-model:value="formState.content" :rows="15" placeholder="HTML content or Markdown" />
            </a-form-item>
          </a-card>
        </a-col>

        <a-col :span="8">
          <a-card title="Settings" :bordered="false" class="mb-4">
            <a-form-item label="URL Slug" name="slug">
              <a-input v-model:value="formState.slug" />
            </a-form-item>
            <a-form-item label="Status">
              <a-switch v-model:checked="formState.is_published" checked-children="Published" un-checked-children="Draft" />
            </a-form-item>
            <a-form-item label="Page Type">
              <a-select v-model:value="formState.page_type">
                <a-select-option value="CUSTOM">Custom Page</a-select-option>
                <a-select-option value="POLICY">Policy Page</a-select-option>
                <a-select-option value="ABOUT">About Us</a-select-option>
              </a-select>
            </a-form-item>
          </a-card>

          <a-card title="SEO" :bordered="false">
            <a-form-item label="Meta Title">
              <a-input v-model:value="formState.meta_title" />
            </a-form-item>
            <a-form-item label="Meta Description">
              <a-textarea v-model:value="formState.meta_description" :rows="3" />
            </a-form-item>
          </a-card>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<style scoped>
.page-form {
  min-height: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-left h1 {
  margin: 0;
  font-size: 24px;
}

.mb-4 {
  margin-bottom: 24px;
}
</style>
