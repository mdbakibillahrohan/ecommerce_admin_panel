<template>
    <div class="notification-template-form max-w-4xl mx-auto">
        <div class="mb-6">
            <a-button @click="router.back()" class="mb-4">Back</a-button>
            <h1 class="text-2xl font-bold">{{ isEdit ? 'Edit Template' : 'Create Template' }}</h1>
        </div>

        <a-card :loading="loading">
            <a-form layout="vertical" :model="formState" @finish="onFinish">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a-form-item label="Event" name="event" :rules="[{ required: true }]">
                        <a-select v-model:value="formState.event">
                            <a-select-option value="ORDER_CREATED">Order Created</a-select-option>
                            <a-select-option value="ORDER_SHIPPED">Order Shipped</a-select-option>
                            <a-select-option value="USER_REGISTERED">User Registered</a-select-option>
                        </a-select>
                    </a-form-item>

                    <a-form-item label="Channel" name="channel" :rules="[{ required: true }]">
                        <a-select v-model:value="formState.channel">
                            <a-select-option value="EMAIL">Email</a-select-option>
                            <a-select-option value="PUSH">Push Notification</a-select-option>
                            <a-select-option value="SMS">SMS</a-select-option>
                        </a-select>
                    </a-form-item>
                </div>

                <a-form-item label="Subject" name="subject" :rules="[{ required: true }]">
                    <a-input v-model:value="formState.subject" />
                </a-form-item>

                <a-form-item label="Content" name="content" :rules="[{ required: true }]">
                    <a-textarea v-model:value="formState.content" :rows="8"
                        placeholder="Use {{variable}} for dynamic content" />
                    <div class="text-xs text-gray-500 mt-1" v-pre>
                        Available variables: {{ customer_name }}, {{ order_id }}, {{ amount }}, etc.
                    </div>
                </a-form-item>

                <a-form-item label="Active">
                    <a-switch v-model:checked="formState.is_active" />
                </a-form-item>

                <a-form-item>
                    <a-button type="primary" html-type="submit" :loading="saving">Save Template</a-button>
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { notificationService } from '@/modules/settings/services/notification.service'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const saving = ref(false)

const isEdit = computed(() => route.params.id !== undefined)

const formState = reactive({
    event: 'ORDER_CREATED',
    channel: 'EMAIL',
    subject: '',
    content: '',
    is_active: true
})

const fetchTemplate = async (id: number) => {
    loading.value = true
    try {
        const data = await notificationService.getTemplate(id)
        Object.assign(formState, data)
    } catch (error) {
        message.error('Failed to load template')
        router.back()
    } finally {
        loading.value = false
    }
}

const onFinish = async () => {
    saving.value = true
    try {
        if (isEdit.value) {
            await notificationService.updateTemplate(Number(route.params.id), formState)
            message.success('Template updated')
        } else {
            await notificationService.createTemplate(formState)
            message.success('Template created')
        }
        router.push('/settings/notifications')
    } catch (error) {
        message.error('Failed to save template')
    } finally {
        saving.value = false
    }
}

onMounted(() => {
    if (isEdit.value) {
        fetchTemplate(Number(route.params.id))
    }
})
</script>
