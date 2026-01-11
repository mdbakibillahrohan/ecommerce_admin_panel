<script setup lang="ts">
interface PaymentGateway {
    id: string
    name: string
    enabled: boolean
    icon?: string
    description: string
}

interface Props {
    gateway: PaymentGateway
}

interface Emits {
    (e: 'configure'): void
    (e: 'toggle'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

<template>
    <a-card class="gateway-card" :bordered="false">
        <div class="gateway-header">
            <div class="gateway-info">
                <div v-if="gateway.icon" class="gateway-icon">
                    <img :src="gateway.icon" :alt="gateway.name" />
                </div>
                <div>
                    <div class="gateway-name">{{ gateway.name }}</div>
                    <div class="gateway-description">{{ gateway.description }}</div>
                </div>
            </div>
            <a-switch v-model:checked="gateway.enabled" @change="emit('toggle')" />
        </div>

        <div class="gateway-actions">
            <a-button type="primary" @click="emit('configure')">Configure</a-button>
        </div>
    </a-card>
</template>

<style scoped>
.gateway-card {
    border: 1px solid var(--border);
    border-radius: 12px;
}

.gateway-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
}

.gateway-info {
    display: flex;
    gap: 12px;
    flex: 1;
}

.gateway-icon {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    overflow: hidden;
    background: var(--muted);
    display: flex;
    align-items: center;
    justify-content: center;
}

.gateway-icon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.gateway-name {
    font-size: 16px;
    font-weight: 700;
    color: var(--foreground);
    margin-bottom: 4px;
}

.gateway-description {
    font-size: 14px;
    color: var(--muted-foreground);
}

.gateway-actions {
    display: flex;
    gap: 12px;
}
</style>
