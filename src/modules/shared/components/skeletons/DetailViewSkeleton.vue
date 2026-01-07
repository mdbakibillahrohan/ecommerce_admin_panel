<template>
    <div class="detail-view-skeleton">
        <!-- Header -->
        <div class="skeleton-header">
            <a-skeleton-input :active="true" size="large" style="width: 300px" />
            <div class="skeleton-header-actions">
                <a-skeleton-button :active="true" size="large" style="width: 100px" />
                <a-skeleton-button :active="true" size="large" style="width: 100px" />
            </div>
        </div>

        <a-row :gutter="24">
            <!-- Main Content -->
            <a-col :xs="24" :lg="16">
                <a-card v-for="section in sections" :key="section" :bordered="false" class="skeleton-section">
                    <a-skeleton :active="true" :title="true" :paragraph="{ rows: 4 }" />
                </a-card>
            </a-col>

            <!-- Sidebar -->
            <a-col :xs="24" :lg="8">
                <a-card :bordered="false" class="skeleton-section">
                    <a-skeleton :active="true" :title="true" :paragraph="{ rows: 3 }" />
                </a-card>

                <a-card :bordered="false" class="skeleton-section" style="margin-top: 24px">
                    <a-skeleton :active="true" :title="true" :paragraph="{ rows: 5 }" />
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>

<script setup lang="ts">
interface Props {
    sections?: number
}

withDefaults(defineProps<Props>(), {
    sections: 3,
})
</script>

<style scoped>
.detail-view-skeleton {
    width: 100%;
}

.skeleton-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding: 24px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
}

.skeleton-header-actions {
    display: flex;
    gap: 12px;
}

.skeleton-section {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    margin-bottom: 24px;
}

@media (max-width: 992px) {
    .skeleton-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }

    .skeleton-header-actions {
        width: 100%;
        justify-content: flex-start;
    }
}
</style>
