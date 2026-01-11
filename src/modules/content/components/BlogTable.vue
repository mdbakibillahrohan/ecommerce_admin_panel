<script setup lang="ts">
import dayjs from 'dayjs'

interface BlogPost {
    id: number
    title: string
    slug: string
    category: string
    status: string
    published_at?: string
    views: number
}

interface Props {
    posts: BlogPost[]
    loading?: boolean
}

interface Emits {
    (e: 'edit', post: BlogPost): void
    (e: 'delete', post: BlogPost): void
    (e: 'view', post: BlogPost): void
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
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        width: 120,
    },
    {
        title: 'Views',
        dataIndex: 'views',
        key: 'views',
        width: 100,
        align: 'center' as const,
    },
    {
        title: 'Published',
        dataIndex: 'published_at',
        key: 'published_at',
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

function handleEdit(post: BlogPost) {
    emit('edit', post)
}

function handleDelete(post: BlogPost) {
    emit('delete', post)
}

function handleView(post: BlogPost) {
    emit('view', post)
}

function formatDate(date: string | undefined) {
    return date ? dayjs(date).format('MMM D, YYYY') : '-'
}

function getStatusColor(status: string) {
    return status === 'PUBLISHED' ? 'green' : 'orange'
}
</script>

<template>
    <a-table :dataSource="posts" :columns="columns" :loading="loading" :pagination="false">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'published_at'">
                {{ formatDate(record.published_at) }}
            </template>

            <template v-else-if="column.key === 'status'">
                <a-tag :color="getStatusColor(record.status)">
                    {{ record.status }}
                </a-tag>
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
