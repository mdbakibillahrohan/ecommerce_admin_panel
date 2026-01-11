<script setup lang="ts">
import { ref, watch } from 'vue'

interface Category {
    id?: number
    name: string
    slug: string
    description?: string
    parent_id?: number | null
}

interface Props {
    category?: Category
    categories: Category[]
    visible: boolean
}

interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'submit', category: Category): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formData = ref<Category>({
    name: '',
    slug: '',
    description: '',
    parent_id: null,
})

watch(
    () => props.category,
    (newVal) => {
        if (newVal) {
            formData.value = { ...newVal }
        } else {
            formData.value = { name: '', slug: '', description: '', parent_id: null }
        }
    },
    { immediate: true }
)

watch(
    () => formData.value.name,
    (newName) => {
        if (!props.category?.id) {
            formData.value.slug = newName
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
    <a-modal :open="visible" :title="category?.id ? 'Edit Category' : 'Add Category'" @ok="handleOk"
        @cancel="handleCancel">
        <a-form :model="formData" layout="vertical">
            <a-form-item label="Category Name" required>
                <a-input v-model:value="formData.name" placeholder="Electronics" size="large" />
            </a-form-item>

            <a-form-item label="Slug" required>
                <a-input v-model:value="formData.slug" placeholder="electronics" size="large" />
            </a-form-item>

            <a-form-item label="Parent Category">
                <a-select v-model:value="formData.parent_id" placeholder="None (Top Level)" size="large" allow-clear>
                    <a-select-option v-for="cat in categories" :key="cat.id" :value="cat.id">
                        {{ cat.name }}
                    </a-select-option>
                </a-select>
            </a-form-item>

            <a-form-item label="Description">
                <a-textarea v-model:value="formData.description" :rows="4" placeholder="Category description..." />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<style scoped>
/* Styles inherited from Ant Design */
</style>
