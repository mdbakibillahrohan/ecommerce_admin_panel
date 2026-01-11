<script setup lang="ts">
interface Props {
    title: string
    bordered?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    bordered: true,
})
</script>

<template>
    <a-card :title="title" :bordered="bordered" class="content-card">
        <slot></slot>
    </a-card>
</template>

<style scoped>
.content-card {
    border-radius: 12px;
    margin-bottom: 16px;
}
</style>
