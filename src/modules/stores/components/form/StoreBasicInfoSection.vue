<script lang="ts" setup>
import { AppstoreOutlined } from '@ant-design/icons-vue';
import type { CreateStoreDto } from '@/modules/stores/api/stores';

interface StoreCategory {
  id: number;
  name: string;
}

const formState = defineModel<CreateStoreDto>('formState', { required: true });

const props = defineProps<{
  storeCategories: StoreCategory[];
  isEdit: boolean;
}>();

const emit = defineEmits<{
  generateSlug: [];
}>();
</script>

<template>
  <a-card :bordered="false" class="form-section">
    <div class="section-header">
      <div class="section-icon-wrapper">
        <AppstoreOutlined class="section-icon" />
      </div>
      <div>
        <h2 class="section-title">Basic Information</h2>
        <p class="section-description">Provide essential details about your store</p>
      </div>
    </div>

    <a-row :gutter="[16, 0]">
      <a-col :xs="24" :lg="12">
        <a-form-item label="Store Name" name="name">
          <a-input
            v-model:value="formState.name"
            size="large"
            placeholder="Enter your store name"
            @blur="!props.isEdit && emit('generateSlug')"
          />
        </a-form-item>
      </a-col>

      <a-col :xs="24" :lg="12">
        <a-form-item label="Store Category" name="store_category_id">
          <a-select v-model:value="formState.store_category_id" size="large" placeholder="Select a category">
            <a-select-option
              v-for="storeCategory in props.storeCategories"
              :key="storeCategory.id"
              :value="storeCategory.id"
            >
              {{ storeCategory.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>

      <a-col :span="24">
        <a-form-item label="Tagline" name="tagline">
          <a-input
            v-model:value="formState.tagline"
            size="large"
            placeholder="A short, catchy phrase that describes your store"
            :maxlength="100"
            show-count
          />
        </a-form-item>
      </a-col>

      <a-col :span="24">
        <a-form-item label="Description" name="description">
          <a-textarea
            v-model:value="formState.description"
            :rows="4"
            placeholder="Tell customers about your store..."
            show-count
            :maxlength="500"
          />
        </a-form-item>
      </a-col>
    </a-row>
  </a-card>
</template>

<style scoped>
.form-section {
  margin-bottom: 20px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--card);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-section:hover {
  box-shadow: 0 4px 16px oklch(0 0 0 / 0.06);
  border-color: oklch(0.65 0.25 192 / 0.3);
}

.section-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
}

.section-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg,
      oklch(0.65 0.25 192 / 0.1) 0%,
      oklch(0.60 0.22 200 / 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.section-icon {
  font-size: 22px;
  color: oklch(0.65 0.25 192);
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0 0 4px 0;
}

.section-description {
  font-size: 13px;
  color: var(--muted-foreground);
  margin: 0;
  line-height: 1.4;
}
</style>
