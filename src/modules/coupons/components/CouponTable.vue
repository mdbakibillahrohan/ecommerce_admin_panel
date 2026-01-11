<script setup lang="ts">
import { computed } from 'vue'
import type { Coupon } from '@/modules/coupons/api/coupons'
import dayjs from 'dayjs'

interface Props {
    coupons: Coupon[]
    loading?: boolean
}

interface Emits {
    (e: 'edit', coupon: Coupon): void
    (e: 'delete', coupon: Coupon): void
    (e: 'toggle', coupon: Coupon): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const columns = [
    {
        title: 'Code',
        dataIndex: 'code',
        key: 'code',
        width: 150,
    },
    {
        title: 'Type',
        dataIndex: 'discount_type',
        key: 'discount_type',
        width: 130,
    },
    {
        title: 'Value',
        dataIndex: 'discount_value',
        key: 'discount_value',
        width: 100,
    },
    {
        title: 'Usage',
        key: 'usage',
        width: 120,
    },
    {
        title: 'Expires At',
        dataIndex: 'expires_at',
        key: 'expires_at',
        width: 150,
    },
    {
        title: 'Status',
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

function handleEdit(coupon: Coupon) {
    emit('edit', coupon)
}

function handleDelete(coupon: Coupon) {
    emit('delete', coupon)
}

function handleToggle(coupon: Coupon) {
    emit('toggle', coupon)
}

function formatDate(date: string | null) {
    return date ? dayjs(date).format('MMM D, YYYY') : 'No expiry'
}

function getDiscountDisplay(coupon: Coupon) {
    if (coupon.discount_type === 'PERCENTAGE') return `${coupon.discount_value}%`
    if (coupon.discount_type === 'FIXED') return `$${coupon.discount_value}`
    return 'Free Shipping'
}

function getStatusColor(coupon: Coupon) {
    if (!coupon.is_active) return 'default'
    if (coupon.expires_at && dayjs(coupon.expires_at).isBefore(dayjs())) return 'red'
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) return 'orange'
    return 'green'
}

function getStatusText(coupon: Coupon) {
    if (!coupon.is_active) return 'Disabled'
    if (coupon.expires_at && dayjs(coupon.expires_at).isBefore(dayjs())) return 'Expired'
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) return 'Limit Reached'
    return 'Active'
}
</script>

<template>
    <a-table :dataSource="coupons" :columns="columns" :loading="loading" :pagination="false">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'code'">
                <span class="coupon-code">{{ record.code }}</span>
            </template>

            <template v-else-if="column.key === 'discount_value'">
                {{ getDiscountDisplay(record) }}
            </template>

            <template v-else-if="column.key === 'usage'">
                {{ record.used_count || 0 }}{{ record.usage_limit ? ` / ${record.usage_limit}` : '' }}
            </template>

            <template v-else-if="column.key === 'expires_at'">
                {{ formatDate(record.expires_at) }}
            </template>

            <template v-else-if="column.key === 'status'">
                <a-tag :color="getStatusColor(record)">
                    {{ getStatusText(record) }}
                </a-tag>
            </template>

            <template v-else-if="column.key === 'actions'">
                <a-space>
                    <a-button size="small" @click="handleEdit(record)">Edit</a-button>
                    <a-button size="small" @click="handleToggle(record)">
                        {{ record.is_active ? 'Disable' : 'Enable' }}
                    </a-button>
                    <a-button size="small" danger @click="handleDelete(record)">Delete</a-button>
                </a-space>
            </template>
        </template>
    </a-table>
</template>

<style scoped>
.coupon-code {
    font-family: 'Courier New', monospace;
    font-weight: 700;
    color: oklch(0.65 0.25 195);
    background: var(--accent);
    padding: 4px 8px;
    border-radius: 4px;
}
</style>
