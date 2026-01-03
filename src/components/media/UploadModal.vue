<script lang="ts" setup>
import { ref, watch } from 'vue'
import { CloudUploadOutlined } from '@ant-design/icons-vue'
import type { UploadProps } from 'ant-design-vue'

const props = defineProps<{
    open: boolean
    confirmLoading: boolean
}>()

const emits = defineEmits<{
    (e: 'update:open', val: boolean): void
    (e: 'upload', files: UploadProps['fileList']): void
}>()

const fileList = ref<UploadProps['fileList']>([])

watch(() => props.open, (newVal) => {
    if (newVal) {
        fileList.value = []
    }
})

const beforeUpload: UploadProps['beforeUpload'] = file => {
    fileList.value = [...(fileList.value || []), file]
    return false
}

const handleRemove: UploadProps['onRemove'] = file => {
    const index = (fileList.value || []).indexOf(file)
    const newFileList = fileList.value!.slice()
    newFileList.splice(index, 1)
    fileList.value = newFileList
}

const handleOk = () => {
    emits('upload', fileList.value)
}

const handleCancel = () => {
    emits('update:open', false)
}
</script>

<template>
    <a-modal :open="open" title="Upload Files" @ok="handleOk" @cancel="handleCancel" :confirmLoading="confirmLoading"
        okText="Upload" width="600px" class="custom-modal">
        <a-upload-dragger v-model:fileList="fileList" name="file" :multiple="true" :beforeUpload="beforeUpload"
            @remove="handleRemove" class="custom-uploader">
            <p class="uploader-icon">
                <CloudUploadOutlined />
            </p>
            <p class="uploader-text">Click or drag files to upload</p>
            <p class="uploader-hint">Support for multiple files • Max 10MB per file</p>
        </a-upload-dragger>
    </a-modal>
</template>

<style scoped>
.custom-modal :deep(.ant-modal-content) {
    background: #ffffff;
    border-radius: 12px;
}

.custom-modal :deep(.ant-modal-header) {
    background: #ffffff;
    border-bottom: 1px solid #e5e7eb;
    border-radius: 12px 12px 0 0;
}

.custom-modal :deep(.ant-modal-title) {
    color: #111827;
    font-weight: 600;
}

.custom-modal :deep(.ant-modal-body) {
    padding: 24px;
}

.custom-uploader :deep(.ant-upload-drag) {
    background: #f9fafb;
    border: 2px dashed #d1d5db;
    border-radius: 12px;
    transition: all 0.3s;
}

.custom-uploader :deep(.ant-upload-drag:hover) {
    border-color: #3b82f6;
    background: #eff6ff;
}

.uploader-icon {
    font-size: 64px;
    color: #3b82f6;
    margin-bottom: 16px;
}

.uploader-text {
    font-size: 16px;
    font-weight: 500;
    color: #111827;
    margin-bottom: 8px;
}

.uploader-hint {
    font-size: 13px;
    color: #6b7280;
}
</style>
