<script setup lang="ts">
import { ref, watch } from 'vue'

interface GatewayConfig {
    gateway_id: string
    api_key: string
    secret_key: string
    test_mode: boolean
    webhook_url?: string
}

interface Props {
    config?: GatewayConfig
    gatewayName: string
    visible: boolean
}

interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'submit', config: GatewayConfig): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formData = ref<GatewayConfig>({
    gateway_id: '',
    api_key: '',
    secret_key: '',
    test_mode: true,
    webhook_url: '',
})

watch(
    () => props.config,
    (newVal) => {
        if (newVal) {
            formData.value = { ...newVal }
        } else {
            formData.value = { gateway_id: '', api_key: '', secret_key: '', test_mode: true, webhook_url: '' }
        }
    },
    { immediate: true }
)

function handleOk() {
    emit('submit', formData.value)
    emit('update:visible', false)
}

function handleCancel() {
    emit('update:visible', false)
}
</script>

<template>
    <a-modal :open="visible" :title="`Configure ${gatewayName}`" @ok="handleOk" @cancel="handleCancel" width="600px">
        <a-form :model="formData" layout="vertical">
            <a-form-item label="API Key" required>
                <a-input v-model:value="formData.api_key" placeholder="pk_live_..." size="large" />
            </a-form-item>

            <a-form-item label="Secret Key" required>
                <a-input-password v-model:value="formData.secret_key" placeholder="sk_live_..." size="large" />
            </a-form-item>

            <a-form-item label="Webhook URL">
                <a-input v-model:value="formData.webhook_url" placeholder="https://yoursite.com/webhooks/payment"
                    size="large" />
            </a-form-item>

            <a-form-item label="Mode">
                <a-switch v-model:checked="formData.test_mode" checked-children="Test Mode"
                    un-checked-children="Live Mode" />
                <div class="mode-hint">
                    {{ formData.test_mode ? 'Using test credentials' : 'Using live credentials' }}
                </div>
            </a-form-item>

            <a-alert
                message="Make sure to keep your secret keys secure. Never share them publicly or commit them to version control."
                type="warning" show-icon />
        </a-form>
    </a-modal>
</template>

<style scoped>
.mode-hint {
    font-size: 13px;
    color: var(--muted-foreground);
    margin-top: 4px;
}
</style>
