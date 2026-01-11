<script setup lang="ts">
interface Props {
    steps: Array<{ title: string; description?: string; status?: 'wait' | 'process' | 'finish' | 'error' }>
    current: number
}

const props = defineProps<Props>()
</script>

<template>
    <a-steps :current="current">
        <a-step v-for="(step, index) in steps" :key="index" :title="step.title" :description="step.description"
            :status="step.status" />
    </a-steps>
</template>

<style scoped>
.ant-steps {
    margin-bottom: 24px;
}
</style>
