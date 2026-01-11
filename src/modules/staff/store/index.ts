import { defineStore } from 'pinia'
import { ref } from 'vue'
import { staffService, type StaffMember, type StaffRole, type InviteStaffDto, type CreateRoleDto, type UpdateRoleDto } from '@/modules/staff/services/staff.service'
import { message } from 'ant-design-vue'

export const useStaffStore = defineStore('staff', () => {
  // State
  const staffMembers = ref<StaffMember[]>([])
  const roles = ref<StaffRole[]>([])
  const currentMember = ref<StaffMember | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions - Staff Members
  async function fetchStaffMembers() {
    loading.value = true
    error.value = null

    try {
      staffMembers.value = await staffService.getStaffMembers()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch staff members'
      message.error(error.value)
      console.error('Staff fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  async function inviteStaff(data: InviteStaffDto) {
    loading.value = true
    error.value = null

    try {
      await staffService.inviteStaff(data)
      message.success('Staff invitation sent successfully')
      await fetchStaffMembers()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to invite staff'
      message.error(error.value)
      console.error('Staff invite error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function updateStaff(memberId: number, data: Partial<StaffMember>) {
    loading.value = true
    error.value = null

    try {
      await staffService.updateStaff(memberId, data)
      message.success('Staff member updated successfully')
      await fetchStaffMembers()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update staff member'
      message.error(error.value)
      console.error('Staff update error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function removeStaff(memberId: number) {
    loading.value = true
    error.value = null

    try {
      await staffService.removeStaff(memberId)
      message.success('Staff member removed successfully')
      await fetchStaffMembers()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to remove staff member'
      message.error(error.value)
      console.error('Staff remove error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  // Actions - Roles
  async function fetchRoles() {
    loading.value = true
    error.value = null

    try {
      const response = await staffService.getRoles()
      roles.value = response.customRoles
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch roles'
      message.error(error.value)
      console.error('Roles fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  async function createRole(data: CreateRoleDto) {
    loading.value = true
    error.value = null

    try {
      await staffService.createRole(data)
      message.success('Role created successfully')
      await fetchRoles()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create role'
      message.error(error.value)
      console.error('Role create error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function updateRole(id: number, data: UpdateRoleDto) {
    loading.value = true
    error.value = null

    try {
      await staffService.updateRole(id, data)
      message.success('Role updated successfully')
      await fetchRoles()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update role'
      message.error(error.value)
      console.error('Role update error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function deleteRole(id: number) {
    loading.value = true
    error.value = null

    try {
      await staffService.deleteRole(id)
      message.success('Role deleted successfully')
      await fetchRoles()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete role'
      message.error(error.value)
      console.error('Role delete error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    staffMembers,
    roles,
    currentMember,
    loading,
    error,
    // Actions
    fetchStaffMembers,
    inviteStaff,
    updateStaff,
    removeStaff,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
    clearError,
  }
})
