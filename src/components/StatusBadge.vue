<script setup lang="ts">
interface Props {
    status: string
}

const props = defineProps<Props>()

function getStatusColor(status: string) {
    const colors: Record<string, string> = {
        ACTIVE: 'green',
        INACTIVE: 'default',
        PENDING: 'orange',
        COMPLETED: 'blue',
        CANCELLED: 'red',
        DRAFT: 'default',
        PUBLISHED: 'green',
    }
    return colors[status] || 'default'
}
</script>

<template>
    <a-tag :color="getStatusColor(status)">
        {{ status }}
    </a-tag>
</template>
