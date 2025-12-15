<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  RightOutlined,
} from '@ant-design/icons-vue'

const router = useRouter()
const authStore = useAuthStore()

const user = ref({
  name: 'Md Baki Billah',
  email: 'baki@admin.com',
  role: 'Administrator',
})

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <a-dropdown trigger="click" placement="bottomRight">
    <div class="user-trigger">
      <a-avatar :size="36" class="user-avatar">
        <template #icon><UserOutlined /></template>
      </a-avatar>
      <div class="user-info">
        <div class="user-name">{{ user.name }}</div>
        <div class="user-role">{{ user.role }}</div>
      </div>
      <RightOutlined class="trigger-arrow" />
    </div>

    <template #overlay>
      <div class="user-menu">
        <div class="user-menu-header">
          <a-avatar :size="48" class="menu-avatar">
            <template #icon><UserOutlined /></template>
          </a-avatar>
          <div class="menu-user-info">
            <div class="menu-user-name">{{ user.name }}</div>
            <div class="menu-user-email">{{ user.email }}</div>
          </div>
        </div>

        <a-menu class="user-menu-items">
          <a-menu-item key="profile">
            <UserOutlined />
            <span>My Profile</span>
          </a-menu-item>
          <a-menu-item key="settings">
            <SettingOutlined />
            <span>Settings</span>
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="logout" @click="handleLogout" danger>
            <LogoutOutlined />
            <span>Logout</span>
          </a-menu-item>
        </a-menu>
      </div>
    </template>
  </a-dropdown>
</template>

<style scoped>
.user-trigger {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.15s ease;
  margin-left: 8px;
}

.user-trigger:hover {
  background: #f3f4f6;
}

.user-avatar {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  flex-shrink: 0;
}

.user-info {
  display: none;
}

@media (min-width: 768px) {
  .user-info {
    display: block;
  }
}

.user-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
  line-height: 1.2;
}

.user-role {
  font-size: 12px;
  color: #6b7280;
}

.trigger-arrow {
  color: #9ca3af;
  font-size: 12px;
  display: none;
}

@media (min-width: 768px) {
  .trigger-arrow {
    display: block;
  }
}

.user-menu {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  min-width: 240px;
  overflow: hidden;
}

.user-menu-header {
  display: flex;
  gap: 12px;
  padding: 20px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  align-items: center;
}

.menu-avatar {
  background: rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
}

.menu-user-info {
  color: #ffffff;
}

.menu-user-name {
  font-weight: 600;
  font-size: 16px;
}

.menu-user-email {
  font-size: 13px;
  opacity: 0.9;
}

.user-menu-items {
  border: none;
  padding: 8px;
}

.user-menu-items :deep(.ant-menu-item) {
  border-radius: 8px;
  margin: 2px 0;
  height: 40px;
  line-height: 40px;
}

.user-menu-items :deep(.ant-menu-item:hover) {
  background: #f3f4f6;
}
</style>
