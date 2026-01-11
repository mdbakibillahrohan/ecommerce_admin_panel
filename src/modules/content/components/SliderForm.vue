<script setup lang="ts">
import { ref, watch } from 'vue'

interface Slider {
    id?: number
    title: string
    description?: string
    is_active: boolean
}

interface Props {
    slider?: Slider
    visible: boolean
}

interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'submit', slider: Slider): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formData = ref<Slider>({
    title: '',
    description: '',
    is_active: true,
})

watch(
    () => props.slider,
    (newVal) => {
        if (newVal) {
            formData.value = { ...newVal }
        } else {
            formData.value = { title: '', description: '', is_active: true }
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
    <a-modal :open="visible" :title="slider?.id ? 'Edit Slider' : 'Add Slider'" @ok="handleOk" @cancel="handleCancel">
        <a-form :model="formData" layout="vertical">
            <a-form-item label="Slider Title" required>
                <a-input v-model:value="formData.title" placeholder="Homepage Slider" size="large" />
            </a-form-item>

            <a-form-item label="Description">
                <a-textarea v-model:value="formData.description" :rows="3" placeholder="Slider description..." />
            </a-form-item>

            <a-form-item label="Status">
                <a-switch v-model:checked="formData.is_active" checked-children="Active"
                    un-checked-children="Inactive" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
