<script setup lang="ts">
interface Props {
    text: string
    maxLength?: number
}

const props = withDefaults(defineProps<Props>(), {
    maxLength: 100,
})

function truncate(text: string, length: number) {
    if (text.length <= length) return text
    return text.slice(0, length) + '...'
}
</script>

<template>
    <span :title="text">{{ truncate(text, maxLength) }}</span>
</template>
