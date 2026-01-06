<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { reviewsApi, type Review } from '@/modules/reviews/api/reviews'
import { productsApi, type Product } from '@/modules/products/api/products'
import {
  CheckOutlined,
  MessageOutlined,
  StarFilled,
  CloseOutlined,
  FilterOutlined,
  DownloadOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'

// State
const loading = ref(false)
const reviews = ref<Review[]>([])
const products = ref<Product[]>([])
const selectedProduct = ref<number | undefined>()
const selectedStatus = ref<string>('all')
const selectedRating = ref<number | undefined>()
const searchQuery = ref('')
const showReplyModal = ref(false)
const replying = ref(false)
const selectedReviews = ref<number[]>([])

// Reply
const replyReview = ref<Review | null>(null)
const replyText = ref('')

// Statistics
const statistics = computed(() => {
  const allReviews = reviews.value
  const totalReviews = allReviews.length
  const avgRating = totalReviews > 0
    ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : '0.0'
  const pendingCount = allReviews.filter(r => !r.is_approved).length
  const repliedCount = allReviews.filter(r => r.admin_reply).length

  return {
    total: totalReviews,
    avgRating: parseFloat(avgRating),
    pending: pendingCount,
    replied: repliedCount,
  }
})

// Filtered reviews
const filteredReviews = computed(() => {
  let filtered = reviews.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(r =>
      r.comment?.toLowerCase().includes(query) ||
      r.title?.toLowerCase().includes(query) ||
      `${r.user?.first_name} ${r.user?.last_name}`.toLowerCase().includes(query)
    )
  }

  if (selectedStatus.value === 'pending') {
    filtered = filtered.filter(r => !r.is_approved)
  } else if (selectedStatus.value === 'approved') {
    filtered = filtered.filter(r => r.is_approved)
  }

  if (selectedRating.value) {
    filtered = filtered.filter(r => r.rating === selectedRating.value)
  }

  return filtered
})

