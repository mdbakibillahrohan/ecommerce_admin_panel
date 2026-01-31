<script lang="ts" setup>
import { DollarOutlined } from '@ant-design/icons-vue';
import type { CreateStoreDto } from '@/modules/stores/api/stores';

const formState = defineModel<CreateStoreDto>('formState', { required: true });
</script>

<template>
  <a-card :bordered="false" class="form-section">
    <div class="section-header">
      <div class="section-icon-wrapper">
        <DollarOutlined class="section-icon" />
      </div>
      <div>
        <h2 class="section-title">Regional Settings</h2>
        <p class="section-description">Configure currency and timezone preferences</p>
      </div>
    </div>

    <a-row :gutter="[16, 0]">
      <a-col :xs="24" :lg="12">
        <a-form-item label="Currency" name="currency">
          <a-select v-model:value="formState.currency" size="large">
            <a-select-option value="BDT">🇧🇩 Bangladeshi Taka (BDT)</a-select-option>
            <a-select-option value="USD">🇺🇸 US Dollar (USD)</a-select-option>
            <a-select-option value="EUR">🇪🇺 Euro (EUR)</a-select-option>
            <a-select-option value="GBP">🇬🇧 British Pound (GBP)</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>

      <a-col :xs="24" :lg="12">
        <a-form-item label="Timezone" name="timezone">
          <a-select v-model:value="formState.timezone" size="large" show-search>
            <a-select-option value="Asia/Dhaka">Asia/Dhaka (GMT+6)</a-select-option>
            <a-select-option value="America/New_York">America/New_York (EST)</a-select-option>
            <a-select-option value="Europe/London">Europe/London (GMT)</a-select-option>
            <a-select-option value="Asia/Tokyo">Asia/Tokyo (JST)</a-select-option>
          </a-select>
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
