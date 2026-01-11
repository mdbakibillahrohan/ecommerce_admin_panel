<script setup lang="ts">
interface Props {
    value: number
    min?: number
    max?: number
    marks?: Record<number, string>
}

const props = withDefaults(defineProps<Props>(), {
    min: 0,
    max: 100,
})

interface Emits {
    (e: 'update:value', value: number): void
}

const emit = defineEmits<Emits>()

function handleChange(value: number) {
    emit('update:value', value)
}
</script>

<template>
    <a-slider :value="value" :min="min" :max="max" :marks="marks" @change="handleChange" />
</template>
