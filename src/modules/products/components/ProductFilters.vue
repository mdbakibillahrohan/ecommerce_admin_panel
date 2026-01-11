<script setup lang="ts">
import { computed } from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import type { Category } from '@/modules/categories/api/categories'

interface Props {
    searchText: string
    selectedCategory?: number
    selectedStatus?: string
    categories: Category[]
    loading?: boolean
}

interface Emits {
    (e: 'update:searchText', value: string): void
    (e: 'update:selectedCategory', value: number | undefined): void
    (e: 'update:selectedStatus', value: string | undefined): void
    (e: 'search'): void
    (e: 'clear'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localSearchText = computed({
    get: () => props.searchText,
    set: (value) => emit('update:searchText', value),
})

const localSelectedCategory = computed({
    get: () => props.selectedCategory,
    set: (value) => emit('update:selectedCategory', value),
})

const localSelectedStatus = computed({
    get: () => props.selectedStatus,
    set: (value) => emit('update:selectedStatus', value),
})

function handleSearch() {
    emit('search')
}

function handleClear() {
    emit('clear')
}
</script>

<template>
    <div class="product-filters">
        <div class="filter-row">
            <div class="filter-input">
                <a-input-search v-model:value="localSearchText" placeholder="Search products by name, SKU..."
                    size="large" allow-clear @search="handleSearch" @pressEnter="handleSearch">
                    <template #prefix>
                        <SearchOutlined />
                    </template>
                </a-input-search>
            </div>

            <div class="filter-select">
                <a-select v-model:value="localSelectedCategory" placeholder="All Categories" size="large" allow-clear
                    @change="handleSearch">
                    <a-select-option v-for="cat in categories" :key="cat.id" :value="cat.id">
                        {{ cat.category_name }}
                    </a-select-option>
                </a-select>
            </div>

            <div class="filter-select">
                <a-select v-model:value="localSelectedStatus" placeholder="All Status" size="large" allow-clear
                    @change="handleSearch">
                    <a-select-option value="published">Published</a-select-option>
                    <a-select-option value="draft">Draft</a-select-option>
                </a-select>
            </div>

            <a-button size="large" @click="handleClear">Clear</a-button>
        </div>
    </div>
</template>

<style scoped>
.product-filters {
    width: 100%;
}

.filter-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr auto;
    gap: 12px;
    align-items: center;
}

.filter-input {
    width: 100%;
}

.filter-select {
    width: 100%;
}

@media (max-width: 768px) {
    .filter-row {
        grid-template-columns: 1fr;
    }
}
</style>
