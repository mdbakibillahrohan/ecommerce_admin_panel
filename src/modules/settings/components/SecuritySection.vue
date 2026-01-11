<script setup lang="ts">
import { computed } from 'vue'
import { SafetyOutlined } from '@ant-design/icons-vue'

interface Props {
    modelValue: {
        forceHttps: boolean
        twoFactorAuth: boolean
        sessionTimeout: number
        ipWhitelist: string
        allowedDomains: string
        passwordPolicy: string
    }
}

const props = defineProps<Props>()
const emit = defineEmits<{
    (e: 'update:modelValue', value: Props['modelValue']): void
}>()

const settings = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
})
</script>

<template>
    <a-card :bordered="false" class="settings-card">
        <a-form :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }" layout="vertical">
            <div class="form-section-title">
                <SafetyOutlined />
                Security Settings
            </div>

            <div class="security-grid">
                <div class="security-item">
                    <div class="security-info">
                        <div class="security-title">Force HTTPS</div>
                        <div class="security-desc">Redirect all HTTP traffic to HTTPS</div>
                    </div>
                    <a-switch v-model:checked="settings.forceHttps" />
                </div>

                <div class="security-item">
                    <div class="security-info">
                        <div class="security-title">Two-Factor Authentication</div>
                        <div class="security-desc">Require 2FA for admin login</div>
                    </div>
                    <a-switch v-model:checked="settings.twoFactorAuth" />
                </div>
            </div>

            <a-form-item label="Session Timeout (minutes)" class="form-item-enhanced">
                <a-input-number v-model:value="settings.sessionTimeout" :min="5" :max="1440" size="large"
                    style="width: 100%" />
                <div class="field-hint">Users will be logged out after this period of inactivity</div>
            </a-form-item>

            <a-form-item label="IP Whitelist" class="form-item-enhanced">
                <a-textarea v-model:value="settings.ipWhitelist" :rows="3"
                    placeholder="Enter IP addresses (one per line)" class="input-enhanced" />
                <div class="field-hint">Only these IP addresses can access the admin panel (leave empty to allow all)
                </div>
            </a-form-item>

            <a-form-item label="Allowed Domains" class="form-item-enhanced">
                <a-textarea v-model:value="settings.allowedDomains" :rows="2"
                    placeholder="example.com, subdomain.example.com" class="input-enhanced" />
                <div class="field-hint">Domains allowed for CORS requests</div>
            </a-form-item>

            <a-form-item label="Password Policy" class="form-item-enhanced">
                <a-select v-model:value="settings.passwordPolicy" size="large" class="select-enhanced">
                    <a-select-option value="weak">Weak - Minimum 6 characters</a-select-option>
                    <a-select-option value="medium">Medium - 8 characters, letters and numbers</a-select-option>
                    <a-select-option value="strong">Strong - 10 characters, letters, numbers, and
                        symbols</a-select-option>
                </a-select>
            </a-form-item>
        </a-form>
    </a-card>
</template>

<style scoped>
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

.security-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 24px;
}

.security-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background: var(--accent);
    border: 1px solid var(--border);
    border-radius: 12px;
    transition: all 0.3s ease;
}

.security-item:hover {
    border-color: oklch(0.65 0.25 195);
    box-shadow: 0 4px 12px rgba(13, 148, 136, 0.1);
}

.security-info {
    flex: 1;
}

.security-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--foreground);
    margin-bottom: 4px;
}

.security-desc {
    font-size: 14px;
    color: var(--muted-foreground);
}

.field-hint {
    font-size: 13px;
    color: var(--muted-foreground);
    margin-top: 4px;
}
</style>
