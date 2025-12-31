<template>
    <div class="payment-settings max-w-4xl">
        <h1 class="text-2xl font-bold mb-6">Payment Providers</h1>

        <div class="grid grid-cols-1 gap-4">
            <!-- Stripe -->
            <a-card class="shadow-sm rounded-lg">
                <div class="flex justify-between items-start">
                    <div class="flex gap-4">
                        <div
                            class="w-12 h-12 bg-gray-100 rounded flex items-center justify-center font-bold text-gray-500">
                            S
                        </div>
                        <div>
                            <h3 class="font-bold text-lg">Stripe</h3>
                            <p class="text-gray-500 text-sm">Accept credit cards, Apple Pay, and more.</p>
                        </div>
                    </div>
                    <a-switch checked-children="On" un-checked-children="Off" />
                </div>
                <div class="mt-4 pt-4 border-t">
                    <a-button type="link" class="px-0">Manage</a-button>
                </div>
            </a-card>

            <!-- PayPal -->
            <a-card class="shadow-sm rounded-lg">
                <div class="flex justify-between items-start">
                    <div class="flex gap-4">
                        <div
                            class="w-12 h-12 bg-gray-100 rounded flex items-center justify-center font-bold text-gray-500">
                            P
                        </div>
                        <div>
                            <h3 class="font-bold text-lg">PayPal</h3>
                            <p class="text-gray-500 text-sm">Accept PayPal payments.</p>
                        </div>
                    </div>
                    <a-switch checked-children="On" un-checked-children="Off" />
                </div>
                <div class="mt-4 pt-4 border-t">
                    <a-button type="link" class="px-0">Manage</a-button>
                </div>
            </a-card>

            <!-- Cash on Delivery -->
            <a-card class="shadow-sm rounded-lg">
                <div class="flex justify-between items-start">
                    <div class="flex gap-4">
                        <div
                            class="w-12 h-12 bg-gray-100 rounded flex items-center justify-center font-bold text-gray-500">
                            COD
                        </div>
                        <div>
                            <h3 class="font-bold text-lg">Cash on Delivery</h3>
                            <p class="text-gray-500 text-sm">Accept cash upon delivery.</p>
                        </div>
                    </div>
                    <a-switch checked-children="On" un-checked-children="Off" />
                </div>
            </a-card>
        </div>
    </div>
</template>

<script lang="ts" setup>
// Placeholder
</script>
