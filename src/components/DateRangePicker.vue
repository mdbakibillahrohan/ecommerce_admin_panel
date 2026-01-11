<script setup lang="ts">
import { ref } from 'vue'
import type { Dayjs } from 'dayjs'

interface Props {
    modelValue?: [Dayjs, Dayjs] | null
}

interface Emits {
    (e: 'update:modelValue', value: [Dayjs, Dayjs] | null): void
    (e: 'change', value: [Dayjs, Dayjs] | null): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localValue = ref(props.modelValue)

function handleChange(dates: [Dayjs, Dayjs] | null) {
    localValue.value = dates
    emit('update:modelValue', dates)
    emit('change', dates)
}
</script>

<template>
    <a-range-picker v-model:value="localValue" size="large" @change="handleChange" />
</template>
