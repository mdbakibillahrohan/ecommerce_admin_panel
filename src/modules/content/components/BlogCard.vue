<script setup lang="ts">
import dayjs from 'dayjs'

interface BlogPost {
    id: number
    title: string
    slug: string
    excerpt: string
    category: string
    status: string
    published_at?: string
    views: number
    featured_image?: string
}

interface Props {
    post: BlogPost
}

interface Emits {
    (e: 'edit'): void
    (e: 'view'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function formatDate(date: string | undefined) {
    return date ? dayjs(date).format('MMM D, YYYY') : 'Not published'
}
</script>

<template>
    <a-card class="blog-card" :bordered="false">
        <div v-if="post.featured_image" class="blog-image">
            <img :src="post.featured_image" :alt="post.title" />
        </div>

        <div class="blog-header">
            <div class="blog-title">{{ post.title }}</div>
            <a-tag :color="post.status === 'PUBLISHED' ? 'green' : 'orange'">
                {{ post.status }}
            </a-tag>
        </div>

        <div class="blog-excerpt">{{ post.excerpt }}</div>

        <div class="blog-meta">
            <a-tag>{{ post.category }}</a-tag>
            <div class="blog-stats">
                <span class="stat-item">
                    <eye-outlined />
                    {{ post.views }}
                </span>
                <span class="stat-item">{{ formatDate(post.published_at) }}</span>
            </div>
        </div>

        <div class="blog-actions">
            <a-button type="primary" @click="emit('view')">View</a-button>
            <a-button @click="emit('edit')">Edit</a-button>
        </div>
    </a-card>
</template>

<script setup lang="ts">
import { EyeOutlined } from '@ant-design/icons-vue'
</script>

<style scoped>
.blog-card {
    border: 1px solid var(--border);
    border-radius: 12px;
    transition: all 0.3s ease;
}

.blog-card:hover {
    border-color: oklch(0.65 0.25 195);
    box-shadow: 0 4px 12px rgba(13, 148, 136, 0.1);
}

.blog-image {
    width: 100%;
    height: 180px;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 16px;
}

.blog-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.blog-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
}

.blog-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--foreground);
    flex: 1;
    margin-right: 12px;
}

.blog-excerpt {
    font-size: 14px;
    color: var(--muted-foreground);
    margin-bottom: 16px;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.blog-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.blog-stats {
    display: flex;
    gap: 16px;
    font-size: 13px;
    color: var(--muted-foreground);
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 4px;
}

.blog-actions {
    display: flex;
    gap: 12px;
}
</style>
