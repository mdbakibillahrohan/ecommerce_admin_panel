<script setup lang="ts">
import { AppstoreOutlined } from '@ant-design/icons-vue'
import type { CreateStoreDto } from '@/modules/stores/api/stores'
import type { IStoreCategory } from '@/modules/shared/interfaces/store/store.interface'

const props = defineProps<{
    formState: CreateStoreDto
    storeCategories: IStoreCategory[]
    isEdit: boolean
}>()

const emit = defineEmits<{
    (e: 'update:formState', value: CreateStoreDto): void
    (e: 'generateSlug'): void
}>()
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
                    <a-input v-model:value="props.formState.name" size="large" placeholder="Enter your store name"
                        @blur="!isEdit && emit('generateSlug')" />
                </a-form-item>
            </a-col>

            <a-col :xs="24" :lg="12">
                <a-form-item label="Store Category" name="store_category_id">
                    <a-select v-model:value="props.formState.store_category_id" size="large"
                        placeholder="Select a category">
                        <a-select-option v-for="storeCategory in storeCategories" :key="storeCategory.id"
                            :value="storeCategory.id">
                            {{ storeCategory.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>

            <a-col :span="24">
                <a-form-item label="Tagline" name="tagline">
                    <a-input v-model:value="props.formState.tagline" size="large"
                        placeholder="A short, catchy phrase that describes your store" :maxlength="100" show-count />
                </a-form-item>
            </a-col>

            <a-col :span="24">
                <a-form-item label="Description" name="description">
                    <a-textarea v-model:value="props.formState.description" :rows="4"
                        placeholder="Tell customers about your store..." show-count :maxlength="500" />
                </a-form-item>
            </a-col>
        </a-row>
    </a-card>
</template>
