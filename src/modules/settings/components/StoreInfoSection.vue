<script setup lang="ts">
import { computed } from 'vue'
import { ShopOutlined, SearchOutlined, PhoneOutlined, PictureOutlined, PlusOutlined } from '@ant-design/icons-vue'

interface Props {
    modelValue: {
        storeName: string
        storeTagline: string
        storeDescription: string
        metaTitle: string
        metaDescription: string
        contactEmail: string
        phoneNumber: string
        websiteUrl: string
        storeLogo?: string
        favicon?: string
    }
}

interface Emits {
    (e: 'update:modelValue', value: Props['modelValue']): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const settings = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
})
</script>

<template>
    <a-card :bordered="false" class="settings-card">
        <a-form :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }" layout="vertical">
            <div class="form-grid">
                <a-form-item label="Store Name" required class="form-item-enhanced">
                    <a-input v-model:value="settings.storeName" placeholder="Enter your store name" size="large"
                        class="input-enhanced" />
                </a-form-item>

                <a-form-item label="Store Tagline" class="form-item-enhanced">
                    <a-input v-model:value="settings.storeTagline" placeholder="A short description of your store"
                        size="large" class="input-enhanced" />
                </a-form-item>
            </div>

            <a-form-item label="Store Description" class="form-item-enhanced">
                <a-textarea v-model:value="settings.storeDescription" :rows="4"
                    placeholder="Describe what your store sells..." class="input-enhanced" />
            </a-form-item>

            <div class="form-section-title">
                <SearchOutlined />
                SEO & Metadata
            </div>

            <a-form-item label="Meta Title" class="form-item-enhanced">
                <a-input v-model:value="settings.metaTitle" placeholder="SEO title for search engines" :max-length="60"
                    size="large" class="input-enhanced" />
                <div class="field-hint">
                    <span :class="{ 'text-warning': settings.metaTitle.length > 55 }">
                        {{ settings.metaTitle.length }}/60 characters
                    </span>
                </div>
            </a-form-item>

            <a-form-item label="Meta Description" class="form-item-enhanced">
                <a-textarea v-model:value="settings.metaDescription" :rows="3"
                    placeholder="SEO description for search engines" :max-length="160" class="input-enhanced" />
                <div class="field-hint">
                    <span :class="{ 'text-warning': settings.metaDescription.length > 155 }">
                        {{ settings.metaDescription.length }}/160 characters
                    </span>
                </div>
            </a-form-item>

            <div class="form-section-title">
                <PhoneOutlined />
                Contact Information
            </div>

            <div class="form-grid">
                <a-form-item label="Contact Email" required class="form-item-enhanced">
                    <a-input v-model:value="settings.contactEmail" type="email" placeholder="store@example.com"
                        size="large" class="input-enhanced" />
                </a-form-item>

                <a-form-item label="Phone Number" class="form-item-enhanced">
                    <a-input v-model:value="settings.phoneNumber" placeholder="+1 (555) 123-4567" size="large"
                        class="input-enhanced" />
                </a-form-item>
            </div>

            <a-form-item label="Website URL" class="form-item-enhanced">
                <a-input v-model:value="settings.websiteUrl" placeholder="https://yourstore.com" size="large"
                    class="input-enhanced" />
            </a-form-item>

            <div class="form-section-title">
                <PictureOutlined />
                Branding Assets
            </div>

            <div class="form-grid">
                <a-form-item label="Store Logo" class="form-item-enhanced">
                    <a-upload :before-upload="() => false" list-type="picture-card" :max-count="1"
                        class="upload-enhanced">
                        <div v-if="!settings.storeLogo" class="upload-content">
                            <plus-outlined class="upload-icon" />
                            <div class="upload-text">Upload Logo</div>
                        </div>
                    </a-upload>
                    <div class="field-hint">
                        Recommended: 200x200px, PNG or JPG
                    </div>
                </a-form-item>

                <a-form-item label="Favicon" class="form-item-enhanced">
                    <a-upload :before-upload="() => false" list-type="picture-card" :max-count="1"
                        class="upload-enhanced">
                        <div class="upload-content">
                            <plus-outlined class="upload-icon" />
                            <div class="upload-text">Upload Favicon</div>
                        </div>
                    </a-upload>
                    <div class="field-hint">
                        Recommended: 32x32px, ICO or PNG
                    </div>
                </a-form-item>
            </div>
        </a-form>
    </a-card>
</template>

<style scoped>
.form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
}

.form-section-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 16px;
    font-weight: 600;
    color: var(--foreground);
    margin: 24px 0 16px;
    padding-bottom: 12px;
    border-bottom: 2px solid var(--border);
}

.field-hint {
    font-size: 13px;
    color: var(--muted-foreground);
    margin-top: 4px;
}

.text-warning {
    color: #faad14;
}

@media (max-width: 768px) {
    .form-grid {
        grid-template-columns: 1fr;
    }
}
</style>
