<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components'

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
])

interface OrderStats {
  pending: number
  confirmed: number
  processing: number
  shipped: number
  delivered: number
  cancelled: number
  refunded: number
  totalOrders: number
}

interface Props {
  data?: OrderStats
}

const props = defineProps<Props>()

const statusColors: Record<string, string> = {
  pending: '#faad14',
  confirmed: '#1890ff',
  processing: '#13c2c2',
  shipped: '#722ed1',
  delivered: '#52c41a',
  cancelled: '#ff4d4f',
  refunded: '#fa541c',
}

const chartData = computed(() => {
  if (!props.data) return []
  
  return [
    { name: 'Pending', value: props.data.pending, itemStyle: { color: statusColors.pending } },
    { name: 'Confirmed', value: props.data.confirmed, itemStyle: { color: statusColors.confirmed } },
    { name: 'Processing', value: props.data.processing, itemStyle: { color: statusColors.processing } },
    { name: 'Shipped', value: props.data.shipped, itemStyle: { color: statusColors.shipped } },
    { name: 'Delivered', value: props.data.delivered, itemStyle: { color: statusColors.delivered } },
    { name: 'Cancelled', value: props.data.cancelled, itemStyle: { color: statusColors.cancelled } },
    { name: 'Refunded', value: props.data.refunded, itemStyle: { color: statusColors.refunded } },
  ].filter(item => item.value > 0)
})

const option = computed(() => ({
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#e8e8e8',
    borderWidth: 1,
    textStyle: {
      color: '#262626',
    },
    formatter: (params: any) => {
      return `
        <div style="font-weight: 600; margin-bottom: 4px;">${params.name}</div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${params.color};"></span>
          <span>${params.value} orders (${params.percent.toFixed(1)}%)</span>
        </div>
      `
    },
  },
  legend: {
    orient: 'horizontal',
    bottom: 0,
    itemWidth: 12,
    itemHeight: 12,
    itemGap: 16,
    textStyle: {
      color: '#8c8c8c',
      fontSize: 12,
    },
  },
  series: [
    {
      name: 'Order Status',
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: false,
      label: {
        show: true,
        position: 'center',
        formatter: () => {
          return `{total|${props.data?.totalOrders || 0}}\n{label|Total Orders}`
        },
        rich: {
          total: {
            fontSize: 28,
            fontWeight: 'bold',
            color: '#262626',
            lineHeight: 36,
          },
          label: {
            fontSize: 13,
            color: '#8c8c8c',
            lineHeight: 20,
          },
        },
      },
      emphasis: {
        label: {
          show: true,
        },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.2)',
        },
      },
      labelLine: {
        show: false,
      },
      data: chartData.value,
    },
  ],
}))
</script>

<template>
  <div class="order-status-chart">
    <v-chart v-if="chartData.length > 0" :option="option" autoresize style="height: 300px" />
    <a-empty v-else description="No order data available" />
  </div>
</template>

<style scoped>
.order-status-chart {
  width: 100%;
  min-height: 300px;
}
</style>
