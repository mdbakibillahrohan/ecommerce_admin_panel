<script lang="ts" setup>
import { SearchOutlined } from '@ant-design/icons-vue';
import type { CreateStoreDto } from '@/modules/stores/api/stores';

const formState = defineModel<CreateStoreDto>('formState', { required: true });
</script>

<template>
  <a-card :bordered="false" class="form-section">
    <div class="section-header">
      <div class="section-icon-wrapper">
        <SearchOutlined class="section-icon" />
      </div>
      <div>
        <h2 class="section-title">SEO Settings</h2>
        <p class="section-description">Optimize your store for search engines</p>
      </div>
    </div>

    <a-row :gutter="[16, 0]">
      <a-col :span="24">
        <a-form-item label="Meta Title" name="meta_title">
          <a-input
            v-model:value="formState.meta_title"
            size="large"
            placeholder="Store title for search engines"
            :maxlength="100"
            show-count
          />
          <div class="field-hint">Recommended: 50-60 characters for optimal display in search results</div>
        </a-form-item>
      </a-col>

      <a-col :span="24">
        <a-form-item label="Meta Description" name="meta_description">
          <a-textarea
            v-model:value="formState.meta_description"
            :rows="3"
            placeholder="Brief description of your store for search engine results"
            :maxlength="500"
            show-count
          />
          <div class="field-hint">Recommended: 150-160 characters for optimal display</div>
        </a-form-item>
      </a-col>

      <a-col :span="24">
        <a-form-item label="Meta Keywords" name="meta_keywords">
          <a-input
            v-model:value="formState.meta_keywords"
            size="large"
            placeholder="keyword1, keyword2, keyword3"
            :maxlength="255"
          />
          <div class="field-hint">Comma-separated keywords related to your store</div>
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

.field-hint {
  margin-top: 6px;
  font-size: 12px;
  color: var(--muted-foreground);
  font-style: italic;
}
</style>
