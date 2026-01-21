<script setup lang="ts">
import { SearchOutlined } from '@ant-design/icons-vue'
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
                    <a-input v-model:value="props.formState.meta_title" size="large"
                        placeholder="Store title for search engines" :maxlength="100" show-count />
                    <div class="field-hint">
                        Recommended: 50-60 characters for optimal display in search results
                    </div>
                </a-form-item>
            </a-col>

            <a-col :span="24">
                <a-form-item label="Meta Description" name="meta_description">
                    <a-textarea v-model:value="props.formState.meta_description" :rows="3"
                        placeholder="Brief description of your store for search engine results" :maxlength="500"
                        show-count />
                    <div class="field-hint">Recommended: 150-160 characters for optimal display</div>
                </a-form-item>
            </a-col>

            <a-col :span="24">
                <a-form-item label="Meta Keywords" name="meta_keywords">
                    <a-input v-model:value="props.formState.meta_keywords" size="large"
                        placeholder="keyword1, keyword2, keyword3" :maxlength="255" />
                    <div class="field-hint">Comma-separated keywords related to your store</div>
                </a-form-item>
            </a-col>
        </a-row>
    </a-card>
</template>
