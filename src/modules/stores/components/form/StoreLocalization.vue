<script setup lang="ts">
import { TranslationOutlined } from '@ant-design/icons-vue'
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
                <TranslationOutlined class="section-icon" />
            </div>
            <div>
                <h2 class="section-title">Localization</h2>
                <p class="section-description">Configure language preferences for your store</p>
            </div>
        </div>

        <a-row :gutter="[16, 0]">
            <a-col :xs="24" :lg="12">
                <a-form-item label="Default Language" name="default_language">
                    <a-select v-model:value="props.formState.default_language" size="large">
                        <a-select-option value="en">🇺🇸 English</a-select-option>
                        <a-select-option value="bn">🇧🇩 Bengali</a-select-option>
                        <a-select-option value="es">🇪🇸 Spanish</a-select-option>
                        <a-select-option value="fr">🇫🇷 French</a-select-option>
                        <a-select-option value="de">🇩🇪 German</a-select-option>
                        <a-select-option value="ar">🇸🇦 Arabic</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>

            <a-col :xs="24" :lg="12">
                <a-form-item label="Supported Languages" name="supported_languages">
                    <a-input v-model:value="props.formState.supported_languages" size="large" placeholder="en,bn,es" />
                    <div class="field-hint">Comma-separated language codes (e.g., en,bn,es)</div>
                </a-form-item>
            </a-col>
        </a-row>
    </a-card>
</template>