onMounted(async () => {
  await fetchProducts()
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
    const data = response.data || response as unknown as Review[]
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

async function handleBulkApprove() {
  if (selectedReviews.value.length === 0) return

  try {
    await Promise.all(selectedReviews.value.map(id => reviewsApi.approve(id)))
    message.success(`${selectedReviews.value.length} reviews approved`)
    selectedReviews.value = []
    fetchReviews()
  } catch (error) {
    message.error('Failed to approve reviews')
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
  selectedReviews.value = []
  fetchReviews()
}

function clearFilters() {
  searchQuery.value = ''
  selectedStatus.value = 'all'
  selectedRating.value = undefined
}

function handleExport() {
  message.success('Export functionality coming soon')
}
</script>

<template>
  <div class="review-list-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <h1>Product Reviews</h1>
        <p>Manage customer reviews and ratings</p>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="statistics-grid">
      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-label">Total Reviews</div>
          <div class="stat-value">{{ statistics.total }}</div>
        </div>
        <div class="stat-icon" style="background: oklch(0.7 0.15 210)">
          <MessageOutlined />
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-label">Average Rating</div>
          <div class="stat-value">{{ statistics.avgRating }}</div>
          <div class="stat-extra">
            <a-rate :value="statistics.avgRating" allow-half disabled />
          </div>
        </div>
        <div class="stat-icon" style="background: oklch(0.75 0.15 150)">
          <StarFilled />
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-label">Pending Approval</div>
          <div class="stat-value">{{ statistics.pending }}</div>
        </div>
        <div class="stat-icon" style="background: oklch(0.7 0.15 60)">
          <CloseOutlined />
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-label">Replied</div>
          <div class="stat-value">{{ statistics.replied }}</div>
        </div>
        <div class="stat-icon" style="background: oklch(0.65 0.19 180)">
          <CheckOutlined />
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="filter-section">
      <div class="filter-header">
        <div class="filter-title">
          <FilterOutlined />
          <span>Filters</span>
        </div>
        <div class="filter-actions">
          <a-button v-if="selectedReviews.length > 0" type="primary" @click="handleBulkApprove">
            Approve Selected ({{ selectedReviews.length }})
          </a-button>
          <a-button @click="handleExport">
            <DownloadOutlined />
            Export
          </a-button>
        </div>
      </div>

      <div class="filter-controls">
        <div class="filter-row">
          <div class="filter-item">
            <label>Product</label>
            <a-select v-model:value="selectedProduct" placeholder="Select a product" show-search
              option-filter-prop="label" @change="handleProductChange">
              <a-select-option v-for="product in products" :key="product.id" :value="product.id" :label="product.name">
                {{ product.name }}
              </a-select-option>
            </a-select>
          </div>

          <div class="filter-item">
            <label>Search</label>
            <a-input v-model:value="searchQuery" placeholder="Search reviews..." allow-clear />
          </div>

          <div class="filter-item">
            <label>Status</label>
            <a-select v-model:value="selectedStatus">
              <a-select-option value="all">All Status</a-select-option>
              <a-select-option value="pending">Pending</a-select-option>
              <a-select-option value="approved">Approved</a-select-option>
            </a-select>
          </div>

          <div class="filter-item">
            <label>Rating</label>
            <a-select v-model:value="selectedRating" allow-clear placeholder="All Ratings">
              <a-select-option :value="5">5 Stars</a-select-option>
              <a-select-option :value="4">4 Stars</a-select-option>
              <a-select-option :value="3">3 Stars</a-select-option>
              <a-select-option :value="2">2 Stars</a-select-option>
              <a-select-option :value="1">1 Star</a-select-option>
            </a-select>
          </div>

          <div class="filter-item filter-actions-mobile">
            <label>&nbsp;</label>
            <a-button @click="clearFilters">Clear All</a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Reviews List -->
    <div class="reviews-container">
      <a-empty v-if="!selectedProduct" description="Select a product to view reviews" />

      <a-spin v-else :spinning="loading">
        <div v-if="filteredReviews.length > 0" class="reviews-list">
          <div v-for="review in filteredReviews" :key="review.id" class="review-card">
            <div class="review-checkbox">
              <a-checkbox v-model:checked="selectedReviews" :value="review.id" />
            </div>

            <div class="review-main">
              <div class="review-header-section">
                <div class="reviewer-info">
                  <div class="reviewer-avatar">
                    {{ review.user?.first_name?.charAt(0) || 'U' }}
                  </div>
                  <div class="reviewer-details">
                    <div class="reviewer-name">
                      {{ review.user?.first_name }} {{ review.user?.last_name }}
                    </div>
                    <div class="review-meta">
                      <a-rate :value="review.rating" disabled />
                      <span class="review-date">{{ dayjs(review.created_at).format('MMM D, YYYY') }}</span>
                    </div>
                  </div>
                </div>

                <div class="review-status">
                  <a-tag v-if="!review.is_approved" color="orange">Pending</a-tag>
                  <a-tag v-else color="green">Approved</a-tag>
                </div>
              </div>

              <div class="review-content">
                <h4 v-if="review.title" class="review-title">{{ review.title }}</h4>
                <p class="review-comment">{{ review.comment }}</p>
              </div>

              <div v-if="review.admin_reply" class="admin-reply">
                <div class="reply-header">
                  <MessageOutlined />
                  <strong>Admin Reply</strong>
                </div>
                <p>{{ review.admin_reply }}</p>
              </div>

              <div class="review-actions">
                <a-button v-if="!review.is_approved" type="primary" size="small" @click="handleApprove(review)">
                  <CheckOutlined />
                  Approve
                </a-button>
                <a-button size="small" @click="openReplyModal(review)">
                  <MessageOutlined />
                  {{ review.admin_reply ? 'Edit Reply' : 'Reply' }}
                </a-button>
              </div>
            </div>
          </div>
        </div>

        <a-empty v-else description="No reviews found" />
      </a-spin>
    </div>

    <!-- Reply Modal -->
    <a-modal v-model:open="showReplyModal" title="Reply to Review" @ok="handleReply" :confirm-loading="replying"
      width="600px">
      <div v-if="replyReview" class="reply-modal-content">
        <div class="review-preview">
          <div class="preview-header">
            <a-rate :value="replyReview.rating" disabled />
            <span class="reviewer">
              by {{ replyReview.user?.first_name }} {{ replyReview.user?.last_name }}
            </span>
          </div>
          <h4 v-if="replyReview.title">{{ replyReview.title }}</h4>
          <p class="preview-comment">{{ replyReview.comment }}</p>
        </div>

        <div class="reply-input">
          <label>Your Reply</label>
          <a-textarea v-model:value="replyText" placeholder="Write your reply to the customer..." :rows="4" />
        </div>
      </div>
    </a-modal>
  </div>
</template>

<style scoped>
.review-list-page {
  min-height: 100vh;
  background: var(--background);
}

.page-header {
  margin-bottom: 24px;
}

.header-content h1 {
  font-size: 28px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0 0 4px 0;
}

.header-content p {
  color: var(--muted-foreground);
  margin: 0;
  font-size: 14px;
}

/* Statistics Grid */
.statistics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 13px;
  color: var(--muted-foreground);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--foreground);
  line-height: 1;
}

.stat-extra {
  margin-top: 8px;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

/* Filter Section */
.filter-section {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
}

.filter-actions {
  display: flex;
  gap: 8px;
}

.filter-controls {
  width: 100%;
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-item label {
  font-size: 13px;
  font-weight: 500;
  color: var(--muted-foreground);
}

.filter-item :deep(.ant-select),
.filter-item :deep(.ant-input) {
  width: 100%;
}

/* Reviews Container */
.reviews-container {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-card {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.review-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  border-color: oklch(0.65 0.19 180);
}

.review-checkbox {
  padding-top: 4px;
}

.review-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.reviewer-info {
  display: flex;
  gap: 12px;
  align-items: center;
}

.reviewer-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, oklch(0.65 0.19 180) 0%, oklch(0.6 0.19 200) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 18px;
}

.reviewer-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.reviewer-name {
  font-weight: 600;
  color: var(--foreground);
  font-size: 15px;
}

.review-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.review-date {
  color: var(--muted-foreground);
  font-size: 13px;
}

.review-content {
  padding-left: 60px;
}

.review-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0 0 8px 0;
}

.review-comment {
  color: var(--muted-foreground);
  margin: 0;
  line-height: 1.6;
  font-size: 14px;
}

.admin-reply {
  margin-left: 60px;
  padding: 16px;
  background: var(--card);
  border-radius: 8px;
  border-left: 4px solid oklch(0.65 0.19 180);
}

.reply-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: oklch(0.65 0.19 180);
  margin-bottom: 8px;
  font-size: 14px;
}

.admin-reply p {
  margin: 0;
  color: var(--muted-foreground);
  font-size: 14px;
}

.review-actions {
  display: flex;
  gap: 8px;
  padding-left: 60px;
}

/* Reply Modal */
.reply-modal-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.review-preview {
  padding: 16px;
  background: var(--background);
  border-radius: 8px;
  border: 1px solid var(--border);
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.preview-header .reviewer {
  color: var(--muted-foreground);
  font-size: 13px;
}

.review-preview h4 {
  font-size: 15px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0 0 8px 0;
}

.preview-comment {
  margin: 0;
  color: var(--muted-foreground);
  font-size: 14px;
  line-height: 1.6;
}

.reply-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reply-input label {
  font-weight: 500;
  color: var(--foreground);
  font-size: 14px;
}

/* Responsive */
@media (max-width: 768px) {
  .review-list-page {
    padding: 16px;
  }

  .statistics-grid {
    grid-template-columns: 1fr;
  }

  .filter-row {
    grid-template-columns: 1fr;
  }

  .review-card {
    flex-direction: column;
  }

  .review-content,
  .admin-reply,
  .review-actions {
    padding-left: 0;
    margin-left: 0;
  }

  .filter-actions-mobile {
    grid-column: 1 / -1;
  }
}
</style>
