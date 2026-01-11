<script setup lang="ts">
import dayjs from 'dayjs'

interface Invoice {
    id: number
    invoice_number: string
    amount: number
    status: string
    due_date: string
    paid_at?: string
}

interface Props {
    invoices: Invoice[]
    loading?: boolean
}

interface Emits {
    (e: 'view', invoice: Invoice): void
    (e: 'download', invoice: Invoice): void
    (e: 'pay', invoice: Invoice): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const columns = [
    {
        title: 'Invoice #',
        dataIndex: 'invoice_number',
        key: 'invoice_number',
        width: 150,
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        width: 120,
        align: 'right' as const,
    },
    {
        title: 'Due Date',
        dataIndex: 'due_date',
        key: 'due_date',
        width: 150,
    },
    {
        title: 'Paid At',
        dataIndex: 'paid_at',
        key: 'paid_at',
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
        width: 180,
        fixed: 'right' as const,
    },
]

function handleView(invoice: Invoice) {
    emit('view', invoice)
}

function handleDownload(invoice: Invoice) {
    emit('download', invoice)
}

function handlePay(invoice: Invoice) {
    emit('pay', invoice)
}

function formatDate(date: string | undefined) {
    return date ? dayjs(date).format('MMM D, YYYY') : '-'
}

function formatCurrency(amount: number) {
    return `$${amount.toFixed(2)}`
}

function getStatusColor(status: string) {
    const colors: Record<string, string> = {
        PAID: 'green',
        PENDING: 'orange',
        OVERDUE: 'red',
    }
    return colors[status] || 'default'
}
</script>

<template>
    <a-table :dataSource="invoices" :columns="columns" :loading="loading" :pagination="false">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'amount'">
                {{ formatCurrency(record.amount) }}
            </template>

            <template v-else-if="column.key === 'due_date'">
                {{ formatDate(record.due_date) }}
            </template>

            <template v-else-if="column.key === 'paid_at'">
                {{ formatDate(record.paid_at) }}
            </template>

            <template v-else-if="column.key === 'status'">
                <a-tag :color="getStatusColor(record.status)">
                    {{ record.status }}
                </a-tag>
            </template>

            <template v-else-if="column.key === 'actions'">
                <a-space>
                    <a-button size="small" @click="handleView(record)">View</a-button>
                    <a-button size="small" @click="handleDownload(record)">Download</a-button>
                    <a-button v-if="record.status !== 'PAID'" size="small" type="primary"
                        @click="handlePay(record)">Pay</a-button>
                </a-space>
            </template>
        </template>
    </a-table>
</template>
