<script setup lang="ts">
interface Props {
    totalCategories: number
    totalProducts: number
    activeCategories: number
}

const props = defineProps<Props>()
</script>

<template>
    <div class="category-stats">
        <a-row :gutter="16">
            <a-col :xs="24" :sm="8">
                <a-card :bordered="false" class="stat-card">
                    <a-statistic title="Total Categories" :value="totalCategories">
                        <template #prefix>
                            <folder-outlined />
                        </template>
                    </a-statistic>
                </a-card>
            </a-col>

            <a-col :xs="24" :sm="8">
                <a-card :bordered="false" class="stat-card">
                    <a-statistic title="Total Products" :value="totalProducts">
                        <template #prefix>
                            <appstore-outlined />
                        </template>
                    </a-statistic>
                </a-card>
            </a-col>

            <a-col :xs="24" :sm="8">
                <a-card :bordered="false" class="stat-card">
                    <a-statistic title="Active Categories" :value="activeCategories"
                        :value-style="{ color: '#3f8600' }">
                        <template #prefix>
                            <check-circle-outlined />
                        </template>
                    </a-statistic>
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>

<script setup lang="ts">
import { FolderOutlined, AppstoreOutlined, CheckCircleOutlined } from '@ant-design/icons-vue'
</script>

<style scoped>
.category-stats {
    margin-bottom: 24px;
}

.stat-card {
    border: 1px solid var(--border);
    border-radius: 12px;
}
</style>
