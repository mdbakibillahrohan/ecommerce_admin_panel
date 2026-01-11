<script setup lang="ts">
interface Props {
    title: string
    items: Array<{ label: string; value: string | number }>
}

const props = defineProps<Props>()
</script>

<template>
    <a-card :title="title" :bordered="false" class="info-card">
        <a-descriptions :column="1" bordered>
            <a-descriptions-item v-for="item in items" :key="item.label" :label="item.label">
                {{ item.value }}
            </a-descriptions-item>
        </a-descriptions>
    </a-card>
</template>

<style scoped>
.info-card {
    border: 1px solid var(--border);
    border-radius: 12px;
}
</style>
