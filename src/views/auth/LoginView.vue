<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
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

onMounted(() => {
  // Redirect if already logged in
  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  }
})

async function handleSubmit(e: Event) {
  // e.preventDefault()
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
        <div class="branding-content">
          <div class="logo">
            <div class="logo-icon">🛒</div>
            <h1>E-Commerce Admin</h1>
          </div>
          <p class="tagline">Manage your store with ease</p>
          
          <div class="features">
            <div class="feature">
              <span class="feature-icon">📊</span>
              <span>Real-time Analytics</span>
            </div>
            <div class="feature">
              <span class="feature-icon">📦</span>
              <span>Inventory Management</span>
            </div>
            <div class="feature">
              <span class="feature-icon">🛍️</span>
              <span>Order Processing</span>
            </div>
            <div class="feature">
              <span class="feature-icon">💰</span>
              <span>Payment Tracking</span>
            </div>
          </div>
        </div>
        
        <div class="wave-decoration">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="rgba(255,255,255,0.1)" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,234.7C960,224,1056,192,1152,181.3C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      <!-- Right Side - Login Form -->
      <div class="login-form-container">
        <div class="login-form-wrapper">
          <div class="form-header">
            <h2>Welcome Back!</h2>
            <p>Sign in to your admin account</p>
          </div>

          <a-alert
            v-if="authStore.error"
            :message="authStore.error"
            type="error"
            showIcon
            closable
            class="login-error"
            @close="authStore.clearError"
          />

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
                placeholder="admin@example.com"
              >
                <template #prefix>
                  <UserOutlined class="input-icon" />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item name="password" label="Password">
              <a-input-password
                v-model:value="formState.password"
                size="large"
                placeholder="Enter your password"
              >
                <template #prefix>
                  <LockOutlined class="input-icon" />
                </template>
              </a-input-password>
            </a-form-item>

            <a-form-item>
              <div class="form-options">
                <a-checkbox v-model:checked="formState.remember">
                  Remember me
                </a-checkbox>
                <a class="forgot-link">Forgot password?</a>
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
                Sign In
              </a-button>
            </a-form-item>
          </a-form>

          <div class="form-footer">
            <p>Protected by enterprise-grade security</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #f0f2f5;
}

.login-container {
  display: flex;
  min-height: 100vh;
}

.login-branding {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.branding-content {
  position: relative;
  z-index: 1;
}

.logo {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.logo-icon {
  font-size: 48px;
}

.logo h1 {
  color: #fff;
  font-size: 32px;
  font-weight: 700;
  margin: 0;
}

.tagline {
  color: rgba(255, 255, 255, 0.85);
  font-size: 18px;
  margin-bottom: 48px;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature {
  display: flex;
  align-items: center;
  gap: 16px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.feature-icon {
  font-size: 24px;
}

.wave-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200px;
}

.wave-decoration svg {
  width: 100%;
  height: 100%;
}

.login-form-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: #fff;
}

.login-form-wrapper {
  width: 100%;
  max-width: 420px;
}

.form-header {
  text-align: center;
  margin-bottom: 40px;
}

.form-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: #262626;
  margin-bottom: 8px;
}

.form-header p {
  color: #8c8c8c;
  font-size: 16px;
}

.login-error {
  margin-bottom: 24px;
}

.login-form :deep(.ant-form-item-label) {
  padding-bottom: 4px;
}

.login-form :deep(.ant-form-item-label > label) {
  font-weight: 500;
  color: #434343;
}

.input-icon {
  color: #bfbfbf;
}

.login-form :deep(.ant-input-affix-wrapper) {
  border-radius: 8px;
}

.login-form :deep(.ant-input-affix-wrapper-lg) {
  padding: 12px 16px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot-link {
  color: #667eea;
  font-weight: 500;
}

.forgot-link:hover {
  color: #764ba2;
}

.login-button {
  height: 48px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.login-button:hover {
  background: linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%);
}

.form-footer {
  text-align: center;
  margin-top: 32px;
}

.form-footer p {
  color: #bfbfbf;
  font-size: 13px;
}

/* Responsive */
@media (max-width: 992px) {
  .login-branding {
    display: none;
  }

  .login-form-container {
    padding: 24px;
  }
}
</style>
