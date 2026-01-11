<script setup lang="ts">
import { computed } from 'vue'
import type { Inventory } from '@/modules/inventory/api/inventory'

interface Props {
    inventory: Inventory[]
    loading?: boolean
}

interface Emits {
    (e: 'update', item: Inventory): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const columns = [
    {
        title: 'Product',
        dataIndex: 'product_name',
        key: 'product_name',
        width: 300,
    },
    {
        title: 'SKU',
        dataIndex: 'sku',
        key: 'sku',
        width: 150,
    },
    {
        title: 'In Stock',
        dataIndex: 'quantity',
        key: 'quantity',
        width: 120,
        align: 'center' as const,
    },
    {
        title: 'Reserved',
        dataIndex: 'reserved',
        key: 'reserved',
        width: 120,
        align: 'center' as const,
    },
    {
        title: 'Available',
        dataIndex: 'available',
        key: 'available',
        width: 120,
        align: 'center' as const,
    },
    {
        title: 'Low Stock Alert',
        dataIndex: 'low_stock_threshold',
        key: 'low_stock_threshold',
        width: 150,
        align: 'center' as const,
    },
    {
        title: 'Status',
        key: 'status',
        width: 120,
    },
    {
        title: 'Actions',
        key: 'actions',
        width: 120,
        fixed: 'right' as const,
    },
]

function handleUpdate(item: Inventory) {
    emit('update', item)
}

function getStockStatus(item: Inventory) {
    if (item.quantity === 0) return { text: 'Out of Stock', color: 'red' }
    if (item.quantity <= item.low_stock_threshold) return { text: 'Low Stock', color: 'orange' }
    return { text: 'In Stock', color: 'green' }
}
</script>

<template>
    <a-table :dataSource="inventory" :columns="columns" :loading="loading" :pagination="false">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'quantity'">
                <span
                    :class="{ 'low-stock': record.quantity <= record.low_stock_threshold, 'out-of-stock': record.quantity === 0 }">
                    {{ record.quantity }}
                </span>
            </template>

            <template v-else-if="column.key === 'available'">
                {{ record.quantity - (record.reserved || 0) }}
            </template>

            <template v-else-if="column.key === 'status'">
                <a-tag :color="getStockStatus(record).color">
                    {{ getStockStatus(record).text }}
                </a-tag>
            </template>

            <template v-else-if="column.key === 'actions'">
                <a-button size="small" @click="handleUpdate(record)">Update</a-button>
            </template>
        </template>
    </a-table>
</template>

<style scoped>
.low-stock {
    color: #faad14;
    font-weight: 600;
}

.out-of-stock {
    color: #ff4d4f;
    font-weight: 600;
}
</style>
