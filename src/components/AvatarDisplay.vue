<script setup lang="ts">
interface Props {
    name: string
    size?: number
    shape?: 'circle' | 'square'
    src?: string
}

const props = withDefaults(defineProps<Props>(), {
    size: 40,
    shape: 'circle',
})

function getInitials(name: string) {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}
</script>

<template>
    <a-avatar :size="size" :shape="shape" :src="src">
        {{ getInitials(name) }}
    </a-avatar>
</template>
