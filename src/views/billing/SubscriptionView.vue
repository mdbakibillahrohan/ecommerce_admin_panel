<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { billingApi, type Plan, type StoreSubscription } from '@/api/billing'
import { CheckOutlined, CrownOutlined, CheckCircleFilled } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const authStore = useAuthStore()
const loading = ref(false)
const plans = ref<Plan[]>([])
const currentSubscription = ref<StoreSubscription | null>(null)
const processing = ref(false)

const activeStoreId = computed(() => authStore.activeStore?.id)

onMounted(() => {
  if (activeStoreId.value) {
    fetchData()
  }
})

async function fetchData() {
  loading.value = true
  try {
    const [plansData, subData] = await Promise.all([
      billingApi.getPlans(),
      activeStoreId.value ? billingApi.getSubscription(activeStoreId.value) : Promise.resolve(null)
    ])
    plans.value = plansData
    currentSubscription.value = subData
  } catch (error) {
    console.error('Failed to fetch billing data', error)
  } finally {
    loading.value = false
  }
}

async function handleSubscribe(plan: Plan, cycle: 'monthly' | 'yearly') {
  if (!activeStoreId.value) return

  processing.value = true
  try {
    await billingApi.subscribe({
      store_id: activeStoreId.value,
      plan_id: plan.id,
      billing_cycle: cycle,
    })
    message.success(`Successfully subscribed to ${plan.name} (${cycle})`)
    fetchData()
  } catch (error) {
    message.error('Failed to process subscription')
    console.error(error)
  } finally {
    processing.value = false
  }
}

function isCurrentPlan(planId: number) {
  return currentSubscription.value?.plan_id === planId && currentSubscription.value?.status === 'active'
}
</script>

<template>
  <div class="subscription-view">
    <div class="page-header">
      <div class="header-left">
        <h1>Subscription & Billing</h1>
        <p>Manage your store plan and billing details</p>
      </div>
    </div>

    <a-spin :spinning="loading">
      <!-- Current Plan -->
      <a-card v-if="currentSubscription" class="current-plan-card" :bordered="false">
        <div class="current-plan-content">
          <div class="plan-info">
            <span class="label">Current Plan</span>
            <h2 class="plan-name">
              {{ currentSubscription.plan.name }}
              <a-tag color="green" v-if="currentSubscription.status === 'active'">Active</a-tag>
            </h2>
            <p class="expiry">
              Renews on {{ new Date(currentSubscription.ends_at).toLocaleDateString() }}
            </p>
          </div>
          <div class="plan-actions">
            <!-- Cancel/Manage buttons could go here -->
          </div>
        </div>
      </a-card>

      <!-- Plans Grid -->
      <h2 class="section-title">Available Plans</h2>
      <div class="plans-grid">
        <div 
          v-for="plan in plans" 
          :key="plan.id" 
          class="plan-card"
          :class="{ 'featured': plan.name === 'Pro', 'current': isCurrentPlan(plan.id) }"
        >
          <div class="plan-header">
            <div class="plan-name">{{ plan.name }}</div>
            <div class="plan-price">
              <span class="currency">{{ plan.currency === 'USD' ? '$' : '৳' }}</span>
              <span class="amount">{{ plan.monthly_price }}</span>
              <span class="period">/mo</span>
            </div>
          </div>
          
          <div class="plan-features">
            <div v-for="feature in plan.features" :key="feature" class="feature-item">
              <CheckOutlined class="check-icon" />
              <span>{{ feature }}</span>
            </div>
          </div>

          <div class="plan-footer">
            <div v-if="isCurrentPlan(plan.id)" class="current-badge">
              <CheckCircleFilled /> Current Plan
            </div>
            <a-button 
              v-else
              type="primary" 
              block 
              size="large"
              :class="{ 'featured-btn': plan.name === 'Pro' }"
              :loading="processing"
              @click="handleSubscribe(plan, 'monthly')"
            >
              {{ plan.monthly_price === 0 ? 'Start Free' : 'Upgrade' }}
            </a-button>
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<style scoped>
.subscription-view {
  min-height: 100%;
}

.page-header {
  margin-bottom: 32px;
}

.current-plan-card {
  background: linear-gradient(135deg, #001529 0%, #002140 100%);
  color: #fff;
  margin-bottom: 40px;
  border-radius: 12px;
}

.plan-info .label {
  opacity: 0.7;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.plan-info .plan-name {
  color: #fff;
  font-size: 24px;
  margin: 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.expiry {
  opacity: 0.8;
  margin: 0;
}

.section-title {
  text-align: center;
  margin-bottom: 32px;
  font-size: 24px;
  color: #262626;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
}

.plan-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  position: relative;
  border: 2px solid transparent;
  transition: transform 0.3s;
}

.plan-card:hover {
  transform: translateY(-5px);
}

.plan-card.featured {
  border-color: #1890ff;
  box-shadow: 0 8px 30px rgba(24, 144, 255, 0.15);
}

.plan-header {
  text-align: center;
  margin-bottom: 32px;
}

.plan-header .plan-name {
  font-size: 18px;
  font-weight: 600;
  color: #595959;
  margin-bottom: 16px;
}

.plan-price .currency {
  font-size: 24px;
  vertical-align: top;
  line-height: 1.5;
}

.plan-price .amount {
  font-size: 48px;
  font-weight: 700;
  color: #262626;
}

.plan-price .period {
  color: #8c8c8c;
  font-size: 16px;
}

.plan-features {
  flex: 1;
  margin-bottom: 32px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
  color: #595959;
}

.check-icon {
  color: #52c41a;
  margin-top: 4px;
}

.plan-footer {
  text-align: center;
}

.current-badge {
  color: #52c41a;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.featured-btn {
  background: linear-gradient(90deg, #1890ff 0%, #096dd9 100%);
  border: none;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
}
</style>
