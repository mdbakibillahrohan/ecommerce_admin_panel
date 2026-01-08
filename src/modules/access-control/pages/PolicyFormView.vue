<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { accessControlService } from '@/modules/access-control/services/access-control.service'
import type { AbacPolicy, AbacResource, CreatePolicyDto, UpdatePolicyDto } from '@/modules/access-control/interfaces'
import { PolicyEffect } from '@/modules/access-control/interfaces/enums'
import {
  SaveOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { FormInstance, Rule } from 'ant-design-vue/es/form'
import CommonPageHeader from '@/modules/shared/components/ui/CommonPageHeader.vue'

const router = useRouter()
const route = useRoute()

// State
const loading = ref(false)
const saving = ref(false)
const resources = ref<AbacResource[]>([])
const formRef = ref<FormInstance>()

// Determine if editing or creating
const policyId = computed(() => (route.params.id ? parseInt(route.params.id as string, 10) : null))
const isEditing = computed(() => !!policyId.value)
const pageTitle = computed(() => (isEditing.value ? 'Edit Policy' : 'Create Policy'))

// Form state
const formState = reactive<CreatePolicyDto & { is_active?: boolean }>({
  name: '',
  description: '',
  resource_id: undefined,
  action: '',
  effect: PolicyEffect.ALLOW,
  priority: 100,
  store_id: undefined,
  conditions: undefined,
  is_active: true,
})

// Condition builder state
const conditionEntries = ref<Array<{ key: string; operator: string; value: string }>>([])

// Common actions
const commonActions = ['create', 'read', 'update', 'delete', 'list', 'manage', '*']

// Operators for conditions
const operators = [
  { value: 'eq', label: 'Equals (=)' },
  { value: 'neq', label: 'Not Equals (≠)' },
  { value: 'gt', label: 'Greater Than (>)' },
  { value: 'gte', label: 'Greater Than or Equal (≥)' },
  { value: 'lt', label: 'Less Than (<)' },
  { value: 'lte', label: 'Less Than or Equal (≤)' },
  { value: 'in', label: 'In List' },
  { value: 'notIn', label: 'Not In List' },
  { value: 'contains', label: 'Contains' },
  { value: 'startsWith', label: 'Starts With' },
  { value: 'endsWith', label: 'Ends With' },
]

// Validation rules
const rules: Record<string, Rule[]> = {
  name: [
    { required: true, message: 'Policy name is required' },
    { min: 3, message: 'Name must be at least 3 characters' },
  ],
  action: [{ required: true, message: 'Action is required' }],
  effect: [{ required: true, message: 'Effect is required' }],
  priority: [
    { required: true, message: 'Priority is required' },
    { type: 'number', min: 0, max: 1000, message: 'Priority must be between 0 and 1000' },
  ],
}

onMounted(async () => {
  loading.value = true
  try {
    await fetchResources()
    if (isEditing.value && policyId.value) {
      await fetchPolicy(policyId.value)
    }
  } finally {
    loading.value = false
  }
})

async function fetchResources() {
  try {
    resources.value = await accessControlService.getResources()
  } catch (error) {
    message.error('Failed to fetch resources')
    console.error(error)
  }
}

async function fetchPolicy(id: number) {
  try {
    const policy = await accessControlService.getPolicyById(id)
    Object.assign(formState, {
      name: policy.name,
      description: policy.description || '',
      resource_id: policy.resource_id || undefined,
      action: policy.action,
      effect: policy.effect,
      priority: policy.priority,
      store_id: policy.store_id || undefined,
      conditions: policy.conditions,
      is_active: policy.is_active,
    })

    // Parse conditions for the builder
    if (policy.conditions) {
      conditionEntries.value = Object.entries(policy.conditions).map(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          const operatorKeys = Object.keys(value)
          const operator = operatorKeys.length > 0 ? operatorKeys[0] : 'eq'
          const operatorValue = operator ? (value as Record<string, any>)[operator] : value
          return { key, operator: operator || 'eq', value: String(operatorValue) }
        }
        return { key, operator: 'eq', value: String(value) }
      })
    }
  } catch (error) {
    message.error('Failed to fetch policy')
    console.error(error)
    router.push('/settings/access-control/policies')
  }
}

