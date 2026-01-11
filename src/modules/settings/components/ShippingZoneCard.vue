<script setup lang="ts">
interface ShippingZone {
    id: number
    name: string
    countries: string[]
    methods: ShippingMethod[]
}

interface ShippingMethod {
    id: number
    name: string
    type: string
    cost: number
    enabled: boolean
}

interface Props {
    zone: ShippingZone
}

interface Emits {
    (e: 'edit'): void
    (e: 'delete'): void
    (e: 'addMethod'): void
    (e: 'editMethod', method: ShippingMethod): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

<template>
    <a-card class="zone-card" :bordered="false">
        <template #title>
            <div class="zone-header">
                <span>{{ zone.name }}</span>
                <a-space>
                    <a-button size="small" @click="emit('edit')">Edit</a-button>
                    <a-button size="small" danger @click="emit('delete')">Delete</a-button>
                </a-space>
            </div>
        </template>

        <div class="zone-countries">
            <div class="section-label">Countries:</div>
            <a-tag v-for="country in zone.countries" :key="country">{{ country }}</a-tag>
        </div>

        <a-divider />

        <div class="zone-methods">
            <div class="section-header">
                <div class="section-label">Shipping Methods</div>
                <a-button size="small" @click="emit('addMethod')">
                    <template #icon>
                        <plus-outlined />
                    </template>
                    Add Method
                </a-button>
            </div>

            <div v-for="method in zone.methods" :key="method.id" class="method-item">
                <div class="method-info">
                    <div class="method-name">{{ method.name }}</div>
                    <div class="method-type">{{ method.type }}</div>
                </div>
                <div class="method-cost">${{ method.cost.toFixed(2) }}</div>
                <a-switch v-model:checked="method.enabled" size="small" />
                <a-button size="small" @click="emit('editMethod', method)">Edit</a-button>
            </div>
        </div>
    </a-card>
</template>

<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue'
</script>

<style scoped>
.zone-card {
    border: 1px solid var(--border);
    border-radius: 12px;
    margin-bottom: 16px;
}

.zone-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.zone-countries {
    margin-bottom: 16px;
}

.section-label {
    font-weight: 600;
    color: var(--muted-foreground);
    margin-bottom: 8px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.method-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px;
    background: var(--accent);
    border-radius: 8px;
    margin-bottom: 8px;
}

.method-info {
    flex: 1;
}

.method-name {
    font-weight: 600;
    color: var(--foreground);
}

.method-type {
    font-size: 13px;
    color: var(--muted-foreground);
}

.method-cost {
    font-weight: 700;
    color: oklch(0.65 0.25 195);
}
</style>
