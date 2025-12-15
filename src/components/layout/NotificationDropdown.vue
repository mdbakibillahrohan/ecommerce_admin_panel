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
  <a-popover
    v-model:open="visible"
    placement="bottomRight"
    trigger="click"
    :overlay-style="{ width: '380px' }"
    :overlay-class-name="'notification-popover'"
  >
    <template #content>
      <div class="notification-panel">
        <div class="notification-header">
          <span class="notification-title">Notifications</span>
          <a-button
            type="link"
            size="small"
            @click="markAllAsRead"
            :disabled="unreadCount === 0"
          >
            Mark all as read
          </a-button>
        </div>

        <div class="notification-list">
          <div
            v-for="notification in notifications"
            :key="notification.id"
            class="notification-item"
            :class="{ unread: !notification.read }"
          >
            <div class="notification-icon" :class="notification.type">
              <component :is="getNotificationIcon(notification.type)" />
            </div>
            <div class="notification-content">
              <div class="notification-item-title">{{ notification.title }}</div>
              <div class="notification-message">{{ notification.message }}</div>
              <div class="notification-time">{{ notification.time }}</div>
            </div>
            <div class="notification-actions">
              <a-button
                v-if="!notification.read"
                type="text"
                size="small"
                class="action-btn"
                @click.stop="markAsRead(notification)"
              >
                <CheckOutlined />
              </a-button>
              <a-button
                type="text"
                size="small"
                class="action-btn delete"
                @click.stop="removeNotification(notification.id)"
              >
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
.notification-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: #4b5563;
  font-size: 18px;
}

.notification-btn:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.notification-panel {
  margin: -12px -16px;
}

.notification-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.notification-title {
  font-weight: 600;
  font-size: 16px;
  color: #1f2937;
}

.notification-list {
  max-height: 360px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 14px 20px;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.15s ease;
}

.notification-item:hover {
  background: #f9fafb;
}

.notification-item.unread {
  background: #f0f9ff;
}

.notification-item.unread:hover {
  background: #e0f2fe;
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
}

.notification-icon.success {
  background: #dcfce7;
  color: #16a34a;
}

.notification-icon.warning {
  background: #fef3c7;
  color: #d97706;
}

.notification-icon.error {
  background: #fee2e2;
  color: #dc2626;
}

.notification-icon.info {
  background: #dbeafe;
  color: #2563eb;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-item-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 2px;
  font-size: 14px;
}

.notification-message {
  font-size: 13px;
  color: #4b5563;
  line-height: 1.4;
}

.notification-time {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 4px;
}

.notification-actions {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.action-btn {
  width: 28px;
  height: 28px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: #6b7280;
}

.action-btn:hover {
  background: #e5e7eb;
  color: #1f2937;
}

.action-btn.delete:hover {
  background: #fee2e2;
  color: #dc2626;
}

.notification-footer {
  padding: 12px 20px;
  border-top: 1px solid #f0f0f0;
}
</style>
