<script lang="ts" setup>
import { GlobalOutlined } from '@ant-design/icons-vue';
import type { CreateStoreDto } from '@/modules/stores/api/stores';

const formState = defineModel<CreateStoreDto>('formState', { required: true });

defineProps<{
  customDomain: string;
}>();
</script>

<template>
  <a-card :bordered="false" class="form-section">
    <div class="section-header">
      <div class="section-icon-wrapper">
        <GlobalOutlined class="section-icon" />
      </div>
      <div>
        <h2 class="section-title">URL & Domain</h2>
        <p class="section-description">Configure your store's web address</p>
      </div>
    </div>

    <a-row :gutter="[16, 0]">
      <a-col :xs="24" :lg="12">
        <a-form-item label="URL Slug" name="slug">
          <a-input v-model:value="formState.slug" size="large" placeholder="my-awesome-store" />
          <div class="url-preview">
            <GlobalOutlined />
            <span>{{ formState.slug || 'your-store' }}.adaptixinnovate.com</span>
          </div>
        </a-form-item>
      </a-col>

      <a-col :xs="24" :lg="12">
        <a-form-item label="Custom Domain">
          <a-input :value="customDomain" size="large" placeholder="www.yourstore.com" disabled />
          <div class="premium-notice">
            <span class="premium-badge">Premium Feature</span>
            <span class="premium-text">Upgrade to use custom domain</span>
          </div>
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

.url-preview {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding: 10px 14px;
  background: oklch(0.65 0.25 192 / 0.08);
  border-radius: 8px;
  font-size: 13px;
  color: oklch(0.65 0.25 192);
  font-weight: 500;
}

.premium-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding: 10px 14px;
  background: linear-gradient(135deg, oklch(0.60 0.18 285 / 0.1), oklch(0.55 0.20 310 / 0.1));
  border-radius: 8px;
}

.premium-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  background: linear-gradient(135deg, oklch(0.60 0.18 285), oklch(0.55 0.20 310));
  color: white;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.premium-text {
  font-size: 12px;
  color: var(--muted-foreground);
}
</style>
