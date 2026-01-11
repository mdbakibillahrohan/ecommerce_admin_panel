<script setup lang="ts">
interface Props {
    subtotal: number
    discount: number
    shipping: number
    tax: number
    total: number
}

const props = defineProps<Props>()

function formatCurrency(amount: number) {
    return `$${amount.toFixed(2)}`
}
</script>

<template>
    <a-card title="Order Summary" :bordered="false">
        <div class="totals-container">
            <div class="total-row">
                <span class="total-label">Subtotal</span>
                <span class="total-value">{{ formatCurrency(subtotal) }}</span>
            </div>

            <div v-if="discount > 0" class="total-row discount">
                <span class="total-label">Discount</span>
                <span class="total-value">-{{ formatCurrency(discount) }}</span>
            </div>

            <div class="total-row">
                <span class="total-label">Shipping</span>
                <span class="total-value">{{ formatCurrency(shipping) }}</span>
            </div>

            <div class="total-row">
                <span class="total-label">Tax</span>
                <span class="total-value">{{ formatCurrency(tax) }}</span>
            </div>

            <a-divider style="margin: 16px 0" />

            <div class="total-row final">
                <span class="total-label">Total</span>
                <span class="total-value">{{ formatCurrency(total) }}</span>
            </div>
        </div>
    </a-card>
</template>

<style scoped>
.totals-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
}

.total-label {
    color: var(--muted-foreground);
}

.total-value {
    font-weight: 600;
    color: var(--foreground);
}

.total-row.discount .total-value {
    color: #52c41a;
}

.total-row.final {
    font-size: 18px;
}

.total-row.final .total-label {
    color: var(--foreground);
    font-weight: 700;
}

.total-row.final .total-value {
    font-size: 20px;
    font-weight: 700;
    color: oklch(0.65 0.25 195);
}
</style>
