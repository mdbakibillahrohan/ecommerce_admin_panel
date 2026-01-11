<script setup lang="ts">
import { ref, watch } from 'vue'

interface Policy {
    id?: number
    name: string
    type: string
    description: string
    content: string
}

interface Props {
    policy?: Policy
    visible: boolean
}

interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'submit', policy: Policy): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formData = ref<Policy>({
    name: '',
    type: 'PRIVACY',
    description: '',
    content: '',
})

watch(
    () => props.policy,
    (newVal) => {
        if (newVal) {
            formData.value = { ...newVal }
        } else {
            formData.value = { name: '', type: 'PRIVACY', description: '', content: '' }
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
    <a-modal :open="visible" :title="policy?.id ? 'Edit Policy' : 'Add Policy'" @ok="handleOk" @cancel="handleCancel"
        width="800px">
        <a-form :model="formData" layout="vertical">
            <a-form-item label="Policy Name" required>
                <a-input v-model:value="formData.name" placeholder="Privacy Policy" size="large" />
            </a-form-item>

            <a-form-item label="Type" required>
                <a-select v-model:value="formData.type" size="large">
                    <a-select-option value="PRIVACY">Privacy Policy</a-select-option>
                    <a-select-option value="TERMS">Terms of Service</a-select-option>
                    <a-select-option value="REFUND">Refund Policy</a-select-option>
                    <a-select-option value="SHIPPING">Shipping Policy</a-select-option>
                </a-select>
            </a-form-item>

            <a-form-item label="Description">
                <a-input v-model:value="formData.description" placeholder="Brief description" size="large" />
            </a-form-item>

            <a-form-item label="Content" required>
                <a-textarea v-model:value="formData.content" :rows="10" placeholder="Policy content..." />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
