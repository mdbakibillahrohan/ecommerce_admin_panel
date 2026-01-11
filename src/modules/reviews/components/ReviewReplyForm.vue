<script setup lang="ts">
import { ref } from 'vue'

interface Emits {
    (e: 'submit', reply: string): void
    (e: 'cancel'): void
}

const emit = defineEmits<Emits>()

const visible = ref(false)
const replyText = ref('')
const reviewInfo = ref({
    customerName: '',
    productName: '',
})

function show(customerName: string, productName: string, existingReply?: string) {
    visible.value = true
    reviewInfo.value = { customerName, productName }
    replyText.value = existingReply || ''
}

function hide() {
    visible.value = false
    replyText.value = ''
}

function handleOk() {
    emit('submit', replyText.value)
    hide()
}

function handleCancel() {
    emit('cancel')
    hide()
}

defineExpose({ show, hide })
</script>

<template>
    <a-modal v-model:open="visible" title="Reply to Review" @ok="handleOk" @cancel="handleCancel" width="600px">
        <div class="review-context">
            <div class="context-item">
                <span class="context-label">Customer:</span>
                <span class="context-value">{{ reviewInfo.customerName }}</span>
            </div>
            <div class="context-item">
                <span class="context-label">Product:</span>
                <span class="context-value">{{ reviewInfo.productName }}</span>
            </div>
        </div>

        <a-form layout="vertical">
            <a-form-item label="Your Reply" required>
                <a-textarea v-model:value="replyText" :rows="6" placeholder="Write your reply to this review..."
                    show-count :maxlength="500" />
            </a-form-item>

            <a-alert message="Your reply will be visible to all customers viewing this product." type="info"
                show-icon />
        </a-form>
    </a-modal>
</template>

<style scoped>
.review-context {
    margin-bottom: 24px;
    padding: 16px;
    background: var(--accent);
    border-radius: 8px;
}

.context-item {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
}

.context-item:last-child {
    margin-bottom: 0;
}

.context-label {
    font-weight: 600;
    color: var(--muted-foreground);
}

.context-value {
    color: var(--foreground);
}
</style>
