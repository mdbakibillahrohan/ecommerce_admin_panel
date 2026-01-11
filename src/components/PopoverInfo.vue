<script setup lang="ts">
interface Props {
    title: string
    content: string
    type?: 'info' | 'success' | 'warning' | 'error'
}

const props = withDefaults(defineProps<Props>(), {
    type: 'info',
})

interface Emits {
    (e: 'close'): void
}

const emit = defineEmits<Emits>()
</script>

<template>
    <a-popover :title="title" trigger="click">
        <template #content>
            <div style="max-width: 300px">{{ content }}</div>
        </template>
        <slot></slot>
    </a-popover>
</template>
