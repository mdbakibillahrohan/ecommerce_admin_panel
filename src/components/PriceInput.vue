<script setup lang="ts">
interface Props {
    value: number
    min?: number
    max?: number
    step?: number
    prefix?: string
    suffix?: string
}

const props = withDefaults(defineProps<Props>(), {
    min: 0,
    max: 100,
    step: 1,
})

interface Emits {
    (e: 'update:value', value: number): void
}

const emit = defineEmits<Emits>()

function handleChange(value: number | null) {
    if (value !== null) {
        emit('update:value', value)
    }
}
</script>

<template>
    <a-input-number :value="value" :min="min" :max="max" :step="step" :prefix="prefix" :suffix="suffix" size="large"
        style="width: 100%" @change="handleChange" />
</template>
