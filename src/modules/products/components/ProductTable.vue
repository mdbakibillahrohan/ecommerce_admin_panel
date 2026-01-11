<script setup lang="ts">
import { computed } from 'vue'
import { EyeOutlined, EditOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import type { Product } from '@/modules/products/api/products'
import type { TableProps } from 'ant-design-vue'

interface Props {
    products: Product[]
    loading?: boolean
    selectedRowKeys: number[]
    pagination: {
        current: number
        pageSize: number
        total: number
        showSizeChanger: boolean
        showQuickJumper: boolean
        showTotal: (total: number) => string
    }
}

interface Emits {
    (e: 'update:selectedRowKeys', keys: number[]): void
    (e: 'change', pagination: { current: number; pageSize: number }): void
    (e: 'view', id: number): void
    (e: 'edit', id: number): void
    (e: 'duplicate', product: Product): void
    (e: 'delete', id: number): void
    (e: 'togglePublish', product: Product): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const columns = [
    {
        title: 'Product',
        key: 'product',
        width: 300,
    },
    {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        width: 150,
    },
    {
        title: 'Price',
        key: 'price',
        width: 150,
        align: 'right' as const,
    },
    {
        title: 'Stock',
        dataIndex: 'stock_quantity',
        key: 'stock',
        width: 100,
        align: 'center' as const,
    },
    {
        title: 'Status',
        key: 'status',
        width: 120,
        align: 'center' as const,
    },
    {
        title: 'Created',
        dataIndex: 'created_at',
        key: 'created_at',
        width: 120,
    },
    {
        title: 'Actions',
        key: 'actions',
        width: 180,
        align: 'center' as const,
        fixed: 'right' as const,
    },
]

const rowSelection = computed(() => ({
    selectedRowKeys: props.selectedRowKeys,
    onChange: (keys: number[]) => {
        emit('update:selectedRowKeys', keys)
    },
}))

function formatCurrency(value: number) {
    return new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT',
        minimumFractionDigits: 0,
    }).format(value)
}

function handleTableChange(pagination: any) {
    emit('change', {
        current: pagination.current,
        pageSize: pagination.pageSize,
    })
}
</script>

<template>
    <a-table :columns="columns" :data-source="products" :loading="loading" row-key="id" :row-selection="rowSelection"
        :pagination="pagination" :scroll="{ x: 1200 }" @change="handleTableChange">
        <template #bodyCell="{ column, record }">
            <!-- Product -->
            <template v-if="column.key === 'product'">
                <div class="product-cell">
                    <a-avatar :src="record.thumbnail?.url" :size="56" shape="square" class="product-avatar">
                        {{ record.name.charAt(0) }}
                    </a-avatar>
                    <div class="product-info">
                        <div class="product-name">{{ record.name }}</div>
                        <div class="product-meta">
                            <span v-if="record.sku" class="sku">SKU: {{ record.sku }}</span>
                            <a-tag v-if="record.is_featured" color="gold" size="small">Featured</a-tag>
                            <a-tag v-if="record.product_type === 'DIGITAL'" color="purple" size="small">Digital</a-tag>
                        </div>
                    </div>
                </div>
            </template>

            <!-- Category -->
            <template v-if="column.key === 'category'">
                <span v-if="record.category" class="category-name">{{ record.category.category_name }}</span>
                <span v-else class="text-muted">Uncategorized</span>
            </template>

            <!-- Price -->
            <template v-if="column.key === 'price'">
                <div class="price-cell">
                    <span v-if="record.sale_price" class="sale-price">
                        {{ formatCurrency(record.sale_price) }}
                    </span>
                    <span :class="{ 'original-price': record.sale_price, 'base-price': !record.sale_price }">
                        {{ formatCurrency(record.base_price) }}
                    </span>
                </div>
            </template>

            <!-- Stock -->
            <template v-if="column.key === 'stock'">
                <a-tag :color="record.stock_quantity <= 0
                        ? 'red'
                        : record.stock_quantity <= record.low_stock_threshold
                            ? 'orange'
                            : 'green'
                    " class="stock-tag">
                    {{ record.stock_quantity }}
                </a-tag>
            </template>

            <!-- Status -->
            <template v-if="column.key === 'status'">
                <a-switch :checked="record.is_published" checked-children="Published" un-checked-children="Draft"
                    @change="() => emit('togglePublish', record)" />
            </template>

            <!-- Created At -->
            <template v-if="column.key === 'created_at'">
                <span class="date-text">{{ dayjs(record.created_at).format('MMM D, YYYY') }}</span>
            </template>

            <!-- Actions -->
            <template v-if="column.key === 'actions'">
                <a-space :size="4">
                    <a-tooltip title="View">
                        <a-button type="text" size="small" @click="emit('view', record.id)">
                            <template #icon>
                                <EyeOutlined />
                            </template>
                        </a-button>
                    </a-tooltip>
                    <a-tooltip title="Edit">
                        <a-button type="text" size="small" @click="emit('edit', record.id)">
                            <template #icon>
                                <EditOutlined />
                            </template>
                        </a-button>
                    </a-tooltip>
                    <a-tooltip title="Duplicate">
                        <a-button type="text" size="small" @click="emit('duplicate', record)">
                            <template #icon>
                                <CopyOutlined />
                            </template>
                        </a-button>
                    </a-tooltip>
                    <a-tooltip title="Delete">
                        <a-button type="text" size="small" danger @click="emit('delete', record.id)">
                            <template #icon>
                                <DeleteOutlined />
                            </template>
                        </a-button>
                    </a-tooltip>
                </a-space>
            </template>
        </template>
    </a-table>
</template>

<style scoped>
.product-cell {
    display: flex;
    align-items: center;
    gap: 16px;
}

.product-avatar {
    background: linear-gradient(135deg, oklch(0.7 0.15 195) 0%, oklch(0.65 0.18 210) 100%);
    flex-shrink: 0;
    border-radius: 8px;
    font-size: 20px;
    font-weight: 600;
}

.product-avatar :deep(img) {
    object-fit: cover;
}

.product-info {
    flex: 1;
    min-width: 0;
}

.product-name {
    font-weight: 600;
    font-size: 15px;
    color: var(--foreground);
    margin-bottom: 6px;
    line-height: 1.4;
}

.product-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.sku {
    font-size: 13px;
    color: var(--muted-foreground);
    font-family: 'Courier New', monospace;
}

.category-name {
    color: var(--foreground);
    font-weight: 500;
}

.price-cell {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
}

.sale-price {
    font-weight: 700;
    font-size: 16px;
    color: oklch(0.75 0.17 145);
}

.base-price {
    font-weight: 600;
    font-size: 15px;
    color: var(--foreground);
}

.original-price {
    text-decoration: line-through;
    color: var(--muted-foreground);
    font-size: 13px;
}

.stock-tag {
    font-weight: 600;
    font-size: 14px;
    padding: 4px 12px;
}

.date-text {
    color: var(--muted-foreground);
    font-size: 14px;
}

.text-muted {
    color: var(--muted-foreground);
    font-style: italic;
}
</style>
