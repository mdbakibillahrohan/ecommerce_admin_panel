<script lang="ts" setup>
import { ref, computed } from 'vue'
import {
  BellOutlined,
  CheckOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons-vue'

interface Notification {
  id: number
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  time: string
  read: boolean
}

const visible = ref(false)

const notifications = ref<Notification[]>([
  {
    id: 1,
    type: 'success',
    title: 'Order Completed',
    message: 'Order #ORD-001 has been delivered successfully.',
    time: '5 min ago',
    read: false,
  },
  {
    id: 2,
    type: 'warning',
    title: 'Low Stock Alert',
    message: 'iPhone 15 Pro is running low on stock (5 left).',
    time: '15 min ago',
    read: false,
  },
  {
    id: 3,
    type: 'error',
    title: 'Payment Failed',
    message: 'Payment for Order #ORD-003 failed.',
    time: '1 hour ago',
    read: false,
  },
  {
    id: 4,
    type: 'info',
    title: 'New Customer',
    message: 'A new customer has registered on your store.',
    time: '2 hours ago',
    read: true,
  },
  {
    id: 5,
    type: 'success',
    title: 'Review Posted',
    message: 'New 5-star review on MacBook Air M3.',
    time: '3 hours ago',
    read: true,
  },
])

const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length)

function getNotificationIcon(type: string) {
  switch (type) {
    case 'success':
      return CheckCircleOutlined
    case 'warning':
      return WarningOutlined
    case 'error':
      return CloseCircleOutlined
    default:
      return InfoCircleOutlined
  }
}

function markAsRead(notification: Notification) {
  notification.read = true
}

function markAllAsRead() {
  notifications.value.forEach((n) => (n.read = true))
}

function removeNotification(id: number) {
  const index = notifications.value.findIndex((n) => n.id === id)
  if (index > -1) notifications.value.splice(index, 1)
}
</script>

<template>
  <a-popover v-model:open="visible" placement="bottomRight" trigger="click" :overlay-style="{ width: '380px' }"
    :overlay-class-name="'notification-popover'">
    <template #content>
      <div class="notification-panel">
        <div class="notification-header">
          <span class="notification-title">Notifications</span>
          <a-button type="link" size="small" @click="markAllAsRead" :disabled="unreadCount === 0">
            Mark all as read
          </a-button>
        </div>

        <div class="notification-list">
          <div v-for="notification in notifications" :key="notification.id" class="notification-item"
            :class="{ unread: !notification.read }">
            <div class="notification-icon" :class="notification.type">
              <component :is="getNotificationIcon(notification.type)" />
            </div>
            <div class="notification-content">
              <div class="notification-item-title">{{ notification.title }}</div>
              <div class="notification-message">{{ notification.message }}</div>
              <div class="notification-time">{{ notification.time }}</div>
            </div>
            <div class="notification-actions">
              <a-button v-if="!notification.read" type="text" size="small" class="action-btn"
                @click.stop="markAsRead(notification)">
                <CheckOutlined />
              </a-button>
              <a-button type="text" size="small" class="action-btn delete"
                @click.stop="removeNotification(notification.id)">
                <CloseOutlined />
              </a-button>
            </div>
          </div>
        </div>

        <div class="notification-footer">
          <a-button type="link" block>View All Notifications</a-button>
        </div>
      </div>
    </template>

    <a-badge :count="unreadCount" :offset="[-4, 4]">
      <a-button type="text" class="notification-btn">
        <BellOutlined />
      </a-button>
    </a-badge>
  </a-popover>
</template>

<style scoped>
/* Replaced all hardcoded colors with CSS variables for proper theme handling */

.notification-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: var(--muted-foreground);
  font-size: 18px;
  transition: all 0.2s ease;
}

.notification-btn:hover {
  background: var(--accent);
  color: var(--primary);
}

.notification-panel {
  margin: -12px -16px;
  background: var(--popover);
}

.notification-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  background: var(--popover);
}

.notification-title {
  font-weight: 600;
  font-size: 16px;
  color: var(--foreground);
}

.notification-list {
  max-height: 360px;
  overflow-y: auto;
  background: var(--popover);
}

/* Custom scrollbar */
.notification-list::-webkit-scrollbar {
  width: 6px;
}

.notification-list::-webkit-scrollbar-track {
  background: transparent;
}

.notification-list::-webkit-scrollbar-thumb {
  background: oklch(0.65 0.15 192);
  border-radius: 3px;
}

.notification-list::-webkit-scrollbar-thumb:hover {
  background: oklch(0.55 0.18 192);
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 14px 20px;
  border-bottom: 1px solid var(--border);
  transition: all 0.15s ease;
  background: var(--popover);
}

.notification-item:hover {
  background: var(--accent);
  transform: translateX(2px);
}

.notification-item.unread {
  background: oklch(0.95 0.02 192);
  border-left: 3px solid oklch(0.65 0.15 192);
  padding-left: 17px;
}

:global(.dark) .notification-item.unread {
  background: oklch(0.25 0.05 192);
  border-left-color: oklch(0.65 0.15 192);
}

.notification-item.unread:hover {
  background: oklch(0.92 0.03 192);
}

:global(.dark) .notification-item.unread:hover {
  background: oklch(0.28 0.06 192);
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 18px;
  transition: all 0.2s ease;
}

.notification-item:hover .notification-icon {
  transform: scale(1.05);
}

.notification-icon.success {
  background: oklch(0.92 0.1 145);
  color: oklch(0.45 0.15 145);
}

:global(.dark) .notification-icon.success {
  background: oklch(0.3 0.1 145);
  color: oklch(0.7 0.15 145);
}

.notification-icon.warning {
  background: oklch(0.92 0.1 85);
  color: oklch(0.5 0.15 85);
}

:global(.dark) .notification-icon.warning {
  background: oklch(0.3 0.1 85);
  color: oklch(0.75 0.15 85);
}

.notification-icon.error {
  background: oklch(0.92 0.1 25);
  color: oklch(0.5 0.18 25);
}

:global(.dark) .notification-icon.error {
  background: oklch(0.3 0.1 25);
  color: oklch(0.75 0.15 25);
}

.notification-icon.info {
  background: oklch(0.92 0.08 240);
  color: oklch(0.5 0.15 240);
}

:global(.dark) .notification-icon.info {
  background: oklch(0.3 0.08 240);
  color: oklch(0.7 0.15 240);
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-item-title {
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 2px;
  font-size: 14px;
}

.notification-message {
  font-size: 13px;
  color: var(--muted-foreground);
  line-height: 1.4;
}

.notification-time {
  font-size: 12px;
  color: oklch(0.6 0.02 192);
  margin-top: 4px;
}

.notification-actions {
  display: flex;
  flex-direction: column;
  gap: 2px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.notification-item:hover .notification-actions {
  opacity: 1;
}

.action-btn {
  width: 28px;
  height: 28px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: var(--muted-foreground);
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: oklch(0.65 0.15 192);
  color: white;
  transform: scale(1.1);
}

.action-btn.delete:hover {
  background: oklch(0.55 0.18 25);
  color: white;
}

.notification-footer {
  padding: 12px 20px;
  border-top: 1px solid var(--border);
  background: var(--popover);
}

.notification-footer :deep(.ant-btn-link) {
  color: oklch(0.65 0.15 192);
  font-weight: 500;
  transition: all 0.2s ease;
}

.notification-footer :deep(.ant-btn-link:hover) {
  color: oklch(0.55 0.18 192);
  transform: translateY(-1px);
}
</style>
