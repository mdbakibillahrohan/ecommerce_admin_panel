<script lang="ts" setup>
import {
    HomeOutlined,
    SearchOutlined,
    AppstoreOutlined,
    UnorderedListOutlined,
    FolderAddOutlined,
    UploadOutlined,
} from '@ant-design/icons-vue'
import type { MediaFolder } from '@/services/media.service'

defineProps<{
    searchQuery: string
    viewMode: 'grid' | 'list'
    folderNameTree: MediaFolder[]
    currentFolderId: number | null
}>()

const emits = defineEmits<{
    (e: 'update:searchQuery', value: string): void
    (e: 'update:viewMode', value: 'grid' | 'list'): void
    (e: 'navigate', id: number | null): void
    (e: 'create-folder'): void
    (e: 'upload'): void
    (e: 'refresh'): void // Added for search Enter
}>()

</script>

<template>
    <div class="top-nav">
        <div class="nav-content">
            <div class="nav-left">
                <h1 class="nav-title">Media Library</h1>
                <a-breadcrumb class="nav-breadcrumb">
                    <a-breadcrumb-item>
                        <a-button class="flex items-center" size="small" type="link"
                            @click.prevent="emits('navigate', null)">
                            <HomeOutlined />
                            <span>All Files</span>
                        </a-button>
                    </a-breadcrumb-item>
                    <a-breadcrumb-item v-for="treeItem in folderNameTree" :key="treeItem.id">
                        <a-button size="small" type="link" @click.prevent="emits('navigate', treeItem.id)">
                            <span>{{ treeItem.name }}</span>
                        </a-button>
                    </a-breadcrumb-item>
                </a-breadcrumb>
            </div>

            <div class="nav-right">
                <a-input :value="searchQuery" @update:value="(val) => emits('update:searchQuery', val)"
                    placeholder="Search files..." class="search-input" @pressEnter="emits('refresh')" allow-clear>
                    <template #prefix>
                        <SearchOutlined />
                    </template>
                </a-input>

                <div class="view-toggle">
                    <a-button :type="viewMode === 'grid' ? 'primary' : 'text'" @click="emits('update:viewMode', 'grid')"
                        class="view-btn">
                        <AppstoreOutlined />
                    </a-button>
                    <a-button :type="viewMode === 'list' ? 'primary' : 'text'" @click="emits('update:viewMode', 'list')"
                        class="view-btn">
                        <UnorderedListOutlined />
                    </a-button>
                </div>

                <a-button @click="emits('create-folder')" class="action-btn">
                    <FolderAddOutlined />
                    New Folder
                </a-button>
                <a-button type="primary" @click="emits('upload')" class="action-btn">
                    <UploadOutlined />
                    Upload
                </a-button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.top-nav {
    position: sticky;
    top: 0;
    z-index: 50;
    background: #ffffff;
    border-bottom: 1px solid #e5e7eb;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.nav-content {
    max-width: 1600px;
    margin: 0 auto;
    padding: 16px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
}

.nav-left {
    display: flex;
    align-items: center;
    gap: 24px;
    flex: 1;
    min-width: 0;
}

.nav-title {
    font-size: 18px;
    font-weight: 600;
    color: #111827;
    margin: 0;
    white-space: nowrap;
}

.nav-breadcrumb {
    display: flex;
    align-items: center;
}

.nav-right {
    display: flex;
    align-items: center;
    gap: 12px;
}

.search-input {
    width: 240px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
}

.search-input :deep(input) {
    background: transparent;
    color: #111827;
}

.search-input :deep(input::placeholder) {
    color: #9ca3af;
}

.search-input :deep(.ant-input-prefix) {
    color: #9ca3af;
}

.view-toggle {
    display: flex;
    gap: 4px;
    background: #f9fafb;
    border-radius: 8px;
    padding: 4px;
    border: 1px solid #e5e7eb;
}

.view-btn {
    border: none;
    background: transparent;
    color: #6b7280;
}

.view-btn:deep(.ant-btn-primary) {
    background: #3b82f6;
    color: #ffffff;
}

.action-btn {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    color: #374151;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
}

.action-btn:hover {
    background: #f9fafb;
    border-color: #d1d5db;
}

.action-btn:deep(.ant-btn-primary) {
    background: #3b82f6;
    border-color: #3b82f6;
    color: #ffffff;
}

.action-btn:deep(.ant-btn-primary):hover {
    background: #2563eb;
    border-color: #2563eb;
}

@media (max-width: 768px) {
    .nav-content {
        flex-wrap: wrap;
    }

    .nav-left {
        flex: 1 1 100%;
    }

    .nav-right {
        flex: 1 1 100%;
        justify-content: space-between;
    }

    .search-input {
        flex: 1;
    }
}
</style>
