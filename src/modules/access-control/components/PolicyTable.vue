<script setup lang="ts">
import dayjs from 'dayjs'

interface Policy {
    id: number
    name: string
    type: string
    description: string
    updated_at: string
}

interface Props {
    policies: Policy[]
    loading?: boolean
}

interface Emits {
    (e: 'edit', policy: Policy): void
    (e: 'delete', policy: Policy): void
    (e: 'view', policy: Policy): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const columns = [
    {
        title: 'Policy Name',
        dataIndex: 'name',
        key: 'name',
        width: 250,
    },
    {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        width: 150,
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
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

function handleEdit(policy: Policy) {
    emit('edit', policy)
}

function handleDelete(policy: Policy) {
    emit('delete', policy)
}

function handleView(policy: Policy) {
    emit('view', policy)
}

function formatDate(date: string) {
    return dayjs(date).format('MMM D, YYYY')
}
</script>

<template>
    <a-table :dataSource="policies" :columns="columns" :loading="loading" :pagination="false">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'updated_at'">
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
