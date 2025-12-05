<script setup lang="ts">
import { computed, type Component } from 'vue'

interface Props {
  title: string
  value: number | string
  icon: Component
  color: string
  trend?: number | string
  trendLabel?: string
  isFormatted?: boolean
}

const props = defineProps<Props>()

const formattedValue = computed(() => {
  if (props.isFormatted || typeof props.value === 'string') {
    return props.value
  }
  return new Intl.NumberFormat().format(props.value as number)
})
</script>

<template>
  <a-card :bordered="false" class="stat-card">
    <div class="stat-content">
      <div class="stat-info">
        <p class="stat-title">{{ title }}</p>
        <h3 class="stat-value">{{ formattedValue }}</h3>
        <div v-if="trend !== undefined" class="stat-trend">
          <span class="trend-value">+{{ trend }}</span>
          <span class="trend-label">{{ trendLabel }}</span>
        </div>
      </div>
      <div class="stat-icon" :style="{ background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)` }">
        <component :is="icon" />
      </div>
    </div>
    <div class="stat-decoration" :style="{ background: color }"></div>
  </a-card>
</template>

<style scoped>
.stat-card {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.stat-info {
  flex: 1;
}

.stat-title {
  font-size: 14px;
  color: #8c8c8c;
  margin: 0 0 8px 0;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #262626;
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
}

.trend-value {
  color: #52c41a;
  font-weight: 600;
  font-size: 14px;
}

.trend-label {
  color: #8c8c8c;
  font-size: 13px;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24px;
  flex-shrink: 0;
}

.stat-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  opacity: 0.8;
}
</style>
