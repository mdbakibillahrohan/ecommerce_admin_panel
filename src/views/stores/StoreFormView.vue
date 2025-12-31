<!-- eslint-disable vue/valid-v-for -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storesApi, type CreateStoreDto } from '@/api/stores'
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import { useStoreStore } from '@/stores/store/store'

const router = useRouter()
const route = useRoute()

const isEdit = computed(() => !!route.params.id)
const storeId = computed(() => route.params.id ? Number(route.params.id) : null)

const loading = ref(false)
const saving = ref(false)
const formRef = ref<FormInstance>()

const storeStore = useStoreStore();

const formState = ref<CreateStoreDto>({
  name: '',
  slug: '',
  store_category_id: 1, // Default, effectively
  description: '',
  email: '',
  phone: '',
  address: '',
  currency: 'BDT',
  timezone: 'Asia/Dhaka',
})

const rules = {
  name: [{ required: true, message: 'Store name is required', trigger: 'blur' }],
  slug: [
    { required: true, message: 'Slug is required', trigger: 'blur' },
    { pattern: /^[a-z0-9-]+$/, message: 'Slug must be lowercase alphanumeric with hyphens', trigger: 'blur' }
  ],
  store_category_id: [{ required: true, message: 'Category is required' }],
}

onMounted(async () => {
  if (isEdit.value && storeId.value) {
    await fetchStore(storeId.value)
  }
  await getCategoryStore();
})

async function fetchStore(id: number) {
  loading.value = true
  try {
    const store = await storesApi.getById(id)
    formState.value = {
      name: store.name,
      slug: store.slug,
      store_category_id: store.store_category_id,
      description: store.description || '',
      email: store.email || '',
      phone: store.phone || '',
      address: store.address || '',
      currency: store.currency || 'BDT',
      timezone: store.timezone || 'Asia/Dhaka',
    }
  } catch (error) {
    message.error('Failed to fetch store details')
    console.error(error)
    router.push('/stores')
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    saving.value = true

    if (isEdit.value && storeId.value) {
      await storesApi.update(storeId.value, formState.value)
      message.success('Store updated successfully')
    } else {
      await storesApi.create(formState.value)
      message.success('Store created successfully')
    }

    router.push('/stores')
  } catch (error: any) {
    if (error.errorFields) {
      message.error('Please check the form for errors')
    } else {
      message.error('Failed to save store')
      console.error(error)
    }
  } finally {
    saving.value = false
  }
}

function generateSlug() {
  if (!formState.value.name) return
  formState.value.slug = formState.value.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const getCategoryStore = async () => {
  await storeStore.fetStoreCategories();
}
</script>

<template>
  <div class="store-form">
    <a-spin :spinning="loading">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-left">
          <a-button type="text" @click="router.push('/stores')">
            <template #icon>
              <ArrowLeftOutlined />
            </template>
          </a-button>
          <div>
            <h1>{{ isEdit ? 'Edit Store' : 'Create New Store' }}</h1>
            <p>{{ isEdit ? 'Update store information' : 'Launch a new online store' }}</p>
          </div>
        </div>
        <div class="header-right">
          <a-space>
            <a-button @click="router.push('/stores')">Cancel</a-button>
            <a-button type="primary" :loading="saving" @click="handleSubmit">
              <template #icon>
                <SaveOutlined />
              </template>
              {{ isEdit ? 'Update' : 'Create' }} Store
            </a-button>
          </a-space>
        </div>
      </div>

      <!-- Form -->
      <a-card :bordered="false" class="form-card">
        <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
          <a-row :gutter="24">
            <a-col :xs="24" :md="12">
              <a-form-item label="Store Name" name="name">
                <a-input v-model:value="formState.name" @blur="!isEdit && generateSlug()" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item label="URL Slug" name="slug" extra="This will be used in your store URL">
                <a-input v-model:value="formState.slug">
                  <template #addonAfter>adaptixinnovate.com</template>
                </a-input>
              </a-form-item>
            </a-col>

            <a-col :xs="24" :md="12">
              <a-form-item label="Category" name="store_category_id">
                <a-select v-model:value="formState.store_category_id">
                  <a-select-option v-for="storeCategory in storeStore.storeCategories" :key="storeCategory.id"
                    :value="storeCategory.id">{{ storeCategory.name }}</a-select-option>
                  <!-- Should ideally fetch from API -->
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item label="Currency">
                <a-select v-model:value="formState.currency">
                  <a-select-option value="BDT">Bangladeshi Taka (BDT)</a-select-option>
                  <a-select-option value="USD">US Dollar (USD)</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item label="Description" name="description">
                <a-textarea v-model:value="formState.description" :rows="3" />
              </a-form-item>
            </a-col>

            <a-col :xs="24" :md="12">
              <a-form-item label="Contact Email" name="email">
                <a-input v-model:value="formState.email" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item label="Contact Phone" name="phone">
                <a-input v-model:value="formState.phone" />
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item label="Address" name="address">
                <a-textarea v-model:value="formState.address" :rows="2" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </a-spin>
  </div>
</template>

<style scoped>
.store-form {
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

.header-left {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.header-left h1 {
  font-size: 24px;
  font-weight: 700;
  color: #262626;
  margin: 0 0 4px 0;
}

.header-left p {
  color: #8c8c8c;
  margin: 0;
}
</style>
