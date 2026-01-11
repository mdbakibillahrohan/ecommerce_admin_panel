<script setup lang="ts">
interface Role {
    id: number
    name: string
    description: string
    permissions_count: number
    users_count: number
}

interface Props {
    roles: Role[]
    loading?: boolean
}

interface Emits {
    (e: 'edit', role: Role): void
    (e: 'delete', role: Role): void
    (e: 'managePermissions', role: Role): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const columns = [
    {
        title: 'Role Name',
        dataIndex: 'name',
        key: 'name',
        width: 200,
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: 'Permissions',
        dataIndex: 'permissions_count',
        key: 'permissions_count',
        width: 120,
        align: 'center' as const,
    },
    {
        title: 'Users',
        dataIndex: 'users_count',
        key: 'users_count',
        width: 100,
        align: 'center' as const,
    },
    {
        title: 'Actions',
        key: 'actions',
        width: 250,
        fixed: 'right' as const,
    },
]

function handleEdit(role: Role) {
    emit('edit', role)
}

function handleDelete(role: Role) {
    emit('delete', role)
}

function handleManagePermissions(role: Role) {
    emit('managePermissions', role)
}
</script>

<template>
    <a-table :dataSource="roles" :columns="columns" :loading="loading" :pagination="false">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'actions'">
                <a-space>
                    <a-button size="small" @click="handleManagePermissions(record)">Permissions</a-button>
                    <a-button size="small" @click="handleEdit(record)">Edit</a-button>
                    <a-button size="small" danger @click="handleDelete(record)">Delete</a-button>
                </a-space>
            </template>
        </template>
    </a-table>
</template>
