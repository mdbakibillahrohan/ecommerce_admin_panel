<template>
    <div class="stats-grid">
        <template v-if="loading">
            <StatCardSkeleton v-for="i in skeletonCount" :key="i" />
        </template>
        <template v-else>
            <div v-for="(stat, index) in stats" :key="index" class="stat-card" :class="stat.type">
                <div v-if="stat.icon" class="stat-icon" :style="stat.iconStyle">
                    <component :is="stat.icon" />
                </div>
                <div class="stat-content">
                    <div class="stat-label">{{ stat.label }}</div>
                    <div class="stat-value">{{ stat.value }}</div>
                    <div v-if="stat.trend" class="stat-trend" :class="stat.trend.type">
                        <span class="trend-icon">{{ stat.trend.type === 'up' ? '↑' : '↓' }}</span>
                        <span class="trend-value">{{ stat.trend.value }}%</span>
                        <span class="trend-label">{{ stat.trend.label }}</span>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import type { StyleValue, Component } from 'vue'
import StatCardSkeleton from '../skeletons/StatCardSkeleton.vue'

interface Stat {
    label: string
    value: string | number
    icon?: Component
    iconStyle?: StyleValue
    type?: string
    trend?: {
        value: number | string
        type: 'up' | 'down'
        label?: string
    }
}

interface Props {
    stats: Stat[]
    loading?: boolean
    skeletonCount?: number
}

withDefaults(defineProps<Props>(), {
    loading: false,
    skeletonCount: 4
})
</script>

<style scoped>
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
    margin-bottom: 24px;
}

.stat-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 20px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: white;
    flex-shrink: 0;
}

.stat-content {
    flex: 1;
    min-width: 0;
}

.stat-label {
    font-size: 14px;
    font-weight: 500;
    color: var(--muted-foreground);
    margin-bottom: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.stat-value {
    font-size: 28px;
    font-weight: 700;
    color: var(--foreground);
    line-height: 1;
}

.stat-trend {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 8px;
    font-size: 13px;
    font-weight: 600;
}

.stat-trend.up {
    color: oklch(0.7 0.18 145);
}

.stat-trend.down {
    color: oklch(0.65 0.25 20);
}

.trend-label {
    color: var(--muted-foreground);
    font-weight: 400;
    margin-left: 2px;
}

@media (max-width: 640px) {
    .stats-grid {
        grid-template-columns: 1fr;
    }
}
</style>
