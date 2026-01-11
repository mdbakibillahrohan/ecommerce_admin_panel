<script setup lang="ts">
interface Props {
    icon?: string
    title: string
    description?: string
    color?: string
}

const props = withDefaults(defineProps<Props>(), {
    color: 'oklch(0.65 0.25 195)',
})
</script>

<template>
    <div class="feature-card">
        <div v-if="icon" class="feature-icon" :style="{ color: color }">
            <component :is="`${icon}-outlined`" />
        </div>
        <div class="feature-content">
            <div class="feature-title">{{ title }}</div>
            <div v-if="description" class="feature-description">{{ description }}</div>
        </div>
    </div>
</template>

<style scoped>
.feature-card {
    display: flex;
    gap: 16px;
    padding: 20px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    transition: all 0.3s ease;
}

.feature-card:hover {
    border-color: oklch(0.65 0.25 195);
    box-shadow: 0 4px 12px rgba(13, 148, 136, 0.1);
}

.feature-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    background: var(--accent);
    border-radius: 12px;
    flex-shrink: 0;
}

.feature-content {
    flex: 1;
}

.feature-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--foreground);
    margin-bottom: 4px;
}

.feature-description {
    font-size: 14px;
    color: var(--muted-foreground);
    line-height: 1.6;
}
</style>
