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
    okText="Upload" width="600px" class="upload-modal">
    <a-upload-dragger v-model:fileList="fileList" name="file" :multiple="true" :beforeUpload="beforeUpload"
      @remove="handleRemove" class="professional-uploader">
      <div class="upload-icon-wrapper">
        <CloudUploadOutlined class="upload-icon" />
      </div>
      <p class="upload-title">Click or drag files to upload</p>
      <p class="upload-hint">Support for multiple files • Max 10MB per file</p>
      <div class="upload-features">
        <span class="feature-badge">JPG</span>
        <span class="feature-badge">PNG</span>
        <span class="feature-badge">GIF</span>
        <span class="feature-badge">PDF</span>
        <span class="feature-badge">SVG</span>
      </div>
    </a-upload-dragger>
  </a-modal>
</template>

<style scoped>
/* Modal Styling */
.upload-modal :deep(.ant-modal-content) {
  background: var(--card);
  border-radius: 16px;
  border: 1px solid var(--border);
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

.upload-modal :deep(.ant-modal-header) {
  background: linear-gradient(135deg, oklch(0.7 0.15 190) 0%, oklch(0.65 0.15 200) 100%);
  border-bottom: none;
  border-radius: 16px 16px 0 0;
  padding: 20px 24px;
}

.upload-modal :deep(.ant-modal-title) {
  color: white;
  font-weight: 600;
  font-size: 18px;
}

.upload-modal :deep(.ant-modal-close) {
  color: white;
  opacity: 0.8;
  transition: opacity 0.3s;
}

.upload-modal :deep(.ant-modal-close:hover) {
  opacity: 1;
}

.upload-modal :deep(.ant-modal-body) {
  padding: 32px 24px;
}

.upload-modal :deep(.ant-modal-footer) {
  border-top: 1px solid var(--border);
  padding: 16px 24px;
  background: var(--muted);
}

.upload-modal :deep(.ant-btn-primary) {
  background: linear-gradient(135deg, oklch(0.7 0.15 190) 0%, oklch(0.65 0.15 200) 100%);
  border: none;
  font-weight: 500;
  height: 40px;
  padding: 0 24px;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.upload-modal :deep(.ant-btn-primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -5px oklch(0.7 0.15 190 / 0.4);
}

/* Upload Dragger Styling */
.professional-uploader :deep(.ant-upload-drag) {
  background: var(--background);
  border: 2px dashed var(--border);
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 40px 20px;
}

.professional-uploader :deep(.ant-upload-drag:hover) {
  border-color: oklch(0.7 0.15 190);
  background: var(--muted);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px -5px oklch(0.7 0.15 190 / 0.2);
}

.professional-uploader :deep(.ant-upload-drag.ant-upload-drag-hover) {
  border-color: oklch(0.65 0.15 200);
}

/* Upload Icon */
.upload-icon-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.upload-icon {
  font-size: 72px;
  background: linear-gradient(135deg, oklch(0.7 0.15 190) 0%, oklch(0.65 0.15 200) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-10px);
  }
}

/* Upload Text */
.upload-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0 0 8px 0;
}

.upload-hint {
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0 0 20px 0;
}

/* Feature Badges */
.upload-features {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.feature-badge {
  display: inline-block;
  padding: 4px 12px;
  background: var(--muted);
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: var(--foreground);
  transition: all 0.3s;
}

.feature-badge:hover {
  background: oklch(0.7 0.15 190 / 0.1);
  border-color: oklch(0.7 0.15 190);
  color: oklch(0.65 0.15 200);
}

/* File List Styling */
.professional-uploader :deep(.ant-upload-list-item) {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px;
  margin-top: 12px;
  transition: all 0.3s;
}

.professional-uploader :deep(.ant-upload-list-item:hover) {
  background: var(--muted);
  border-color: oklch(0.7 0.15 190);
  box-shadow: 0 4px 12px -2px oklch(0.7 0.15 190 / 0.15);
}

.professional-uploader :deep(.ant-upload-list-item-name) {
  color: var(--foreground);
  font-weight: 500;
}

.professional-uploader :deep(.ant-upload-list-item-card-actions) {
  opacity: 0.7;
  transition: opacity 0.3s;
}

.professional-uploader :deep(.ant-upload-list-item:hover .ant-upload-list-item-card-actions) {
  opacity: 1;
}

/* Responsive Design */
@media (max-width: 640px) {
  .upload-modal :deep(.ant-modal) {
    width: 95% !important;
    max-width: 95%;
  }

  .upload-icon {
    font-size: 56px;
  }

  .upload-title {
    font-size: 16px;
  }

  .professional-uploader :deep(.ant-upload-drag) {
    padding: 32px 16px;
  }
}
</style>
