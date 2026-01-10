<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { staffService } from '../services/staff.service'
import type { PermissionGroup, StaffRole } from '../services/staff.service'
import { message } from 'ant-design-vue'
import {
  SaveOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons-vue'

// Import shared components
import CommonPageHeader from '@/modules/shared/components/ui/CommonPageHeader.vue'

const router = useRouter()
const route = useRoute()

// State
const loading = ref(false)
const saving = ref(false)
const permissionGroups = ref<PermissionGroup[]>([])
const allPermissions = ref<string[]>([])
const existingRole = ref<StaffRole | null>(null)

// Form data
const roleName = ref('')
const roleDescription = ref('')
const selectedPermissions = ref<string[]>([])
const isActive = ref(true)

// Computed
const isEditMode = computed(() => route.params.id !== undefined && route.params.id !== 'new')
const templateSlug = computed(() => route.query.template as string | undefined)
const pageTitle = computed(() => isEditMode.value ? 'Edit Role' : 'Create Role')

const selectedCount = computed(() => selectedPermissions.value.length)
const totalCount = computed(() => allPermissions.value.length)

// Check if group is fully selected
function isGroupFullySelected(group: PermissionGroup): boolean {
  return group.permissions.every(p => selectedPermissions.value.includes(p.key))
}

// Check if group is partially selected
function isGroupPartiallySelected(group: PermissionGroup): boolean {
  const selected = group.permissions.filter(p => selectedPermissions.value.includes(p.key))
  return selected.length > 0 && selected.length < group.permissions.length
}

// Toggle all permissions in a group
function toggleGroup(group: PermissionGroup) {
  if (isGroupFullySelected(group)) {
    // Remove all permissions in this group
    selectedPermissions.value = selectedPermissions.value.filter(
      p => !group.permissions.map(gp => gp.key).includes(p)
    )
  } else {
    // Add all permissions in this group
    const groupPerms = group.permissions.map(p => p.key)
    const newPerms = groupPerms.filter(p => !selectedPermissions.value.includes(p))
    selectedPermissions.value = [...selectedPermissions.value, ...newPerms]
  }
}

// Toggle individual permission
function togglePermission(permissionKey: string) {
  const index = selectedPermissions.value.indexOf(permissionKey)
  if (index > -1) {
    selectedPermissions.value.splice(index, 1)
  } else {
    selectedPermissions.value.push(permissionKey)
  }
}

// Select all permissions
function selectAll() {
  selectedPermissions.value = [...allPermissions.value]
}

// Clear all permissions
function clearAll() {
  selectedPermissions.value = []
}

onMounted(async () => {
  await loadPermissions()

  if (isEditMode.value) {
    await loadRole(Number(route.params.id))
  } else if (templateSlug.value) {
    await loadTemplate(templateSlug.value)
  }
})

async function loadPermissions() {
  loading.value = true
  try {
    const response = await staffService.getPermissions()
    permissionGroups.value = response.groups
    allPermissions.value = response.allPermissions
  } catch (error) {
    message.error('Failed to load permissions')
    console.error(error)
  } finally {
    loading.value = false
  }
}

async function loadRole(id: number) {
  loading.value = true
  try {
    const role = await staffService.getRole(id)
    existingRole.value = role
    roleName.value = role.name
    roleDescription.value = role.description || ''
    selectedPermissions.value = [...role.permissions]
    isActive.value = role.is_active
  } catch (error) {
    message.error('Failed to load role')
    router.push('/staff/roles')
  } finally {
    loading.value = false
  }
}

async function loadTemplate(slug: string) {
  try {
    const templates = await staffService.getRoleTemplates()
    const template = templates.find(t => t.slug === slug)
    if (template) {
      roleName.value = `${template.name} (Custom)`
      roleDescription.value = template.description
      selectedPermissions.value = [...template.permissions]
    }
  } catch (error) {
    console.error('Failed to load template', error)
  }
}

async function handleSubmit() {
  if (!roleName.value.trim()) {
    message.error('Role name is required')
    return
  }

  if (selectedPermissions.value.length === 0) {
    message.error('Please select at least one permission')
    return
  }

  saving.value = true
  try {
    if (isEditMode.value && existingRole.value) {
      await staffService.updateRole(existingRole.value.id, {
        name: roleName.value.trim(),
        description: roleDescription.value.trim() || undefined,
        permissions: selectedPermissions.value,
        is_active: isActive.value,
      })
      message.success('Role updated successfully')
    } else {
      await staffService.createRole({
        name: roleName.value.trim(),
        description: roleDescription.value.trim() || undefined,
        permissions: selectedPermissions.value,
      })
      message.success('Role created successfully')
    }
    router.push('/staff/roles')
  } catch (error: any) {
    message.error(error.response?.data?.message || 'Failed to save role')
  } finally {
    saving.value = false
  }
}

function goBack() {
  router.push('/staff/roles')
}
</script>

<template>
  <div class="role-form-page">
    <CommonPageHeader :title="pageTitle" subtitle="Configure role name and permissions">
      <template #actions>
        <a-space>
          <a-button size="large" @click="goBack">
            <template #icon><ArrowLeftOutlined /></template>
            Cancel
          </a-button>
          <a-button type="primary" size="large" :loading="saving" @click="handleSubmit">
            <template #icon><SaveOutlined /></template>
            {{ isEditMode ? 'Save Changes' : 'Create Role' }}
          </a-button>
        </a-space>
      </template>
    </CommonPageHeader>

    <a-spin :spinning="loading">
      <div class="form-container">
        <!-- Role Details Card -->
        <div class="form-card">
          <h3 class="card-title">Role Details</h3>
          <a-form layout="vertical">
            <a-form-item label="Role Name" required>
              <a-input
                v-model:value="roleName"
                placeholder="Enter role name (e.g., Marketing Manager)"
                size="large"
                :maxlength="255"
              />
            </a-form-item>
            <a-form-item label="Description">
              <a-textarea
                v-model:value="roleDescription"
                placeholder="Brief description of this role's responsibilities"
                :rows="3"
              />
            </a-form-item>
            <a-form-item v-if="isEditMode" label="Status">
              <a-switch v-model:checked="isActive" />
              <span class="status-label">{{ isActive ? 'Active' : 'Inactive' }}</span>
            </a-form-item>
          </a-form>
        </div>

        <!-- Permissions Card -->
        <div class="form-card permissions-card">
          <div class="permissions-header">
            <h3 class="card-title">Permissions</h3>
            <div class="permissions-actions">
              <span class="selection-count">{{ selectedCount }} of {{ totalCount }} selected</span>
              <a-button-group size="small">
                <a-button @click="selectAll">Select All</a-button>
                <a-button @click="clearAll">Clear All</a-button>
              </a-button-group>
            </div>
          </div>

          <div class="permissions-grid">
            <a-collapse :bordered="false" accordion>
              <a-collapse-panel
                v-for="group in permissionGroups"
                :key="group.key"
                :header="group.label"
              >
                <template #extra>
                  <a-checkbox
                    :checked="isGroupFullySelected(group)"
                    :indeterminate="isGroupPartiallySelected(group)"
                    @click.stop
                    @change="toggleGroup(group)"
                  />
                </template>

                <p class="group-description">{{ group.description }}</p>

                <div class="permission-list">
                  <div
                    v-for="permission in group.permissions"
                    :key="permission.key"
                    class="permission-item"
                    @click="togglePermission(permission.key)"
                  >
                    <a-checkbox
                      :checked="selectedPermissions.includes(permission.key)"
                      @click.stop
                      @change="togglePermission(permission.key)"
                    />
                    <div class="permission-info">
                      <span class="permission-label">{{ permission.label }}</span>
                      <span class="permission-description">{{ permission.description }}</span>
                    </div>
                  </div>
                </div>
              </a-collapse-panel>
            </a-collapse>
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<style scoped>
.role-form-page {
  padding: 24px;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 24px;
}

.form-card {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--text-primary);
}

.status-label {
  margin-left: 12px;
  color: var(--text-secondary);
}

.permissions-card {
  max-height: none;
}

.permissions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.permissions-header .card-title {
  margin-bottom: 0;
}

.permissions-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.selection-count {
  color: var(--text-secondary);
  font-size: 13px;
}

.permissions-grid {
  max-height: 600px;
  overflow-y: auto;
}

.group-description {
  color: var(--text-secondary);
  font-size: 13px;
  margin-bottom: 16px;
}

.permission-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.permission-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.permission-item:hover {
  background: var(--bg-secondary);
}

.permission-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.permission-label {
  font-weight: 500;
  color: var(--text-primary);
}

.permission-description {
  font-size: 12px;
  color: var(--text-secondary);
}

:deep(.ant-collapse-header) {
  font-weight: 500;
  font-size: 14px;
}

:deep(.ant-collapse-content-box) {
  padding: 16px !important;
}

:deep(.ant-form-item) {
  margin-bottom: 20px;
}
</style>
