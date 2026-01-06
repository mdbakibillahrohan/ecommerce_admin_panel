<template>
  <div class="page-form max-w-4xl mx-auto">
    <div class="mb-6">
      <a-button @click="router.back()" class="mb-4">Back</a-button>
      <h1 class="text-2xl font-bold">{{ isEdit ? 'Edit Page' : 'Create Page' }}</h1>
    </div>

    <a-card :loading="loading">
      <a-form layout="vertical" :model="formState" @finish="onFinish">
        <a-form-item label="Page Title" name="title" :rules="[{ required: true }]">
          <a-input v-model:value="formState.title" />
        </a-form-item>

        <a-form-item label="Slug" name="slug" :rules="[{ required: true }]">
          <a-input v-model:value="formState.slug" />
        </a-form-item>

        <a-form-item label="Content" name="content">
          <a-textarea v-model:value="formState.content" :rows="10" placeholder="HTML or Markdown content..." />
        </a-form-item>

        <a-form-item label="Published">
          <a-switch v-model:checked="formState.is_published" />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" :loading="saving">Save Page</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { contentService } from '@/modules/content/services/content.service'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const saving = ref(false)

const isEdit = computed(() => route.params.id !== undefined)

const formState = reactive({
  title: '',
  slug: '',
  content: '',
  is_published: false
})

const fetchPage = async (id: number) => {
  loading.value = true
  try {
    const data = await contentService.getPage(id)
    Object.assign(formState, data)
  } catch (error) {
    message.error('Failed to load page')
    router.back()
  } finally {
    loading.value = false
  }
}

const onFinish = async () => {
  saving.value = true
  try {
    if (isEdit.value) {
      await contentService.updatePage(Number(route.params.id), formState)
      message.success('Page updated')
    } else {
      await contentService.createPage(formState)
      message.success('Page created')
    }
    router.push('/content/pages')
  } catch (error) {
    message.error('Failed to save page')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  if (isEdit.value) {
    fetchPage(Number(route.params.id))
  }
})
</script>
