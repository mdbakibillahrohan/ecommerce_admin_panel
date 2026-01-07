<template>
    <div class="page-header">
        <div class="header-content">
            <div class="title-section">
                <div class="title-wrapper">
                    <a-button v-if="showBack" type="text" class="back-btn" @click="$emit('back')">
                        <template #icon>
                            <ArrowLeftOutlined />
                        </template>
                    </a-button>
                    <div class="title-text">
                        <div class="main-title">
                            <h1 class="page-title">{{ title }}</h1>
                            <span v-if="count !== undefined" class="item-count">{{ count }}</span>
                        </div>
                        <slot name="subtitle">
                            <p v-if="subtitle" class="page-subtitle">{{ subtitle }}</p>
                        </slot>
                    </div>
                </div>
            </div>
            <div class="action-section">
                <slot name="actions"></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ArrowLeftOutlined } from '@ant-design/icons-vue'

interface Props {
    title: string
    subtitle?: string
    count?: number | string
    showBack?: boolean
}

defineProps<Props>()
defineEmits(['back'])
</script>

<style scoped>
.page-header {
    margin-bottom: 24px;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 20px;
}

.title-wrapper {
    display: flex;
    align-items: flex-start;
    gap: 16px;
}

.back-btn {
    height: 40px;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: var(--muted);
    color: var(--foreground);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.back-btn:hover {
    background: var(--accent);
    transform: translateX(-4px);
}

.main-title {
    display: flex;
    align-items: center;
    gap: 12px;
}

.page-title {
    font-size: 32px;
    font-weight: 700;
    color: var(--foreground);
    margin: 0;
    line-height: 1.2;
}

.item-count {
    background: var(--muted);
    color: var(--muted-foreground);
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
}

.page-subtitle {
    font-size: 15px;
    color: var(--muted-foreground);
    margin: 4px 0 0 0;
}

@media (max-width: 640px) {
    .header-content {
        flex-direction: column;
        gap: 16px;
    }
}
</style>
