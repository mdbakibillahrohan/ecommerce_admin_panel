<script setup lang="ts">
interface Activity {
    id: number
    type: string
    description: string
    timestamp: string
    user?: string
}

interface Props {
    activities: Activity[]
    loading?: boolean
}

const props = defineProps<Props>()

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

function formatTime(timestamp: string) {
    return dayjs(timestamp).fromNow()
}

function getActivityIcon(type: string) {
    const icons: Record<string, string> = {
        ORDER: 'shopping',
        PRODUCT: 'appstore',
        CUSTOMER: 'user',
        PAYMENT: 'dollar',
        REVIEW: 'star',
    }
    return icons[type] || 'info-circle'
}
</script>

<template>
    <a-card title="Recent Activity" :bordered="false" class="activity-card">
        <a-spin :spinning="loading">
            <div class="activity-list">
                <div v-for="activity in activities" :key="activity.id" class="activity-item">
                    <div class="activity-icon">
                        <component :is="`${getActivityIcon(activity.type)}-outlined`" />
                    </div>
                    <div class="activity-content">
                        <div class="activity-description">{{ activity.description }}</div>
                        <div class="activity-meta">
                            <span v-if="activity.user" class="activity-user">{{ activity.user }}</span>
                            <span class="activity-time">{{ formatTime(activity.timestamp) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </a-spin>
    </a-card>
</template>

<script setup lang="ts">
import {
  ShoppingOutlined,
  AppstoreOutlined,
  UserOutlined,
  DollarOutlined,
  StarOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons-vue'
</script>

<style scoped>
.activity-card {
    border: 1px solid var(--border);
    border-radius: 12px;
}

.activity-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.activity-item {
    display: flex;
    gap: 12px;
    padding: 12px;
    background: var(--accent);
    border-radius: 8px;
    transition: background 0.2s;
}

.activity-item:hover {
    background: var(--muted);
}

.activity-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: oklch(0.65 0.25 195);
    color: white;
    border-radius: 50%;
    font-size: 18px;
    flex-shrink: 0;
}

.activity-content {
    flex: 1;
}

.activity-description {
    font-size: 14px;
    color: var(--foreground);
    margin-bottom: 4px;
}

.activity-meta {
    display: flex;
    gap: 12px;
    font-size: 13px;
    color: var(--muted-foreground);
}

.activity-user {
    font-weight: 600;
}
</style>
