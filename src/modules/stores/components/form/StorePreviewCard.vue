<script lang="ts" setup>
import { ShopOutlined, GlobalOutlined } from '@ant-design/icons-vue';
import type { CreateStoreDto } from '@/modules/stores/api/stores';
import type { MediaFile } from '@/modules/media/services/media.service';
import { configuration } from '@/modules/shared/config/configruation';

interface StoreCategory {
  id: number;
  name: string;
}

defineProps<{
  logo: MediaFile | null | undefined;
  formState: CreateStoreDto;
  storeCategories: StoreCategory[];
}>();
</script>

<template>
  <a-card :bordered="false" class="sidebar-card">
    <div class="card-header">
      <ShopOutlined class="card-icon" />
      <h3 class="card-title">Store Preview</h3>
    </div>

    <div class="store-preview">
      <div class="preview-logo">
        <img v-if="logo" :src="configuration.MEDIA_BASE_URL + logo?.url" alt="Store Logo" />
        <div v-else class="preview-logo-placeholder">
          <ShopOutlined />
        </div>
      </div>

      <div class="preview-info">
        <h3 class="preview-name">{{ formState.name || 'Store Name' }}</h3>
        <p class="preview-tagline">{{ formState.tagline || 'Your store tagline' }}</p>
        <div class="preview-url">
          <GlobalOutlined />
          <span>{{ formState.slug || 'your-store' }}.adaptixinnovate.com</span>
        </div>
      </div>

      <div class="preview-details">
        <div class="detail-item">
          <span class="detail-label">Category</span>
          <span class="detail-value">
            {{ storeCategories.find(c => c.id === formState.store_category_id)?.name || 'Not selected' }}
          </span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Currency</span>
          <span class="detail-value">{{ formState.currency }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Timezone</span>
          <span class="detail-value">{{ formState.timezone }}</span>
        </div>
      </div>
    </div>
  </a-card>
</template>

<style scoped>
.sidebar-card {
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--card);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

.card-icon {
  font-size: 18px;
  color: oklch(0.65 0.25 192);
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0;
}

.store-preview {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.preview-logo {
  width: 100%;
  height: 140px;
  border-radius: 10px;
  background: linear-gradient(135deg,
      oklch(0.65 0.25 192 / 0.1) 0%,
      oklch(0.60 0.22 200 / 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 2px solid var(--border);
}

.preview-logo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.preview-logo-placeholder {
  font-size: 48px;
  color: var(--muted-foreground);
}

.preview-info {
  text-align: center;
}

.preview-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0 0 6px 0;
}

.preview-tagline {
  font-size: 13px;
  color: var(--muted-foreground);
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.preview-url {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: oklch(0.65 0.25 192 / 0.1);
  border-radius: 6px;
  font-size: 12px;
  color: oklch(0.65 0.25 192);
  font-weight: 500;
}

.preview-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 13px;
  color: var(--muted-foreground);
  font-weight: 500;
}

.detail-value {
  font-size: 13px;
  color: var(--foreground);
  font-weight: 600;
}
</style>
