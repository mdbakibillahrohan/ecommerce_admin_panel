<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { reviewsApi, type Review } from '@/api/reviews'
import { productsApi, type Product } from '@/api/products'
import {
  CheckOutlined,
  MessageOutlined,
  StarFilled,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'

// State
const loading = ref(false)
const reviews = ref<Review[]>([])
const products = ref<Product[]>([])
const selectedProduct = ref<number | undefined>()
const showOnlyPending = ref(false)
const showReplyModal = ref(false)
const replying = ref(false)

// Reply
const replyReview = ref<Review | null>(null)
const replyText = ref('')

onMounted(async () => {
  await Promise.all([fetchProducts()])
})

async function fetchProducts() {
  try {
    const response = await productsApi.getAll({ limit: 100 })
    products.value = response.data
  } catch (error) {
    console.error('Failed to fetch products:', error)
  }
}

async function fetchReviews() {
  if (!selectedProduct.value) {
    reviews.value = []
    return
  }
  
  loading.value = true
  try {
    const response = await reviewsApi.getByProduct(selectedProduct.value, 1, 100)
    let data = response.data || response as unknown as Review[]
    
    if (showOnlyPending.value) {
      data = data.filter(r => !r.is_approved)
    }
    
    reviews.value = data
  } catch (error) {
    message.error('Failed to fetch reviews')
    console.error(error)
  } finally {
    loading.value = false
  }
}

async function handleApprove(review: Review) {
  try {
    await reviewsApi.approve(review.id)
    message.success('Review approved')
    fetchReviews()
  } catch (error) {
    message.error('Failed to approve review')
    console.error(error)
  }
}

function openReplyModal(review: Review) {
  replyReview.value = review
  replyText.value = review.admin_reply || ''
  showReplyModal.value = true
}

async function handleReply() {
  if (!replyReview.value || !replyText.value.trim()) return

  replying.value = true
  try {
    await reviewsApi.addReply(replyReview.value.id, replyText.value)
    message.success('Reply added')
    showReplyModal.value = false
    fetchReviews()
  } catch (error) {
    message.error('Failed to add reply')
    console.error(error)
  } finally {
    replying.value = false
  }
}

function handleProductChange() {
  fetchReviews()
}
</script>

<template>
  <div class="review-list">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-left">
        <h1>Reviews</h1>
        <p>Manage product reviews and ratings</p>
      </div>
    </div>

    <!-- Filters -->
    <a-card :bordered="false" class="filter-card">
      <a-row :gutter="16" align="middle">
        <a-col :xs="24" :sm="12" :md="8">
          <a-select
            v-model:value="selectedProduct"
            placeholder="Select a product"
            show-search
            option-filter-prop="label"
            style="width: 100%"
            @change="handleProductChange"
          >
            <a-select-option 
              v-for="product in products" 
              :key="product.id" 
              :value="product.id"
              :label="product.name"
            >
              {{ product.name }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col>
          <a-checkbox v-model:checked="showOnlyPending" @change="fetchReviews">
            Show only pending approval
          </a-checkbox>
        </a-col>
      </a-row>
    </a-card>

    <!-- Reviews List -->
    <a-card :bordered="false" class="reviews-card">
      <a-empty v-if="!selectedProduct" description="Select a product to view reviews" />
      
      <a-spin v-else :spinning="loading">
        <a-list
          v-if="reviews.length > 0"
          :data-source="reviews"
          item-layout="vertical"
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <template #actions>
                <a-button 
                  v-if="!item.is_approved"
                  type="primary" 
                  size="small"
                  @click="handleApprove(item)"
                >
                  <template #icon><CheckOutlined /></template>
                  Approve
                </a-button>
                <a-button size="small" @click="openReplyModal(item)">
                  <template #icon><MessageOutlined /></template>
                  {{ item.admin_reply ? 'Edit Reply' : 'Reply' }}
                </a-button>
              </template>

              <a-list-item-meta>
                <template #avatar>
                  <a-avatar :size="48" class="reviewer-avatar">
                    {{ item.user?.first_name?.charAt(0) || 'U' }}
                  </a-avatar>
                </template>
                <template #title>
                  <div class="review-header">
                    <span class="reviewer-name">
                      {{ item.user?.first_name }} {{ item.user?.last_name }}
                    </span>
                    <a-rate :value="item.rating" disabled :style="{ fontSize: '14px' }" />
                    <a-tag v-if="!item.is_approved" color="orange">Pending</a-tag>
                    <a-tag v-else color="green">Approved</a-tag>
                  </div>
                </template>
                <template #description>
                  <span class="review-date">{{ dayjs(item.created_at).format('MMM D, YYYY') }}</span>
                </template>
              </a-list-item-meta>

              <div class="review-content">
                <h4 v-if="item.title" class="review-title">{{ item.title }}</h4>
                <p class="review-comment">{{ item.comment }}</p>
              </div>

              <div v-if="item.admin_reply" class="admin-reply">
                <div class="reply-header">
                  <strong>Admin Reply</strong>
                </div>
                <p>{{ item.admin_reply }}</p>
              </div>
            </a-list-item>
          </template>
        </a-list>

        <a-empty v-else description="No reviews found" />
      </a-spin>
    </a-card>

    <!-- Reply Modal -->
    <a-modal
      v-model:open="showReplyModal"
      title="Reply to Review"
      @ok="handleReply"
      :confirm-loading="replying"
    >
      <div v-if="replyReview" class="reply-form">
        <div class="review-preview">
          <div class="preview-header">
            <a-rate :value="replyReview.rating" disabled :style="{ fontSize: '14px' }" />
            <span class="reviewer">
              by {{ replyReview.user?.first_name }} {{ replyReview.user?.last_name }}
            </span>
          </div>
          <p class="preview-comment">{{ replyReview.comment }}</p>
        </div>

        <a-form-item label="Your Reply">
          <a-textarea
            v-model:value="replyText"
            placeholder="Write your reply..."
            :rows="4"
          />
        </a-form-item>
      </div>
    </a-modal>
  </div>
</template>

<style scoped>
.review-list {
  min-height: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
}

.header-left h1 {
  font-size: 28px;
  font-weight: 700;
  color: #262626;
  margin: 0 0 4px 0;
}

.header-left p {
  color: #8c8c8c;
  margin: 0;
}

.filter-card {
  margin-bottom: 24px;
}

.reviews-card :deep(.ant-list-item) {
  padding: 24px;
  background: #fafafa;
  border-radius: 12px;
  margin-bottom: 16px;
}

.reviewer-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.review-header {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.reviewer-name {
  font-weight: 600;
  color: #262626;
}

.review-date {
  color: #8c8c8c;
  font-size: 13px;
}

.review-content {
  margin-top: 12px;
}

.review-title {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 8px 0;
}

.review-comment {
  color: #595959;
  margin: 0;
  line-height: 1.6;
}

.admin-reply {
  margin-top: 16px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.admin-reply .reply-header {
  color: #667eea;
  margin-bottom: 8px;
}

.admin-reply p {
  margin: 0;
  color: #595959;
}

.review-preview {
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 16px;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.preview-header .reviewer {
  color: #8c8c8c;
  font-size: 13px;
}

.preview-comment {
  margin: 0;
  color: #595959;
}
</style>
