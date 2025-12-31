<template>
    <div class="shipping-settings max-w-4xl">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">Shipping Settings</h1>
            <a-button type="primary">Add Shipping Zone</a-button>
        </div>

        <a-card :bordered="false" class="shadow-sm rounded-lg mb-6">
            <a-empty description="No shipping zones configured" />
            <div class="text-center mt-4">
                <p class="text-gray-500 text-sm">Configure where you ship and how much you charge.</p>
            </div>
        </a-card>
    </div>
</template>

<script lang="ts" setup>
// Placeholder logic for now
</script>
