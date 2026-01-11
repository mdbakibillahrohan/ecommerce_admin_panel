<script setup lang="ts">
interface Props {
    message: string
    type?: 'success' | 'info' | 'warning' | 'error'
    duration?: number
}

const props = withDefaults(defineProps<Props>(), {
    type: 'info',
    duration: 3,
})
</script>

<template>
    <div class="toast-notification" :class="type">
        <component
            :is="`${type === 'success' ? 'check-circle' : type === 'error' ? 'close-circle' : 'info-circle'}-outlined`"
            class="toast-icon" />
        <div class="toast-message">{{ message }}</div>
    </div>
</template>

<script setup lang="ts">
import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons-vue'
</script>

<style scoped>
.toast-notification {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 8px;
    background: var(--card);
    border: 1px solid var(--border);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.toast-icon {
    font-size: 20px;
}

.toast-notification.success {
    border-color: #52c41a;
}

.toast-notification.success .toast-icon {
    color: #52c41a;
}

.toast-notification.error {
    border-color: #ff4d4f;
}

.toast-notification.error .toast-icon {
    color: #ff4d4f;
}

.toast-notification.warning {
    border-color: #faad14;
}

.toast-notification.warning .toast-icon {
    color: #faad14;
}

.toast-notification.info {
    border-color: #1890ff;
}

.toast-notification.info .toast-icon {
    color: #1890ff;
}

.toast-message {
    font-size: 14px;
    color: var(--foreground);
}
</style>
