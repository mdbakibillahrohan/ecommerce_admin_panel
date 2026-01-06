<script lang="ts" setup>
import {
  HomeOutlined,
  SearchOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  FolderAddOutlined,
  UploadOutlined,
} from '@ant-design/icons-vue'
import type { MediaFolder } from '@/modules/media/services/media.service'

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
  (e: 'refresh'): void
}>()
</script>

<template>
  <div class="top-nav">
    <div class="nav-content">
      <div class="nav-left">
        <h1 class="nav-title">Media Library</h1>
        <a-breadcrumb class="nav-breadcrumb">
          <a-breadcrumb-item>
            <a-button class="breadcrumb-btn" size="small" type="link" @click.prevent="emits('navigate', null)">
              <HomeOutlined />
              <span>All Files</span>
            </a-button>
          </a-breadcrumb-item>
          <a-breadcrumb-item v-for="treeItem in folderNameTree" :key="treeItem.id">
            <a-button class="breadcrumb-btn" size="small" type="link" @click.prevent="emits('navigate', treeItem.id)">
              <span>{{ treeItem.name }}</span>
            </a-button>
          </a-breadcrumb-item>
        </a-breadcrumb>
      </div>

      <div class="nav-right">
        <a-input :value="searchQuery" @update:value="(val: string) => emits('update:searchQuery', val)"
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
        <a-button type="primary" @click="emits('upload')" class="action-btn primary-btn">
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
  background: var(--background);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 1px 3px 0 oklch(0% 0 0 / 0.1);
  backdrop-filter: blur(8px);
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
  color: var(--foreground);
  margin: 0;
  white-space: nowrap;
}

.nav-breadcrumb {
  display: flex;
  align-items: center;
}

.breadcrumb-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--muted-foreground);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.breadcrumb-btn:hover {
  color: oklch(0.65 0.15 195);
  transform: translateY(-1px);
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-input {
  width: 280px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 10px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-input:hover {
  border-color: oklch(0.65 0.15 195);
  box-shadow: 0 0 0 3px oklch(0.65 0.15 195 / 0.1);
}

.search-input:focus-within {
  border-color: oklch(0.65 0.15 195);
  box-shadow: 0 0 0 3px oklch(0.65 0.15 195 / 0.15);
}

.search-input :deep(input) {
  background: transparent;
  color: var(--foreground);
}

.search-input :deep(input::placeholder) {
  color: var(--muted-foreground);
}

.search-input :deep(.ant-input-prefix) {
  color: var(--muted-foreground);
}

.view-toggle {
  display: flex;
  gap: 4px;
  background: var(--card);
  border-radius: 10px;
  padding: 4px;
  border: 1px solid var(--border);
}

.view-btn {
  border: none;
  background: transparent;
  color: var(--muted-foreground);
  border-radius: 6px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.view-btn:hover {
  background: var(--accent);
  color: var(--foreground);
}

.view-btn:deep(.ant-btn-primary) {
  background: oklch(0.65 0.15 195);
  color: white;
}

.view-btn:deep(.ant-btn-primary):hover {
  background: oklch(0.60 0.15 195);
}

.action-btn {
  background: var(--card);
  border: 1px solid var(--border);
  color: var(--foreground);
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  padding: 8px 16px;
  height: auto;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-btn:hover {
  background: var(--accent);
  border-color: var(--border);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px oklch(0% 0 0 / 0.1);
}

.primary-btn {
  background: oklch(0.65 0.15 195);
  border-color: oklch(0.65 0.15 195);
  color: white;
}

.primary-btn:hover {
  background: oklch(0.60 0.15 195);
  border-color: oklch(0.60 0.15 195);
  box-shadow: 0 4px 12px oklch(0.65 0.15 195 / 0.3);
}

@media (max-width: 768px) {
  .nav-content {
    flex-wrap: wrap;
    padding: 12px 16px;
  }

  .nav-left {
    flex: 1 1 100%;
    gap: 12px;
  }

  .nav-title {
    font-size: 16px;
  }

  .nav-right {
    flex: 1 1 100%;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
  }

  .search-input {
    flex: 1 1 100%;
    width: 100%;
    order: -1;
  }

  .action-btn {
    font-size: 13px;
    padding: 6px 12px;
  }
}
</style>
