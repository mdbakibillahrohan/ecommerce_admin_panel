<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'

interface Payment {
    id: number
    order_number: string
    customer_name: string
    amount: number
    payment_method: string
    status: string
    created_at: string
    transaction_id?: string
}

interface Props {
    payments: Payment[]
    loading?: boolean
    pagination: {
        current: number
        pageSize: number
        total: number
    }
}

interface Emits {
    (e: 'view', payment: Payment): void
    (e: 'refund', payment: Payment): void
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
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        width: 120,
        align: 'right' as const,
    },
    {
        title: 'Method',
        dataIndex: 'payment_method',
        key: 'payment_method',
        width: 150,
    },
    {
        title: 'Transaction ID',
        dataIndex: 'transaction_id',
        key: 'transaction_id',
        width: 200,
    },
    {
        title: 'Date',
        dataIndex: 'created_at',
        key: 'created_at',
        width: 150,
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 120,
    },
    {
        title: 'Actions',
        key: 'actions',
        width: 150,
        fixed: 'right' as const,
    },
]

function handleView(payment: Payment) {
    emit('view', payment)
}

function handleRefund(payment: Payment) {
    emit('refund', payment)
}

function handleTableChange(pagination: any) {
    emit('pageChange', pagination.current, pagination.pageSize)
}

function formatCurrency(amount: number) {
    return `$${amount.toFixed(2)}`
}

function formatDate(date: string) {
    return dayjs(date).format('MMM D, YYYY')
}

function getStatusColor(status: string) {
    const colors: Record<string, string> = {
        COMPLETED: 'green',
        PENDING: 'orange',
        FAILED: 'red',
        REFUNDED: 'purple',
    }
    return colors[status] || 'default'
}
</script>

<template>
    <a-table :dataSource="payments" :columns="columns" :loading="loading" :pagination="{
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        showSizeChanger: true,
        showTotal: (total: number) => `Total ${total} payments`,
    }" @change="handleTableChange" :scroll="{ x: 1200 }">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'amount'">
                <span class="amount">{{ formatCurrency(record.amount) }}</span>
            </template>

            <template v-else-if="column.key === 'transaction_id'">
                <span class="transaction-id">{{ record.transaction_id || '-' }}</span>
            </template>

            <template v-else-if="column.key === 'created_at'">
                {{ formatDate(record.created_at) }}
            </template>

            <template v-else-if="column.key === 'status'">
                <a-tag :color="getStatusColor(record.status)">
                    {{ record.status }}
                </a-tag>
            </template>

            <template v-else-if="column.key === 'actions'">
                <a-space>
                    <a-button size="small" @click="handleView(record)">View</a-button>
                    <a-button v-if="record.status === 'COMPLETED'" size="small" danger @click="handleRefund(record)">
                        Refund
                    </a-button>
                </a-space>
            </template>
        </template>
    </a-table>
</template>

<style scoped>
.amount {
    font-weight: 600;
    color: var(--foreground);
}

.transaction-id {
    font-family: 'Courier New', monospace;
    font-size: 13px;
    color: var(--muted-foreground);
}
</style>
