import { ref, computed, onMounted } from 'vue'
import { accessControlService } from '@/modules/access-control/services/access-control.service'
import type { EffectivePermission } from '@/modules/access-control/interfaces'
import { PolicyEffect } from '@/modules/access-control/interfaces/enums'

// Cache for permissions
const permissionsCache = ref<EffectivePermission[]>([])
const isLoading = ref(false)
const isLoaded = ref(false)
const currentStoreId = ref<number | undefined>(undefined)

/**
 * Composable for checking user permissions throughout the application
 */
export function usePermissions() {
  /**
   * Load permissions for the current user
   */
  async function loadPermissions(storeId?: number) {
    // Skip if already loading or if permissions are loaded for the same store
    if (isLoading.value || (isLoaded.value && currentStoreId.value === storeId)) {
      return
    }

    isLoading.value = true
    try {
      const permissions = await accessControlService.getMyPermissions(storeId)
      permissionsCache.value = permissions
      currentStoreId.value = storeId
      isLoaded.value = true
    } catch (error) {
      console.error('Failed to load permissions:', error)
      permissionsCache.value = []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Check if user has a specific permission
   * @param resource - Resource name (e.g., 'product', 'order')
   * @param action - Action name (e.g., 'create', 'read', 'update', 'delete')
   */
  function hasPermission(resource: string, action: string): boolean {
    // If permissions aren't loaded yet, deny by default (secure default)
    if (!isLoaded.value) {
      return false
    }

    // Check for explicit DENY first (deny overrides allow)
    const denyPermission = permissionsCache.value.find(
      (p) =>
        p.effect === PolicyEffect.DENY &&
        (p.resource === resource || p.resource === '*') &&
        (p.action === action || p.action === '*')
    )

    if (denyPermission) {
      return false
    }

    // Check for ALLOW
    const allowPermission = permissionsCache.value.find(
      (p) =>
        p.effect === PolicyEffect.ALLOW &&
        (p.resource === resource || p.resource === '*') &&
        (p.action === action || p.action === '*')
    )

    return !!allowPermission
  }

  /**
   * Check if user can perform any of the specified actions on a resource
   */
  function hasAnyPermission(resource: string, actions: string[]): boolean {
    return actions.some((action) => hasPermission(resource, action))
  }

  /**
   * Check if user can perform all of the specified actions on a resource
   */
  function hasAllPermissions(resource: string, actions: string[]): boolean {
    return actions.every((action) => hasPermission(resource, action))
  }

  /**
   * Get all permissions for a specific resource
   */
  function getResourcePermissions(resource: string): EffectivePermission[] {
    return permissionsCache.value.filter(
      (p) => p.resource === resource || p.resource === '*'
    )
  }

  /**
   * Clear the permissions cache (useful on logout or store switch)
   */
  function clearCache() {
    permissionsCache.value = []
    isLoaded.value = false
    currentStoreId.value = undefined
  }

  /**
   * Force reload permissions
   */
  async function reloadPermissions(storeId?: number) {
    isLoaded.value = false
    await loadPermissions(storeId)
  }

  // Computed properties
  const permissions = computed(() => permissionsCache.value)
  const loading = computed(() => isLoading.value)
  const loaded = computed(() => isLoaded.value)

  // Common permission checks as computed properties
  const canManageProducts = computed(() => hasAnyPermission('product', ['create', 'update', 'delete']))
  const canManageOrders = computed(() => hasAnyPermission('order', ['update', 'cancel', 'refund']))
  const canManageCustomers = computed(() => hasAnyPermission('customer', ['create', 'update', 'delete']))
  const canManageSettings = computed(() => hasPermission('settings', 'update'))
  const canManageStaff = computed(() => hasAnyPermission('staff', ['create', 'update', 'delete']))
  const canManageAccessControl = computed(() => hasPermission('access_control', 'manage'))

  return {
    // State
    permissions,
    loading,
    loaded,

    // Methods
    loadPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getResourcePermissions,
    clearCache,
    reloadPermissions,

    // Common permission checks
    canManageProducts,
    canManageOrders,
    canManageCustomers,
    canManageSettings,
    canManageStaff,
    canManageAccessControl,
  }
}

// Export a directive for v-permission usage
export const vPermission = {
  mounted(el: HTMLElement, binding: { value: { resource: string; action: string } }) {
    const { hasPermission } = usePermissions()
    const { resource, action } = binding.value

    if (!hasPermission(resource, action)) {
      el.style.display = 'none'
    }
  },
}

export default usePermissions
