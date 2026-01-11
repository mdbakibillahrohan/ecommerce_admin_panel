<script setup lang="ts">
interface Props {
    title: string
    subtitle?: string
    extra?: string
}

const props = defineProps<Props>()
</script>

<template>
    <div class="section-header">
        <div class="header-main">
            <h3 class="header-title">{{ title }}</h3>
            <p v-if="subtitle" class="header-subtitle">{{ subtitle }}</p>
        </div>
        <div v-if="extra || $slots.extra" class="header-extra">
            <span v-if="extra">{{ extra }}</span>
            <slot name="extra"></slot>
        </div>
    </div>
</template>

<style scoped>
.section-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border);
}

.header-main {
    flex: 1;
}

.header-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--foreground);
    margin: 0 0 4px 0;
}

.header-subtitle {
    font-size: 14px;
    color: var(--muted-foreground);
    margin: 0;
}

.header-extra {
    display: flex;
    gap: 12px;
    align-items: center;
}
</style>
