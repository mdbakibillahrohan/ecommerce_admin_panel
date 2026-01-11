<script setup lang="ts">
interface Props {
    count: number
    color?: string
    showZero?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    color: '#ff4d4f',
    showZero: false,
})
</script>

<template>
    <a-badge :count="count" :color="color" :show-zero="showZero">
        <slot></slot>
    </a-badge>
</template>
