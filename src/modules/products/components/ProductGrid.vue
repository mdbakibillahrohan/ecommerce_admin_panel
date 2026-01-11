<script setup lang="ts">
import ProductCard from './ProductCard.vue'
import type { Product } from '@/modules/products/api/products'

interface Props {
    products: Product[]
    loading?: boolean
}

interface Emits {
    (e: 'view', id: number): void
    (e: 'edit', id: number): void
    (e: 'duplicate', product: Product): void
    (e: 'delete', id: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

<template>
    <div class="product-grid">
        <a-spin :spinning="loading">
            <div v-if="products.length > 0" class="grid-container">
                <ProductCard v-for="product in products" :key="product.id" :product="product"
                    @view="emit('view', $event)" @edit="emit('edit', $event)" @duplicate="emit('duplicate', $event)"
                    @delete="emit('delete', $event)" />
            </div>
            <a-empty v-else description="No products found" />
        </a-spin>
    </div>
</template>

<style scoped>
.product-grid {
    width: 100%;
}

.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
}

@media (max-width: 1200px) {
    .grid-container {
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    }
}

@media (max-width: 768px) {
    .grid-container {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 16px;
    }
}
</style>
