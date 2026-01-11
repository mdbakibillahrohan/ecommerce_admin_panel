<script setup lang="ts">
interface Folder {
    id: number
    name: string
    parent_id: number | null
    children?: Folder[]
}

interface Props {
    folders: Folder[]
    selectedId?: number
}

interface Emits {
    (e: 'select', folder: Folder): void
    (e: 'create', parentId: number | null): void
    (e: 'rename', folder: Folder): void
    (e: 'delete', folder: Folder): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function handleSelect(folder: Folder) {
    emit('select', folder)
}
</script>

<template>
    <a-card title="Folders" :bordered="false" class="folder-tree-card">
        <template #extra>
            <a-button size="small" @click="emit('create', null)">
                <template #icon>
                    <folder-add-outlined />
                </template>
                New Folder
            </a-button>
        </template>

        <a-tree :tree-data="folders" :field-names="{ title: 'name', key: 'id', children: 'children' }"
            :selected-keys="selectedId ? [selectedId] : []" @select="(_keys: any, { node }: any) => handleSelect(node)">
            <template #icon>
                <folder-outlined />
            </template>
            <template #title="{ dataRef }">
                <div class="folder-node">
                    <span class="folder-name">{{ dataRef.name }}</span>
                    <div class="folder-actions" @click.stop>
                        <a-button type="link" size="small" @click="emit('create', dataRef.id)">
                            <plus-outlined />
                        </a-button>
                        <a-button type="link" size="small" @click="emit('rename', dataRef)">
                            <edit-outlined />
                        </a-button>
                        <a-button type="link" size="small" danger @click="emit('delete', dataRef)">
                            <delete-outlined />
                        </a-button>
                    </div>
                </div>
            </template>
        </a-tree>
    </a-card>
</template>

<script setup lang="ts">
import { FolderOutlined, FolderAddOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
</script>

<style scoped>
.folder-tree-card {
    height: 100%;
}

.folder-node {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
}

.folder-name {
    flex: 1;
    font-weight: 500;
}

.folder-actions {
    display: none;
    gap: 4px;
}

.folder-node:hover .folder-actions {
    display: flex;
}
</style>
