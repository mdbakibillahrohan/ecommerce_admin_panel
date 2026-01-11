<script setup lang="ts">
import type { Order } from '@/modules/orders/api/orders'

interface Props {
    status: Order['status']
}

const props = defineProps<Props>()

const statusConfig = {
    PENDING: { color: 'orange', text: 'Pending' },
    PROCESSING: { color: 'blue', text: 'Processing' },
    SHIPPED: { color: 'cyan', text: 'Shipped' },
    DELIVERED: { color: 'green', text: 'Delivered' },
    CANCELLED: { color: 'red', text: 'Cancelled' },
    REFUNDED: { color: 'purple', text: 'Refunded' },
}

const config = statusConfig[props.status as keyof typeof statusConfig] || { color: 'default', text: props.status }
</script>

<template>
    <a-tag :color="config.color" class="status-badge">
        {{ config.text }}
    </a-tag>
</template>

<style scoped>
.status-badge {
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 6px;
}
</style>
