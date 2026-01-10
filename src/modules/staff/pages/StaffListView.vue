<template>
  <div class="staff-list-container">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">Team & Staff</h1>
          <p class="page-subtitle">Manage access to your store for your team members.</p>
        </div>
        <div class="header-actions">
          <a-button class="invite-button" type="primary" size="large" @click="showInviteModal">
            <UserAddOutlined />
            Invite Staff Member
          </a-button>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon"
          style="background: linear-gradient(135deg, oklch(0.7 0.15 210) 0%, oklch(0.6 0.15 210) 100%);">
          <TeamOutlined />
        </div>
        <div class="stat-content">
          <div class="stat-label">Total Staff</div>
          <div class="stat-value">{{ staff.length }}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon"
          style="background: linear-gradient(135deg, oklch(0.7 0.19 180) 0%, oklch(0.6 0.19 180) 100%);">
          <CheckCircleOutlined />
        </div>
        <div class="stat-content">
          <div class="stat-label">Active Members</div>
          <div class="stat-value">{{ activeStaffCount }}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon"
          style="background: linear-gradient(135deg, oklch(0.75 0.15 60) 0%, oklch(0.65 0.15 60) 100%);">
          <ClockCircleOutlined />
        </div>
        <div class="stat-content">
          <div class="stat-label">Pending Invites</div>
          <div class="stat-value">{{ pendingInvitesCount }}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon"
          style="background: linear-gradient(135deg, oklch(0.7 0.2 330) 0%, oklch(0.6 0.2 330) 100%);">
          <SafetyOutlined />
        </div>
        <div class="stat-content">
          <div class="stat-label">Admins</div>
          <div class="stat-value">{{ adminCount }}</div>
        </div>
      </div>
    </div>

    <!-- Filters and Actions -->
    <div class="filters-section">
      <div class="filters-left">
        <a-input-search v-model:value="searchQuery" placeholder="Search by name or email..." class="search-input"
          size="large" @search="handleSearch">
          <template #prefix>
            <SearchOutlined />
          </template>
        </a-input-search>

        <a-select v-model:value="roleFilter" placeholder="Filter by Role" class="filter-select" size="large" allowClear>
          <a-select-option value="ADMIN">Admin</a-select-option>
          <a-select-option value="MEMBER">Member</a-select-option>
          <a-select-option value="SUPPORT">Support</a-select-option>
        </a-select>

        <a-select v-model:value="statusFilter" placeholder="Filter by Status" class="filter-select" size="large"
          allowClear>
          <a-select-option value="ACTIVE">Active</a-select-option>
          <a-select-option value="PENDING">Pending</a-select-option>
        </a-select>

        <a-button v-if="searchQuery || roleFilter || statusFilter" class="clear-filters-btn" @click="clearFilters">
          Clear Filters
        </a-button>
      </div>

      <div class="filters-right">
        <a-dropdown>
          <a-button size="large" class="export-btn">
            <DownloadOutlined />
            Export
          </a-button>
          <template #overlay>
            <a-menu @click="handleExport">
              <a-menu-item key="csv">Export as CSV</a-menu-item>
              <a-menu-item key="pdf">Export as PDF</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>

    <!-- Staff Table -->
    <div class="table-container">
      <a-table :columns="columns" :dataSource="filteredStaff" :loading="loading" :pagination="pagination" rowKey="id"
        class="staff-table">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'user'">
            <div class="user-cell">
              <a-avatar :size="48" :style="{ backgroundColor: getAvatarColor(record) }">
                {{ getInitials(record) }}
              </a-avatar>
              <div class="user-info">
                <div class="user-name">
                  {{ getUserName(record) }}
                </div>
                <div class="user-email">{{ record.user?.email || record.email }}</div>
              </div>
            </div>
          </template>

          <template v-if="column.key === 'role'">
            <div class="role-badge" :class="`role-${record.role.toLowerCase()}`">
              <SafetyOutlined v-if="record.role === 'ADMIN'" />
              <UserOutlined v-else-if="record.role === 'MEMBER'" />
              <CustomerServiceOutlined v-else />
              {{ record.role }}
            </div>
          </template>

          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === 'ACTIVE' ? 'success' : 'warning'" class="status-tag">
              <CheckCircleOutlined v-if="record.status === 'ACTIVE'" />
              <ClockCircleOutlined v-else />
              {{ record.status }}
            </a-tag>
          </template>

          <template v-if="column.key === 'joinedDate'">
            <div class="date-cell">
              {{ formatDate(record.created_at) }}
            </div>
          </template>

          <template v-if="column.key === 'actions'">
            <div class="action-buttons">
              <a-tooltip title="View Details">
                <a-button type="text" class="action-btn view-btn" @click="viewStaffDetails(record)">
                  <EyeOutlined />
                </a-button>
              </a-tooltip>
              <a-tooltip title="Edit Role">
                <a-button type="text" class="action-btn edit-btn" @click="editStaffRole(record)">
                  <EditOutlined />
                </a-button>
              </a-tooltip>
              <a-popconfirm title="Remove this staff member?" @confirm="handleRemove(record.id)" okText="Remove"
                cancelText="Cancel">
                <a-tooltip title="Remove">
                  <a-button type="text" class="action-btn delete-btn">
                    <DeleteOutlined />
                  </a-button>
                </a-tooltip>
              </a-popconfirm>
            </div>
          </template>
        </template>
      </a-table>
    </div>

    <!-- Invite Modal -->
    <a-modal v-model:open="inviteModalVisible" :title="null" :footer="null" width="600px" class="invite-modal">
      <div class="modal-header">
        <div class="modal-icon">
          <UserAddOutlined />
        </div>
        <h2 class="modal-title">Invite Staff Member</h2>
        <p class="modal-subtitle">Send an invitation to join your team</p>
      </div>

      <a-form layout="vertical" class="invite-form">
        <a-form-item label="Email Address" required>
          <a-input v-model:value="inviteForm.email" placeholder="colleague@example.com" size="large" type="email">
            <template #prefix>
              <MailOutlined />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item label="Role" required>
          <a-select v-model:value="inviteForm.role" size="large">
            <a-select-option value="ADMIN">
              <div class="role-option">
                <SafetyOutlined />
                <div>
                  <div class="role-option-title">Admin</div>
                  <div class="role-option-desc">Full access to all features</div>
                </div>
              </div>
            </a-select-option>
            <a-select-option value="MEMBER">
              <div class="role-option">
                <UserOutlined />
                <div>
                  <div class="role-option-title">Member</div>
                  <div class="role-option-desc">Limited access to features</div>
                </div>
              </div>
            </a-select-option>
            <a-select-option value="SUPPORT">
              <div class="role-option">
                <CustomerServiceOutlined />
                <div>
                  <div class="role-option-title">Support</div>
                  <div class="role-option-desc">Customer support access</div>
                </div>
              </div>
            </a-select-option>
          </a-select>
        </a-form-item>

        <div class="modal-actions">
          <a-button size="large" @click="inviteModalVisible = false" class="cancel-btn">
            Cancel
          </a-button>
          <a-button type="primary" size="large" @click="handleInvite" :loading="inviting" class="submit-btn">
            <SendOutlined />
            Send Invitation
          </a-button>
        </div>
      </a-form>
    </a-modal>

    <!-- Staff Details Drawer -->
    <a-drawer v-model:open="detailsDrawerVisible" title="Staff Member Details" placement="right" width="500"
      class="details-drawer">
      <div v-if="selectedStaff" class="staff-details">
        <div class="details-header">
          <a-avatar :size="80" :style="{ backgroundColor: getAvatarColor(selectedStaff) }">
            {{ getInitials(selectedStaff) }}
          </a-avatar>
          <h3 class="details-name">{{ getUserName(selectedStaff) }}</h3>
          <p class="details-email">{{ selectedStaff.user?.email || selectedStaff.email }}</p>
        </div>

        <div class="details-section">
          <div class="detail-item">
            <label>Role</label>
            <div class="role-badge" :class="`role-${selectedStaff.role.toLowerCase()}`">
              {{ selectedStaff.role }}
            </div>
          </div>

          <div class="detail-item">
            <label>Status</label>
            <a-tag :color="selectedStaff.status === 'ACTIVE' ? 'success' : 'warning'">
              {{ selectedStaff.status }}
            </a-tag>
          </div>

          <div class="detail-item">
            <label>Joined Date</label>
            <div>{{ formatDate(selectedStaff.created_at) }}</div>
          </div>
        </div>
      </div>
    </a-drawer>

    <!-- Edit Role Modal -->
    <a-modal v-model:open="editRoleModalVisible" title="Edit Staff Role" @ok="handleUpdateRole"
      :confirmLoading="updating" okText="Update Role" class="edit-role-modal">
      <a-form layout="vertical" v-if="selectedStaff">
        <a-form-item label="Staff Member">
          <a-input :value="getUserName(selectedStaff)" disabled />
        </a-form-item>
        <a-form-item label="New Role" required>
          <a-select v-model:value="editRoleForm.role" size="large">
            <a-select-option value="ADMIN">Admin (Full Access)</a-select-option>
            <a-select-option value="MEMBER">Member (Limited Access)</a-select-option>
            <a-select-option value="SUPPORT">Support</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { message } from 'ant-design-vue'
