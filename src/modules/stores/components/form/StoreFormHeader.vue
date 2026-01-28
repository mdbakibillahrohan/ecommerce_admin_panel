
<script lang="ts" setup>

import { useRouter } from 'vue-router';
import { SaveOutlined, ArrowLeftOutlined, ShopOutlined } from '@ant-design/icons-vue';

const router = useRouter();

defineProps({
    isEdit: {
        type: Boolean,
        default: false
    },
    saving: {
        type: Boolean,
        default: false
    },
    handleSubmit: {
        type: Function,
        default: () => {}
    }
})
</script>
<template>

<!-- Professional gradient header with better visual hierarchy -->
      <div class="page-header">
        <div class="header-gradient"></div>
        <div class="header-content">
          <a-button class="back-button" type="text" @click="router.push('/stores')">
            <template #icon>
              <ArrowLeftOutlined />
            </template>
          </a-button>
          <div class="header-text">
            <div class="page-subtitle">Store Management</div>
            <h1 class="page-title">
              <ShopOutlined class="title-icon" />
              {{ isEdit ? 'Edit Store' : 'Create New Store' }}
            </h1>
            <p class="page-description">
              {{ isEdit ? 'Update your store information and branding' : 'Set up your new online store with' }}
            </p>
          </div>
        </div>
        <div class="header-actions">
          <a-space :size="12">
            <a-button size="large" @click="router.push('/stores')">
              <span>Cancel</span>
            </a-button>
            <a-button type="primary" size="large" :loading="saving" @click="handleSubmit">
              <template #icon>
                <SaveOutlined />
              </template>
              {{ isEdit ? 'Update Store' : 'Create Store' }}
            </a-button>
          </a-space>
        </div>
      </div>
</template>

<style scoped>
/* Header Styles */
.page-header {
  position: relative;
  background: var(--card);
  border-bottom: 1px solid var(--border);
  margin-bottom: 24px;
  overflow: hidden;
}

.header-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg,
      oklch(0.65 0.25 192) 0%,
      oklch(0.60 0.22 200) 50%,
      oklch(0.65 0.25 192) 100%);
}

.header-content {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 24px;
  padding-bottom: 20px;
}

.back-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--muted-foreground);
  flex-shrink: 0;
  margin-top: 4px;
}

.back-button:hover {
  background: oklch(0.65 0.25 192 / 0.1);
  color: oklch(0.65 0.25 192);
  transform: translateX(-2px);
}

.header-text {
  flex: 1;
}

.page-subtitle {
  font-size: 13px;
  font-weight: 500;
  color: var(--muted-foreground);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  font-size: 28px;
  color: oklch(0.65 0.25 192);
}

.page-description {
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0;
  line-height: 1.5;
}

.header-actions {
  padding: 0 24px 20px;
}
</style>
