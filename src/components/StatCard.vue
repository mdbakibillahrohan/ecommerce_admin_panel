<script setup lang="ts">
interface Props {
    label: string
    value: string | number
    icon?: string
    color?: string
}

const props = defineProps<Props>()
</script>

<template>
    <div class="stat-item">
        <div v-if="icon" class="stat-icon" :style="{ color: color || 'oklch(0.65 0.25 195)' }">
            <component :is="`${icon}-outlined`" />
        </div>
        <div class="stat-content">
            <div class="stat-label">{{ label }}</div>
            <div class="stat-value">{{ value }}</div>
        </div>
    </div>
</template>

<style scoped>
.stat-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
}

.stat-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    background: var(--accent);
    border-radius: 50%;
}

.stat-content {
    flex: 1;
}

.stat-label {
    font-size: 13px;
    color: var(--muted-foreground);
    margin-bottom: 4px;
}

.stat-value {
    font-size: 24px;
    font-weight: 700;
    color: var(--foreground);
}
</style>
