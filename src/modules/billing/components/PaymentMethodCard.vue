<script setup lang="ts">
interface PaymentMethod {
    id: number
    type: string
    last4: string
    brand?: string
    expiry_month?: number
    expiry_year?: number
    is_default: boolean
}

interface Props {
    paymentMethod: PaymentMethod
}

interface Emits {
    (e: 'setDefault'): void
    (e: 'delete'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

<template>
    <a-card class="payment-method-card" :bordered="false">
        <div class="method-header">
            <div class="method-info">
                <div class="method-type">
                    <span v-if="paymentMethod.brand" class="brand">{{ paymentMethod.brand }}</span>
                    <span class="type-label">{{ paymentMethod.type }}</span>
                </div>
                <div class="method-number">•••• {{ paymentMethod.last4 }}</div>
            </div>
            <a-tag v-if="paymentMethod.is_default" color="green">Default</a-tag>
        </div>

        <div v-if="paymentMethod.expiry_month && paymentMethod.expiry_year" class="method-expiry">
            Expires: {{ paymentMethod.expiry_month }}/{{ paymentMethod.expiry_year }}
        </div>

        <div class="method-actions">
            <a-button v-if="!paymentMethod.is_default" size="small" @click="emit('setDefault')">Set as
                Default</a-button>
            <a-button size="small" danger @click="emit('delete')">Remove</a-button>
        </div>
    </a-card>
</template>

<style scoped>
.payment-method-card {
    border: 1px solid var(--border);
    border-radius: 12px;
}

.method-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
}

.method-info {
    flex: 1;
}

.method-type {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
}

.brand {
    font-weight: 700;
    color: oklch(0.65 0.25 195);
}

.type-label {
    font-size: 14px;
    color: var(--muted-foreground);
}

.method-number {
    font-size: 18px;
    font-weight: 700;
    color: var(--foreground);
}

.method-expiry {
    font-size: 13px;
    color: var(--muted-foreground);
    margin-bottom: 12px;
}

.method-actions {
    display: flex;
    gap: 8px;
}
</style>
