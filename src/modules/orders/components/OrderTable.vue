<script setup lang="ts">
import { computed } from 'vue'
import type { Order } from '@/modules/orders/api/orders'
import OrderStatusBadge from './OrderStatusBadge.vue'
import dayjs from 'dayjs'

interface Props {
    orders: Order[]
    loading?: boolean
    pagination: {
        current: number
        pageSize: number
        total: number
    }
}

interface Emits {
    (e: 'view', order: Order): void
    (e: 'updateStatus', order: Order): void
    (e: 'pageChange', page: number, pageSize: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const columns = [
    {
        title: 'Order #',
        dataIndex: 'order_number',
        key: 'order_number',
        width: 150,
    },
    {
        title: 'Customer',
        dataIndex: 'customer_name',
        key: 'customer_name',
        width: 200,
    },
    {
        title: 'Date',
        dataIndex: 'created_at',
        key: 'created_at',
        width: 150,
    },
    {
        title: 'Items',
        dataIndex: 'items_count',
        key: 'items_count',
        width: 100,
        align: 'center' as const,
    },
    {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        width: 120,
        align: 'right' as const,
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 130,
    },
    {
        title: 'Actions',
        key: 'actions',
        width: 150,
        fixed: 'right' as const,
    },
]

function handleView(order: Order) {
    emit('view', order)
}

function handleUpdateStatus(order: Order) {
    emit('updateStatus', order)
}

function handleTableChange(pagination: any) {
    emit('pageChange', pagination.current, pagination.pageSize)
}

function formatDate(date: string) {
    return dayjs(date).format('MMM D, YYYY')
}

function formatCurrency(amount: number) {
    return `$${amount.toFixed(2)}`
}
</script>

<template>
    <a-table :dataSource="orders" :columns="columns" :loading="loading" :pagination="{
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        showSizeChanger: true,
        showTotal: (total: number) => `Total ${total} orders`,
    }" @change="handleTableChange" :scroll="{ x: 1000 }">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'order_number'">
                <a @click="handleView(record)" class="order-link">
                    {{ record.order_number }}
                </a>
            </template>

            <template v-else-if="column.key === 'created_at'">
                {{ formatDate(record.created_at) }}
            </template>

            <template v-else-if="column.key === 'total'">
                <span class="total-amount">{{ formatCurrency(record.total) }}</span>
            </template>

            <template v-else-if="column.key === 'status'">
                <OrderStatusBadge :status="record.status" />
            </template>

            <template v-else-if="column.key === 'actions'">
                <a-space>
                    <a-button size="small" @click="handleView(record)">View</a-button>
                    <a-button size="small" @click="handleUpdateStatus(record)">Update</a-button>
                </a-space>
            </template>
        </template>
    </a-table>
</template>

<style scoped>
.order-link {
    color: oklch(0.65 0.25 195);
    font-weight: 600;
    cursor: pointer;
}

.order-link:hover {
    text-decoration: underline;
}

.total-amount {
    font-weight: 600;
    color: var(--foreground);
}
</style>
