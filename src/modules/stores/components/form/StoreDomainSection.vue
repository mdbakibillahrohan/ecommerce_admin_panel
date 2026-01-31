<script lang="ts" setup>
import { LinkOutlined, GlobalOutlined } from '@ant-design/icons-vue';

const customDomain = defineModel<string>('customDomain');

defineProps<{
  isEdit: boolean;
}>();
</script>

<template>
  <a-card :bordered="false" class="form-section">
    <div class="section-header">
      <div class="section-icon-wrapper">
        <LinkOutlined class="section-icon" />
      </div>
      <div>
        <h2 class="section-title">Domain Settings</h2>
        <p class="section-description">Configure your custom domain</p>
      </div>
    </div>

    <a-row :gutter="[16, 0]">
      <a-col :span="24">
        <a-form-item label="Custom Domain">
          <a-input
            v-model:value="customDomain"
            size="large"
            placeholder="www.yourstore.com"
            :disabled="!isEdit"
          >
            <template #prefix>
              <GlobalOutlined />
            </template>
          </a-input>
          <div v-if="!isEdit" class="premium-notice">
            <span class="premium-badge">Premium Feature</span>
            <span class="premium-text">Create your store first, then configure custom domain</span>
          </div>
          <div v-else class="field-hint">Enter your custom domain (DNS configuration required)</div>
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

.field-hint {
  margin-top: 6px;
  font-size: 12px;
  color: var(--muted-foreground);
  font-style: italic;
}
</style>
