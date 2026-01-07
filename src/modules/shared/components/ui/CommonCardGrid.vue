<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import CardGridSkeleton from '../skeletons/CardGridSkeleton.vue'

interface Props {
  dataSource: any[]
  loading?: boolean
  skeletonCount?: number
}

withDefaults(defineProps<Props>(), {
  loading: false,
  skeletonCount: 8
})
</script>

<template>
  <div class="common-card-grid-wrapper">
    <CardGridSkeleton v-if="loading" :count="skeletonCount" />
    <div v-else class="common-card-grid">
      <div v-for="(item, index) in dataSource" :key="index">
        <slot name="item" :item="item" :index="index"></slot>
      </div>
    </div>
  </div>
</template>



<style scoped>
.common-card-grid-wrapper {
  width: 100%;
}

.common-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

@media (max-width: 640px) {
  .common-card-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }
}
</style>
