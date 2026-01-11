<script setup lang="ts">
interface TaxZone {
    id: number
    name: string
    country: string
    state?: string
    zip_code?: string
    tax_rate: number
    enabled: boolean
}

interface Props {
    zone: TaxZone
}

interface Emits {
    (e: 'edit'): void
    (e: 'delete'): void
    (e: 'toggle'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

<template>
    <a-card class="tax-zone-card" :bordered="false">
        <div class="zone-header">
            <div class="zone-info">
                <div class="zone-name">{{ zone.name }}</div>
                <div class="zone-location">
                    {{ zone.country }}{{ zone.state ? `, ${zone.state}` : '' }}{{ zone.zip_code ? ` ${zone.zip_code}` :
                    '' }}
                </div>
            </div>
            <a-switch v-model:checked="zone.enabled" @change="emit('toggle')" />
        </div>

        <div class="zone-rate">
            <span class="rate-label">Tax Rate:</span>
            <span class="rate-value">{{ zone.tax_rate }}%</span>
        </div>

        <div class="zone-actions">
            <a-button size="small" @click="emit('edit')">Edit</a-button>
            <a-button size="small" danger @click="emit('delete')">Delete</a-button>
        </div>
    </a-card>
</template>

<style scoped>
.tax-zone-card {
    border: 1px solid var(--border);
    border-radius: 12px;
    margin-bottom: 16px;
}

.zone-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
}

.zone-info {
    flex: 1;
}

.zone-name {
    font-size: 16px;
    font-weight: 700;
    color: var(--foreground);
    margin-bottom: 4px;
}

.zone-location {
    font-size: 14px;
    color: var(--muted-foreground);
}

.zone-rate {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    padding: 12px;
    background: var(--accent);
    border-radius: 8px;
}

.rate-label {
    font-weight: 600;
    color: var(--muted-foreground);
}

.rate-value {
    font-size: 20px;
    font-weight: 700;
    color: oklch(0.65 0.25 195);
}

.zone-actions {
    display: flex;
    gap: 12px;
}
</style>
