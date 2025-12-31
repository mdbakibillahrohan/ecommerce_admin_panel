<template>
  <div class="staff-list">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">Team & Staff</h1>
        <p class="text-gray-500">Manage access to your store for your team members.</p>
      </div>
      <a-button type="primary" @click="showInviteModal">
        <UserAddOutlined /> Invite Staff
      </a-button>
    </div>

    <a-card :bordered="false" class="shadow-sm rounded-lg">
      <a-table :columns="columns" :dataSource="staff" :loading="loading" rowKey="id">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'user'">
            <div class="flex items-center gap-3">
              <a-avatar :style="{ backgroundColor: '#f56a00', verticalAlign: 'middle' }">
                {{ record.user?.first_name[0] || record.email[0] }}
              </a-avatar>
              <div>
                <div class="font-medium">
                  {{ record.user ? (record.user.first_name + ' ' + record.user.last_name) : 'Pending Invitation' }}
                </div>
                <div class="text-xs text-gray-500">{{ record.user?.email || record.email }}</div>
              </div>
            </div>
          </template>

          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === 'ACTIVE' ? 'green' : 'orange'">
              {{ record.status }}
            </a-tag>
          </template>

          <template v-if="column.key === 'role'">
            {{ record.role }}
          </template>

          <template v-if="column.key === 'actions'">
            <a-popconfirm title="Remove this staff member?" @confirm="handleRemove(record.id)">
              <a-button type="text" danger size="small">Remove</a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Invite Modal -->
    <a-modal v-model:open="inviteModalVisible" title="Invite Staff Member" @ok="handleInvite" :confirmLoading="inviting"
      okText="Send Invitation">
      <a-form layout="vertical">
        <a-form-item label="Email Address" required>
          <a-input v-model:value="inviteForm.email" placeholder="colleague@example.com" />
        </a-form-item>
        <a-form-item label="Role" required>
          <a-select v-model:value="inviteForm.role">
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
import { ref, onMounted, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { UserAddOutlined } from '@ant-design/icons-vue'
import { staffService, type StaffMember } from '@/services/staff.service'

const loading = ref(false)
const inviting = ref(false)
const staff = ref<StaffMember[]>([])
const inviteModalVisible = ref(false)

const inviteForm = reactive({
  email: '',
  role: 'MEMBER'
})

const columns = [
  { title: 'User', key: 'user' },
  { title: 'Role', key: 'role' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', width: 100 },
]

const fetchStaff = async () => {
  loading.value = true
  try {
    const data = await staffService.getStaffMembers()
    staff.value = data
  } catch (error) {
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
  if (!inviteForm.email) return
  inviting.value = true
  try {
    await staffService.inviteStaff(inviteForm.email, inviteForm.role)
    message.success(`Invitation sent to ${inviteForm.email}`)
    inviteModalVisible.value = false
    fetchStaff()
  } catch (error) {
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
    message.error('Failed to remove staff')
  }
}

onMounted(() => {
  fetchStaff()
})
</script>
