<script setup lang="ts">
import { DollarOutlined } from '@ant-design/icons-vue'
import type { CreateStoreDto } from '@/modules/stores/api/stores'

const props = defineProps<{
    formState: CreateStoreDto
}>()

const emit = defineEmits<{
    (e: 'update:formState', value: CreateStoreDto): void
}>()
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
                    <a-select v-model:value="props.formState.currency" size="large">
                        <a-select-option value="BDT">🇧🇩 Bangladeshi Taka (BDT)</a-select-option>
                        <a-select-option value="USD">🇺🇸 US Dollar (USD)</a-select-option>
                        <a-select-option value="EUR">🇪🇺 Euro (EUR)</a-select-option>
                        <a-select-option value="GBP">🇬🇧 British Pound (GBP)</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>

            <a-col :xs="24" :lg="12">
                <a-form-item label="Timezone" name="timezone">
                    <a-select v-model:value="props.formState.timezone" size="large" show-search>
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
