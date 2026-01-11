<script setup lang="ts">
import { computed } from 'vue'
import type { StaffMember } from '@/modules/staff/services/staff.service'
import dayjs from 'dayjs'

interface Props {
    staff: StaffMember[]
    loading?: boolean
}

interface Emits {
    (e: 'edit', member: StaffMember): void
    (e: 'remove', member: StaffMember): void
    (e: 'resendInvite', member: StaffMember): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const columns = [
    {
        title: 'Staff Member',
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
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        width: 150,
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 120,
    },
    {
        title: 'Joined',
        dataIndex: 'joined_at',
        key: 'joined_at',
        width: 150,
    },
    {
        title: 'Actions',
        key: 'actions',
        width: 180,
        fixed: 'right' as const,
    },
]

function handleEdit(member: StaffMember) {
    emit('edit', member)
}

function handleRemove(member: StaffMember) {
    emit('remove', member)
}

function handleResendInvite(member: StaffMember) {
    emit('resendInvite', member)
}

function formatDate(date: string | null) {
    return date ? dayjs(date).format('MMM D, YYYY') : '-'
}

function getStatusColor(status: string) {
    const colors: Record<string, string> = {
        ACTIVE: 'green',
        INVITED: 'blue',
        PENDING: 'orange',
        SUSPENDED: 'red',
    }
    return colors[status] || 'default'
}

function getRoleBadgeColor(role: string) {
    const colors: Record<string, string> = {
        OWNER: 'purple',
        ADMIN: 'red',
        MANAGER: 'blue',
        STAFF: 'default',
    }
    return colors[role] || 'default'
}

function getInitials(member: StaffMember) {
    if (member.user) {
        return `${member.user.first_name[0]}${member.user.last_name[0]}`
    }
    return member.email?.[0]?.toUpperCase() || '?'
}
</script>

<template>
    <a-table :dataSource="staff" :columns="columns" :loading="loading" :pagination="false">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'name'">
                <div class="staff-cell">
                    <a-avatar>{{ getInitials(record) }}</a-avatar>
                    <div class="staff-info">
                        <div class="staff-name">
                            {{ record.user ? `${record.user.first_name} ${record.user.last_name}` : record.email }}
                        </div>
                    </div>
                </div>
            </template>

            <template v-else-if="column.key === 'email'">
                {{ record.email || record.user?.email }}
            </template>

            <template v-else-if="column.key === 'role'">
                <a-tag :color="getRoleBadgeColor(record.role)">
                    {{ record.role }}
                </a-tag>
            </template>

            <template v-else-if="column.key === 'status'">
                <a-tag :color="getStatusColor(record.status)">
                    {{ record.status }}
                </a-tag>
            </template>

            <template v-else-if="column.key === 'joined_at'">
                {{ formatDate(record.joined_at) }}
            </template>

            <template v-else-if="column.key === 'actions'">
                <a-space>
                    <a-button v-if="record.status === 'INVITED'" size="small" @click="handleResendInvite(record)">
                        Resend
                    </a-button>
                    <a-button size="small" @click="handleEdit(record)">Edit</a-button>
                    <a-button size="small" danger @click="handleRemove(record)">Remove</a-button>
                </a-space>
            </template>
        </template>
    </a-table>
</template>

<style scoped>
.staff-cell {
    display: flex;
    align-items: center;
    gap: 12px;
}

.staff-info {
    display: flex;
    flex-direction: column;
}

.staff-name {
    font-weight: 600;
    color: var(--foreground);
}
</style>
