<script setup lang="ts">
import { ref, watch } from 'vue'

interface ShippingZone {
    id?: number
    name: string
    countries: string[]
}

interface Props {
    zone?: ShippingZone
    visible: boolean
}

interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'submit', zone: ShippingZone): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formData = ref<ShippingZone>({
    name: '',
    countries: [],
})

watch(
    () => props.zone,
    (newVal) => {
        if (newVal) {
            formData.value = { ...newVal }
        } else {
            formData.value = { name: '', countries: [] }
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
    <a-modal :open="visible" :title="zone?.id ? 'Edit Shipping Zone' : 'Add Shipping Zone'" @ok="handleOk"
        @cancel="handleCancel">
        <a-form :model="formData" layout="vertical">
            <a-form-item label="Zone Name" required>
                <a-input v-model:value="formData.name" placeholder="North America" size="large" />
            </a-form-item>

            <a-form-item label="Countries" required>
                <a-select v-model:value="formData.countries" mode="multiple" placeholder="Select countries" size="large"
                    :options="[
                        { value: 'US', label: 'United States' },
                        { value: 'CA', label: 'Canada' },
                        { value: 'MX', label: 'Mexico' },
                        { value: 'UK', label: 'United Kingdom' },
                        { value: 'AU', label: 'Australia' },
                    ]" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
