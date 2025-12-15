<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  MailOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  DashboardOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  TeamOutlined,
} from '@ant-design/icons-vue'
import type { FormInstance } from 'ant-design-vue'

const router = useRouter()
const authStore = useAuthStore()

const formRef = ref<FormInstance>()
const formState = ref({
  email: '',
  password: '',
  remember: true,
})

const rules = {
  email: [
    { required: true, message: 'Please enter your email' },
    { type: 'email' as const, message: 'Please enter a valid email' },
  ],
  password: [
    { required: true, message: 'Please enter your password' },
    { min: 6, message: 'Password must be at least 6 characters' },
  ],
}

const features = [
  {
    icon: DashboardOutlined,
    title: 'Real-time Dashboard',
    description: 'Monitor your store performance with live analytics',
  },
  {
    icon: ShoppingCartOutlined,
    title: 'Order Management',
    description: 'Process and track orders efficiently',
  },
  {
    icon: BarChartOutlined,
    title: 'Advanced Analytics',
    description: 'Gain insights with detailed reports',
  },
  {
    icon: TeamOutlined,
    title: 'Team Collaboration',
    description: 'Manage roles and permissions easily',
  },
]

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  }
})

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    const success = await authStore.login({
      username: formState.value.email,
      password: formState.value.password,
    })

    if (success) {
      router.push('/dashboard')
    }
  } catch (error) {
    console.error('Validation failed:', error)
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Left Side - Branding -->
      <div class="login-branding">
        <div class="branding-overlay"></div>
        <div class="branding-content">
          <!-- Logo -->
          <div class="brand-logo">
            <div class="logo-icon">
              <SafetyCertificateOutlined />
            </div>
            <div class="logo-text">
              <span class="logo-name">Adaptix</span>
              <span class="logo-tagline">E-Commerce Admin</span>
            </div>
          </div>

          <!-- Hero Text -->
          <div class="hero-section">
            <h1 class="hero-title">Manage Your Store with Confidence</h1>
            <p class="hero-description">
              Powerful tools to grow your e-commerce business. Track orders, manage inventory,
              and analyze performance all in one place.
            </p>
          </div>

          <!-- Feature Grid -->
          <div class="features-grid">
            <div v-for="(feature, index) in features" :key="index" class="feature-card">
              <div class="feature-icon">
                <component :is="feature.icon" />
              </div>
              <div class="feature-content">
                <h3 class="feature-title">{{ feature.title }}</h3>
                <p class="feature-description">{{ feature.description }}</p>
              </div>
            </div>
          </div>

          <!-- Trust Badge -->
          <div class="trust-section">
            <div class="trust-badge">
              <SafetyCertificateOutlined />
              <span>Enterprise-grade security</span>
            </div>
          </div>
        </div>

        <!-- Decorative Elements -->
        <div class="decorative-circles">
          <div class="circle circle-1"></div>
          <div class="circle circle-2"></div>
          <div class="circle circle-3"></div>
        </div>
      </div>

      <!-- Right Side - Login Form -->
      <div class="login-form-container">
        <div class="login-form-wrapper">
          <!-- Mobile Logo -->
          <div class="mobile-logo">
            <div class="logo-icon small">
              <SafetyCertificateOutlined />
            </div>
            <span class="logo-name">Adaptix</span>
          </div>

          <!-- Form Header -->
          <div class="form-header">
            <h2 class="form-title">Welcome back</h2>
            <p class="form-subtitle">Enter your credentials to access your dashboard</p>
          </div>

          <!-- Error Alert -->
          <a-alert
            v-if="authStore.error"
            :message="authStore.error"
            type="error"
            showIcon
            closable
            class="login-error"
            @close="authStore.clearError"
          />

          <!-- Login Form -->
          <a-form
            ref="formRef"
            :model="formState"
            :rules="rules"
            layout="vertical"
            class="login-form"
            @finish="handleSubmit"
          >
            <a-form-item name="email" label="Email Address">
              <a-input
                v-model:value="formState.email"
                size="large"
                placeholder="name@company.com"
                class="form-input"
              >
                <template #prefix>
                  <MailOutlined class="input-icon" />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item name="password" label="Password">
              <a-input-password
                v-model:value="formState.password"
                size="large"
                placeholder="Enter your password"
                class="form-input"
              >
                <template #prefix>
                  <LockOutlined class="input-icon" />
                </template>
              </a-input-password>
            </a-form-item>

            <a-form-item>
              <div class="form-options">
                <a-checkbox v-model:checked="formState.remember" class="remember-checkbox">
                  Remember me
                </a-checkbox>
                <a href="#" class="forgot-link">Forgot password?</a>
              </div>
            </a-form-item>

            <a-form-item>
              <a-button
                type="primary"
                html-type="submit"
                size="large"
                block
                :loading="authStore.loading"
                class="login-button"
              >
                Sign in to Dashboard
              </a-button>
            </a-form-item>
          </a-form>

          <!-- Footer -->
          <div class="form-footer">
            <p class="footer-text">
              Protected by enterprise-grade encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #f8fafc;
}

