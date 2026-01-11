<script setup lang="ts">
import { ref } from 'vue'

interface Props {
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    type?: 'warning' | 'danger' | 'info'
}

interface Emits {
    (e: 'confirm'): void
    (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'warning',
})

const emit = defineEmits<Emits>()

const visible = ref(false)

function show() {
    visible.value = true
}

function hide() {
    visible.value = false
}

function handleConfirm() {
    emit('confirm')
    hide()
}

function handleCancel() {
    emit('cancel')
    hide()
}

defineExpose({ show, hide })
</script>

<template>
    <a-modal v-model:open="visible" :title="title" @ok="handleConfirm" @cancel="handleCancel">
        <template #footer>
            <a-button @click="handleCancel">{{ cancelText }}</a-button>
            <a-button :type="type === 'danger' ? 'primary' : 'default'" :danger="type === 'danger'"
                @click="handleConfirm">
                {{ confirmText }}
            </a-button>
        </template>

        <div class="confirm-content">
            <exclamation-circle-outlined v-if="type === 'warning'" class="confirm-icon warning" />
            <close-circle-outlined v-else-if="type === 'danger'" class="confirm-icon danger" />
            <info-circle-outlined v-else class="confirm-icon info" />
            <div class="confirm-message">{{ message }}</div>
        </div>
    </a-modal>
</template>

<script setup lang="ts">
import { ExclamationCircleOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons-vue'
</script>

<style scoped>
.confirm-content {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 16px 0;
}

.confirm-icon {
    font-size: 24px;
    flex-shrink: 0;
}

.confirm-icon.warning {
    color: #faad14;
}

.confirm-icon.danger {
    color: #ff4d4f;
}

.confirm-icon.info {
    color: #1890ff;
}

.confirm-message {
    font-size: 14px;
    color: var(--foreground);
    line-height: 1.6;
}
</style>
