<script setup lang="ts">
import { computed } from 'vue'
import type { Order } from '@/modules/orders/api/orders'
import OrderStatusBadge from './OrderStatusBadge.vue'
import dayjs from 'dayjs'

interface Props {
    order: Order
}

interface Emits {
    (e: 'updateStatus'): void
    (e: 'print'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formattedDate = computed(() => dayjs(props.order.created_at).format('MMM D, YYYY h:mm A'))
</script>

<template>
    <div class="order-header">
        <div class="header-left">
            <h2 class="order-number">Order #{{ order.order_number }}</h2>
            <div class="order-meta">
                <span class="meta-item">{{ formattedDate }}</span>
                <span class="meta-divider">•</span>
                <OrderStatusBadge :status="order.status" />
            </div>
        </div>
        <div class="header-actions">
            <a-button @click="emit('print')">
                <template #icon>
                    <printer-outlined />
                </template>
                Print
            </a-button>
            <a-button type="primary" @click="emit('updateStatus')">
                Update Status
            </a-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PrinterOutlined } from '@ant-design/icons-vue'
</script>

<style scoped>
.order-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 24px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    margin-bottom: 24px;
}

.header-left {
    flex: 1;
}

.order-number {
    font-size: 24px;
    font-weight: 700;
    color: var(--foreground);
    margin: 0 0 8px 0;
}

.order-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--muted-foreground);
}

.meta-divider {
    color: var(--border);
}

.header-actions {
    display: flex;
    gap: 12px;
}

@media (max-width: 768px) {
    .order-header {
        flex-direction: column;
        gap: 16px;
    }

    .header-actions {
        width: 100%;
    }

    .header-actions button {
        flex: 1;
    }
}
</style>