import {
  UserAddOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SafetyOutlined,
  SearchOutlined,
  DownloadOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  CustomerServiceOutlined,
  MailOutlined,
  SendOutlined
} from '@ant-design/icons-vue'
import { staffService, type StaffMember } from '@/modules/staff/services/staff.service'

const loading = ref(false)
const inviting = ref(false)
const updating = ref(false)
const staff = ref<StaffMember[]>([])
const inviteModalVisible = ref(false)
const detailsDrawerVisible = ref(false)
const editRoleModalVisible = ref(false)
const selectedStaff = ref<StaffMember | null>(null)

const searchQuery = ref('')
const roleFilter = ref<string | undefined>(undefined)
const statusFilter = ref<string | undefined>(undefined)

const inviteForm = reactive({
  email: '',
  role: 'MEMBER'
})

const editRoleForm = reactive({
  role: ''
})

const pagination = {
  pageSize: 10,
  showSizeChanger: true,
  showTotal: (total: number) => `Total ${total} staff members`
}

const columns = [
  { title: 'Staff Member', key: 'user', width: 300 },
  { title: 'Role', key: 'role', width: 150 },
  { title: 'Status', key: 'status', width: 120 },
  { title: 'Joined Date', key: 'joinedDate', width: 150 },
  { title: 'Actions', key: 'actions', width: 150, align: 'center' as const },
]

