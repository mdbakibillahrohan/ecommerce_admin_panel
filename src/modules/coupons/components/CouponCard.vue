<script setup lang="ts">
import type { Coupon } from '@/modules/coupons/api/coupons'
import dayjs from 'dayjs'

interface Props {
    coupon: Coupon
}

interface Emits {
    (e: 'edit'): void
    (e: 'delete'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function getDiscountDisplay() {
    if (props.coupon.discount_type === 'PERCENTAGE') return `${props.coupon.discount_value}% OFF`
    if (props.coupon.discount_type === 'FIXED') return `$${props.coupon.discount_value} OFF`
    return 'FREE SHIPPING'
}

function formatDate(date: string | null) {
    return date ? dayjs(date).format('MMM D, YYYY') : 'No expiry'
}
</script>

<template>
    <a-card class="coupon-card" :bordered="false">
        <div class="coupon-header">
            <div class="coupon-code">{{ coupon.code }}</div>
            <a-dropdown>
                <a-button size="small">
                    <template #icon>
                        <more-outlined />
                    </template>
                </a-button>
                <template #overlay>
                    <a-menu>
                        <a-menu-item @click="emit('edit')">Edit</a-menu-item>
                        <a-menu-item danger @click="emit('delete')">Delete</a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>
        </div>

        <div class="coupon-discount">{{ getDiscountDisplay() }}</div>

        <div class="coupon-details">
            <div class="detail-item">
                <span class="detail-label">Usage:</span>
                <span class="detail-value">{{ coupon.used_count || 0 }}{{ coupon.usage_limit ? ` /
                    ${coupon.usage_limit}` : ''
                }}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Expires At:</span>
                <span class="detail-value">{{ formatDate(coupon.expires_at) }}</span>
            </div>
        </div>

        <div class="coupon-footer">
            <a-tag :color="coupon.is_active ? 'green' : 'default'">
                {{ coupon.is_active ? 'Active' : 'Disabled' }}
            </a-tag>
        </div>
    </a-card>
</template>

<script setup lang="ts">
import { MoreOutlined } from '@ant-design/icons-vue'
</script>

<style scoped>
.coupon-card {
    border: 1px solid var(--border);
    border-radius: 12px;
    transition: all 0.3s ease;
}

.coupon-card:hover {
    border-color: oklch(0.65 0.25 195);
    box-shadow: 0 4px 12px rgba(13, 148, 136, 0.1);
}

.coupon-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.coupon-code {
    font-family: 'Courier New', monospace;
    font-size: 18px;
    font-weight: 700;
    color: oklch(0.65 0.25 195);
}

.coupon-discount {
    font-size: 24px;
    font-weight: 700;
    color: var(--foreground);
    margin-bottom: 16px;
}

.coupon-details {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
}

.detail-item {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
}

.detail-label {
    color: var(--muted-foreground);
}

.detail-value {
    font-weight: 600;
    color: var(--foreground);
}

.coupon-footer {
    display: flex;
    justify-content: flex-start;
}
</style>
