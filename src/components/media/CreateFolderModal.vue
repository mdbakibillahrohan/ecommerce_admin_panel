<script lang="ts" setup>
import { ref, watch } from 'vue'
import { FolderOutlined, CheckCircleOutlined } from '@ant-design/icons-vue'

const props = defineProps<{
  open: boolean
}>()

const emits = defineEmits<{
  (e: 'update:open', val: boolean): void
  (e: 'create', name: string): void
}>()

const folderName = ref('')

watch(() => props.open, (newVal) => {
  if (newVal) {
    folderName.value = ''
  }
})

const handleOk = () => {
  if (folderName.value.trim()) {
    emits('create', folderName.value)
  }
}

const handleCancel = () => {
  emits('update:open', false)
}
</script>

<template>
  <a-modal :open="open" title="Create New Folder" @ok="handleOk" @cancel="handleCancel" okText="Create Folder"
    cancelText="Cancel" class="create-folder-modal" :width="480">
    <div class="modal-content">
      <div class="folder-icon-wrapper">
        <div class="folder-icon">
          <FolderOutlined />
        </div>
      </div>

      <a-form layout="vertical" class="folder-form">
        <a-form-item label="Folder Name" class="form-item">
          <a-input v-model:value="folderName" placeholder="e.g., Product Images, Documents" size="large"
            @pressEnter="handleOk" class="folder-input">
            <template #prefix>
              <FolderOutlined class="input-icon" />
            </template>
          </a-input>
          <div class="input-hint">
            Choose a descriptive name for easy organization
          </div>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<style scoped>
.create-folder-modal :deep(.ant-modal-content) {
  background: var(--background);
  border-radius: 16px;
  border: 1px solid var(--border);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.create-folder-modal :deep(.ant-modal-header) {
  background: linear-gradient(135deg, oklch(0.65 0.15 190) 0%, oklch(0.60 0.18 200) 100%);
  border-bottom: none;
  border-radius: 16px 16px 0 0;
  padding: 24px 28px;
}

.create-folder-modal :deep(.ant-modal-title) {
  color: #ffffff;
  font-weight: 600;
  font-size: 18px;
  letter-spacing: -0.01em;
}

.create-folder-modal :deep(.ant-modal-close) {
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.create-folder-modal :deep(.ant-modal-close:hover) {
  color: #ffffff;
  transform: scale(1.1);
}

.create-folder-modal :deep(.ant-modal-body) {
  padding: 32px 28px 28px;
}

.create-folder-modal :deep(.ant-modal-footer) {
  border-top: 1px solid var(--border);
  padding: 16px 28px;
  background: var(--background);
}

.create-folder-modal :deep(.ant-btn) {
  height: 42px;
  padding: 0 24px;
  font-weight: 500;
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.create-folder-modal :deep(.ant-btn-default) {
  border-color: var(--border);
  color: var(--foreground);
  background: var(--background);
}

.create-folder-modal :deep(.ant-btn-default:hover) {
  border-color: oklch(0.65 0.15 190);
  color: oklch(0.65 0.15 190);
  transform: translateY(-1px);
}

.create-folder-modal :deep(.ant-btn-primary) {
  background: linear-gradient(135deg, oklch(0.65 0.15 190) 0%, oklch(0.60 0.18 200) 100%);
  border: none;
  color: #ffffff;
  box-shadow: 0 4px 6px -1px rgba(13, 148, 136, 0.2);
}

.create-folder-modal :deep(.ant-btn-primary:hover) {
  background: linear-gradient(135deg, oklch(0.60 0.18 200) 0%, oklch(0.55 0.20 210) 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px -1px rgba(13, 148, 136, 0.3);
}

.modal-content {
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.folder-icon-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.folder-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: linear-gradient(135deg, oklch(0.65 0.15 190) 0%, oklch(0.60 0.18 200) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: #ffffff;
  box-shadow: 0 8px 16px -4px rgba(13, 148, 136, 0.3);
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }
}

.folder-form {
  margin: 0;
}

.form-item {
  margin-bottom: 0;
}

.folder-form :deep(.ant-form-item-label > label) {
  color: var(--foreground);
  font-weight: 600;
  font-size: 14px;
  letter-spacing: -0.01em;
  margin-bottom: 8px;
}

.folder-input :deep(.ant-input) {
  border-radius: 12px;
  border: 2px solid var(--border);
  padding: 12px 16px;
  font-size: 15px;
  background: var(--background);
  color: var(--foreground);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.folder-input :deep(.ant-input:hover) {
  border-color: oklch(0.65 0.15 190);
}

.folder-input :deep(.ant-input:focus) {
  border-color: oklch(0.65 0.15 190);
  box-shadow: 0 0 0 4px rgba(13, 148, 136, 0.1);
  background: var(--background);
}

.folder-input :deep(.ant-input::placeholder) {
  color: var(--muted-foreground);
}

.input-icon {
  color: var(--muted-foreground);
  font-size: 16px;
  transition: all 0.2s;
}

.folder-input :deep(.ant-input:focus)~.input-icon {
  color: oklch(0.65 0.15 190);
}

.input-hint {
  margin-top: 8px;
  font-size: 13px;
  color: var(--muted-foreground);
  display: flex;
  align-items: center;
  gap: 6px;
}

.input-hint::before {
  content: "💡";
  font-size: 14px;
}

/* Responsive */
@media (max-width: 768px) {
  .create-folder-modal :deep(.ant-modal) {
    max-width: calc(100vw - 32px);
    margin: 16px;
  }

  .folder-icon {
    width: 64px;
    height: 64px;
    font-size: 28px;
  }
}
</style>
