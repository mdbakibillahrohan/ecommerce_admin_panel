<script setup lang="ts">
interface Props {
    percentage: number
    status?: 'normal' | 'success' | 'exception'
    showInfo?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    status: 'normal',
    showInfo: true,
})
</script>

<template>
    <a-progress :percent="percentage" :status="status" :show-info="showInfo" />
</template>
