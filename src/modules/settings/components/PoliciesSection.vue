<script setup lang="ts">
import { computed } from 'vue'
import { FileTextOutlined } from '@ant-design/icons-vue'

interface Props {
    modelValue: {
        returnPolicy: string
        refundPolicy: string
        shippingPolicy: string
        privacyPolicyUrl: string
        termsOfServiceUrl: string
        returnWindow: number
        restockingFee: number
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
                <FileTextOutlined />
                Store Policies
            </div>

            <a-form-item label="Return Policy" class="form-item-enhanced">
                <a-textarea v-model:value="settings.returnPolicy" :rows="4" placeholder="Describe your return policy..."
                    class="input-enhanced" />
            </a-form-item>

            <a-form-item label="Refund Policy" class="form-item-enhanced">
                <a-textarea v-model:value="settings.refundPolicy" :rows="4" placeholder="Describe your refund policy..."
                    class="input-enhanced" />
            </a-form-item>

            <a-form-item label="Shipping Policy" class="form-item-enhanced">
                <a-textarea v-model:value="settings.shippingPolicy" :rows="4"
                    placeholder="Describe your shipping policy..." class="input-enhanced" />
            </a-form-item>

            <div class="form-section-title">
                Policy Settings
            </div>

            <div class="form-grid">
                <a-form-item label="Return Window (days)" class="form-item-enhanced">
                    <a-input-number v-model:value="settings.returnWindow" :min="0" :max="365" size="large"
                        style="width: 100%" />
                    <div class="field-hint">Number of days customers can return products</div>
                </a-form-item>

                <a-form-item label="Restocking Fee (%)" class="form-item-enhanced">
                    <a-input-number v-model:value="settings.restockingFee" :min="0" :max="100" size="large"
                        style="width: 100%" />
                    <div class="field-hint">Percentage fee for returns</div>
                </a-form-item>
            </div>

            <div class="form-section-title">
                Legal Pages
            </div>

            <a-form-item label="Privacy Policy URL" class="form-item-enhanced">
                <a-input v-model:value="settings.privacyPolicyUrl" placeholder="https://yourstore.com/privacy"
                    size="large" class="input-enhanced" />
            </a-form-item>

            <a-form-item label="Terms of Service URL" class="form-item-enhanced">
                <a-input v-model:value="settings.termsOfServiceUrl" placeholder="https://yourstore.com/terms"
                    size="large" class="input-enhanced" />
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

@media (max-width: 768px) {
    .form-grid {
        grid-template-columns: 1fr;
    }
}
</style>