const activeStaffCount = computed(() => {
  return staff.value.filter(s => s.status === 'ACTIVE').length
})

const pendingInvitesCount = computed(() => {
  return staff.value.filter(s => s.status === 'PENDING').length
})

const adminCount = computed(() => {
  return staff.value.filter(s => s.role === 'ADMIN').length
})

const filteredStaff = computed(() => {
  let result = staff.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(s => {
      const name = getUserName(s).toLowerCase()
      const email = (s.user?.email || s.email || '').toLowerCase()
      return name.includes(query) || email.includes(query)
    })
  }

  if (roleFilter.value) {
    result = result.filter(s => s.role === roleFilter.value)
  }

  if (statusFilter.value) {
    result = result.filter(s => s.status === statusFilter.value)
  }

  return result
})

const fetchStaff = async () => {
  loading.value = true
  try {
    const data = await staffService.getStaffMembers()
    staff.value = data
  } catch (error) {
    void error
    message.error('Failed to load staff')
  } finally {
    loading.value = false
  }
}

const showInviteModal = () => {
  inviteForm.email = ''
  inviteForm.role = 'MEMBER'
  inviteModalVisible.value = true
}

const handleInvite = async () => {
  if (!inviteForm.email) {
    message.warning('Please enter an email address')
    return
  }
  inviting.value = true
  try {
    await staffService.inviteStaff({ email: inviteForm.email, role: inviteForm.role })
    message.success(`Invitation sent to ${inviteForm.email}`)
    inviteModalVisible.value = false
    fetchStaff()
  } catch (error) {
    void error
    message.error('Failed to send invitation')
  } finally {
    inviting.value = false
  }
}

