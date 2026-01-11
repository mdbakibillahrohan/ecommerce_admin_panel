<script setup lang="ts">
import { computed } from 'vue'
import type { Customer } from '@/modules/customers/services/customer.service'
import dayjs from 'dayjs'

interface Props {
    customers: Customer[]
    loading?: boolean
    pagination: {
        current: number
        pageSize: number
        total: number
    }
}

interface Emits {
    (e: 'view', customer: Customer): void
    (e: 'edit', customer: Customer): void
    (e: 'pageChange', page: number, pageSize: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const columns = [
    {
        title: 'Customer',
        dataIndex: 'name',
        key: 'name',
        width: 250,
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        width: 250,
    },
    {
        title: 'Phone',
        dataIndex: 'phone',
        key: 'phone',
        width: 150,
    },
    {
        title: 'Orders',
        dataIndex: 'total_orders',
        key: 'total_orders',
        width: 100,
        align: 'center' as const,
    },
    {
        title: 'Total Spent',
        dataIndex: 'total_spent',
        key: 'total_spent',
        width: 130,
        align: 'right' as const,
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 120,
    },
    {
        title: 'Joined',
        dataIndex: 'created_at',
        key: 'created_at',
        width: 130,
    },
    {
        title: 'Actions',
        key: 'actions',
        width: 150,
        fixed: 'right' as const,
    },
]

function handleView(customer: Customer) {
    emit('view', customer)
}

function handleEdit(customer: Customer) {
    emit('edit', customer)
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

function getStatusColor(status?: string) {
    return status === 'active' ? 'green' : 'default'
}
</script>

<template>
    <a-table :dataSource="customers" :columns="columns" :loading="loading" :pagination="{
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        showSizeChanger: true,
        showTotal: (total: number) => `Total ${total} customers`,
    }" @change="handleTableChange" :scroll="{ x: 1200 }">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'name'">
                <div class="customer-cell">
                    <a-avatar v-if="record.avatar" :src="record.avatar" />
                    <a-avatar v-else>{{ record.first_name?.[0] }}{{ record.last_name?.[0] }}</a-avatar>
                    <div class="customer-info">
                        <a @click="handleView(record)" class="customer-link">
                            {{ record.first_name }} {{ record.last_name }}
                        </a>
                    </div>
                </div>
            </template>

            <template v-else-if="column.key === 'total_spent'">
                <span class="total-amount">{{ formatCurrency(record.total_spent || 0) }}</span>
            </template>

            <template v-else-if="column.key === 'status'">
                <a-tag :color="getStatusColor(record.status)">
                    {{ record.status || 'Active' }}
                </a-tag>
            </template>

            <template v-else-if="column.key === 'created_at'">
                {{ formatDate(record.created_at) }}
            </template>

            <template v-else-if="column.key === 'actions'">
                <a-space>
                    <a-button size="small" @click="handleView(record)">View</a-button>
                    <a-button size="small" @click="handleEdit(record)">Edit</a-button>
                </a-space>
            </template>
        </template>
    </a-table>
</template>

<style scoped>
.customer-cell {
    display: flex;
    align-items: center;
    gap: 12px;
}

.customer-info {
    display: flex;
    flex-direction: column;
}

.customer-link {
    color: oklch(0.65 0.25 195);
    font-weight: 600;
    cursor: pointer;
}

.customer-link:hover {
    text-decoration: underline;
}

.total-amount {
    font-weight: 600;
    color: var(--foreground);
}
</style>
