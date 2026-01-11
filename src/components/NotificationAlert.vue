<script setup lang="ts">
interface Props {
    message: string
    type?: 'success' | 'error' | 'warning' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
    type: 'info',
})
</script>

<template>
    <a-alert :message="message" :type="type" show-icon closable class="notification-alert" />
</template>

<style scoped>
.notification-alert {
    margin-bottom: 16px;
    border-radius: 8px;
}
</style>
