<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { accessControlService } from '@/modules/access-control/services/access-control.service'
import type { AbacPolicy, QueryPolicyDto, AbacResource, PaginatedResponse } from '@/modules/access-control/interfaces'
import { PolicyEffect } from '@/modules/access-control/interfaces/enums'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FilterOutlined,
} from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import CommonPageHeader from '@/modules/shared/components/ui/CommonPageHeader.vue'
import CommonTable from '@/modules/shared/components/ui/CommonTable.vue'
import CommonStatsGrid from '@/modules/shared/components/ui/CommonStatsGrid.vue'

const router = useRouter()

// State
const loading = ref(false)
const policies = ref<AbacPolicy[]>([])
const resources = ref<AbacResource[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)

// Filters
const searchText = ref('')
const selectedResource = ref<number | undefined>()
const selectedEffect = ref<PolicyEffect | undefined>()
const selectedStatus = ref<boolean | undefined>()

// Statistics
const statsData = computed(() => [
  {
    label: 'Total Policies',
    value: total.value,
    icon: SafetyOutlined,
    iconStyle: { background: 'linear-gradient(135deg, oklch(0.7 0.15 210) 0%, oklch(0.65 0.18 220) 100%)' },
  },
  {
    label: 'Active Policies',
    value: policies.value.filter((p) => p.is_active).length,
    icon: CheckCircleOutlined,
    iconStyle: { background: 'linear-gradient(135deg, oklch(0.75 0.15 140) 0%, oklch(0.7 0.18 150) 100%)' },
  },
  {
    label: 'Allow Policies',
    value: policies.value.filter((p) => p.effect === PolicyEffect.ALLOW).length,
    icon: CheckCircleOutlined,
    iconStyle: { background: 'linear-gradient(135deg, oklch(0.7 0.15 170) 0%, oklch(0.65 0.18 180) 100%)' },
  },
  {
    label: 'Deny Policies',
    value: policies.value.filter((p) => p.effect === PolicyEffect.DENY).length,
    icon: CloseCircleOutlined,
    iconStyle: { background: 'linear-gradient(135deg, oklch(0.65 0.20 25) 0%, oklch(0.60 0.22 30) 100%)' },
  },
])

onMounted(async () => {
  await Promise.all([fetchPolicies(), fetchResources()])
})

async function fetchPolicies() {
  loading.value = true
  try {
    const query: QueryPolicyDto = {
      page: currentPage.value,
      limit: pageSize.value,
      search: searchText.value || undefined,
      resource_id: selectedResource.value,
      effect: selectedEffect.value,
      is_active: selectedStatus.value,
    }
    const response = await accessControlService.getPolicies(query)
    policies.value = response.data
    total.value = response.meta.total
  } catch (error) {
    message.error('Failed to fetch policies')
    console.error(error)
  } finally {
    loading.value = false
  }
}

async function fetchResources() {
  try {
    resources.value = await accessControlService.getResources()
  } catch (error) {
    console.error('Failed to fetch resources:', error)
  }
}

function handleSearch() {
  currentPage.value = 1
  fetchPolicies()
}

function handleTableChange(pagination: { current: number; pageSize: number }) {
  currentPage.value = pagination.current
  pageSize.value = pagination.pageSize
  fetchPolicies()
}

function handleCreate() {
  router.push('/settings/access-control/policies/create')
}

function handleEdit(id: number) {
  router.push(`/settings/access-control/policies/${id}/edit`)
}

async function handleDelete(id: number) {
  Modal.confirm({
    title: 'Delete Policy',
    content: 'Are you sure you want to delete this policy? This action cannot be undone.',
    okText: 'Delete',
    okType: 'danger',
    cancelText: 'Cancel',
    async onOk() {
      try {
        await accessControlService.deletePolicy(id)
        message.success('Policy deleted successfully')
        fetchPolicies()
      } catch (error) {
        message.error('Failed to delete policy')
        console.error(error)
      }
    },
  })
}

async function handleToggleStatus(policy: AbacPolicy) {
  try {
    await accessControlService.togglePolicyStatus(policy.id, !policy.is_active)
    message.success(`Policy ${policy.is_active ? 'deactivated' : 'activated'} successfully`)
    fetchPolicies()
  } catch (error) {
    message.error('Failed to update policy status')
    console.error(error)
  }
}

function clearFilters() {
  searchText.value = ''
  selectedResource.value = undefined
  selectedEffect.value = undefined
  selectedStatus.value = undefined
  handleSearch()
}

function getResourceName(resourceId: number | null): string {
  if (!resourceId) return 'All Resources'
  const resource = resources.value.find((r) => r.id === resourceId)
  return resource?.name || 'Unknown'
}

