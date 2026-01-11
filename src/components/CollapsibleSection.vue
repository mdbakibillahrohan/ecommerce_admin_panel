<script setup lang="ts">
interface Props {
    title: string
    collapsed?: boolean
}

interface Emits {
    (e: 'toggle'): void
}

const props = withDefaults(defineProps<Props>(), {
    collapsed: false,
})

const emit = defineEmits<Emits>()
</script>

<template>
    <a-collapse v-model:active-key="collapsed ? [] : ['1']" @change="emit('toggle')">
        <a-collapse-panel key="1" :header="title">
            <slot></slot>
        </a-collapse-panel>
    </a-collapse>
</template>
