<script setup lang="ts">
interface Props {
    src: string
    alt?: string
    width?: number | string
    height?: number | string
    fallback?: string
}

const props = withDefaults(defineProps<Props>(), {
    alt: 'Image',
    fallback: 'https://via.placeholder.com/150',
})
</script>

<template>
    <a-image :src="src" :alt="alt" :width="width" :height="height" :fallback="fallback" />
</template>
