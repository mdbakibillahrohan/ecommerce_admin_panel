<template>
    <div class="tax-settings max-w-4xl">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">Tax Settings</h1>
            <a-button type="primary">Add Tax Rate</a-button>
        </div>

        <a-card :bordered="false" class="shadow-sm rounded-lg">
            <div class="mb-4">
                <a-checkbox>All prices include tax</a-checkbox>
            </div>
            <a-divider />
            <a-empty description="No tax rates configured" />
        </a-card>
    </div>
</template>

<script lang="ts" setup>
// Placeholder
</script>
