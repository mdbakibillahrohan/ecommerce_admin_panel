<script setup lang="ts">
interface Props {
    label: string
    value: string | number
    trend?: 'up' | 'down'
    trendValue?: number
}

const props = defineProps<Props>()
</script>

<template>
    <div class="metric-card">
        <div class="metric-label">{{ label }}</div>
        <div class="metric-value">{{ value }}</div>
        <div v-if="trend && trendValue" class="metric-trend" :class="trend">
            <component :is="trend === 'up' ? 'arrow-up-outlined' : 'arrow-down-outlined'" />
            {{ trendValue }}%
        </div>
    </div>
</template>

<script setup lang="ts">
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons-vue'
</script>

<style scoped>
.metric-card {
    padding: 20px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
}

.metric-label {
    font-size: 14px;
    color: var(--muted-foreground);
    margin-bottom: 8px;
}

.metric-value {
    font-size: 32px;
    font-weight: 700;
    color: var(--foreground);
    margin-bottom: 8px;
}

.metric-trend {
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;
}

.metric-trend.up {
    color: #52c41a;
}

.metric-trend.down {
    color: #ff4d4f;
}
</style>