function addCondition() {
  conditionEntries.value.push({ key: '', operator: 'eq', value: '' })
}

function removeCondition(index: number) {
  conditionEntries.value.splice(index, 1)
}

function buildConditions(): Record<string, any> | undefined {
  if (conditionEntries.value.length === 0) return undefined

  const conditions: Record<string, any> = {}
  for (const entry of conditionEntries.value) {
    if (!entry.key) continue

    if (entry.operator === 'eq') {
      conditions[entry.key] = entry.value
    } else {
      conditions[entry.key] = { [entry.operator]: entry.value }
    }
  }

  return Object.keys(conditions).length > 0 ? conditions : undefined
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()

    saving.value = true

    const conditions = buildConditions()
    const data: CreatePolicyDto = {
      name: formState.name,
      description: formState.description || undefined,
      resource_id: formState.resource_id,
      action: formState.action,
      effect: formState.effect,
      priority: formState.priority,
      store_id: formState.store_id,
      conditions,
    }

    if (isEditing.value && policyId.value) {
      const updateData: UpdatePolicyDto = {
        ...data,
        is_active: formState.is_active,
      }
      await accessControlService.updatePolicy(policyId.value, updateData)
      message.success('Policy updated successfully')
    } else {
      await accessControlService.createPolicy(data)
      message.success('Policy created successfully')
    }

    router.push('/settings/access-control/policies')
  } catch (error: any) {
    if (error.errorFields) {
      // Validation failed
      return
    }
    message.error('Failed to save policy')
    console.error(error)
  } finally {
    saving.value = false
  }
}

function handleBack() {
  router.push('/settings/access-control/policies')
}
</script>

