<script setup lang="ts">
interface Store {
    id: number
    name: string
    domain: string
    is_active: boolean
    plan: string
}

interface Props {
    stores: Store[]
    loading?: boolean
}

interface Emits {
    (e: 'edit', store: Store): void
    (e: 'delete', store: Store): void
    (e: 'toggle', store: Store): void
    (e: 'view', store: Store): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const columns = [
    {
        title: 'Store Name',
        dataIndex: 'name',
        key: 'name',
        width: 250,
    },
    {
        title: 'Domain',
        dataIndex: 'domain',
        key: 'domain',
        width: 250,
    },
    {
        title: 'Plan',
        dataIndex: 'plan',
        key: 'plan',
        width: 120,
    },
    {
        title: 'Status',
        dataIndex: 'is_active',
        key: 'is_active',
        width: 120,
    },
    {
        title: 'Actions',
        key: 'actions',
        width: 200,
        fixed: 'right' as const,
    },
]

function handleEdit(store: Store) {
    emit('edit', store)
}

function handleDelete(store: Store) {
    emit('delete', store)
}

function handleToggle(store: Store) {
    emit('toggle', store)
}

function handleView(store: Store) {
    emit('view', store)
}
</script>

<template>
    <a-table :dataSource="stores" :columns="columns" :loading="loading" :pagination="false">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'is_active'">
                <a-tag :color="record.is_active ? 'green' : 'default'">
                    {{ record.is_active ? 'Active' : 'Inactive' }}
                </a-tag>
            </template>

            <template v-else-if="column.key === 'actions'">
                <a-space>
                    <a-button size="small" @click="handleView(record)">View</a-button>
                    <a-button size="small" @click="handleEdit(record)">Edit</a-button>
                    <a-button size="small" @click="handleToggle(record)">
                        {{ record.is_active ? 'Deactivate' : 'Activate' }}
                    </a-button>
                    <a-button size="small" danger @click="handleDelete(record)">Delete</a-button>
                </a-space>
            </template>
        </template>
    </a-table>
</template>
