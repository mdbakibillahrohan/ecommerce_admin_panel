<script setup lang="ts">
interface Props {
    title: string
    description?: string
}

const props = defineProps<Props>()
</script>

<template>
    <div class="page-header">
        <div class="header-content">
            <h1 class="header-title">{{ title }}</h1>
            <p v-if="description" class="header-description">{{ description }}</p>
        </div>
        <div class="header-actions">
            <slot name="actions"></slot>
        </div>
    </div>
</template>

<style scoped>
.page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 2px solid var(--border);
}

.header-content {
    flex: 1;
}

.header-title {
    font-size: 28px;
    font-weight: 700;
    color: var(--foreground);
    margin: 0 0 8px 0;
}

.header-description {
    font-size: 14px;
    color: var(--muted-foreground);
    margin: 0;
}

.header-actions {
    display: flex;
    gap: 12px;
    align-items: center;
}

@media (max-width: 768px) {
    .page-header {
        flex-direction: column;
        gap: 16px;
    }

    .header-actions {
        width: 100%;
        justify-content: flex-end;
    }
}
</style>
