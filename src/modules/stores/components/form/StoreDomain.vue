<script setup lang="ts">
import { GlobalOutlined, LinkOutlined } from '@ant-design/icons-vue'
import type { CreateStoreDto } from '@/modules/stores/api/stores'

const props = defineProps<{
    formState: CreateStoreDto
    customDomain: string
    isEdit: boolean
}>()

const emit = defineEmits<{
    (e: 'update:formState', value: CreateStoreDto): void
}>()
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
                    <a-input v-model:value="props.formState.slug" size="large" placeholder="my-awesome-store" />
                    <div class="url-preview">
                        <GlobalOutlined />
                        <span>{{ props.formState.slug || 'your-store' }}.adaptixinnovate.com</span>
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
                    <a-input :value="customDomain" size="large" placeholder="www.yourstore.com" :disabled="!isEdit">
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
