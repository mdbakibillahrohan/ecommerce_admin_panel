<script setup lang="ts">
interface Category {
    id: number
    name: string
    slug: string
    parent_id: number | null
    children?: Category[]
    product_count?: number
}

interface Props {
    categories: Category[]
    selectedId?: number
}

interface Emits {
    (e: 'select', category: Category): void
    (e: 'add', parentId: number | null): void
    (e: 'edit', category: Category): void
    (e: 'delete', category: Category): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function handleSelect(category: Category) {
    emit('select', category)
}

function handleAdd(parentId: number | null) {
    emit('add', parentId)
}

function handleEdit(category: Category) {
    emit('edit', category)
}

function handleDelete(category: Category) {
    emit('delete', category)
}
</script>

<template>
    <a-card title="Categories" :bordered="false">
        <template #extra>
            <a-button type="primary" size="small" @click="handleAdd(null)">
                <template #icon>
                    <plus-outlined />
                </template>
                Add Category
            </a-button>
        </template>

        <a-tree :tree-data="categories" :field-names="{ title: 'name', key: 'id', children: 'children' }"
            :selected-keys="selectedId ? [selectedId] : []" @select="(_keys: any, { node }: any) => handleSelect(node)">
            <template #title="{ dataRef }">
                <div class="tree-node">
                    <span class="node-name">{{ dataRef.name }}</span>
                    <span v-if="dataRef.product_count !== undefined" class="node-count">({{ dataRef.product_count
                    }})</span>
                    <div class="node-actions" @click.stop>
                        <a-button type="link" size="small" @click="handleAdd(dataRef.id)">
                            <plus-outlined />
                        </a-button>
                        <a-button type="link" size="small" @click="handleEdit(dataRef as Category)">
                            <edit-outlined />
                        </a-button>
                        <a-button type="link" size="small" danger @click="handleDelete(dataRef as Category)">
                            <delete-outlined />
                        </a-button>
                    </div>
                </div>
            </template>
        </a-tree>
    </a-card>
</template>

<script setup lang="ts">
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
</script>

<style scoped>
.tree-node {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
}

.node-name {
    flex: 1;
    font-weight: 500;
}

.node-count {
    font-size: 13px;
    color: var(--muted-foreground);
}

.node-actions {
    display: none;
    gap: 4px;
}

.tree-node:hover .node-actions {
    display: flex;
}
</style>
