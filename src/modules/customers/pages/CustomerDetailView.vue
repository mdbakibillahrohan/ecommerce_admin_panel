<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<template>
  <div class="customer-detail max-w-6xl mx-auto">
    <div class="mb-6">
      <a-button @click="router.back()" class="mb-4">Back to Customers</a-button>
      <div v-if="customer" class="flex justify-between items-start">
        <div>
          <h1 class="text-2xl font-bold mb-1">{{ customer.first_name }} {{ customer.last_name }}</h1>
          <p class="text-gray-500">{{ customer.email }} • {{ customer.phone || 'No Phone' }}</p>
        </div>
        <a-tag color="green" class="text-lg px-3 py-1">
          Customer since {{ formatDate(customer.created_at) }}
        </a-tag>
      </div>
    </div>

    <a-spin :spinning="loading">
      <div v-if="customer" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Stats -->
          <div class="grid grid-cols-3 gap-4">
            <a-card>
              <a-statistic title="Total Spent" :value="customer.total_spent" prefix="$" :precision="2" />
            </a-card>
            <a-card>
              <a-statistic title="Orders" :value="customer.orders_count" />
            </a-card>
            <a-card>
              <a-statistic title="Avg. Order" :value="customer.total_spent / (customer.orders_count || 1)" prefix="$"
                :precision="2" />
            </a-card>
          </div>

          <!-- Last Order (Placeholder) -->
          <a-card title="Recent Orders">
            <a-empty description="No recent orders found" />
            <!-- We would fetch orders for this customer here -->
          </a-card>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Contact Info -->
          <a-card title="Contact Info">
            <div class="mb-2"><strong>Email:</strong> {{ customer.email }}</div>
            <div class="mb-2"><strong>Phone:</strong> {{ customer.phone || 'N/A' }}</div>
            <a-button type="link" class="p-0">Edit Contact</a-button>
          </a-card>

          <!-- Notes -->
          <a-card title="Notes">
            <div class="space-y-4 max-h-60 overflow-y-auto mb-4">
              <div v-for="note in notes" :key="note.id" class="bg-gray-50 p-3 rounded">
                <p class="text-sm">{{ note.content }}</p>
                <div class="text-xs text-gray-400 mt-1 flex justify-between">
                  <span>{{ formatDate(note.created_at) }}</span>
                  <span>{{ note.created_by_user?.first_name }}</span>
                </div>
              </div>
            </div>
            <div class="flex gap-2">
              <a-input v-model:value="newNote" placeholder="Add a note..." @pressEnter="addNote" />
              <a-button type="primary" @click="addNote">Add</a-button>
            </div>
          </a-card>

          <!-- Tags/Groups -->
          <a-card title="Tags" :bodyStyle="{ padding: '12px 24px' }">
            <div class="flex flex-wrap gap-2 mb-4">
              <a-tag v-for="group in customer.groups" :key="group.id" closable>{{ group.name }}</a-tag>
            </div>
            <a-input placeholder="Add tag" size="small" />
          </a-card>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { customerService, type Customer, type CustomerNote } from '@/modules/customers/services/customer.service'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const customer = ref<Customer | null>(null)
const notes = ref<CustomerNote[]>([])
const newNote = ref('')

const fetchCustomer = async () => {
  loading.value = true
  try {
    const id = Number(route.params.id)
    const data = await customerService.getCustomer(id)
    customer.value = data
    // Assuming backend returns notes in customer object or separate call.
    // For now let's assume separate call or included.
    // If not included, we might need customerService.getNotes(id).
    // Let's assume the mock backend or service returns it or we implemented it.
    // Based on my backend impl, I added notes entity.
    // Let's assume it's included in `customer.notes` relation or I fetch it.
    // In `customers.service.ts` backend, `findOne` might include 'notes'.
    if (data.notes) notes.value = data.notes
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    message.error('Failed to fetch customer')
  } finally {
    loading.value = false
  }
}

const addNote = async () => {
  if (!newNote.value.trim() || !customer.value) return
  try {
    const note = await customerService.addNote(customer.value.id, newNote.value)
    notes.value.unshift(note)
    newNote.value = ''
    message.success('Note added')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    message.error('Failed to add note')
  }
}

const formatDate = (date: string) => {
  return dayjs(date).format('MMM D, YYYY')
}

onMounted(() => {
  fetchCustomer()
})
</script>
