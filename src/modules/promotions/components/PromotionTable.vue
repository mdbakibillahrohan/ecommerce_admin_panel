<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'

interface Promotion {
    id: number
    title: string
    type: string
    status: string
    starts_at: string | null
    ends_at: string | null
    views: number
    clicks: number
}

interface Props {
    promotions: Promotion[]
    loading?: boolean
}

interface Emits {
    (e: 'edit', promotion: Promotion): void
    (e: 'delete', promotion: Promotion): void
    (e: 'toggle', promotion: Promotion): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const columns = [
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        width: 250,
    },
    {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        width: 120,
    },
    {
        title: 'Start Date',
        dataIndex: 'starts_at',
        key: 'starts_at',
        width: 150,
    },
    {
        title: 'End Date',
        dataIndex: 'ends_at',
        key: 'ends_at',
        width: 150,
    },
    {
        title: 'Views',
        dataIndex: 'views',
        key: 'views',
        width: 100,
        align: 'center' as const,
    },
    {
        title: 'Clicks',
        dataIndex: 'clicks',
        key: 'clicks',
        width: 100,
        align: 'center' as const,
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

function handleEdit(promotion: Promotion) {
    emit('edit', promotion)
}

function handleDelete(promotion: Promotion) {
    emit('delete', promotion)
}

function handleToggle(promotion: Promotion) {
    emit('toggle', promotion)
}

function formatDate(date: string | null) {
    return date ? dayjs(date).format('MMM D, YYYY') : '-'
}

function getStatusColor(status: string) {
    const colors: Record<string, string> = {
        ACTIVE: 'green',
        SCHEDULED: 'blue',
        EXPIRED: 'default',
    }
    return colors[status] || 'default'
}
</script>

<template>
    <a-table :dataSource="promotions" :columns="columns" :loading="loading" :pagination="false">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'starts_at'">
                {{ formatDate(record.starts_at) }}
            </template>

            <template v-else-if="column.key === 'ends_at'">
                {{ formatDate(record.ends_at) }}
            </template>

            <template v-else-if="column.key === 'status'">
                <a-tag :color="getStatusColor(record.status)">
                    {{ record.status }}
                </a-tag>
            </template>

            <template v-else-if="column.key === 'actions'">
                <a-space>
                    <a-button size="small" @click="handleEdit(record)">Edit</a-button>
                    <a-button size="small" @click="handleToggle(record)">
                        {{ record.status === 'ACTIVE' ? 'Pause' : 'Activate' }}
                    </a-button>
                    <a-button size="small" danger @click="handleDelete(record)">Delete</a-button>
                </a-space>
            </template>
        </template>
    </a-table>
</template>

<style scoped>
/* Styles inherited from Ant Design */
</style>
