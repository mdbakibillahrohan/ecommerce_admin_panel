<script setup lang="ts">
import {
    PlusOutlined,
    DeleteOutlined,
    DollarOutlined,
} from '@ant-design/icons-vue'
import type { VariantPrice } from '@/modules/products/interfaces'

const prices = defineModel<VariantPrice[]>('prices', { default: () => [] })

function addPrice() {
    const newPrice: VariantPrice = {
        id: `vp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        label: '',
        price: 0,
        minQuantity: undefined,
        currency: 'BDT',
    }
    prices.value = [...prices.value, newPrice]
}

function removePrice(id: string) {
    prices.value = prices.value.filter(p => p.id !== id)
}

function updatePrice(id: string, field: keyof VariantPrice, value: unknown) {
    prices.value = prices.value.map(p =>
        p.id === id ? { ...p, [field]: value } : p,
    )
}
</script>

<template>
    <div class="variant-price-manager">
        <div class="price-label">
            <DollarOutlined />
            <span>Price Tiers</span>
            <a-tag color="green" size="small">{{ prices.length }}</a-tag>
        </div>

        <!-- Price Rows -->
        <div class="price-list" v-if="prices.length > 0">
            <div v-for="price in prices" :key="price.id" class="price-row">
                <a-input :value="price.label" placeholder="Label (e.g., Regular)" size="small" class="price-label-input"
                    @update:value="updatePrice(price.id, 'label', $event)" />
                <a-input-number :value="price.price" :min="0" :precision="2" placeholder="Price" size="small"
                    class="price-amount-input" @update:value="updatePrice(price.id, 'price', $event)">
                    <template #addonBefore>৳</template>
                </a-input-number>
                <a-input-number :value="price.minQuantity" :min="1" placeholder="Min Qty" size="small"
                    class="price-qty-input" @update:value="updatePrice(price.id, 'minQuantity', $event)" />
                <a-button size="small" danger type="text" @click="removePrice(price.id)">
                    <DeleteOutlined />
                </a-button>
            </div>
        </div>

        <a-button size="small" type="dashed" @click="addPrice" class="add-price-btn">
            <PlusOutlined />
            Add Price Tier
        </a-button>
    </div>
</template>

<style scoped>
.variant-price-manager {
    margin-top: 12px;
}

.price-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 500;
    color: var(--muted-foreground);
    margin-bottom: 8px;
}

.price-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 8px;
}

.price-row {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 6px 10px;
    background: var(--background);
    border: 1px solid var(--border);
    border-radius: 8px;
    transition: all 0.2s ease;
}

.price-row:hover {
    border-color: oklch(0.65 0.19 164);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.price-label-input {
    flex: 1;
    min-width: 100px;
}

.price-amount-input {
    width: 130px;
}

.price-qty-input {
    width: 90px;
}

.add-price-btn {
    width: 100%;
    border-style: dashed;
}
</style>
