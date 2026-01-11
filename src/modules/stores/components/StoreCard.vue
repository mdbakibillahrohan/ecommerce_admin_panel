<script setup lang="ts">
interface Store {
    id: number
    name: string
    domain: string
    plan: string
    is_active: boolean
    products_count?: number
    orders_count?: number
}

interface Props {
    store: Store
}

interface Emits {
    (e: 'edit'): void
    (e: 'view'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

<template>
    <a-card class="store-card" :bordered="false">
        <div class="store-header">
            <div class="store-info">
                <div class="store-name">{{ store.name }}</div>
                <div class="store-domain">{{ store.domain }}</div>
            </div>
            <a-tag :color="store.is_active ? 'green' : 'default'">
                {{ store.is_active ? 'Active' : 'Inactive' }}
            </a-tag>
        </div>

        <div class="store-plan">
            <span class="plan-label">Plan:</span>
            <span class="plan-value">{{ store.plan }}</span>
        </div>

        <div class="store-stats">
            <div class="stat-item">
                <div class="stat-value">{{ store.products_count || 0 }}</div>
                <div class="stat-label">Products</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">{{ store.orders_count || 0 }}</div>
                <div class="stat-label">Orders</div>
            </div>
        </div>

        <div class="store-actions">
            <a-button type="primary" @click="emit('view')">View Store</a-button>
            <a-button @click="emit('edit')">Edit</a-button>
        </div>
    </a-card>
</template>

<style scoped>
.store-card {
    border: 1px solid var(--border);
    border-radius: 12px;
    transition: all 0.3s ease;
}

.store-card:hover {
    border-color: oklch(0.65 0.25 195);
    box-shadow: 0 4px 12px rgba(13, 148, 136, 0.1);
}

.store-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
}

.store-info {
    flex: 1;
}

.store-name {
    font-size: 18px;
    font-weight: 700;
    color: var(--foreground);
    margin-bottom: 4px;
}

.store-domain {
    font-size: 14px;
    color: var(--muted-foreground);
}

.store-plan {
    margin-bottom: 16px;
    padding: 8px 12px;
    background: var(--accent);
    border-radius: 6px;
}

.plan-label {
    font-weight: 600;
    color: var(--muted-foreground);
    margin-right: 8px;
}

.plan-value {
    font-weight: 700;
    color: oklch(0.65 0.25 195);
}

.store-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 16px;
}

.stat-item {
    text-align: center;
}

.stat-value {
    font-size: 24px;
    font-weight: 700;
    color: var(--foreground);
}

.stat-label {
    font-size: 13px;
    color: var(--muted-foreground);
    margin-top: 4px;
}

.store-actions {
    display: flex;
    gap: 12px;
}
</style>
