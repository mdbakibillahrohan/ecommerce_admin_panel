<script setup lang="ts">
import { ref, watch } from 'vue'

interface TaxZone {
    id?: number
    name: string
    country: string
    state?: string
    zip_code?: string
    tax_rate: number
    enabled: boolean
}

interface Props {
    zone?: TaxZone
    visible: boolean
}

interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'submit', zone: TaxZone): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formData = ref<TaxZone>({
    name: '',
    country: '',
    state: '',
    zip_code: '',
    tax_rate: 0,
    enabled: true,
})

watch(
    () => props.zone,
    (newVal) => {
        if (newVal) {
            formData.value = { ...newVal }
        } else {
            formData.value = { name: '', country: '', state: '', zip_code: '', tax_rate: 0, enabled: true }
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
    <a-modal :open="visible" :title="zone?.id ? 'Edit Tax Zone' : 'Add Tax Zone'" @ok="handleOk" @cancel="handleCancel">
        <a-form :model="formData" layout="vertical">
            <a-form-item label="Zone Name" required>
                <a-input v-model:value="formData.name" placeholder="California Sales Tax" size="large" />
            </a-form-item>

            <a-form-item label="Country" required>
                <a-input v-model:value="formData.country" placeholder="United States" size="large" />
            </a-form-item>

            <a-form-item label="State/Province">
                <a-input v-model:value="formData.state" placeholder="California" size="large" />
            </a-form-item>

            <a-form-item label="ZIP/Postal Code">
                <a-input v-model:value="formData.zip_code" placeholder="90210" size="large" />
            </a-form-item>

            <a-form-item label="Tax Rate (%)" required>
                <a-input-number v-model:value="formData.tax_rate" :min="0" :max="100" :precision="2" size="large"
                    style="width: 100%" />
            </a-form-item>

            <a-form-item label="Status">
                <a-switch v-model:checked="formData.enabled" checked-children="Enabled"
                    un-checked-children="Disabled" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
