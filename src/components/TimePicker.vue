<script setup lang="ts">
import type { Dayjs } from 'dayjs'

interface Props {
    value?: Dayjs | null
    format?: string
}

const props = withDefaults(defineProps<Props>(), {
    format: 'HH:mm:ss',
})

interface Emits {
    (e: 'update:value', value: Dayjs | null): void
}

const emit = defineEmits<Emits>()

function handleChange(time: Dayjs | null) {
    emit('update:value', time)
}
</script>

<template>
    <a-time-picker :value="value" :format="format" size="large" @change="handleChange" />
</template>
