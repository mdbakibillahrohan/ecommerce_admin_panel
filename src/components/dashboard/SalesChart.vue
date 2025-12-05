<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components'

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
])

interface SalesDataPoint {
  date: string
  orders: number
  revenue: number
}

interface Props {
  data: SalesDataPoint[]
}

const props = defineProps<Props>()

const option = computed(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#e8e8e8',
    borderWidth: 1,
    textStyle: {
      color: '#262626',
    },
    formatter: (params: any) => {
      const date = params[0].axisValue
      let html = `<div style="font-weight: 600; margin-bottom: 8px;">${date}</div>`
      params.forEach((param: any) => {
        const value = param.seriesName === 'Revenue' 
          ? `৳${param.value.toLocaleString()}`
          : param.value
        html += `
          <div style="display: flex; align-items: center; gap: 8px; margin: 4px 0;">
            <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${param.color};"></span>
            <span>${param.seriesName}: <strong>${value}</strong></span>
          </div>
        `
      })
      return html
    },
  },
  legend: {
    data: ['Revenue', 'Orders'],
    bottom: 0,
    itemWidth: 24,
    itemHeight: 14,
    textStyle: {
      color: '#8c8c8c',
    },
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '15%',
    top: '10%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: props.data.map(d => d.date),
    axisLine: {
      lineStyle: {
        color: '#e8e8e8',
      },
    },
    axisLabel: {
      color: '#8c8c8c',
      fontSize: 12,
    },
    axisTick: {
      show: false,
    },
  },
  yAxis: [
    {
      type: 'value',
      name: 'Revenue',
      position: 'left',
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0',
          type: 'dashed',
        },
      },
      axisLabel: {
        color: '#8c8c8c',
        fontSize: 12,
        formatter: (value: number) => {
          if (value >= 1000) {
            return `৳${(value / 1000).toFixed(0)}k`
          }
          return `৳${value}`
        },
      },
    },
    {
      type: 'value',
      name: 'Orders',
      position: 'right',
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        color: '#8c8c8c',
        fontSize: 12,
      },
    },
  ],
  series: [
    {
      name: 'Revenue',
      type: 'line',
      yAxisIndex: 0,
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        width: 3,
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: '#667eea' },
            { offset: 1, color: '#764ba2' },
          ],
        },
      },
      itemStyle: {
        color: '#667eea',
        borderWidth: 2,
        borderColor: '#fff',
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(102, 126, 234, 0.25)' },
            { offset: 1, color: 'rgba(102, 126, 234, 0)' },
          ],
        },
      },
      data: props.data.map(d => d.revenue),
    },
    {
      name: 'Orders',
      type: 'line',
      yAxisIndex: 1,
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        width: 3,
        color: '#52c41a',
      },
      itemStyle: {
        color: '#52c41a',
        borderWidth: 2,
        borderColor: '#fff',
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(82, 196, 26, 0.15)' },
            { offset: 1, color: 'rgba(82, 196, 26, 0)' },
          ],
        },
      },
      data: props.data.map(d => d.orders),
    },
  ],
}))
</script>

<template>
  <div class="sales-chart">
    <v-chart v-if="data.length > 0" :option="option" autoresize style="height: 300px" />
    <a-empty v-else description="No sales data available" />
  </div>
</template>

<style scoped>
.sales-chart {
  width: 100%;
  min-height: 300px;
}
</style>
