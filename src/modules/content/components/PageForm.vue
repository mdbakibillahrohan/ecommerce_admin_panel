<script setup lang="ts">
import { ref, watch } from 'vue'

interface Page {
    id?: number
    title: string
    slug: string
    content: string
    status: string
    meta_title?: string
    meta_description?: string
}

interface Props {
    page?: Page
    visible: boolean
}

interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'submit', page: Page): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formData = ref<Page>({
    title: '',
    slug: '',
    content: '',
    status: 'DRAFT',
    meta_title: '',
    meta_description: '',
})

watch(
    () => props.page,
    (newVal) => {
        if (newVal) {
            formData.value = { ...newVal }
        } else {
            formData.value = { title: '', slug: '', content: '', status: 'DRAFT', meta_title: '', meta_description: '' }
        }
    },
    { immediate: true }
)

watch(
    () => formData.value.title,
    (newTitle) => {
        if (!props.page?.id) {
            formData.value.slug = newTitle
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
        }
    }
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
    <a-modal :open="visible" :title="page?.id ? 'Edit Page' : 'Add Page'" @ok="handleOk" @cancel="handleCancel"
        width="900px">
        <a-form :model="formData" layout="vertical">
            <a-form-item label="Page Title" required>
                <a-input v-model:value="formData.title" placeholder="About Us" size="large" />
            </a-form-item>

            <a-form-item label="Slug" required>
                <a-input v-model:value="formData.slug" placeholder="about-us" size="large" />
            </a-form-item>

            <a-form-item label="Content" required>
                <a-textarea v-model:value="formData.content" :rows="12" placeholder="Page content..." />
            </a-form-item>

            <a-form-item label="Status">
                <a-select v-model:value="formData.status" size="large">
                    <a-select-option value="DRAFT">Draft</a-select-option>
                    <a-select-option value="PUBLISHED">Published</a-select-option>
                </a-select>
            </a-form-item>

            <a-divider>SEO Settings</a-divider>

            <a-form-item label="Meta Title">
                <a-input v-model:value="formData.meta_title" placeholder="SEO title" size="large" />
            </a-form-item>

            <a-form-item label="Meta Description">
                <a-textarea v-model:value="formData.meta_description" :rows="3" placeholder="SEO description..." />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
