<template>
  <div class="table-skeleton">
    <a-card :bordered="false" class="skeleton-card">
      <!-- Table Header -->
      <div class="skeleton-header">
        <a-skeleton-input :active="true" size="large" style="width: 150px" />
        <div class="skeleton-actions">
          <a-skeleton-button :active="true" size="large" style="width: 100px" />
          <a-skeleton-button :active="true" size="large" style="width: 100px" />
        </div>
      </div>

      <!-- Table Content -->
      <div class="skeleton-table">
        <!-- Header Row -->
        <div class="skeleton-table-header">
          <div v-for="col in columns" :key="col" class="skeleton-table-cell">
            <a-skeleton-input :active="true" size="small" style="width: 80%" />
          </div>
        </div>

        <!-- Data Rows -->
        <div v-for="row in rows" :key="row" class="skeleton-table-row">
          <div v-for="col in columns" :key="col" class="skeleton-table-cell">
            <a-skeleton-input :active="true" size="small" :style="{ width: getRandomWidth() }" />
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="skeleton-pagination">
        <a-skeleton-button :active="true" size="small" style="width: 200px" />
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
interface Props {
  rows?: number
  columns?: number
}

withDefaults(defineProps<Props>(), {
  rows: 5,
  columns: 6,
})

function getRandomWidth() {
  const widths = ['60%', '70%', '80%', '90%']
  return widths[Math.floor(Math.random() * widths.length)]
}
</script>

<style scoped>
.table-skeleton {
  width: 100%;
}

.skeleton-card {
  background: var(--card);
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.skeleton-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 0 24px;
}

.skeleton-actions {
  display: flex;
  gap: 12px;
}

.skeleton-table {
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  background: var(--background);
}

.skeleton-table-header {
  display: grid;
  grid-template-columns: repeat(v-bind(columns), 1fr);
  gap: 16px;
  padding: 16px 24px;
  background: var(--muted);
  border-bottom: 1px solid var(--border);
}

.skeleton-table-row {
  display: grid;
  grid-template-columns: repeat(v-bind(columns), 1fr);
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border);
  transition: background-color 0.2s ease;
}

.skeleton-table-row:hover {
  background: var(--muted);
}

.skeleton-table-row:last-child {
  border-bottom: none;
}

.skeleton-table-cell {
  display: flex;
  align-items: center;
}

.skeleton-pagination {
  display: flex;
  justify-content: flex-end;
  padding: 16px 24px 0;
}

/* Custom shimmer animation for skeleton elements */
:deep(.ant-skeleton-input),
:deep(.ant-skeleton-button) {
  background: linear-gradient(90deg,
      var(--muted) 25%,
      var(--muted-foreground) 50%,
      var(--muted) 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 6px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .skeleton-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .skeleton-actions {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
