<script setup lang="ts">
interface Props {
    totalRevenue: number
    totalOrders: number
    totalCustomers: number
    conversionRate: number
}

const props = defineProps<Props>()

function formatCurrency(amount: number) {
    return `$${amount.toLocaleString()}`
}

function formatPercentage(value: number) {
    return `${value.toFixed(1)}%`
}
</script>

<template>
    <div class="dashboard-stats">
        <a-row :gutter="16">
            <a-col :xs="24" :sm="12" :lg="6">
                <a-card :bordered="false" class="stat-card">
                    <a-statistic title="Total Revenue" :value="formatCurrency(totalRevenue)">
                        <template #prefix>
                            <dollar-outlined />
                        </template>
                    </a-statistic>
                </a-card>
            </a-col>

            <a-col :xs="24" :sm="12" :lg="6">
                <a-card :bordered="false" class="stat-card">
                    <a-statistic title="Total Orders" :value="totalOrders">
                        <template #prefix>
                            <shopping-outlined />
                        </template>
                    </a-statistic>
                </a-card>
            </a-col>

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
                    <a-statistic title="Conversion Rate" :value="formatPercentage(conversionRate)"
                        :value-style="{ color: '#3f8600' }">
                        <template #prefix>
                            <rise-outlined />
                        </template>
                    </a-statistic>
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>

<script setup lang="ts">
import { DollarOutlined, ShoppingOutlined, UserOutlined, RiseOutlined } from '@ant-design/icons-vue'
</script>

<style scoped>
.dashboard-stats {
    margin-bottom: 24px;
}

.stat-card {
    border: 1px solid var(--border);
    border-radius: 12px;
}
</style>
