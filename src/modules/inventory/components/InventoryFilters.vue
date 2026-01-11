<script setup lang="ts">
import { computed } from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue'

interface Props {
    searchText: string
    showLowStock?: boolean
}

interface Emits {
    (e: 'update:searchText', value: string): void
    (e: 'update:showLowStock', value: boolean): void
    (e: 'search'): void
    (e: 'clear'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localSearchText = computed({
    get: () => props.searchText,
    set: (value) => emit('update:searchText', value),
})

const localShowLowStock = computed({
    get: () => props.showLowStock,
    set: (value) => emit('update:showLowStock', value || false),
})

function handleSearch() {
    emit('search')
}

function handleClear() {
    emit('clear')
}
</script>

<template>
    <div class="inventory-filters">
        <div class="filter-row">
            <div class="filter-input">
                <a-input-search v-model:value="localSearchText" placeholder="Search products..." size="large"
                    allow-clear @search="handleSearch" @pressEnter="handleSearch">
                    <template #prefix>
                        <SearchOutlined />
                    </template>
                </a-input-search>
            </div>

            <div class="filter-checkbox">
                <a-checkbox v-model:checked="localShowLowStock" @change="handleSearch">
                    Low Stock Only
                </a-checkbox>
            </div>

            <a-button size="large" @click="handleClear">Clear</a-button>
        </div>
    </div>
</template>

<style scoped>
.inventory-filters {
    width: 100%;
}

.filter-row {
    display: grid;
    grid-template-columns: 2fr auto auto;
    gap: 12px;
    align-items: center;
}

.filter-input {
    width: 100%;
}

.filter-checkbox {
    display: flex;
    align-items: center;
    padding: 0 16px;
}

@media (max-width: 768px) {
    .filter-row {
        grid-template-columns: 1fr;
    }
}
</style>
