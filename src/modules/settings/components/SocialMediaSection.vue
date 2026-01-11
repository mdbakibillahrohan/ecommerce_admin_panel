<script setup lang="ts">
import { computed } from 'vue'
import {
    FacebookOutlined,
    InstagramOutlined,
    TwitterOutlined,
    LinkedinOutlined,
    YoutubeOutlined,
    ShareAltOutlined,
    BarChartOutlined,
} from '@ant-design/icons-vue'

interface Props {
    modelValue: {
        facebook: string
        instagram: string
        twitter: string
        linkedin: string
        youtube: string
        googleAnalyticsId: string
        facebookPixelId: string
        googleTagManagerId: string
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
            <div class="form-section-title">
                <ShareAltOutlined />
                Social Media Profiles
            </div>

            <div class="form-grid">
                <a-form-item label="Facebook" class="form-item-enhanced">
                    <a-input v-model:value="settings.facebook" placeholder="https://facebook.com/yourstore" size="large"
                        class="input-enhanced">
                        <template #prefix>
                            <FacebookOutlined class="input-prefix-icon" />
                        </template>
                    </a-input>
                </a-form-item>

                <a-form-item label="Instagram" class="form-item-enhanced">
                    <a-input v-model:value="settings.instagram" placeholder="https://instagram.com/yourstore"
                        size="large" class="input-enhanced">
                        <template #prefix>
                            <InstagramOutlined class="input-prefix-icon" />
                        </template>
                    </a-input>
                </a-form-item>

                <a-form-item label="Twitter" class="form-item-enhanced">
                    <a-input v-model:value="settings.twitter" placeholder="https://twitter.com/yourstore" size="large"
                        class="input-enhanced">
                        <template #prefix>
                            <TwitterOutlined class="input-prefix-icon" />
                        </template>
                    </a-input>
                </a-form-item>

                <a-form-item label="LinkedIn" class="form-item-enhanced">
                    <a-input v-model:value="settings.linkedin" placeholder="https://linkedin.com/company/yourstore"
                        size="large" class="input-enhanced">
                        <template #prefix>
                            <LinkedinOutlined class="input-prefix-icon" />
                        </template>
                    </a-input>
                </a-form-item>

                <a-form-item label="YouTube" class="form-item-enhanced">
                    <a-input v-model:value="settings.youtube" placeholder="https://youtube.com/yourstore" size="large"
                        class="input-enhanced">
                        <template #prefix>
                            <YoutubeOutlined class="input-prefix-icon" />
                        </template>
                    </a-input>
                </a-form-item>
            </div>

            <div class="form-section-title">
                <BarChartOutlined />
                Marketing & Analytics
            </div>

            <a-form-item label="Google Analytics ID" class="form-item-enhanced">
                <a-input v-model:value="settings.googleAnalyticsId" placeholder="UA-XXXXXXXXX-X or G-XXXXXXXXXX"
                    size="large" class="input-enhanced" />
                <div class="field-hint">Track your store's performance with Google Analytics</div>
            </a-form-item>

            <a-form-item label="Facebook Pixel ID" class="form-item-enhanced">
                <a-input v-model:value="settings.facebookPixelId" placeholder="Enter your Facebook Pixel ID"
                    size="large" class="input-enhanced" />
                <div class="field-hint">Track conversions and optimize Facebook ads</div>
            </a-form-item>

            <a-form-item label="Google Tag Manager ID" class="form-item-enhanced">
                <a-input v-model:value="settings.googleTagManagerId" placeholder="GTM-XXXXXXX" size="large"
                    class="input-enhanced" />
                <div class="field-hint">Manage all marketing tags from one place</div>
            </a-form-item>
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

.input-prefix-icon {
    color: var(--muted-foreground);
}

@media (max-width: 768px) {
    .form-grid {
        grid-template-columns: 1fr;
    }
}
</style>
