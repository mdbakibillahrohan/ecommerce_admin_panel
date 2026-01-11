<script setup lang="ts">
interface Props {
    loading?: boolean
    text?: string
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
    text: 'Loading...',
})
</script>

<template>
    <div v-if="loading" class="loading-spinner">
        <a-spin size="large" :tip="text" />
    </div>
</template>

<style scoped>
.loading-spinner {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    width: 100%;
}
</style>
