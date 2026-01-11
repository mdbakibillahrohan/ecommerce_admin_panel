import { defineStore } from 'pinia'
import { ref } from 'vue'
import { paymentsApi, type Payment, type RefundPaymentDto } from '@/modules/payments/api/payments'
import { message } from 'ant-design-vue'

export const usePaymentsStore = defineStore('payments', () => {
  // State
  const payments = ref<Payment[]>([])
  const total = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Pagination
  const pagination = ref({
    current: 1,
    pageSize: 20,
  })

  // Actions
  async function fetchPayments() {
    loading.value = true
    error.value = null

    try {
      const response = await paymentsApi.getAll(pagination.value.current, pagination.value.pageSize)
      payments.value = response.data
      total.value = response.total
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch payments'
      message.error(error.value)
      console.error('Payments fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  async function refundPayment(id: number, data: RefundPaymentDto) {
    loading.value = true
    error.value = null

    try {
      await paymentsApi.refund(id, data)
      message.success('Payment refunded successfully')
      await fetchPayments()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to refund payment'
      message.error(error.value)
      console.error('Payment refund error:', err)
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
    payments,
    total,
    loading,
    error,
    pagination,
    // Actions
    fetchPayments,
    refundPayment,
    setPagination,
    clearError,
  }
})
