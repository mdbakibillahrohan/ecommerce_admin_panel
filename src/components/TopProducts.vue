<script setup lang="ts">
interface Product {
    id: number
    name: string
    sales: number
    revenue: number
    thumbnail?: string
}

interface Props {
    products: Product[]
    loading?: boolean
}

const props = defineProps<Props>()

function formatCurrency(amount: number) {
    return `$${amount.toLocaleString()}`
}
</script>

<template>
    <a-card title="Top Products" :bordered="false" class="top-products-card">
        <a-spin :spinning="loading">
            <div class="products-list">
                <div v-for="(product, index) in products" :key="product.id" class="product-item">
                    <div class="product-rank">{{ index + 1 }}</div>
                    <div v-if="product.thumbnail" class="product-thumbnail">
                        <img :src="product.thumbnail" :alt="product.name" />
                    </div>
                    <div class="product-info">
                        <div class="product-name">{{ product.name }}</div>
                        <div class="product-stats">
                            <span>{{ product.sales }} sales</span>
                            <span>{{ formatCurrency(product.revenue) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </a-spin>
    </a-card>
</template>

<style scoped>
.top-products-card {
    border: 1px solid var(--border);
    border-radius: 12px;
}

.products-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.product-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: var(--accent);
    border-radius: 8px;
    transition: background 0.2s;
}

.product-item:hover {
    background: var(--muted);
}

.product-rank {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: oklch(0.65 0.25 195);
    color: white;
    border-radius: 50%;
    font-weight: 700;
    font-size: 14px;
    flex-shrink: 0;
}

.product-thumbnail {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    overflow: hidden;
    flex-shrink: 0;
}

.product-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.product-info {
    flex: 1;
}

.product-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--foreground);
    margin-bottom: 4px;
}

.product-stats {
    display: flex;
    gap: 16px;
    font-size: 13px;
    color: var(--muted-foreground);
}
</style>
