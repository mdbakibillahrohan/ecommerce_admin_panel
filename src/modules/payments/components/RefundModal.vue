<script setup lang="ts">
import { ref } from 'vue'

interface Emits {
    (e: 'refund', data: { amount: number; reason: string }): void
    (e: 'cancel'): void
}

const emit = defineEmits<Emits>()

const visible = ref(false)
const formData = ref({
    orderNumber: '',
    originalAmount: 0,
    refundAmount: 0,
    reason: '',
})

function show(orderNumber: string, originalAmount: number) {
    visible.value = true
    formData.value = {
        orderNumber,
        originalAmount,
        refundAmount: originalAmount,
        reason: '',
    }
}

function hide() {
    visible.value = false
}

function handleOk() {
    emit('refund', {
        amount: formData.value.refundAmount,
        reason: formData.value.reason,
    })
    hide()
}

function handleCancel() {
    emit('cancel')
    hide()
}

defineExpose({ show, hide })
</script>

<template>
    <a-modal v-model:open="visible" title="Process Refund" @ok="handleOk" @cancel="handleCancel" width="600px">
        <a-form :model="formData" layout="vertical">
            <a-form-item label="Order Number">
                <a-input v-model:value="formData.orderNumber" disabled size="large" />
            </a-form-item>

            <a-form-item label="Original Amount">
                <a-input-number v-model:value="formData.originalAmount" disabled
                    :formatter="(value: number) => `$ ${value}`" size="large" style="width: 100%" />
            </a-form-item>

            <a-form-item label="Refund Amount" required>
                <a-input-number v-model:value="formData.refundAmount" :min="0" :max="formData.originalAmount"
                    :formatter="(value: number) => `$ ${value}`"
                    :parser="(value: string | undefined) => value?.replace(/\$\s?|(,*)/g, '') || ''" size="large"
                    style="width: 100%" />
                <div class="field-hint">Maximum refund: ${{ formData.originalAmount.toFixed(2) }}</div>
            </a-form-item>

            <a-form-item label="Reason" required>
                <a-textarea v-model:value="formData.reason" :rows="4"
                    placeholder="Explain the reason for this refund..." show-count :maxlength="300" />
            </a-form-item>

            <a-alert message="This action cannot be undone. The refund will be processed immediately." type="warning"
                show-icon />
        </a-form>
    </a-modal>
</template>

<style scoped>
.field-hint {
    font-size: 13px;
    color: var(--muted-foreground);
    margin-top: 4px;
}
</style>
