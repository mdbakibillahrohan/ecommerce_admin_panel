<script setup lang="ts">
import dayjs from 'dayjs'

interface Subscription {
    id: number
    plan: string
    status: string
    current_period_start: string
    current_period_end: string
    amount: number
}

interface Props {
    subscriptions: Subscription[]
    loading?: boolean
}

interface Emits {
    (e: 'cancel', subscription: Subscription): void
    (e: 'upgrade', subscription: Subscription): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const columns = [
    {
        title: 'Plan',
        dataIndex: 'plan',
        key: 'plan',
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
        title: 'Current Period',
        key: 'period',
        width: 250,
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

function handleCancel(subscription: Subscription) {
    emit('cancel', subscription)
}

function handleUpgrade(subscription: Subscription) {
    emit('upgrade', subscription)
}

function formatDate(date: string) {
    return dayjs(date).format('MMM D, YYYY')
}

function formatCurrency(amount: number) {
    return `$${amount.toFixed(2)}`
}

function getStatusColor(status: string) {
    const colors: Record<string, string> = {
        ACTIVE: 'green',
        CANCELLED: 'red',
        PAST_DUE: 'orange',
    }
    return colors[status] || 'default'
}
</script>

<template>
    <a-table :dataSource="subscriptions" :columns="columns" :loading="loading" :pagination="false">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'amount'">
                {{ formatCurrency(record.amount) }}
            </template>

            <template v-else-if="column.key === 'period'">
                {{ formatDate(record.current_period_start) }} - {{ formatDate(record.current_period_end) }}
            </template>

            <template v-else-if="column.key === 'status'">
                <a-tag :color="getStatusColor(record.status)">
                    {{ record.status }}
                </a-tag>
            </template>

            <template v-else-if="column.key === 'actions'">
                <a-space>
                    <a-button v-if="record.status === 'ACTIVE'" size="small"
                        @click="handleUpgrade(record)">Upgrade</a-button>
                    <a-button v-if="record.status === 'ACTIVE'" size="small" danger
                        @click="handleCancel(record)">Cancel</a-button>
                </a-space>
            </template>
        </template>
    </a-table>
</template>
