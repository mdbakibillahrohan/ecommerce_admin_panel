<script setup lang="ts">
import { ref, watch } from 'vue'

interface BlogPost {
    id?: number
    title: string
    slug: string
    excerpt: string
    content: string
    category: string
    status: string
    featured_image?: string
    meta_title?: string
    meta_description?: string
}

interface Props {
    post?: BlogPost
    visible: boolean
}

interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'submit', post: BlogPost): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formData = ref<BlogPost>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'NEWS',
    status: 'DRAFT',
    featured_image: '',
    meta_title: '',
    meta_description: '',
})

watch(
    () => props.post,
    (newVal) => {
        if (newVal) {
            formData.value = { ...newVal }
        } else {
            formData.value = {
                title: '',
                slug: '',
                excerpt: '',
                content: '',
                category: 'NEWS',
                status: 'DRAFT',
                featured_image: '',
                meta_title: '',
                meta_description: '',
            }
        }
    },
    { immediate: true }
)

watch(
    () => formData.value.title,
    (newTitle) => {
        if (!props.post?.id) {
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
    <a-modal :open="visible" :title="post?.id ? 'Edit Blog Post' : 'Add Blog Post'" @ok="handleOk"
        @cancel="handleCancel" width="900px">
        <a-form :model="formData" layout="vertical">
            <a-form-item label="Title" required>
                <a-input v-model:value="formData.title" placeholder="Blog post title" size="large" />
            </a-form-item>

            <a-form-item label="Slug" required>
                <a-input v-model:value="formData.slug" placeholder="blog-post-slug" size="large" />
            </a-form-item>

            <a-form-item label="Excerpt" required>
                <a-textarea v-model:value="formData.excerpt" :rows="3" placeholder="Brief excerpt..." />
            </a-form-item>

            <a-form-item label="Content" required>
                <a-textarea v-model:value="formData.content" :rows="12" placeholder="Blog post content..." />
            </a-form-item>

            <a-row :gutter="16">
                <a-col :span="12">
                    <a-form-item label="Category">
                        <a-select v-model:value="formData.category" size="large">
                            <a-select-option value="NEWS">News</a-select-option>
                            <a-select-option value="TUTORIAL">Tutorial</a-select-option>
                            <a-select-option value="UPDATE">Update</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>

                <a-col :span="12">
                    <a-form-item label="Status">
                        <a-select v-model:value="formData.status" size="large">
                            <a-select-option value="DRAFT">Draft</a-select-option>
                            <a-select-option value="PUBLISHED">Published</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>

            <a-form-item label="Featured Image URL">
                <a-input v-model:value="formData.featured_image" placeholder="https://..." size="large" />
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
