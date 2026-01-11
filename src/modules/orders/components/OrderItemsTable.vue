<script setup lang="ts">
interface OrderItem {
    id: number
    product_name: string
    variant?: string
    quantity: number
    price: number
    total: number
    thumbnail?: string
}

interface Props {
    items: OrderItem[]
}

const props = defineProps<Props>()

const columns = [
    {
        title: 'Product',
        dataIndex: 'product_name',
        key: 'product_name',
    },
    {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity',
        width: 100,
        align: 'center' as const,
    },
    {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        width: 120,
        align: 'right' as const,
    },
    {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        width: 120,
        align: 'right' as const,
    },
]

function formatCurrency(amount: number) {
    return `$${amount.toFixed(2)}`
}
</script>

<template>
    <a-card title="Order Items" :bordered="false">
        <a-table :dataSource="items" :columns="columns" :pagination="false">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'product_name'">
                    <div class="product-cell">
                        <a-avatar v-if="record.thumbnail" :src="record.thumbnail" shape="square" :size="48" />
                        <a-avatar v-else shape="square" :size="48">
                            <template #icon>
                                <picture-outlined />
                            </template>
                        </a-avatar>
                        <div class="product-info">
                            <div class="product-name">{{ record.product_name }}</div>
                            <div v-if="record.variant" class="product-variant">{{ record.variant }}</div>
                        </div>
                    </div>
                </template>

                <template v-else-if="column.key === 'price'">
                    {{ formatCurrency(record.price) }}
                </template>

                <template v-else-if="column.key === 'total'">
                    <span class="total-amount">{{ formatCurrency(record.total) }}</span>
                </template>
            </template>
        </a-table>
    </a-card>
</template>

<script setup lang="ts">
import { PictureOutlined } from '@ant-design/icons-vue'
</script>

<style scoped>
.product-cell {
    display: flex;
    align-items: center;
    gap: 12px;
}

.product-info {
    display: flex;
    flex-direction: column;
}

.product-name {
    font-weight: 600;
    color: var(--foreground);
}

.product-variant {
    font-size: 13px;
    color: var(--muted-foreground);
}

.total-amount {
    font-weight: 600;
    color: var(--foreground);
}
</style>
