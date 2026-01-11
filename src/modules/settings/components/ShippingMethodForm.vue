<script setup lang="ts">
import { ref, watch } from 'vue'

interface ShippingMethod {
    id?: number
    name: string
    type: string
    cost: number
    enabled: boolean
}

interface Props {
    method?: ShippingMethod
    visible: boolean
}

interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'submit', method: ShippingMethod): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formData = ref<ShippingMethod>({
    name: '',
    type: 'FLAT_RATE',
    cost: 0,
    enabled: true,
})

watch(
    () => props.method,
    (newVal) => {
        if (newVal) {
            formData.value = { ...newVal }
        } else {
            formData.value = { name: '', type: 'FLAT_RATE', cost: 0, enabled: true }
        }
    },
    { immediate: true }
)

function handleOk() {
    emit('submit', formData.value)
    emit('update:visible', false)
}

function handleCancel() {
    emit('update:visible', false)
}
</script>

<template>
    <a-modal :open="visible" :title="method?.id ? 'Edit Shipping Method' : 'Add Shipping Method'" @ok="handleOk"
        @cancel="handleCancel">
        <a-form :model="formData" layout="vertical">
            <a-form-item label="Method Name" required>
                <a-input v-model:value="formData.name" placeholder="Standard Shipping" size="large" />
            </a-form-item>

            <a-form-item label="Type" required>
                <a-select v-model:value="formData.type" size="large">
                    <a-select-option value="FLAT_RATE">Flat Rate</a-select-option>
                    <a-select-option value="FREE">Free Shipping</a-select-option>
                    <a-select-option value="WEIGHT_BASED">Weight Based</a-select-option>
                </a-select>
            </a-form-item>

            <a-form-item label="Cost" required>
                <a-input-number v-model:value="formData.cost" :min="0" :formatter="(value: number) => `$ ${value}`"
                    :parser="(value: string | undefined) => value?.replace(/\$\s?|(,*)/g, '') || ''" size="large"
                    style="width: 100%" />
            </a-form-item>

            <a-form-item label="Status">
                <a-switch v-model:checked="formData.enabled" checked-children="Enabled"
                    un-checked-children="Disabled" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
