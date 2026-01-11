<script setup lang="ts">
interface Props {
    totalCustomers: number
    activeCustomers: number
    newThisMonth: number
    averageOrderValue: number
}

const props = defineProps<Props>()

function formatCurrency(amount: number) {
    return `$${amount.toFixed(2)}`
}
</script>

<template>
    <div class="customer-stats">
        <a-row :gutter="16">
            <a-col :xs="24" :sm="12" :lg="6">
                <a-card :bordered="false" class="stat-card">
                    <a-statistic title="Total Customers" :value="totalCustomers">
                        <template #prefix>
                            <user-outlined />
                        </template>
                    </a-statistic>
                </a-card>
            </a-col>

            <a-col :xs="24" :sm="12" :lg="6">
                <a-card :bordered="false" class="stat-card">
                    <a-statistic title="Active Customers" :value="activeCustomers" :value-style="{ color: '#3f8600' }">
                        <template #prefix>
                            <check-circle-outlined />
                        </template>
                    </a-statistic>
                </a-card>
            </a-col>

            <a-col :xs="24" :sm="12" :lg="6">
                <a-card :bordered="false" class="stat-card">
                    <a-statistic title="New This Month" :value="newThisMonth" :value-style="{ color: '#1890ff' }">
                        <template #prefix>
                            <user-add-outlined />
                        </template>
                    </a-statistic>
                </a-card>
            </a-col>

            <a-col :xs="24" :sm="12" :lg="6">
                <a-card :bordered="false" class="stat-card">
                    <a-statistic title="Avg Order Value" :value="formatCurrency(averageOrderValue)">
                        <template #prefix>
                            <dollar-outlined />
                        </template>
                    </a-statistic>
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>

<script setup lang="ts">
import { UserOutlined, CheckCircleOutlined, UserAddOutlined, DollarOutlined } from '@ant-design/icons-vue'
</script>

<style scoped>
.customer-stats {
    margin-bottom: 24px;
}

.stat-card {
    border: 1px solid var(--border);
    border-radius: 12px;
}
</style>
