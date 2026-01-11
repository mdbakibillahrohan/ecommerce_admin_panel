<script setup lang="ts">
import dayjs from 'dayjs'

interface Page {
    id: number
    title: string
    slug: string
    status: string
    updated_at: string
}

interface Props {
    pages: Page[]
    loading?: boolean
}

interface Emits {
    (e: 'edit', page: Page): void
    (e: 'delete', page: Page): void
    (e: 'view', page: Page): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const columns = [
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        width: 300,
    },
    {
        title: 'Slug',
        dataIndex: 'slug',
        key: 'slug',
        width: 250,
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 120,
    },
    {
        title: 'Last Updated',
        dataIndex: 'updated_at',
        key: 'updated_at',
        width: 150,
    },
    {
        title: 'Actions',
        key: 'actions',
        width: 180,
        fixed: 'right' as const,
    },
]

function handleEdit(page: Page) {
    emit('edit', page)
}

function handleDelete(page: Page) {
    emit('delete', page)
}

function handleView(page: Page) {
    emit('view', page)
}

function formatDate(date: string) {
    return dayjs(date).format('MMM D, YYYY')
}

function getStatusColor(status: string) {
    return status === 'PUBLISHED' ? 'green' : 'orange'
}
</script>

<template>
    <a-table :dataSource="pages" :columns="columns" :loading="loading" :pagination="false">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
                <a-tag :color="getStatusColor(record.status)">
                    {{ record.status }}
                </a-tag>
            </template>

            <template v-else-if="column.key === 'updated_at'">
                {{ formatDate(record.updated_at) }}
            </template>

            <template v-else-if="column.key === 'actions'">
                <a-space>
                    <a-button size="small" @click="handleView(record)">View</a-button>
                    <a-button size="small" @click="handleEdit(record)">Edit</a-button>
                    <a-button size="small" danger @click="handleDelete(record)">Delete</a-button>
                </a-space>
            </template>
        </template>
    </a-table>
</template>