<template>
  <div class="policy-form-page">
    <CommonPageHeader :title="pageTitle" subtitle="Configure access control rules and conditions">
      <template #actions>
        <a-space>
          <a-button size="large" @click="handleBack">
            <template #icon>
              <ArrowLeftOutlined />
            </template>
            Back
          </a-button>
          <a-button type="primary" size="large" :loading="saving" @click="handleSubmit">
            <template #icon>
              <SaveOutlined />
            </template>
            {{ isEditing ? 'Update' : 'Create' }} Policy
          </a-button>
        </a-space>
      </template>
    </CommonPageHeader>

    <a-spin :spinning="loading">
      <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical" class="policy-form">
        <div class="form-container">
          <!-- Basic Information Card -->
          <div class="form-card">
            <div class="card-header">
              <h3>Basic Information</h3>
              <p>Define the policy name and description</p>
            </div>

            <div class="form-grid">
              <a-form-item label="Policy Name" name="name" class="col-span-2">
                <a-input
                  v-model:value="formState.name"
                  placeholder="Enter policy name"
                  size="large"
                />
              </a-form-item>

              <a-form-item label="Description" name="description" class="col-span-2">
                <a-textarea
                  v-model:value="formState.description"
                  placeholder="Describe what this policy controls"
                  :rows="3"
                />
              </a-form-item>

              <a-form-item v-if="isEditing" label="Status" name="is_active">
                <a-switch
                  v-model:checked="formState.is_active"
                  checked-children="Active"
                  un-checked-children="Inactive"
                />
              </a-form-item>
            </div>
          </div>

          <!-- Access Rules Card -->
          <div class="form-card">
            <div class="card-header">
              <h3>Access Rules</h3>
              <p>Define what resource and action this policy applies to</p>
            </div>

            <div class="form-grid">
              <a-form-item label="Resource" name="resource_id">
                <a-select
                  v-model:value="formState.resource_id"
                  placeholder="All Resources"
                  size="large"
                  allow-clear
                >
                  <a-select-option v-for="res in resources" :key="res.id" :value="res.id">
                    {{ res.name }}
                  </a-select-option>
                </a-select>
                <template #extra>
                  Leave empty to apply to all resources
                </template>
              </a-form-item>

              <a-form-item label="Action" name="action">
                <a-auto-complete
                  v-model:value="formState.action"
                  :options="commonActions.map((a) => ({ value: a }))"
                  placeholder="e.g., create, read, update, delete, or *"
                  size="large"
                />
                <template #extra>
                  Use * for all actions
                </template>
              </a-form-item>

              <a-form-item label="Effect" name="effect">
                <a-radio-group v-model:value="formState.effect" size="large">
                  <a-radio-button :value="PolicyEffect.ALLOW" class="effect-allow">
                    Allow
                  </a-radio-button>
                  <a-radio-button :value="PolicyEffect.DENY" class="effect-deny">
                    Deny
                  </a-radio-button>
                </a-radio-group>
              </a-form-item>

              <a-form-item label="Priority" name="priority">
                <a-input-number
                  v-model:value="formState.priority"
                  :min="0"
                  :max="1000"
                  size="large"
                  style="width: 100%"
                />
                <template #extra>
                  Higher priority policies are evaluated first (0-1000)
                </template>
              </a-form-item>
            </div>
          </div>

          <!-- Conditions Card -->
          <div class="form-card">
            <div class="card-header">
              <h3>Conditions (Optional)</h3>
              <p>Add conditions to make this policy apply only in specific contexts</p>
            </div>

            <div class="conditions-section">
              <div v-if="conditionEntries.length === 0" class="empty-conditions">
                <p>No conditions defined. This policy will apply to all requests matching the resource and action.</p>
                <a-button type="dashed" @click="addCondition">
                  <template #icon>
                    <PlusOutlined />
                  </template>
                  Add Condition
                </a-button>
              </div>

              <template v-else>
                <div v-for="(condition, index) in conditionEntries" :key="index" class="condition-row">
                  <a-input
                    v-model:value="condition.key"
                    placeholder="Attribute key (e.g., role)"
                    style="width: 30%"
                  />
                  <a-select v-model:value="condition.operator" style="width: 25%">
                    <a-select-option v-for="op in operators" :key="op.value" :value="op.value">
                      {{ op.label }}
                    </a-select-option>
                  </a-select>
                  <a-input v-model:value="condition.value" placeholder="Value" style="width: 35%" />
                  <a-button type="text" danger @click="removeCondition(index)">
                    <template #icon>
                      <DeleteOutlined />
                    </template>
                  </a-button>
                </div>

                <a-button type="dashed" block @click="addCondition" class="add-condition-btn">
                  <template #icon>
                    <PlusOutlined />
                  </template>
                  Add Another Condition
                </a-button>
              </template>
            </div>
          </div>
        </div>
      </a-form>
    </a-spin>
  </div>
</template>

<style scoped>
.policy-form-page {
  background: var(--background);
  min-height: 100vh;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
}

.card-header {
  margin-bottom: 20px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 16px;
}

.card-header h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
}

.card-header p {
  margin: 0;
  font-size: 14px;
  color: var(--muted-foreground);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.col-span-2 {
  grid-column: span 2;
}

.conditions-section {
  padding: 16px;
  background: var(--muted);
  border-radius: 8px;
}

.empty-conditions {
  text-align: center;
  padding: 24px;
}

.empty-conditions p {
  margin-bottom: 16px;
  color: var(--muted-foreground);
}

.condition-row {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
}

.add-condition-btn {
  margin-top: 12px;
}

.effect-allow :deep(.ant-radio-button-wrapper-checked) {
  background: oklch(0.85 0.15 140) !important;
  border-color: oklch(0.6 0.15 140) !important;
  color: oklch(0.25 0.05 140) !important;
}

.effect-deny :deep(.ant-radio-button-wrapper-checked) {
  background: oklch(0.85 0.15 25) !important;
  border-color: oklch(0.6 0.20 25) !important;
  color: oklch(0.35 0.10 25) !important;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .col-span-2 {
    grid-column: span 1;
  }

  .condition-row {
    flex-wrap: wrap;
  }

  .condition-row > * {
    width: 100% !important;
    flex: 1 1 100%;
  }
}
</style>
