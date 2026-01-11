<script setup lang="ts">
interface Props {
    rating: number
    max?: number
    allowHalf?: boolean
    disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    max: 5,
    allowHalf: true,
    disabled: false,
})

interface Emits {
    (e: 'update:rating', value: number): void
}

const emit = defineEmits<Emits>()

function handleChange(value: number) {
    emit('update:rating', value)
}
</script>

<template>
    <a-rate :value="rating" :count="max" :allow-half="allowHalf" :disabled="disabled" @change="handleChange" />
</template>
