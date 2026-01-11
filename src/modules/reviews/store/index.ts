import { defineStore } from 'pinia'
import { ref } from 'vue'
import { reviewsApi, type Review } from '@/modules/reviews/api/reviews'
import { message } from 'ant-design-vue'

export const useReviewsStore = defineStore('reviews', () => {
  // State
  const reviews = ref<Review[]>([])
  const total = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Pagination
  const pagination = ref({
    current: 1,
    pageSize: 10,
  })

  // Actions
  async function fetchReviewsByProduct(productId: number) {
    loading.value = true
    error.value = null

    try {
      const response = await reviewsApi.getByProduct(
        productId,
        pagination.value.current,
        pagination.value.pageSize
      )
      reviews.value = response.data
      total.value = response.total
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch reviews'
      message.error(error.value)
      console.error('Reviews fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  async function approveReview(id: number) {
    loading.value = true
    error.value = null

    try {
      const updatedReview = await reviewsApi.approve(id)
      message.success('Review approved successfully')

      // Update in list
      const index = reviews.value.findIndex(r => r.id === id)
      if (index !== -1) {
        reviews.value[index] = updatedReview
      }

      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to approve review'
      message.error(error.value)
      console.error('Review approve error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function addReply(id: number, reply: string) {
    loading.value = true
    error.value = null

    try {
      const updatedReview = await reviewsApi.addReply(id, reply)
      message.success('Reply added successfully')

      // Update in list
      const index = reviews.value.findIndex(r => r.id === id)
      if (index !== -1) {
        reviews.value[index] = updatedReview
      }

      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to add reply'
      message.error(error.value)
      console.error('Add reply error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  function setPagination(current: number, pageSize: number) {
    pagination.value = { current, pageSize }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    reviews,
    total,
    loading,
    error,
    pagination,
    // Actions
    fetchReviewsByProduct,
    approveReview,
    addReply,
    setPagination,
    clearError,
  }
})
