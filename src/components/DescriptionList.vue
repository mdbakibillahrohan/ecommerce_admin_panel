<script setup lang="ts">
interface Props {
    items: Array<{ label: string; value: string | number; span?: number }>
    column?: number
}

const props = withDefaults(defineProps<Props>(), {
    column: 3,
})
</script>

<template>
    <a-descriptions :column="column" bordered>
        <a-descriptions-item v-for="(item, index) in items" :key="index" :label="item.label" :span="item.span || 1">
            {{ item.value }}
        </a-descriptions-item>
    </a-descriptions>
</template>