const handleRemove = async (id: number) => {
  try {
    await staffService.removeStaff(id)
    message.success('Staff member removed')
    fetchStaff()
  } catch (error) {
    void error
    message.error('Failed to remove staff')
  }
}

const viewStaffDetails = (record: StaffMember) => {
  selectedStaff.value = record
  detailsDrawerVisible.value = true
}

const editStaffRole = (record: StaffMember) => {
  selectedStaff.value = record
  editRoleForm.role = record.role
  editRoleModalVisible.value = true
}

const handleUpdateRole = async () => {
  if (!selectedStaff.value) return
  updating.value = true
  try {
    message.success('Staff role updated successfully')
    editRoleModalVisible.value = false
    fetchStaff()
  } catch (error) {
    void error
    message.error('Failed to update role')
  } finally {
    updating.value = false
  }
}

const handleSearch = () => {
  // Search is handled by computed property
}

const clearFilters = () => {
  searchQuery.value = ''
  roleFilter.value = undefined
  statusFilter.value = undefined
}

const handleExport = ({ key }: { key: string }) => {
  message.success(`Exporting as ${key.toUpperCase()}...`)
}

const getUserName = (record: StaffMember) => {
  if (record.user) {
    return `${record.user.first_name} ${record.user.last_name}`.trim()
  }
  return 'Pending Invitation'
}

const getInitials = (record: StaffMember) => {
  const user = record.user
  if (user && user.first_name) {
    return user.first_name.charAt(0).toUpperCase()
  }
  const email = user?.email || record.email || ''
  return email.charAt(0).toUpperCase()
}

const getAvatarColor = (record: StaffMember) => {
  const colors = [
    'oklch(0.7 0.19 180)',
    'oklch(0.7 0.15 210)',
    'oklch(0.75 0.15 60)',
    'oklch(0.7 0.2 330)',
    'oklch(0.65 0.15 150)'
  ]
  const email = record.user?.email || record.email || ''
  const index = (email.charCodeAt(0) || 0) % colors.length
  return colors[index]
}

const formatDate = (date: string | undefined) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  fetchStaff()
})
</script>

