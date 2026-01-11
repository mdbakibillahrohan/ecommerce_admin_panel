<script setup lang="ts">
interface Props {
    title: string
    content?: string
    placement?: 'top' | 'bottom' | 'left' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
    placement: 'top',
})
</script>

<template>
    <a-tooltip :title="title" :placement="placement">
        <template v-if="content" #title>
            <div v-html="content"></div>
        </template>
        <slot></slot>
    </a-tooltip>
</template>
