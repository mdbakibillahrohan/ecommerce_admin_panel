<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/store'
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/modules/auth/store/user'

const router = useRouter()
const authStore = useAuthStore()
const userStore = useUserStore()

const user = computed(() => ({
  name: userStore.currentUserInfo?.first_name || 'Admin User',
  email: userStore.currentUserInfo?.email || 'baki@admin.com',
  role: 'Administrator',
}))

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <a-dropdown trigger="click" placement="bottomRight">
    <div class="user-trigger">
      <a-avatar :size="40" class="user-avatar">
        <template #icon>
          <UserOutlined />
        </template>
      </a-avatar>
      <div class="user-info">
        <div class="user-name">{{ user.name }}</div>
        <div class="user-role">{{ user.role }}</div>
      </div>
      <div class="status-indicator"></div>
    </div>

    <template #overlay>
      <div class="user-menu">
        <div class="user-menu-header">
          <div class="header-background"></div>
          <a-avatar :size="56" class="menu-avatar">
            <template #icon>
              <UserOutlined />
            </template>
          </a-avatar>
          <div class="menu-user-info">
            <div class="menu-user-name">{{ user.name }}</div>
            <div class="menu-user-email">{{ user.email }}</div>
            <div class="menu-user-badge">{{ user.role }}</div>
          </div>
        </div>

        <a-menu class="user-menu-items">
          <a-menu-item key="profile">
            <div class="menu-item-content">
              <div class="menu-item-icon">
                <UserOutlined />
              </div>
              <div class="menu-item-text">
                <div class="menu-item-label">My Profile</div>
                <div class="menu-item-desc">View and edit your profile</div>
              </div>
            </div>
          </a-menu-item>
          <a-menu-item key="settings">
            <div class="menu-item-content">
              <div class="menu-item-icon">
                <SettingOutlined />
              </div>
              <div class="menu-item-text">
                <div class="menu-item-label">Settings</div>
                <div class="menu-item-desc">Manage preferences</div>
              </div>
            </div>
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="logout" @click="handleLogout" danger>
            <div class="menu-item-content">
              <div class="menu-item-icon">
                <LogoutOutlined />
              </div>
              <div class="menu-item-text">
                <div class="menu-item-label">Logout</div>
                <div class="menu-item-desc">Sign out of your account</div>
              </div>
            </div>
          </a-menu-item>
        </a-menu>
      </div>
    </template>
  </a-dropdown>
</template>

<style scoped>
/* Enhanced trigger button with professional design */
.user-trigger {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 12px 6px 6px;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  background: var(--background);
  border: 2px solid transparent;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.user-trigger::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(135deg, oklch(0.65 0.15 180) 0%, oklch(0.7 0.14 180) 50%, oklch(0.75 0.13 185) 100%);
  border-radius: 50px;
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: -1;
}

.user-trigger:hover::before {
  opacity: 1;
}

.user-trigger:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(13, 148, 136, 0.25);
  border-color: transparent;
}

/* Avatar with enhanced gradient and glow effect */
.user-avatar {
  background: linear-gradient(135deg, oklch(0.65 0.15 180) 0%, oklch(0.7 0.14 180) 50%, oklch(0.75 0.13 185) 100%);
  flex-shrink: 0;
  box-shadow: 0 4px 16px rgba(13, 148, 136, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 3px solid var(--background);
}

.user-trigger:hover .user-avatar {
  transform: scale(1.08) rotate(5deg);
  box-shadow: 0 6px 20px rgba(13, 148, 136, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

/* Status indicator with pulse animation */
.status-indicator {
  position: absolute;
  bottom: 8px;
  left: 32px;
  width: 10px;
  height: 10px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  border: 2px solid var(--background);
  box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  animation: pulse 2s infinite;
}

@keyframes pulse {

  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  }

  50% {
    box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
  }
}

.user-info {
  display: none;
  line-height: 1.3;
}

@media (min-width: 768px) {
  .user-info {
    display: block;
  }
}

.user-name {
  font-weight: 600;
  color: var(--foreground);
  font-size: 14px;
  letter-spacing: -0.01em;
  transition: color 0.3s ease;
}

.user-trigger:hover .user-name {
  color: oklch(0.65 0.15 180);
}

.user-role {
  font-size: 12px;
  color: var(--muted-foreground);
  font-weight: 500;
  transition: color 0.3s ease;
}

.user-trigger:hover .user-role {
  color: oklch(0.7 0.14 180);
}

/* Enhanced dropdown menu with modern glass effect */
.user-menu {
  background: var(--popover);
  border-radius: 20px;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.15),
    0 8px 24px rgba(0, 0, 0, 0.1),
    0 0 0 1px var(--border);
  min-width: 320px;
  overflow: hidden;
  animation: menuSlide 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  backdrop-filter: blur(20px);
}

@keyframes menuSlide {
  from {
    opacity: 0;
    transform: translateY(-12px) scale(0.96);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Premium gradient header with depth */
.user-menu-header {
  display: flex;
  gap: 16px;
  padding: 28px 24px;
  align-items: flex-start;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, oklch(0.65 0.15 180) 0%, oklch(0.7 0.14 180) 50%, oklch(0.75 0.13 185) 100%);
}

.header-background {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 40%),
    linear-gradient(135deg, transparent 0%, rgba(0, 0, 0, 0.05) 100%);
  animation: headerShimmer 8s ease-in-out infinite;
}

@keyframes headerShimmer {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.8;
  }
}

