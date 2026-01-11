<script setup lang="ts">
import { ref, watch } from 'vue'

interface Role {
    id?: number
    name: string
    description: string
}

interface Props {
    role?: Role
    visible: boolean
}

interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'submit', role: Role): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formData = ref<Role>({
    name: '',
    description: '',
})

watch(
    () => props.role,
    (newVal) => {
        if (newVal) {
            formData.value = { ...newVal }
        } else {
            formData.value = { name: '', description: '' }
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
    <a-modal :open="visible" :title="role?.id ? 'Edit Role' : 'Add Role'" @ok="handleOk" @cancel="handleCancel">
        <a-form :model="formData" layout="vertical">
            <a-form-item label="Role Name" required>
                <a-input v-model:value="formData.name" placeholder="Content Manager" size="large" />
            </a-form-item>

            <a-form-item label="Description">
                <a-textarea v-model:value="formData.description" :rows="4" placeholder="Role description..." />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
