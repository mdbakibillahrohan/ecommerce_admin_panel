<script setup lang="ts">
import { ref, watch } from 'vue'

interface Store {
    id?: number
    name: string
    domain: string
    plan: string
    is_active: boolean
}

interface Props {
    store?: Store
    visible: boolean
}

interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'submit', store: Store): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formData = ref<Store>({
    name: '',
    domain: '',
    plan: 'BASIC',
    is_active: true,
})

watch(
    () => props.store,
    (newVal) => {
        if (newVal) {
            formData.value = { ...newVal }
        } else {
            formData.value = { name: '', domain: '', plan: 'BASIC', is_active: true }
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
    <a-modal :open="visible" :title="store?.id ? 'Edit Store' : 'Add Store'" @ok="handleOk" @cancel="handleCancel"
        width="600px">
        <a-form :model="formData" layout="vertical">
            <a-form-item label="Store Name" required>
                <a-input v-model:value="formData.name" placeholder="My Store" size="large" />
            </a-form-item>

            <a-form-item label="Domain" required>
                <a-input v-model:value="formData.domain" placeholder="mystore.com" size="large" />
            </a-form-item>

            <a-form-item label="Plan" required>
                <a-select v-model:value="formData.plan" size="large">
                    <a-select-option value="BASIC">Basic</a-select-option>
                    <a-select-option value="PROFESSIONAL">Professional</a-select-option>
                    <a-select-option value="ENTERPRISE">Enterprise</a-select-option>
                </a-select>
            </a-form-item>

            <a-form-item label="Status">
                <a-switch v-model:checked="formData.is_active" checked-children="Active"
                    un-checked-children="Inactive" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
