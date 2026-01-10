<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { staffService } from '../services/staff.service'
import type { StaffRole, RoleTemplate } from '../services/staff.service'
import { message, Modal } from 'ant-design-vue'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  SafetyOutlined,
  CopyOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons-vue'

// Import shared components
import CommonPageHeader from '@/modules/shared/components/ui/CommonPageHeader.vue'
import CommonStatsGrid from '@/modules/shared/components/ui/CommonStatsGrid.vue'
import CommonTable from '@/modules/shared/components/ui/CommonTable.vue'

const router = useRouter()

// State
const loading = ref(false)
const customRoles = ref<StaffRole[]>([])
const templates = ref<(RoleTemplate & { id: null; isTemplate: true })[]>([])
const activeTab = ref<'custom' | 'templates'>('custom')

// Statistics
const statsData = computed(() => [
  {
    label: 'Custom Roles',
    value: customRoles.value.length,
    icon: TeamOutlined,
    iconStyle: { background: 'linear-gradient(135deg, oklch(0.7 0.15 210) 0%, oklch(0.65 0.18 220) 100%)' },
  },
  {
    label: 'Active Roles',
    value: customRoles.value.filter(r => r.is_active).length,
    icon: CheckCircleOutlined,
    iconStyle: { background: 'linear-gradient(135deg, oklch(0.75 0.18 145) 0%, oklch(0.70 0.20 155) 100%)' },
  },
  {
    label: 'Role Templates',
    value: templates.value.length,
    icon: SafetyOutlined,
    iconStyle: { background: 'linear-gradient(135deg, oklch(0.75 0.15 50) 0%, oklch(0.70 0.17 55) 100%)' },
  },
])

onMounted(async () => {
  await fetchRoles()
})

async function fetchRoles() {
  loading.value = true
  try {
    const response = await staffService.getRoles()
    customRoles.value = response.customRoles
    templates.value = response.templates
  } catch (error) {
    message.error('Failed to load roles')
    console.error(error)
  } finally {
    loading.value = false
  }
}

function handleCreate() {
  router.push('/staff/roles/new')
}

function handleEdit(id: number) {
  router.push(`/staff/roles/${id}`)
}

function handleCreateFromTemplate(template: RoleTemplate) {
  router.push({
    path: '/staff/roles/new',
    query: { template: template.slug }
  })
}

function handleDelete(role: StaffRole) {
  Modal.confirm({
    title: 'Delete Role',
    content: `Are you sure you want to delete "${role.name}"? This action cannot be undone.`,
    okText: 'Delete',
    okType: 'danger',
    cancelText: 'Cancel',
    async onOk() {
      try {
        await staffService.deleteRole(role.id)
        message.success('Role deleted successfully')
        await fetchRoles()
      } catch (error: any) {
        message.error(error.response?.data?.message || 'Failed to delete role')
      }
    },
  })
}

// Table columns for custom roles
const customRoleColumns = [
  {
    title: 'Role Name',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
  },
  {
    title: 'Permissions',
    key: 'permissions',
    width: 120,
    align: 'center' as const,
  },
  {
    title: 'Status',
    key: 'status',
    width: 100,
    align: 'center' as const,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 120,
    align: 'center' as const,
    fixed: 'right' as const,
  },
]

// Table columns for templates
const templateColumns = [
  {
    title: 'Template Name',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
  },
  {
    title: 'Permissions',
    key: 'permissions',
    width: 120,
    align: 'center' as const,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 150,
    align: 'center' as const,
  },
]
</script>

<template>
  <div class="role-list-page">
    <CommonPageHeader title="Role Management" subtitle="Create and manage staff roles with custom permissions">
      <template #actions>
        <a-button type="primary" size="large" @click="handleCreate">
          <template #icon>
            <PlusOutlined />
          </template>
          Create Role
        </a-button>
      </template>
    </CommonPageHeader>

    <CommonStatsGrid :stats="statsData" :loading="loading" />

    <!-- Tabs for Custom Roles vs Templates -->
    <div class="tabs-container">
      <a-tabs v-model:activeKey="activeTab" size="large">
        <a-tab-pane key="custom" tab="Custom Roles">
          <div class="table-container">
            <CommonTable
              :columns="customRoleColumns"
              :data-source="customRoles"
              :loading="loading"
              row-key="id"
              :pagination="false"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'permissions'">
                  <a-tag color="blue">{{ record.permissions.length }} permissions</a-tag>
                </template>
                <template v-else-if="column.key === 'status'">
                  <a-tag :color="record.is_active ? 'success' : 'default'">
                    {{ record.is_active ? 'Active' : 'Inactive' }}
                  </a-tag>
                </template>
                <template v-else-if="column.key === 'actions'">
                  <a-space>
                    <a-tooltip title="Edit">
                      <a-button type="text" size="small" @click="handleEdit(record.id)">
                        <template #icon><EditOutlined /></template>
                      </a-button>
                    </a-tooltip>
                    <a-tooltip title="Delete">
                      <a-button type="text" size="small" danger @click="handleDelete(record)">
                        <template #icon><DeleteOutlined /></template>
                      </a-button>
                    </a-tooltip>
                  </a-space>
                </template>
              </template>
            </CommonTable>

            <a-empty
              v-if="!loading && customRoles.length === 0"
              description="No custom roles yet"
              class="empty-state"
            >
              <a-button type="primary" @click="handleCreate">
                <PlusOutlined /> Create Your First Role
              </a-button>
            </a-empty>
          </div>
        </a-tab-pane>

        <a-tab-pane key="templates" tab="Role Templates">
          <div class="table-container">
            <div class="template-info">
              <a-alert
                message="Role Templates"
                description="These are predefined role templates. You can use them as a starting point to create custom roles with pre-configured permissions."
                type="info"
                show-icon
              />
            </div>

            <CommonTable
              :columns="templateColumns"
              :data-source="templates"
              :loading="loading"
              row-key="slug"
              :pagination="false"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'permissions'">
                  <a-tag color="purple">{{ record.permissionCount }} permissions</a-tag>
                </template>
                <template v-else-if="column.key === 'actions'">
                  <a-button type="primary" size="small" @click="handleCreateFromTemplate(record)">
                    <template #icon><CopyOutlined /></template>
                    Use Template
                  </a-button>
                </template>
              </template>
            </CommonTable>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<style scoped>
.role-list-page {
  padding: 24px;
}

.tabs-container {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 24px;
  margin-top: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.table-container {
  margin-top: 16px;
}

.template-info {
  margin-bottom: 16px;
}

.empty-state {
  padding: 48px 0;
}

:deep(.ant-tabs-tab) {
  font-size: 15px;
  font-weight: 500;
}
</style>
