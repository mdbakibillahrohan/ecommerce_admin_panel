<script setup lang="ts">
interface ChartData {
    labels: string[]
    values: number[]
}

interface Props {
    data: ChartData
    title: string
    type?: 'line' | 'bar'
}

const props = withDefaults(defineProps<Props>(), {
    type: 'line',
})
</script>

<template>
    <a-card :title="title" :bordered="false" class="chart-card">
        <div class="chart-placeholder">
            <div class="chart-info">
                Chart component placeholder for {{ type }} chart
            </div>
            <div class="chart-data">
                Data points: {{ data.values.length }}
            </div>
        </div>
    </a-card>
</template>

<style scoped>
.chart-card {
    border: 1px solid var(--border);
    border-radius: 12px;
}

.chart-placeholder {
    height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: var(--accent);
    border-radius: 8px;
}

.chart-info {
    font-size: 16px;
    font-weight: 600;
    color: var(--foreground);
    margin-bottom: 8px;
}

.chart-data {
    font-size: 14px;
    color: var(--muted-foreground);
}
</style>
