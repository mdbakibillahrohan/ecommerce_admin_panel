<template>
    <div class="promotion-form max-w-4xl mx-auto">
        <div class="mb-6">
            <a-button @click="router.back()" class="mb-4">Back</a-button>
            <h1 class="text-2xl font-bold">{{ isEdit ? 'Edit Promotion' : 'Create Promotion' }}</h1>
        </div>

        <a-card :bordered="false" class="shadow-sm rounded-lg" :loading="loading">
            <a-form layout="vertical" :model="formState" @finish="onFinish">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a-form-item label="Promotion Name" name="name" :rules="[{ required: true, message: 'Required' }]">
                        <a-input v-model:value="formState.name" />
                    </a-form-item>

                    <a-form-item label="Slug (Code)" name="slug" :rules="[{ required: true, message: 'Required' }]">
                        <a-input v-model:value="formState.slug" />
                    </a-form-item>
                </div>

                <a-form-item label="Description" name="description">
                    <a-textarea v-model:value="formState.description" :rows="3" />
                </a-form-item>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a-form-item label="Type" name="type" :rules="[{ required: true }]">
                        <a-select v-model:value="formState.type">
                            <a-select-option value="FLASH_SALE">Flash Sale</a-select-option>
                            <a-select-option value="SEASONAL_OFFER">Seasonal Offer</a-select-option>
                            <a-select-option value="CLEARANCE">Clearance</a-select-option>
                            <a-select-option value="NEW_ARRIVAL">New Arrival</a-select-option>
                        </a-select>
                    </a-form-item>

                    <a-form-item label="Discount Type" name="discount_type" :rules="[{ required: true }]">
                        <a-select v-model:value="formState.discount_type">
                            <a-select-option value="PERCENTAGE">Percentage (%)</a-select-option>
                            <a-select-option value="FIXED_AMOUNT">Fixed Amount</a-select-option>
                        </a-select>
                    </a-form-item>

                    <a-form-item label="Discount Value" name="discount_value" :rules="[{ required: true }]">
                        <a-input-number v-model:value="formState.discount_value" class="w-full" :min="0" />
                    </a-form-item>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a-form-item label="Start Date" name="start_date" :rules="[{ required: true }]">
                        <a-date-picker v-model:value="formState.start_date" show-time class="w-full" />
                    </a-form-item>
                    <a-form-item label="End Date" name="end_date" :rules="[{ required: true }]">
                        <a-date-picker v-model:value="formState.end_date" show-time class="w-full" />
                    </a-form-item>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a-form-item label="Active Status">
                        <a-switch v-model:checked="formState.is_active" />
                    </a-form-item>
                </div>

                <div class="flex justify-end pt-4 border-t">
                    <a-button @click="router.back()" class="mr-2">Cancel</a-button>
                    <a-button type="primary" html-type="submit" :loading="submitting">
                        {{ isEdit ? 'Update' : 'Create' }}
                    </a-button>
                </div>
            </a-form>
        </a-card>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { promotionService } from '@/services/promotion.service'
import dayjs from 'dayjs'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const submitting = ref(false)

const isEdit = computed(() => route.params.id !== undefined)

const formState = reactive({
    name: '',
    slug: '',
    description: '',
    type: 'FLASH_SALE',
    discount_type: 'PERCENTAGE',
    discount_value: 0,
    start_date: null,
    end_date: null,
    is_active: true,
})

const fetchPromotion = async (id: number) => {
    loading.value = true
    try {
        const data = await promotionService.getPromotion(id)
        Object.assign(formState, {
            ...data,
            start_date: dayjs(data.start_date),
            end_date: dayjs(data.end_date)
        })
    } catch (error) {
        message.error('Failed to load promotion')
        router.back()
    } finally {
        loading.value = false
    }
}

const onFinish = async (values: any) => {
    submitting.value = true
    try {
        const payload = {
            ...values,
            start_date: values.start_date.toISOString(),
            end_date: values.end_date.toISOString()
        }

        if (isEdit.value) {
            await promotionService.updatePromotion(Number(route.params.id), payload)
            message.success('Promotion updated')
        } else {
            await promotionService.createPromotion(payload)
            message.success('Promotion created')
        }
        router.push('/promotions')
    } catch (error) {
        message.error('Failed to save promotion')
    } finally {
        submitting.value = false
    }
}

onMounted(() => {
    if (isEdit.value) {
        fetchPromotion(Number(route.params.id))
    }
})
</script>
