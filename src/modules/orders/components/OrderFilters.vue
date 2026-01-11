<script setup lang="ts">
import { computed } from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import type { Order } from '@/modules/orders/api/orders'

interface Props {
    searchText: string
    selectedStatus?: string
    dateRange?: [string, string]
}

interface Emits {
    (e: 'update:searchText', value: string): void
    (e: 'update:selectedStatus', value: string | undefined): void
    (e: 'update:dateRange', value: [string, string] | undefined): void
    (e: 'search'): void
    (e: 'clear'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localSearchText = computed({
    get: () => props.searchText,
    set: (value) => emit('update:searchText', value),
})

const localSelectedStatus = computed({
    get: () => props.selectedStatus,
    set: (value) => emit('update:selectedStatus', value),
})

const localDateRange = computed({
    get: () => props.dateRange,
    set: (value) => emit('update:dateRange', value),
})

function handleSearch() {
    emit('search')
}

function handleClear() {
    emit('clear')
}
</script>

<template>
    <div class="order-filters">
        <div class="filter-row">
            <div class="filter-input">
                <a-input-search v-model:value="localSearchText" placeholder="Search orders by number, customer..."
                    size="large" allow-clear @search="handleSearch" @pressEnter="handleSearch">
                    <template #prefix>
                        <SearchOutlined />
                    </template>
                </a-input-search>
            </div>

            <div class="filter-select">
                <a-select v-model:value="localSelectedStatus" placeholder="All Status" size="large" allow-clear
                    @change="handleSearch">
                    <a-select-option value="PENDING">Pending</a-select-option>
                    <a-select-option value="PROCESSING">Processing</a-select-option>
                    <a-select-option value="SHIPPED">Shipped</a-select-option>
                    <a-select-option value="DELIVERED">Delivered</a-select-option>
                    <a-select-option value="CANCELLED">Cancelled</a-select-option>
                </a-select>
            </div>

            <div class="filter-date">
                <a-range-picker v-model:value="localDateRange" size="large" @change="handleSearch" />
            </div>

            <a-button size="large" @click="handleClear">Clear</a-button>
        </div>
    </div>
</template>

<style scoped>
.order-filters {
    width: 100%;
}

.filter-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1.5fr auto;
    gap: 12px;
    align-items: center;
}

.filter-input {
    width: 100%;
}

.filter-select,
.filter-date {
    width: 100%;
}

@media (max-width: 768px) {
    .filter-row {
        grid-template-columns: 1fr;
    }
}
</style>
