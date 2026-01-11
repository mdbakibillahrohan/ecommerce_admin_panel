<script setup lang="ts">
interface Review {
    id: number
    product_name: string
    customer_name: string
    rating: number
    comment: string
    status: string
    created_at: string
    reply?: string
}

interface Props {
    review: Review
}

interface Emits {
    (e: 'approve'): void
    (e: 'reject'): void
    (e: 'reply'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

<template>
    <a-card class="review-card" :bordered="false">
        <div class="review-header">
            <div class="review-info">
                <div class="customer-name">{{ review.customer_name }}</div>
                <div class="product-name">{{ review.product_name }}</div>
            </div>
            <a-rate :value="review.rating" disabled />
        </div>

        <div class="review-comment">{{ review.comment }}</div>

        <div v-if="review.reply" class="review-reply">
            <div class="reply-label">Your Reply:</div>
            <div class="reply-text">{{ review.reply }}</div>
        </div>

        <div class="review-footer">
            <div class="review-date">{{ new Date(review.created_at).toLocaleDateString() }}</div>
            <a-space>
                <a-tag :color="review.status === 'APPROVED' ? 'green' : review.status === 'PENDING' ? 'orange' : 'red'">
                    {{ review.status }}
                </a-tag>
                <a-button v-if="review.status === 'PENDING'" size="small" type="primary" @click="emit('approve')">
                    Approve
                </a-button>
                <a-button v-if="review.status === 'PENDING'" size="small" danger @click="emit('reject')">
                    Reject
                </a-button>
                <a-button size="small" @click="emit('reply')">
                    {{ review.reply ? 'Edit Reply' : 'Reply' }}
                </a-button>
            </a-space>
        </div>
    </a-card>
</template>

<style scoped>
.review-card {
    border: 1px solid var(--border);
    border-radius: 12px;
    transition: all 0.3s ease;
}

.review-card:hover {
    border-color: oklch(0.65 0.25 195);
    box-shadow: 0 4px 12px rgba(13, 148, 136, 0.1);
}

.review-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
}

.review-info {
    flex: 1;
}

.customer-name {
    font-size: 16px;
    font-weight: 600;
    color: var(--foreground);
}

.product-name {
    font-size: 14px;
    color: var(--muted-foreground);
    margin-top: 4px;
}

.review-comment {
    font-size: 15px;
    color: var(--foreground);
    line-height: 1.6;
    margin-bottom: 16px;
}

.review-reply {
    background: var(--accent);
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 16px;
}

.reply-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--muted-foreground);
    margin-bottom: 4px;
}

.reply-text {
    font-size: 14px;
    color: var(--foreground);
}

.review-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.review-date {
    font-size: 13px;
    color: var(--muted-foreground);
}
</style>
