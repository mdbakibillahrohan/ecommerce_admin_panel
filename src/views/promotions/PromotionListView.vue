<template>
    <div class="promotion-list">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">Promotions</h1>
            <a-button type="primary" @click="router.push('/promotions/create')">
                <PlusOutlined /> Create Promotion
            </a-button>
        </div>

        <a-card :bordered="false" class="shadow-sm rounded-lg">
            <a-table :columns="columns" :dataSource="promotions" :loading="loading" :pagination="pagination"
                @change="handleTableChange" rowKey="id">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'status'">
                        <a-tag :color="record.is_active ? 'green' : 'red'">
                            {{ record.is_active ? 'Active' : 'Inactive' }}
                        </a-tag>
                    </template>

                    <template v-if="column.key === 'discount'">
                        <span v-if="record.discount_type === 'PERCENTAGE'">{{ record.discount_value }}%</span>
                        <span v-else>${{ record.discount_value }}</span>
                    </template>

                    <template v-if="column.key === 'dates'">
                        <div class="text-xs text-gray-500">
                            <div>Start: {{ formatDate(record.start_date) }}</div>
                            <div>End: {{ formatDate(record.end_date) }}</div>
                        </div>
                    </template>

                    <template v-if="column.key === 'actions'">
                        <div class="flex gap-2">
                            <a-button size="small" @click="router.push(`/promotions/${record.id}/edit`)">
                                <EditOutlined />
                            </a-button>
                            <a-popconfirm title="Are you sure?" @confirm="handleDelete(record.id)">
                                <a-button size="small" danger>
                                    <DeleteOutlined />
                                </a-button>
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
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { promotionService } from '@/services/promotion.service'
import dayjs from 'dayjs'

const router = useRouter()
const loading = ref(false)
const promotions = ref([])
const pagination = ref({
    current: 1,
    pageSize: 10,
    total: 0,
})

const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Discount', key: 'discount' },
    { title: 'Usage', dataIndex: 'used_count', key: 'used_count' },
    { title: 'Duration', key: 'dates' },
    { title: 'Status', key: 'status' },
    { title: 'Actions', key: 'actions', width: 120 },
]

const fetchPromotions = async () => {
    loading.value = true
    try {
        const { current, pageSize } = pagination.value
        const data = await promotionService.getPromotions({ page: current, limit: pageSize })
        promotions.value = data.data
        pagination.value.total = data.total
    } catch (error) {
        message.error('Failed to load promotions')
    } finally {
        loading.value = false
    }
}

const handleTableChange = (pag: any) => {
    pagination.value = pag
    fetchPromotions()
}

const handleDelete = async (id: number) => {
    try {
        await promotionService.deletePromotion(id)
        message.success('Promotion deleted')
        fetchPromotions()
    } catch (error) {
        message.error('Failed to delete promotion')
    }
}

const formatDate = (date: string) => {
    return dayjs(date).format('MMM D, YYYY')
}

onMounted(() => {
    fetchPromotions()
})
</script>