.login-container {
  display: flex;
  min-height: 100vh;
}

/* Branding Side */
.login-branding {
  flex: 1;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
  padding: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.branding-overlay {
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2H6zM6 34v-4H4v4H0v2h4v4h2V6h4V4H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.branding-content {
  position: relative;
  z-index: 1;
  max-width: 540px;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 48px;
}

.logo-icon {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 28px;
  backdrop-filter: blur(10px);
}

.logo-icon.small {
  width: 44px;
  height: 44px;
  font-size: 22px;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-name {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.5px;
}

.logo-tagline {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.hero-section {
  margin-bottom: 48px;
}

.hero-title {
  font-size: 40px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.2;
  margin-bottom: 16px;
  letter-spacing: -1px;
}

.hero-description {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
  margin: 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 48px;
}

.feature-card {
  display: flex;
  gap: 14px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.feature-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.feature-icon {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 20px;
  flex-shrink: 0;
}

.feature-title {
  font-size: 15px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 4px 0;
}

.feature-description {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
  margin: 0;
  line-height: 1.4;
}

.trust-section {
  display: flex;
  align-items: center;
}

.trust-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 100px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 500;
  backdrop-filter: blur(10px);
}

/* Decorative Circles */
.decorative-circles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
}

.circle-1 {
  width: 400px;
  height: 400px;
  top: -100px;
  right: -100px;
}

.circle-2 {
  width: 300px;
  height: 300px;
  bottom: -50px;
  left: -50px;
}

.circle-3 {
  width: 200px;
  height: 200px;
  top: 50%;
  right: 20%;
  transform: translateY(-50%);
}

/* Form Side */
.login-form-container {
  flex: 0 0 520px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  background: #ffffff;
}

.login-form-wrapper {
  width: 100%;
  max-width: 400px;
}

.mobile-logo {
  display: none;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
}

.mobile-logo .logo-icon {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
}

.mobile-logo .logo-name {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
}

.form-header {
  margin-bottom: 32px;
}

.form-title {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.form-subtitle {
  font-size: 15px;
  color: #6b7280;
  margin: 0;
}

.login-error {
  margin-bottom: 24px;
  border-radius: 12px;
}

.login-form :deep(.ant-form-item-label > label) {
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.form-input :deep(.ant-input),
.form-input :deep(.ant-input-password) {
  height: 48px;
  border-radius: 12px;
  font-size: 15px;
}

.form-input :deep(.ant-input-affix-wrapper) {
  padding: 0 16px;
  border-radius: 12px;
  border: 1.5px solid #e5e7eb;
  transition: all 0.2s ease;
}

.form-input :deep(.ant-input-affix-wrapper:hover) {
  border-color: #6366f1;
}

.form-input :deep(.ant-input-affix-wrapper-focused) {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.input-icon {
  color: #9ca3af;
  font-size: 18px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remember-checkbox {
  color: #4b5563;
}

.forgot-link {
  color: #6366f1;
  font-weight: 500;
  font-size: 14px;
  transition: color 0.2s ease;
}

.forgot-link:hover {
  color: #4f46e5;
}

.login-button {
  height: 52px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
  transition: all 0.2s ease;
}

.login-button:hover {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.45);
  transform: translateY(-1px);
}

.form-footer {
  text-align: center;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f3f4f6;
}

.footer-text {
  color: #9ca3af;
  font-size: 13px;
  margin: 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .login-branding {
    display: none;
  }

  .login-form-container {
    flex: 1;
    padding: 24px;
  }

  .mobile-logo {
    display: flex;
  }
}

@media (max-width: 480px) {
  .login-form-wrapper {
    max-width: 100%;
  }

  .form-title {
    font-size: 24px;
  }
}
</style>
