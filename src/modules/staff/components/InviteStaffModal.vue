<script setup lang="ts">
import { ref } from 'vue'

interface Emits {
    (e: 'invite', data: { email: string; role: string }): void
    (e: 'cancel'): void
}

const emit = defineEmits<Emits>()

const visible = ref(false)
const formData = ref({
    email: '',
    role: 'STAFF',
})

function show() {
    visible.value = true
    formData.value = { email: '', role: 'STAFF' }
}

function hide() {
    visible.value = false
}

function handleOk() {
    emit('invite', formData.value)
    hide()
}

function handleCancel() {
    emit('cancel')
    hide()
}

defineExpose({ show, hide })
</script>

<template>
    <a-modal v-model:open="visible" title="Invite Staff Member" @ok="handleOk" @cancel="handleCancel">
        <a-form :model="formData" layout="vertical">
            <a-form-item label="Email Address" required>
                <a-input v-model:value="formData.email" type="email" placeholder="staff@example.com" size="large" />
            </a-form-item>

            <a-form-item label="Role" required>
                <a-select v-model:value="formData.role" size="large">
                    <a-select-option value="ADMIN">Admin</a-select-option>
                    <a-select-option value="MANAGER">Manager</a-select-option>
                    <a-select-option value="STAFF">Staff</a-select-option>
                </a-select>
            </a-form-item>

            <a-alert message="An invitation email will be sent to this address." type="info" show-icon />
        </a-form>
    </a-modal>
</template>

<style scoped>
/* Styles inherited from Ant Design */
</style>
