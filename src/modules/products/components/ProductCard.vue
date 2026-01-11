<script setup lang="ts">
import { ShoppingOutlined, EyeOutlined, EditOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons-vue'
import type { Product } from '@/modules/products/api/products'

interface Props {
    product: Product
}

interface Emits {
    (e: 'view', id: number): void
    (e: 'edit', id: number): void
    (e: 'duplicate', product: Product): void
    (e: 'delete', id: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function formatCurrency(value: number) {
    return new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT',
        minimumFractionDigits: 0,
    }).format(value)
}
</script>

<template>
    <div class="product-card">
        <div class="product-image-container">
            <img v-if="product.thumbnail?.url" :src="product.thumbnail.url" :alt="product.name" class="product-image" />
            <div v-else class="product-image-placeholder">
                <ShoppingOutlined />
            </div>
            <div class="product-badges">
                <a-tag v-if="product.is_featured" color="gold">Featured</a-tag>
                <a-tag v-if="!product.is_published" color="default">Draft</a-tag>
            </div>
            <div class="product-hover-actions">
                <a-button type="primary" size="small" @click="emit('view', product.id)">
                    <EyeOutlined /> View
                </a-button>
                <a-button size="small" @click="emit('edit', product.id)">
                    <EditOutlined /> Edit
                </a-button>
            </div>
        </div>
        <div class="product-card-content">
            <div class="product-card-header">
                <h3 class="product-card-title">{{ product.name }}</h3>
                <a-dropdown>
                    <a-button type="text" size="small">⋯</a-button>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item @click="emit('edit', product.id)">
                                <EditOutlined /> Edit
                            </a-menu-item>
                            <a-menu-item @click="emit('duplicate', product)">
                                <CopyOutlined /> Duplicate
                            </a-menu-item>
                            <a-menu-divider />
                            <a-menu-item danger @click="emit('delete', product.id)">
                                <DeleteOutlined /> Delete
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </div>
            <p class="product-category">{{ product.category?.category_name || 'Uncategorized' }}</p>
            <div class="product-card-footer">
                <div class="product-price">
                    <span v-if="product.sale_price" class="sale-price">{{ formatCurrency(product.sale_price) }}</span>
                    <span :class="{ 'original-price': product.sale_price, 'base-price': !product.sale_price }">
                        {{ formatCurrency(product.base_price) }}
                    </span>
                </div>
                <a-tag :color="product.stock_quantity <= 0
                        ? 'red'
                        : product.stock_quantity <= product.low_stock_threshold
                            ? 'orange'
                            : 'green'
                    ">
                    Stock: {{ product.stock_quantity }}
                </a-tag>
            </div>
        </div>
    </div>
</template>

<style scoped>
.product-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    border-color: oklch(0.7 0.15 195);
}

.product-image-container {
    position: relative;
    width: 100%;
    padding-top: 100%;
    overflow: hidden;
    background: var(--muted);
}

.product-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.product-image-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    color: var(--muted-foreground);
    background: linear-gradient(135deg, oklch(0.95 0.01 195) 0%, oklch(0.92 0.02 210) 100%);
}

.product-badges {
    position: absolute;
    top: 12px;
    left: 12px;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.product-hover-actions {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    gap: 8px;
    opacity: 0;
    transition: opacity 0.3s;
}

.product-card:hover .product-hover-actions {
    opacity: 1;
}

.product-card-content {
    padding: 16px;
}

.product-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 8px;
}

.product-card-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--foreground);
    margin: 0;
    line-height: 1.4;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.product-category {
    font-size: 14px;
    color: var(--muted-foreground);
    margin: 0 0 12px 0;
}

.product-card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
}

.product-price {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.sale-price {
    font-weight: 700;
    font-size: 16px;
    color: oklch(0.75 0.17 145);
}

.base-price {
    font-weight: 600;
    font-size: 15px;
    color: var(--foreground);
}

.original-price {
    text-decoration: line-through;
    color: var(--muted-foreground);
    font-size: 13px;
}
</style>
