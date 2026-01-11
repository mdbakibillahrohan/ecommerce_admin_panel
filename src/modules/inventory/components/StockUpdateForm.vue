<script setup lang="ts">
import { ref } from 'vue'

interface Emits {
    (e: 'update', data: { quantity: number; lowStockThreshold: number }): void
    (e: 'cancel'): void
}

const emit = defineEmits<Emits>()

const visible = ref(false)
const formData = ref({
    productName: '',
    quantity: 0,
    lowStockThreshold: 10,
})

function show(productName: string, currentQuantity: number, currentThreshold: number) {
    visible.value = true
    formData.value = {
        productName,
        quantity: currentQuantity,
        lowStockThreshold: currentThreshold,
    }
}

function hide() {
    visible.value = false
}

function handleOk() {
    emit('update', {
        quantity: formData.value.quantity,
        lowStockThreshold: formData.value.lowStockThreshold,
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
    <a-modal v-model:open="visible" title="Update Stock" @ok="handleOk" @cancel="handleCancel">
        <a-form :model="formData" layout="vertical">
            <a-form-item label="Product">
                <a-input v-model:value="formData.productName" disabled size="large" />
            </a-form-item>

            <a-form-item label="Quantity" required>
                <a-input-number v-model:value="formData.quantity" :min="0" size="large" style="width: 100%" />
            </a-form-item>

            <a-form-item label="Low Stock Threshold" required>
                <a-input-number v-model:value="formData.lowStockThreshold" :min="0" size="large" style="width: 100%" />
                <div class="field-hint">Alert when stock falls below this number</div>
            </a-form-item>
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
