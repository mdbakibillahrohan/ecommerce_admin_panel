<script setup lang="ts">
import type { Dayjs } from 'dayjs'

interface Props {
    value?: Dayjs | null
    format?: string
    showTime?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    format: 'YYYY-MM-DD',
    showTime: false,
})

interface Emits {
    (e: 'update:value', value: Dayjs | null): void
}

const emit = defineEmits<Emits>()

function handleChange(date: Dayjs | null) {
    emit('update:value', date)
}
</script>

<template>
    <a-date-picker :value="value" :format="format" :show-time="showTime" size="large" @change="handleChange" />
</template>