.menu-avatar {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  flex-shrink: 0;
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    0 0 0 3px rgba(255, 255, 255, 0.2);
  border: none;
  position: relative;
  z-index: 2;
}

.menu-user-info {
  color: #ffffff;
  position: relative;
  z-index: 2;
  flex: 1;
}

.menu-user-name {
  font-weight: 700;
  font-size: 17px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  margin-bottom: 4px;
  letter-spacing: -0.02em;
}

.menu-user-email {
  font-size: 13px;
  opacity: 0.92;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  font-weight: 500;
  margin-bottom: 8px;
}

/* Role badge with professional styling */
.menu-user-badge {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Enhanced menu items with descriptions and better spacing */
.user-menu-items {
  border: none;
  padding: 16px;
  background: var(--popover);
}

.user-menu-items :deep(.ant-menu-item) {
  border-radius: 12px;
  margin: 4px 0;
  height: auto;
  line-height: normal;
  padding: 0;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
  background: transparent;
}

.user-menu-items :deep(.ant-menu-item)::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, oklch(0.65 0.15 180) 0%, oklch(0.7 0.14 180) 100%);
  border-radius: 0 4px 4px 0;
  transform: scaleY(0);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.user-menu-items :deep(.ant-menu-item:hover) {
  background: linear-gradient(90deg, rgba(13, 148, 136, 0.08) 0%, transparent 100%);
  transform: translateX(4px);
}

.user-menu-items :deep(.ant-menu-item:hover)::before {
  transform: scaleY(1);
}

.user-menu-items :deep(.ant-menu-item.ant-menu-item-danger:hover) {
  background: linear-gradient(90deg, rgba(239, 68, 68, 0.08) 0%, transparent 100%);
}

.user-menu-items :deep(.ant-menu-item.ant-menu-item-danger:hover)::before {
  background: linear-gradient(180deg, #ef4444 0%, #dc2626 100%);
}

.menu-item-content {
  display: flex;
  gap: 14px;
  padding: 14px 16px;
  align-items: center;
}

.menu-item-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(13, 148, 136, 0.1) 0%, rgba(13, 148, 136, 0.05) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: oklch(0.65 0.15 180);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  flex-shrink: 0;
}

.user-menu-items :deep(.ant-menu-item:hover) .menu-item-icon {
  background: linear-gradient(135deg, oklch(0.65 0.15 180) 0%, oklch(0.7 0.14 180) 100%);
  color: #ffffff;
  transform: rotate(8deg) scale(1.05);
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.3);
}

.user-menu-items :deep(.ant-menu-item.ant-menu-item-danger:hover) .menu-item-icon {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: #ffffff;
}

.menu-item-text {
  flex: 1;
  line-height: 1.4;
}

.menu-item-label {
  font-weight: 600;
  font-size: 14px;
  color: var(--foreground);
  margin-bottom: 2px;
  transition: color 0.3s ease;
}

.user-menu-items :deep(.ant-menu-item:hover) .menu-item-label {
  color: oklch(0.65 0.15 180);
}

.user-menu-items :deep(.ant-menu-item.ant-menu-item-danger:hover) .menu-item-label {
  color: #ef4444;
}

.menu-item-desc {
  font-size: 12px;
  color: var(--muted-foreground);
  font-weight: 500;
  transition: color 0.3s ease;
}

.user-menu-items :deep(.ant-menu-item:hover) .menu-item-desc {
  color: oklch(0.7 0.14 180);
}

.user-menu-items :deep(.ant-menu-item.ant-menu-item-danger:hover) .menu-item-desc {
  color: #f87171;
}

.user-menu-items :deep(.ant-menu-divider) {
  margin: 12px 0;
  background: var(--border);
  opacity: 0.6;
}
</style>
