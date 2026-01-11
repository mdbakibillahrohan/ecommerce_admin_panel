<script setup lang="ts">
import type { Order } from '@/modules/orders/api/orders'

interface Props {
    order: Order
}

const props = defineProps<Props>()
</script>

<template>
    <a-card title="Customer Information" :bordered="false">
        <a-descriptions :column="1" bordered>
            <a-descriptions-item label="Name">
                {{ order.user ? `${order.user.first_name} ${order.user.last_name}` : '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="Email">
                {{ order.user?.email || '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="Phone">
                {{ order.shipping_address?.phone || '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="Shipping Address">
                <div v-if="order.shipping_address">
                    <div>{{ order.shipping_address.address_line1 }}</div>
                    <div v-if="order.shipping_address.address_line2">{{ order.shipping_address.address_line2 }}</div>
                    <div>
                        {{ order.shipping_address.city }}, {{ order.shipping_address.state }} {{
                            order.shipping_address.postal_code }}
                    </div>
                    <div>{{ order.shipping_address.country }}</div>
                </div>
                <span v-else>-</span>
            </a-descriptions-item>
            <a-descriptions-item label="Billing Address">
                <div v-if="order.billing_address">
                    <div>{{ order.billing_address.address_line1 }}</div>
                    <div v-if="order.billing_address.address_line2">{{ order.billing_address.address_line2 }}</div>
                    <div>
                        {{ order.billing_address.city }}, {{ order.billing_address.state }} {{
                            order.billing_address.postal_code }}
                    </div>
                    <div>{{ order.billing_address.country }}</div>
                </div>
                <span v-else>Same as shipping</span>
            </a-descriptions-item>
        </a-descriptions>
    </a-card>
</template>

<style scoped>
/* Styles inherited from Ant Design */
</style>
