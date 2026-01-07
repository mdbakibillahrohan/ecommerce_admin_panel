<template>
  <div class="card-grid-skeleton">
    <div class="skeleton-grid">
      <div v-for="i in count" :key="i" class="skeleton-card">
        <div class="skeleton-image"></div>
        <div class="skeleton-content">
          <div class="skeleton-title"></div>
          <div class="skeleton-text"></div>
          <div class="skeleton-text short"></div>
        </div>
      </div>
    </div>

    <div class="skeleton-pagination">
      <div class="skeleton-pagination-bar"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  count?: number
  columns?: number
}

withDefaults(defineProps<Props>(), {
  count: 8,
  columns: 4,
})
</script>

<style scoped>
.card-grid-skeleton {
  width: 100%;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.skeleton-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.skeleton-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -10px oklch(from var(--primary) l c h / 0.2);
}

.skeleton-image {
  width: 100%;
  height: 200px;
  background: linear-gradient(90deg,
      var(--muted) 0%,
      var(--muted-foreground) 20%,
      var(--muted) 40%,
      var(--muted) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  opacity: 0.1;
}

.skeleton-content {
  padding: 16px;
}

.skeleton-title {
  height: 20px;
  background: linear-gradient(90deg,
      var(--muted) 0%,
      var(--muted-foreground) 20%,
      var(--muted) 40%,
      var(--muted) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 12px;
  opacity: 0.15;
}

.skeleton-text {
  height: 14px;
  background: linear-gradient(90deg,
      var(--muted) 0%,
      var(--muted-foreground) 20%,
      var(--muted) 40%,
      var(--muted) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 8px;
  opacity: 0.12;
}

.skeleton-text.short {
  width: 60%;
}

.skeleton-pagination {
  display: flex;
  justify-content: center;
  padding: 24px 0;
}

.skeleton-pagination-bar {
  width: 300px;
  height: 32px;
  background: linear-gradient(90deg,
      var(--muted) 0%,
      var(--muted-foreground) 20%,
      var(--muted) 40%,
      var(--muted) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 6px;
  opacity: 0.15;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

@media (max-width: 768px) {
  .skeleton-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }

  .skeleton-image {
    height: 160px;
  }

  .skeleton-content {
    padding: 12px;
  }

  .skeleton-pagination-bar {
    width: 200px;
  }
}
</style>
