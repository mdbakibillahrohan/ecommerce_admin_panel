<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import type { TableColumnType } from 'ant-design-vue'
import TableSkeleton from '../skeletons/TableSkeleton.vue'

interface Props {
  columns: TableColumnType<any>[]
  dataSource: any[]
  loading?: boolean
  showSkeleton?: boolean
  skeletonRows?: number
}

withDefaults(defineProps<Props>(), {
  loading: false,
  showSkeleton: true,
  skeletonRows: 10
})

// Define slots to make them available in the template
defineSlots<{
  bodyCell(props: { column: TableColumnType<any>; record: any; text: any; index: number }): any
  [key: string]: any
}>()
</script>

<template>
  <div class="common-table-wrapper">
    <TableSkeleton v-if="loading && showSkeleton" :columns="columns.length" :rows="skeletonRows" />
    <a-table v-else v-bind="$attrs" :columns="columns" :data-source="dataSource" :loading="loading && !showSkeleton"
      class="common-table">
      <!-- Pass through all slots -->
      <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps"></slot>
      </template>

      <!-- Default body cell handling if needed, or just let slots pass through -->
      <template #bodyCell="bodyCellProps">
        <slot name="bodyCell" v-bind="bodyCellProps"></slot>
      </template>
    </a-table>
  </div>
</template>



<style scoped>
.common-table-wrapper {
  width: 100%;
}

.common-table :deep(.ant-table) {
  background: var(--card);
  border-radius: 12px;
}

.common-table :deep(.ant-table-thead > tr > th) {
  background: var(--muted);
  color: var(--muted-foreground);
  font-weight: 600;
  border-bottom: 1px solid var(--border);
}

.common-table :deep(.ant-table-tbody > tr > td) {
  border-bottom: 1px solid var(--border);
}

.common-table :deep(.ant-table-tbody > tr:hover > td) {
  background: var(--muted);
}
</style>
