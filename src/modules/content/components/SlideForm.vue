<script setup lang="ts">
import { ref, watch } from 'vue'

interface Slide {
    id?: number
    title: string
    subtitle?: string
    image_url: string
    link_url?: string
    order: number
    is_active: boolean
}

interface Props {
    slide?: Slide
    visible: boolean
}

interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'submit', slide: Slide): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formData = ref<Slide>({
    title: '',
    subtitle: '',
    image_url: '',
    link_url: '',
    order: 0,
    is_active: true,
})

watch(
    () => props.slide,
    (newVal) => {
        if (newVal) {
            formData.value = { ...newVal }
        } else {
            formData.value = { title: '', subtitle: '', image_url: '', link_url: '', order: 0, is_active: true }
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
    <a-modal :open="visible" :title="slide?.id ? 'Edit Slide' : 'Add Slide'" @ok="handleOk" @cancel="handleCancel"
        width="700px">
        <a-form :model="formData" layout="vertical">
            <a-form-item label="Title" required>
                <a-input v-model:value="formData.title" placeholder="Summer Sale" size="large" />
            </a-form-item>

            <a-form-item label="Subtitle">
                <a-input v-model:value="formData.subtitle" placeholder="Up to 50% off" size="large" />
            </a-form-item>

            <a-form-item label="Image URL" required>
                <a-input v-model:value="formData.image_url" placeholder="https://..." size="large" />
            </a-form-item>

            <a-form-item label="Link URL">
                <a-input v-model:value="formData.link_url" placeholder="/products/sale" size="large" />
            </a-form-item>

            <a-form-item label="Display Order">
                <a-input-number v-model:value="formData.order" :min="0" size="large" style="width: 100%" />
            </a-form-item>

            <a-form-item label="Status">
                <a-switch v-model:checked="formData.is_active" checked-children="Active"
                    un-checked-children="Inactive" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
