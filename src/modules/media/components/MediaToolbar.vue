<script setup lang="ts">
interface Emits {
    (e: 'upload'): void
    (e: 'createFolder'): void
    (e: 'delete'): void
    (e: 'search', query: string): void
}

const emit = defineEmits<Emits>()

function handleSearch(value: string) {
    emit('search', value)
}
</script>

<template>
    <div class="media-toolbar">
        <div class="toolbar-left">
            <a-button type="primary" @click="emit('upload')">
                <template #icon>
                    <upload-outlined />
                </template>
                Upload Files
            </a-button>

            <a-button @click="emit('createFolder')">
                <template #icon>
                    <folder-add-outlined />
                </template>
                New Folder
            </a-button>

            <a-button danger @click="emit('delete')">
                <template #icon>
                    <delete-outlined />
                </template>
                Delete
            </a-button>
        </div>

        <div class="toolbar-right">
            <a-input-search placeholder="Search files..." style="width: 300px" @search="handleSearch" allow-clear />
        </div>
    </div>
</template>

<script setup lang="ts">
import { UploadOutlined, FolderAddOutlined, DeleteOutlined } from '@ant-design/icons-vue'
</script>

<style scoped>
.media-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    margin-bottom: 24px;
}

.toolbar-left {
    display: flex;
    gap: 12px;
}

.toolbar-right {
    display: flex;
    gap: 12px;
}

@media (max-width: 768px) {
    .media-toolbar {
        flex-direction: column;
        gap: 16px;
    }

    .toolbar-left,
    .toolbar-right {
        width: 100%;
    }

    .toolbar-right {
        justify-content: flex-end;
    }
}
</style>
