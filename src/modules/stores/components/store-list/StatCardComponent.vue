<script setup lang="ts">

defineProps({
  type: {
    type: String,
    default: 'total'
  },
  totalStores: {
    type: Number,
    default: 0
  },
  label: {
    type: String,
    default: ''
  },
  icon: {
    type: Object
  }
})


</script>

<template>
  <div :class="'stat-card ' + type">
    <div class="stat-icon">
      <component :is="icon" />
    </div>
    <div class="stat-content">
      <div class="stat-value">{{ totalStores }}</div>
      <div class="stat-label">{{ label }}</div>
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, oklch(0.65 0.2 190) 0%, oklch(0.6 0.18 195) 100%);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  border-color: oklch(0.65 0.2 190);
}

.stat-card.total::before {
  background: linear-gradient(90deg, oklch(0.65 0.2 230) 0%, oklch(0.65 0.2 250) 100%);
}

.stat-card.active::before {
  background: linear-gradient(90deg, oklch(0.7 0.18 145) 0%, oklch(0.72 0.16 165) 100%);
}

.stat-card.inactive::before {
  background: linear-gradient(90deg, oklch(0.7 0.15 45) 0%, oklch(0.72 0.13 60) 100%);
}

.stat-card.new::before {
  background: linear-gradient(90deg, oklch(0.65 0.2 190) 0%, oklch(0.6 0.18 195) 100%);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  background: var(--muted);
  color: var(--muted-foreground);
  transition: all 0.3s ease;
}

.stat-card.total .stat-icon {
  background: oklch(0.65 0.2 230 / 0.15);
  color: oklch(0.65 0.2 230);
}

.stat-card.active .stat-icon {
  background: oklch(0.7 0.18 145 / 0.15);
  color: oklch(0.7 0.18 145);
}

.stat-card.inactive .stat-icon {
  background: oklch(0.7 0.15 45 / 0.15);
  color: oklch(0.7 0.15 45);
}

.stat-card.new .stat-icon {
  background: oklch(0.65 0.2 190 / 0.15);
  color: oklch(0.65 0.2 190);
}

.stat-card:hover .stat-icon {
  transform: scale(1.1) rotate(5deg);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--foreground);
  line-height: 1;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: var(--muted-foreground);
  font-weight: 500;
}
</style>
