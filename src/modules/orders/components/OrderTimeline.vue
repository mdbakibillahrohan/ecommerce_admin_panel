<script setup lang="ts">
import dayjs from 'dayjs'

interface TimelineEvent {
    status: string
    timestamp: string
    note?: string
}

interface Props {
    events: TimelineEvent[]
}

const props = defineProps<Props>()

function formatDateTime(date: string) {
    return dayjs(date).format('MMM D, YYYY h:mm A')
}

function getStatusIcon(status: string) {
    const icons: Record<string, string> = {
        PENDING: 'clock-circle',
        PROCESSING: 'sync',
        SHIPPED: 'car',
        DELIVERED: 'check-circle',
        CANCELLED: 'close-circle',
    }
    return icons[status] || 'info-circle'
}

function getStatusColor(status: string) {
    const colors: Record<string, string> = {
        PENDING: 'orange',
        PROCESSING: 'blue',
        SHIPPED: 'cyan',
        DELIVERED: 'green',
        CANCELLED: 'red',
    }
    return colors[status] || 'default'
}
</script>

<template>
    <a-card title="Order Timeline" :bordered="false">
        <a-timeline>
            <a-timeline-item v-for="event in events" :key="event.timestamp" :color="getStatusColor(event.status)">
                <template #dot>
                    <component :is="`${getStatusIcon(event.status)}-outlined`" />
                </template>
                <div class="timeline-content">
                    <div class="timeline-status">{{ event.status }}</div>
                    <div class="timeline-time">{{ formatDateTime(event.timestamp) }}</div>
                    <div v-if="event.note" class="timeline-note">{{ event.note }}</div>
                </div>
            </a-timeline-item>
        </a-timeline>
    </a-card>
</template>

<style scoped>
.timeline-content {
    padding-bottom: 8px;
}

.timeline-status {
    font-weight: 600;
    font-size: 15px;
    color: var(--foreground);
}

.timeline-time {
    font-size: 13px;
    color: var(--muted-foreground);
    margin-top: 4px;
}

.timeline-note {
    font-size: 14px;
    color: var(--foreground);
    margin-top: 8px;
    padding: 8px;
    background: var(--accent);
    border-radius: 6px;
}
</style>
