<script setup lang="ts">
import { ref } from 'vue'

interface Props {
    accept?: string
    maxSize?: number
    multiple?: boolean
}

interface Emits {
    (e: 'upload', files: File[]): void
}

const props = withDefaults(defineProps<Props>(), {
    accept: 'image/*',
    maxSize: 5,
    multiple: false,
})

const emit = defineEmits<Emits>()

const fileList = ref<any[]>([])

function handleChange(info: any) {
    fileList.value = info.fileList
}

function handleUpload() {
    const files = fileList.value.map((f) => f.originFileObj)
    emit('upload', files)
}
</script>

<template>
    <div class="image-uploader">
        <a-upload v-model:file-list="fileList" :before-upload="() => false" :accept="accept" :multiple="multiple"
            list-type="picture-card" @change="handleChange">
            <div>
                <plus-outlined />
                <div style="margin-top: 8px">Upload</div>
            </div>
        </a-upload>
    </div>
</template>

<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue'
</script>

<style scoped>
.image-uploader {
    width: 100%;
}
</style>
