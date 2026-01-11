<script setup lang="ts">
interface Props {
    message?: string
    icon?: string
}

const props = withDefaults(defineProps<Props>(), {
    message: 'No data available',
    icon: 'inbox',
})
</script>

<template>
    <div class="empty-state">
        <component :is="`${icon}-outlined`" class="empty-icon" />
        <div class="empty-message">{{ message }}</div>
        <div class="empty-actions">
            <slot name="actions"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { InboxOutlined } from '@ant-design/icons-vue'
</script>

<style scoped>
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    padding: 48px 24px;
}

.empty-icon {
    font-size: 64px;
    color: var(--muted-foreground);
    margin-bottom: 16px;
}

.empty-message {
    font-size: 16px;
    color: var(--muted-foreground);
    margin-bottom: 24px;
}

.empty-actions {
    display: flex;
    gap: 12px;
}
</style>