const columns = [
  {
    title: 'Policy Name',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: 'Resource',
    key: 'resource',
    width: 150,
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
    width: 120,
  },
  {
    title: 'Effect',
    key: 'effect',
    width: 100,
    align: 'center' as const,
  },
  {
    title: 'Priority',
    dataIndex: 'priority',
    key: 'priority',
    width: 100,
    align: 'center' as const,
  },
  {
    title: 'Status',
    key: 'status',
    width: 120,
    align: 'center' as const,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 150,
    align: 'center' as const,
    fixed: 'right' as const,
  },
]

const pagination = computed(() => ({
  current: currentPage.value,
  pageSize: pageSize.value,
  total: total.value,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `Total ${total} policies`,
}))
</script>

<template>
  <div class="policy-list-page">
    <CommonPageHeader title="Access Control Policies" subtitle="Manage permissions and access rules for your store">
      <template #actions>
        <a-button type="primary" size="large" @click="handleCreate">
          <template #icon>
            <PlusOutlined />
          </template>
          Create Policy
        </a-button>
      </template>
    </CommonPageHeader>

    <CommonStatsGrid :stats="statsData" :loading="loading" />

    <!-- Filters Card -->
    <div class="filter-card">
      <div class="filter-section">
        <div class="filter-row">
          <div class="filter-input">
            <a-input-search
              v-model:value="searchText"
              placeholder="Search policies by name..."
              size="large"
              allow-clear
              @search="handleSearch"
              @pressEnter="handleSearch"
            >
              <template #prefix>
                <SearchOutlined />
              </template>
            </a-input-search>
          </div>

          <div class="filter-select">
            <a-select
              v-model:value="selectedResource"
              placeholder="All Resources"
              size="large"
              allow-clear
              @change="handleSearch"
            >
              <a-select-option v-for="res in resources" :key="res.id" :value="res.id">
                {{ res.name }}
              </a-select-option>
            </a-select>
          </div>

          <div class="filter-select">
            <a-select
              v-model:value="selectedEffect"
              placeholder="All Effects"
              size="large"
              allow-clear
              @change="handleSearch"
            >
              <a-select-option :value="PolicyEffect.ALLOW">Allow</a-select-option>
              <a-select-option :value="PolicyEffect.DENY">Deny</a-select-option>
            </a-select>
          </div>

          <div class="filter-select">
            <a-select
              v-model:value="selectedStatus"
              placeholder="All Status"
              size="large"
              allow-clear
              @change="handleSearch"
            >
              <a-select-option :value="true">Active</a-select-option>
              <a-select-option :value="false">Inactive</a-select-option>
            </a-select>
          </div>

          <a-button size="large" @click="clearFilters">Clear</a-button>
        </div>
      </div>
    </div>

    <!-- Policies Table -->
    <div class="table-container">
      <CommonTable
        :columns="columns"
        :data-source="policies"
        :loading="loading"
        row-key="id"
        :pagination="pagination"
        :scroll="{ x: 1000 }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <!-- Resource -->
          <template v-if="column.key === 'resource'">
            <a-tag v-if="record.resource" color="blue">{{ record.resource.name }}</a-tag>
            <a-tag v-else color="geekblue">All Resources (*)</a-tag>
          </template>

          <!-- Effect -->
          <template v-if="column.key === 'effect'">
            <a-tag :color="record.effect === PolicyEffect.ALLOW ? 'green' : 'red'">
              {{ record.effect }}
            </a-tag>
          </template>

          <!-- Status -->
          <template v-if="column.key === 'status'">
            <a-switch
              :checked="record.is_active"
              checked-children="Active"
              un-checked-children="Inactive"
              @change="() => handleToggleStatus(record)"
            />
          </template>

          <!-- Actions -->
          <template v-if="column.key === 'actions'">
            <a-space :size="4">
              <a-tooltip title="Edit">
                <a-button type="text" size="small" @click="handleEdit(record.id)">
                  <template #icon>
                    <EditOutlined />
                  </template>
                </a-button>
              </a-tooltip>
              <a-tooltip title="Delete">
                <a-button type="text" size="small" danger @click="handleDelete(record.id)">
                  <template #icon>
                    <DeleteOutlined />
                  </template>
                </a-button>
              </a-tooltip>
            </a-space>
          </template>
        </template>
      </CommonTable>
    </div>
  </div>
</template>

<style scoped>
.policy-list-page {
  background: var(--background);
  min-height: 100vh;
}

.filter-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.filter-section {
  margin-bottom: 0;
}

.filter-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr auto;
  gap: 12px;
  align-items: center;
}

.filter-input {
  width: 100%;
}

.filter-select {
  width: 100%;
}

.table-container {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}

@media (max-width: 1024px) {
  .filter-row {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .filter-row {
    grid-template-columns: 1fr;
  }
}
</style>
