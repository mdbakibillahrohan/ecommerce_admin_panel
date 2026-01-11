<script setup lang="ts">
import dayjs from 'dayjs'

interface Promotion {
    id: number
    title: string
    description: string
    type: string
    status: string
    starts_at: string | null
    ends_at: string | null
    views: number
    clicks: number
    banner_url?: string
}

interface Props {
    promotion: Promotion
}

interface Emits {
    (e: 'edit'): void
    (e: 'delete'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function formatDate(date: string | null) {
    return date ? dayjs(date).format('MMM D, YYYY') : 'Not set'
}
</script>

<template>
    <a-card class="promotion-card" :bordered="false">
        <div v-if="promotion.banner_url" class="promotion-banner">
            <img :src="promotion.banner_url" :alt="promotion.title" />
        </div>

        <div class="promotion-header">
            <div class="promotion-title">{{ promotion.title }}</div>
            <a-dropdown>
                <a-button size="small">
                    <template #icon>
                        <more-outlined />
                    </template>
                </a-button>
                <template #overlay>
                    <a-menu>
                        <a-menu-item @click="emit('edit')">Edit</a-menu-item>
                        <a-menu-item danger @click="emit('delete')">Delete</a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>
        </div>

        <div class="promotion-description">{{ promotion.description }}</div>

        <div class="promotion-meta">
            <a-tag>{{ promotion.type }}</a-tag>
            <a-tag :color="promotion.status === 'ACTIVE' ? 'green' : 'default'">
                {{ promotion.status }}
            </a-tag>
        </div>

        <div class="promotion-dates">
            <div class="date-item">
                <span class="date-label">Starts:</span>
                <span class="date-value">{{ formatDate(promotion.starts_at) }}</span>
            </div>
            <div class="date-item">
                <span class="date-label">Ends:</span>
                <span class="date-value">{{ formatDate(promotion.ends_at) }}</span>
            </div>
        </div>

        <div class="promotion-stats">
            <div class="stat-item">
                <div class="stat-value">{{ promotion.views }}</div>
                <div class="stat-label">Views</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">{{ promotion.clicks }}</div>
                <div class="stat-label">Clicks</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">{{ promotion.clicks > 0 ? ((promotion.clicks / promotion.views) *
                    100).toFixed(1) : 0
                    }}%</div>
                <div class="stat-label">CTR</div>
            </div>
        </div>
    </a-card>
</template>

<script setup lang="ts">
import { MoreOutlined } from '@ant-design/icons-vue'
</script>

<style scoped>
.promotion-card {
    border: 1px solid var(--border);
    border-radius: 12px;
    transition: all 0.3s ease;
}

.promotion-card:hover {
    border-color: oklch(0.65 0.25 195);
    box-shadow: 0 4px 12px rgba(13, 148, 136, 0.1);
}

.promotion-banner {
    width: 100%;
    height: 150px;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 16px;
}

.promotion-banner img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.promotion-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.promotion-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--foreground);
}

.promotion-description {
    font-size: 14px;
    color: var(--muted-foreground);
    margin-bottom: 16px;
    line-height: 1.5;
}

.promotion-meta {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
}

.promotion-dates {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
    padding: 12px;
    background: var(--accent);
    border-radius: 8px;
}

.date-item {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
}

.date-label {
    color: var(--muted-foreground);
}

.date-value {
    font-weight: 600;
    color: var(--foreground);
}

.promotion-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
}

.stat-item {
    text-align: center;
}

.stat-value {
    font-size: 20px;
    font-weight: 700;
    color: oklch(0.65 0.25 195);
}

.stat-label {
    font-size: 13px;
    color: var(--muted-foreground);
    margin-top: 4px;
}
</style>
