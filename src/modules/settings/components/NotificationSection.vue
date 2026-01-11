<script setup lang="ts">
import { computed } from 'vue'
import { BellOutlined } from '@ant-design/icons-vue'

interface Props {
    modelValue: {
        orderConfirmation: boolean
        orderShipped: boolean
        orderDelivered: boolean
        lowStock: boolean
        newReview: boolean
        newCustomer: boolean
        emailNotifications: boolean
        smsNotifications: boolean
        pushNotifications: boolean
    }
}

const props = defineProps<Props>()
const emit = defineEmits<{
    (e: 'update:modelValue', value: Props['modelValue']): void
}>()

const settings = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
})
</script>

<template>
    <a-card :bordered="false" class="settings-card">
        <a-form :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }" layout="vertical">
            <div class="form-section-title">
                <BellOutlined />
                Notification Preferences
            </div>

            <div class="notification-grid">
                <div class="notification-item">
                    <div class="notification-info">
                        <div class="notification-title">Order Confirmation</div>
                        <div class="notification-desc">Notify when a new order is placed</div>
                    </div>
                    <a-switch v-model:checked="settings.orderConfirmation" />
                </div>

                <div class="notification-item">
                    <div class="notification-info">
                        <div class="notification-title">Order Shipped</div>
                        <div class="notification-desc">Notify when an order is shipped</div>
                    </div>
                    <a-switch v-model:checked="settings.orderShipped" />
                </div>

                <div class="notification-item">
                    <div class="notification-info">
                        <div class="notification-title">Order Delivered</div>
                        <div class="notification-desc">Notify when an order is delivered</div>
                    </div>
                    <a-switch v-model:checked="settings.orderDelivered" />
                </div>

                <div class="notification-item">
                    <div class="notification-info">
                        <div class="notification-title">Low Stock Alert</div>
                        <div class="notification-desc">Notify when products are running low</div>
                    </div>
                    <a-switch v-model:checked="settings.lowStock" />
                </div>

                <div class="notification-item">
                    <div class="notification-info">
                        <div class="notification-title">New Review</div>
                        <div class="notification-desc">Notify when a customer leaves a review</div>
                    </div>
                    <a-switch v-model:checked="settings.newReview" />
                </div>

                <div class="notification-item">
                    <div class="notification-info">
                        <div class="notification-title">New Customer</div>
                        <div class="notification-desc">Notify when a new customer registers</div>
                    </div>
                    <a-switch v-model:checked="settings.newCustomer" />
                </div>
            </div>

            <div class="form-section-title">
                Notification Channels
            </div>

            <div class="notification-grid">
                <div class="notification-item">
                    <div class="notification-info">
                        <div class="notification-title">Email Notifications</div>
                        <div class="notification-desc">Receive notifications via email</div>
                    </div>
                    <a-switch v-model:checked="settings.emailNotifications" />
                </div>

                <div class="notification-item">
                    <div class="notification-info">
                        <div class="notification-title">SMS Notifications</div>
                        <div class="notification-desc">Receive notifications via SMS</div>
                    </div>
                    <a-switch v-model:checked="settings.smsNotifications" />
                </div>

                <div class="notification-item">
                    <div class="notification-info">
                        <div class="notification-title">Push Notifications</div>
                        <div class="notification-desc">Receive browser push notifications</div>
                    </div>
                    <a-switch v-model:checked="settings.pushNotifications" />
                </div>
            </div>
        </a-form>
    </a-card>
</template>

<style scoped>
.form-section-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 16px;
    font-weight: 600;
    color: var(--foreground);
    margin: 24px 0 16px;
    padding-bottom: 12px;
    border-bottom: 2px solid var(--border);
}

.notification-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 24px;
}

.notification-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background: var(--accent);
    border: 1px solid var(--border);
    border-radius: 12px;
    transition: all 0.3s ease;
}

.notification-item:hover {
    border-color: oklch(0.65 0.25 195);
    box-shadow: 0 4px 12px rgba(13, 148, 136, 0.1);
}

.notification-info {
    flex: 1;
}

.notification-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--foreground);
    margin-bottom: 4px;
}

.notification-desc {
    font-size: 14px;
    color: var(--muted-foreground);
}
</style>