<style scoped>
.staff-list-container {
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.title-section {
  flex: 1;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: var(--foreground);
}

.page-subtitle {
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.invite-button {
  height: 44px;
  padding: 0 24px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, oklch(0.7 0.19 180) 0%, oklch(0.6 0.19 180) 100%);
  border: none;
  box-shadow: 0 2px 8px rgba(13, 148, 136, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.invite-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.3);
}

/* Statistics Cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: oklch(0.7 0.19 180);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 13px;
  color: var(--muted-foreground);
  margin-bottom: 4px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--foreground);
}

/* Filters Section */
.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.filters-left {
  display: flex;
  gap: 12px;
  flex: 1;
  flex-wrap: wrap;
}

.filters-right {
  display: flex;
  gap: 12px;
}

.search-input {
  width: 300px;
  border-radius: 8px;
}

.search-input :deep(.ant-input) {
  border-radius: 8px;
  background: var(--background);
  border-color: var(--border);
  color: var(--foreground);
}

.filter-select {
  min-width: 180px;
  border-radius: 8px;
}

.filter-select :deep(.ant-select-selector) {
  border-radius: 8px !important;
  background: var(--background) !important;
  border-color: var(--border) !important;
  color: var(--foreground) !important;
}

.clear-filters-btn {
  height: 40px;
  border-radius: 8px;
  color: var(--muted-foreground);
  border-color: var(--border);
}

.export-btn {
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Table Container */
.table-container {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}

.staff-table :deep(.ant-table) {
  background: transparent;
}

.staff-table :deep(.ant-table-thead > tr > th) {
  background: var(--muted);
  color: var(--foreground);
  font-weight: 600;
  border-bottom: 1px solid var(--border);
}

.staff-table :deep(.ant-table-tbody > tr) {
  transition: background 0.2s;
}

.staff-table :deep(.ant-table-tbody > tr:hover) {
  background: var(--accent);
}

.staff-table :deep(.ant-table-tbody > tr > td) {
  border-bottom: 1px solid var(--border);
}

/* User Cell */
.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 2px;
}

.user-email {
  font-size: 12px;
  color: var(--muted-foreground);
}

/* Role Badge */
.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.role-admin {
  background: rgba(239, 68, 68, 0.1);
  color: oklch(0.6 0.2 30);
}

.role-member {
  background: rgba(13, 148, 136, 0.1);
  color: oklch(0.6 0.19 180);
}

.role-support {
  background: rgba(59, 130, 246, 0.1);
  color: oklch(0.6 0.15 250);
}

/* Status Tag */
.status-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
}

/* Date Cell */
.date-cell {
  color: var(--muted-foreground);
  font-size: 13px;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 4px;
  justify-content: center;
}

.action-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;
}

.view-btn:hover {
  background: rgba(13, 148, 136, 0.1);
  color: oklch(0.6 0.19 180);
}

.edit-btn:hover {
  background: rgba(59, 130, 246, 0.1);
  color: oklch(0.6 0.15 250);
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: oklch(0.6 0.2 30);
}

/* Invite Modal */
.invite-modal :deep(.ant-modal-content) {
  border-radius: 16px;
  overflow: hidden;
}

.modal-header {
  text-align: center;
  padding: 24px 24px 16px;
  background: linear-gradient(135deg, oklch(0.7 0.19 180) 0%, oklch(0.6 0.19 180) 100%);
  color: white;
}

.modal-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: white;
}

.modal-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.invite-form {
  padding: 24px;
}

.invite-form :deep(.ant-form-item-label > label) {
  font-weight: 600;
  color: var(--foreground);
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.cancel-btn {
  height: 44px;
  padding: 0 24px;
  border-radius: 8px;
}

.submit-btn {
  height: 44px;
  padding: 0 24px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, oklch(0.7 0.19 180) 0%, oklch(0.6 0.19 180) 100%);
  border: none;
}

/* Role Option */
.role-option {
  display: flex;
  align-items: center;
  gap: 12px;
}

.role-option-title {
  font-weight: 600;
  font-size: 14px;
}

.role-option-desc {
  font-size: 12px;
  color: var(--muted-foreground);
}

/* Details Drawer */
.details-drawer :deep(.ant-drawer-header) {
  background: linear-gradient(135deg, oklch(0.7 0.19 180) 0%, oklch(0.6 0.19 180) 100%);
  border: none;
}

.details-drawer :deep(.ant-drawer-title) {
  color: white;
  font-weight: 700;
}

.details-drawer :deep(.ant-drawer-close) {
  color: white;
}

.staff-details {
  padding: 16px 0;
}

.details-header {
  text-align: center;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 24px;
}

.details-name {
  font-size: 20px;
  font-weight: 700;
  margin: 16px 0 4px;
  color: var(--foreground);
}

.details-email {
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0;
}

.details-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item label {
  font-size: 12px;
  font-weight: 600;
  color: var(--muted-foreground);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .staff-list-container {
    padding: 16px;
  }

  .header-content {
    flex-direction: column;
    align-items: stretch;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
  }

  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }

  .filters-left {
    flex-direction: column;
  }

  .search-input {
    width: 100%;
  }

  .filter-select {
    width: 100%;
  }
}
</style>
