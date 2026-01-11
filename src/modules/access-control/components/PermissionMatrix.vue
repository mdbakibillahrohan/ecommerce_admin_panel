<script setup lang="ts">
import { ref } from 'vue'

interface Permission {
    id: number
    name: string
    description: string
    category: string
}

interface Props {
    permissions: Permission[]
    selectedPermissions: number[]
    roleName: string
    visible: boolean
}

interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'update', permissionIds: number[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localSelected = ref<number[]>([...props.selectedPermissions])

function handleOk() {
    emit('update', localSelected.value)
    emit('update:visible', false)
}

function handleCancel() {
    emit('update:visible', false)
}

function groupedPermissions() {
    const groups: Record<string, Permission[]> = {}
    props.permissions.forEach((p) => {
        if (!groups[p.category]) groups[p.category] = []
        groups[p.category]!.push(p)
    })
    return groups
}
</script>

<template>
    <a-modal :open="visible" :title="`Manage Permissions - ${roleName}`" @ok="handleOk" @cancel="handleCancel"
        width="700px">
        <div class="permissions-matrix">
            <div v-for="(perms, category) in groupedPermissions()" :key="category" class="permission-category">
                <h4 class="category-title">{{ category }}</h4>
                <a-checkbox-group v-model:value="localSelected" class="permission-list">
                    <div v-for="perm in perms" :key="perm.id" class="permission-item">
                        <a-checkbox :value="perm.id">
                            <div class="permission-info">
                                <div class="permission-name">{{ perm.name }}</div>
                                <div class="permission-desc">{{ perm.description }}</div>
                            </div>
                        </a-checkbox>
                    </div>
                </a-checkbox-group>
            </div>
        </div>
    </a-modal>
</template>

<style scoped>
.permissions-matrix {
    max-height: 500px;
    overflow-y: auto;
}

.permission-category {
    margin-bottom: 24px;
}

.category-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--foreground);
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 2px solid var(--border);
}

.permission-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
}

.permission-item {
    padding: 8px;
    border-radius: 6px;
    transition: background 0.2s;
}

.permission-item:hover {
    background: var(--accent);
}

.permission-info {
    margin-left: 8px;
}

.permission-name {
    font-weight: 600;
    color: var(--foreground);
}

.permission-desc {
    font-size: 13px;
    color: var(--muted-foreground);
    margin-top: 2px;
}
</style>
