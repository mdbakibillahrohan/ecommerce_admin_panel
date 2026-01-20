<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/store'
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
      usernameOrEmail: formState.value.email,
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
              <span class="logo-name">Adaptive Innovate</span>
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
            <span class="logo-name">Adaptive Innovate</span>
          </div>

          <!-- Form Header -->
          <div class="form-header">
            <h2 class="form-title">Welcome back</h2>
            <p class="form-subtitle">Enter your credentials to access your dashboard</p>
          </div>

          <!-- Error Alert -->
          <a-alert v-if="authStore.error" :message="authStore.error" type="error" showIcon closable class="login-error"
            @close="authStore.clearError" />

          <!-- Login Form -->
          <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical" class="login-form"
            @finish="handleSubmit">
            <a-form-item name="email" label="Email Address">
              <a-input v-model:value="formState.email" size="large" placeholder="name@company.com" class="form-input">
                <template #prefix>
                  <MailOutlined class="input-icon" />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item name="password" label="Password">
              <a-input-password v-model:value="formState.password" size="large" placeholder="Enter your password"
                class="form-input">
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
              <a-button type="primary" html-type="submit" size="large" block :loading="authStore.loading"
                class="login-button">
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
  background: var(--background);
}

.login-container {
  display: flex;
  min-height: 100vh;
}

/* Branding Side */
.login-branding {
  flex: 1;
  background: linear-gradient(135deg,
      oklch(0.55 0.18 192) 0%,
      oklch(0.50 0.20 192) 50%,
      oklch(0.45 0.22 192) 100%);
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
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 34v-4H4v4H0v2h4v4h2V6h4V4H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  animation: slidePattern 30s linear infinite;
}

@keyframes slidePattern {
  0% {
    transform: translate(0, 0);
  }

  100% {
    transform: translate(60px, 60px);
  }
}

.branding-content {
  position: relative;
  z-index: 1;
  max-width: 540px;
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 48px;
  animation: fadeInUp 0.8s ease-out 0.1s both;
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
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo-icon:hover {
  transform: scale(1.05) rotate(5deg);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
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
  animation: fadeInUp 0.8s ease-out 0.2s both;
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUp 0.8s ease-out calc(0.3s + var(--index) * 0.1s) both;
}

.feature-card:nth-child(1) {
  --index: 0;
}

.feature-card:nth-child(2) {
  --index: 1;
}

.feature-card:nth-child(3) {
  --index: 2;
}

.feature-card:nth-child(4) {
  --index: 3;
}

.feature-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
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
  transition: all 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1) rotate(5deg);
}

.feature-content {
  flex: 1;
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
  animation: fadeInUp 0.8s ease-out 0.7s both;
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
  transition: all 0.3s ease;
}

.trust-badge:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(4px);
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
  animation: float 20s ease-in-out infinite;
}

@keyframes float {

  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  50% {
    transform: translate(30px, -30px) scale(1.1);
  }
}

.circle-1 {
  width: 400px;
  height: 400px;
  top: -100px;
  right: -100px;
  animation-delay: 0s;
}

.circle-2 {
  width: 300px;
  height: 300px;
  bottom: -50px;
  left: -50px;
  animation-delay: -7s;
}

.circle-3 {
  width: 200px;
  height: 200px;
  top: 50%;
  right: 20%;
  animation-delay: -14s;
}

/* Form Side */
.login-form-container {
  flex: 0 0 520px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  background: var(--card);
}

.login-form-wrapper {
  width: 100%;
  max-width: 400px;
  animation: fadeInRight 0.8s ease-out;
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.mobile-logo {
  display: none;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
}

.mobile-logo .logo-icon {
  background: linear-gradient(135deg,
      oklch(0.55 0.18 192) 0%,
      oklch(0.45 0.22 192) 100%);
}

.mobile-logo .logo-name {
  font-size: 24px;
  font-weight: 700;
  color: var(--foreground);
}

.form-header {
  margin-bottom: 32px;
}

.form-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.form-subtitle {
  font-size: 15px;
  color: var(--muted-foreground);
  margin: 0;
}

.login-error {
  margin-bottom: 24px;
  border-radius: 12px;
}

.login-form :deep(.ant-form-item-label > label) {
  font-weight: 500;
  color: var(--foreground);
  font-size: 14px;
}

.form-input :deep(.ant-input),
.form-input :deep(.ant-input-password) {
  height: 48px;
  border-radius: 12px;
  font-size: 15px;
  background: var(--background);
  color: var(--foreground);
  border: 1.5px solid var(--border);
}

.form-input :deep(.ant-input-affix-wrapper) {
  padding: 0 16px;
  border-radius: 12px;
  border: 1.5px solid var(--border);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--background);
}

.form-input :deep(.ant-input-affix-wrapper:hover) {
  border-color: oklch(0.55 0.18 192);
  box-shadow: 0 0 0 3px oklch(0.55 0.18 192 / 0.1);
}

.form-input :deep(.ant-input-affix-wrapper-focused) {
  border-color: oklch(0.55 0.18 192);
  box-shadow: 0 0 0 4px oklch(0.55 0.18 192 / 0.15);
}

.input-icon {
  color: var(--muted-foreground);
  font-size: 18px;
  transition: all 0.3s ease;
}

.form-input :deep(.ant-input-affix-wrapper:focus-within) .input-icon {
  color: oklch(0.55 0.18 192);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remember-checkbox {
  color: var(--muted-foreground);
}

.forgot-link {
  color: oklch(0.55 0.18 192);
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s ease;
  text-decoration: none;
}

.forgot-link:hover {
  color: oklch(0.50 0.20 192);
  text-decoration: underline;
}

.login-button {
  height: 52px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg,
      oklch(0.55 0.18 192) 0%,
      oklch(0.45 0.22 192) 100%);
  border: none;
  box-shadow: 0 4px 14px oklch(0.55 0.18 192 / 0.35);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.login-button:not(:disabled):hover {
  background: linear-gradient(135deg,
      oklch(0.50 0.20 192) 0%,
      oklch(0.40 0.24 192) 100%);
  box-shadow: 0 6px 20px oklch(0.55 0.18 192 / 0.45);
  transform: translateY(-2px);
}

.login-button:not(:disabled):active {
  transform: translateY(0);
}

.form-footer {
  text-align: center;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}

.footer-text {
  color: var(--muted-foreground);
  font-size: 13px;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
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
  .login-form-container {
    padding: 20px;
  }

  .login-form-wrapper {
    max-width: 100%;
  }

  .form-title {
    font-size: 24px;
  }

  .form-input :deep(.ant-input),
  .form-input :deep(.ant-input-password) {
    height: 44px;
  }

  .login-button {
    height: 48px;
  }
}
</style>
