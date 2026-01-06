<template>
    <div class="slider-list">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">Sliders & Banners</h1>
            <a-button type="primary" @click="showModal">
                <PlusOutlined /> Create Slider
            </a-button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <a-card v-for="slider in sliders" :key="slider.id" hoverable class="shadow-sm rounded-lg">
                <template #cover>
                    <div class="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                        <img v-if="slider.items?.[0]?.image_url" :src="slider.items[0].image_url"
                            class="w-full h-full object-cover" />
                        <PictureOutlined v-else class="text-4xl text-gray-400" />
                    </div>
                </template>
                <a-card-meta :title="slider.name">
                    <template #description>
                        <div class="flex justify-between items-center mt-2">
                            <span class="text-xs text-gray-500">{{ slider.code }} • {{ slider.items?.length || 0 }}
                                slides</span>
                            <div class="flex gap-2">
                                <a-button size="small" @click="handleEdit(slider)">Edit</a-button>
                                <a-popconfirm title="Delete slider?" @confirm="handleDelete(slider.id)">
                                    <a-button size="small" danger type="text">
                                        <DeleteOutlined />
                                    </a-button>
                                </a-popconfirm>
                            </div>
                        </div>
                    </template>
                </a-card-meta>
            </a-card>
        </div>

        <!-- Create/Edit Modal (Simplified) -->
        <a-modal v-model:open="modalVisible" :title="isEdit ? 'Edit Slider' : 'Create Slider'" @ok="handleSave"
            :confirmLoading="saving">
            <a-form layout="vertical">
                <a-form-item label="Name" required>
                    <a-input v-model:value="formState.name" />
                </a-form-item>
                <a-form-item label="Code (Slug)" required>
                    <a-input v-model:value="formState.code" placeholder="e.g. home-hero" />
                </a-form-item>
                <a-form-item label="Active">
                    <a-switch v-model:checked="formState.is_active" />
                </a-form-item>

                <div v-if="isEdit" class="mt-4 p-4 bg-gray-50 rounded">
                    <p class="text-sm text-gray-500">Manage slides logic would go here (adding images, links etc).</p>
                </div>
            </a-form>
        </a-modal>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, PictureOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { contentService, type Slider } from '@/modules/content/services/content.service'

const loading = ref(false)
const saving = ref(false)
const sliders = ref<Slider[]>([])
const modalVisible = ref(false)
const isEdit = ref(false)
const currentId = ref<number | null>(null)

const formState = reactive({
    name: '',
    code: '',
    is_active: true
})

const fetchSliders = async () => {
    loading.value = true
    try {
        const data = await contentService.getSliders()
        sliders.value = data
    } catch (error) {
        message.error('Failed to load sliders')
    } finally {
        loading.value = false
    }
}

const showModal = () => {
    isEdit.value = false
    currentId.value = null
    formState.name = ''
    formState.code = ''
    formState.is_active = true
    modalVisible.value = true
}

const handleEdit = (slider: Slider) => {
    isEdit.value = true
    currentId.value = slider.id
    formState.name = slider.name
    formState.code = slider.code
    formState.is_active = slider.is_active
    modalVisible.value = true
}

const handleSave = async () => {
    if (!formState.name || !formState.code) {
        message.warning('Name and Code are required')
        return
    }
    saving.value = true
    try {
        if (isEdit.value && currentId.value) {
            await contentService.updateSlider(currentId.value, formState)
            message.success('Slider updated')
        } else {
            await contentService.createSlider(formState)
            message.success('Slider created')
        }
        modalVisible.value = false
        fetchSliders()
    } catch (error) {
        message.error('Failed to save slider')
    } finally {
        saving.value = false
    }
}

const handleDelete = async (id: number) => {
    try {
        await contentService.deleteSlider(id)
        message.success('Slider deleted')
        fetchSliders()
    } catch (error) {
        message.error('Failed to delete slider')
    }
}

onMounted(() => {
    fetchSliders()
})
</script>
