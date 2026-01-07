<template>
    <div class="form-skeleton">
        <a-row :gutter="24">
            <!-- Main Form Column -->
            <a-col :xs="24" :lg="16">
                <a-card :bordered="false" class="skeleton-card">
                    <a-skeleton :active="true" :title="true" :paragraph="{ rows: 1 }" />
                    <a-divider />

                    <!-- Form Fields -->
                    <div v-for="i in fieldCount" :key="i" class="skeleton-field">
                        <a-skeleton-input :active="true" size="small" style="width: 120px; margin-bottom: 8px" />
                        <a-skeleton-input :active="true" size="large" block />
                    </div>
                </a-card>

                <!-- Additional Sections -->
                <a-card v-if="showExtraSection" :bordered="false" class="skeleton-card" style="margin-top: 24px">
                    <a-skeleton :active="true" :title="true" :paragraph="{ rows: 4 }" />
                </a-card>
            </a-col>

            <!-- Sidebar Column -->
            <a-col :xs="24" :lg="8">
                <!-- Image Upload Section -->
                <a-card :bordered="false" class="skeleton-card">
                    <a-skeleton :active="true" :title="true" :paragraph="false" />
                    <div class="skeleton-image">
                        <a-skeleton-image :active="true" style="width: 100%; height: 200px" />
                    </div>
                </a-card>

                <!-- Info Card -->
                <a-card :bordered="false" class="skeleton-card" style="margin-top: 24px">
                    <a-skeleton :active="true" :title="true" :paragraph="{ rows: 3 }" />
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>

<script setup lang="ts">
interface Props {
    fieldCount?: number
    showExtraSection?: boolean
}

withDefaults(defineProps<Props>(), {
    fieldCount: 6,
    showExtraSection: false,
})
</script>

<style scoped>
.form-skeleton {
    width: 100%;
}

.skeleton-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
}

.skeleton-field {
    margin-bottom: 24px;
}

.skeleton-image {
    margin-top: 16px;
}

.skeleton-image :deep(.ant-skeleton-image) {
    width: 100%;
    height: 200px;
}
</style>
