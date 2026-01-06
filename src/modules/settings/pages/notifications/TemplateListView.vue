<template>
    <div class="notification-templates">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">Notification Templates</h1>
            <a-button type="primary" @click="router.push('/settings/notifications/create')">
                <PlusOutlined /> Create Template
            </a-button>
        </div>

        <a-card :bordered="false" class="shadow-sm rounded-lg">
            <a-table :columns="columns" :dataSource="templates" :loading="loading" rowKey="id">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'status'">
                        <a-tag :color="record.is_active ? 'green' : 'red'">
                            {{ record.is_active ? 'Active' : 'Inactive' }}
                        </a-tag>
                    </template>

                    <template v-if="column.key === 'actions'">
                        <div class="flex gap-2">
                            <a-button size="small" @click="router.push(`/settings/notifications/${record.id}/edit`)">
                                Edit
                            </a-button>
                            <a-popconfirm title="Delete template?" @confirm="handleDelete(record.id)">
                                <a-button size="small" danger type="text">Delete</a-button>
                            </a-popconfirm>
                        </div>
                    </template>
                </template>
            </a-table>
        </a-card>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { notificationService, type NotificationTemplate } from '@/modules/settings/services/notification.service'

const router = useRouter()
const loading = ref(false)
const templates = ref<NotificationTemplate[]>([])

const columns = [
    { title: 'Event', dataIndex: 'event', key: 'event' },
    { title: 'Channel', dataIndex: 'channel', key: 'channel' },
    { title: 'Subject', dataIndex: 'subject', key: 'subject' },
    { title: 'Status', key: 'status' },
    { title: 'Actions', key: 'actions', width: 120 },
]

const fetchTemplates = async () => {
    loading.value = true
    try {
        const data = await notificationService.getTemplates()
        templates.value = data
    } catch (error) {
        message.error('Failed to load templates')
    } finally {
        loading.value = false
    }
}

const handleDelete = async (id: number) => {
    try {
        await notificationService.deleteTemplate(id)
        message.success('Template deleted')
        fetchTemplates()
    } catch (error) {
        message.error('Failed to delete template')
    }
}

onMounted(() => {
    fetchTemplates()
})
</script>
