<template>
  <div class="stat-card-skeleton">
    <a-card :bordered="false" class="skeleton-stat-card">
      <div class="skeleton-stat-content">
        <div class="skeleton-icon">
          <a-skeleton-avatar :active="true" :size="64" shape="square" />
        </div>
        <div class="skeleton-info">
          <a-skeleton-input :active="true" size="small" style="width: 100px; margin-bottom: 8px" />
          <a-skeleton-input :active="true" size="large" style="width: 80px" />
        </div>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
// No props needed for this simple component
</script>

<style scoped>
.stat-card-skeleton {
  width: 100%;
}

.skeleton-stat-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  position: relative;
}

.skeleton-stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
      transparent,
      oklch(from var(--primary) l c h / 0.1),
      transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }

  100% {
    left: 100%;
  }
}

.skeleton-stat-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.skeleton-icon :deep(.ant-skeleton-avatar) {
  border-radius: 16px;
  background: var(--muted) !important;
}

.skeleton-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-info :deep(.ant-skeleton-input) {
  background: var(--muted) !important;
  border-radius: 8px;
}

.skeleton-info :deep(.ant-skeleton-element) {
  display: block;
}

/* Dark mode adjustments */
:global(.dark) .skeleton-stat-card {
  background: var(--card);
  border-color: var(--border);
}

:global(.dark) .skeleton-icon :deep(.ant-skeleton-avatar),
:global(.dark) .skeleton-info :deep(.ant-skeleton-input) {
  background: var(--muted) !important;
}
</style>
