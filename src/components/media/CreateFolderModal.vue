<script lang="ts" setup>
import { ref, watch } from 'vue'
import { FolderOutlined } from '@ant-design/icons-vue'

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
    <a-modal :open="open" title="Create New Folder" @ok="handleOk" @cancel="handleCancel" okText="Create"
        class="custom-modal">
        <a-form layout="vertical" class="folder-form">
            <a-form-item label="Folder Name">
                <a-input v-model:value="folderName" placeholder="Enter folder name" size="large" @pressEnter="handleOk">
                    <template #prefix>
                        <FolderOutlined />
                    </template>
                </a-input>
            </a-form-item>
        </a-form>
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

.folder-form :deep(.ant-form-item-label > label) {
    color: #374151;
    font-weight: 500;
}

.folder-form :deep(.ant-input) {
    border-radius: 8px;
    border-color: #e5e7eb;
}

.folder-form :deep(.ant-input:focus) {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}
</style>
