<template>
  <div class="customer-list">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Customers</h1>
      <div class="flex gap-2">
        <a-input-search v-model:value="searchQuery" placeholder="Search customers..." style="width: 250px"
          @search="fetchCustomers" />
        <!-- Export or other actions -->
      </div>
    </div>

    <a-card :bordered="false" class="shadow-sm rounded-lg">
      <a-table :columns="columns" :dataSource="customers" :loading="loading" :pagination="pagination"
        @change="handleTableChange" rowKey="id">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <a @click="router.push(`/customers/${record.id}`)">{{ record.first_name }} {{ record.last_name
              }}</a>
          </template>

          <template v-if="column.key === 'spent'">
            ${{ record.total_spent ? Number(record.total_spent).toFixed(2) : '0.00' }}
          </template>

          <template v-if="column.key === 'groups'">
            <a-tag v-for="group in record.groups" :key="group.id" color="blue">{{ group.name }}</a-tag>
          </template>

          <template v-if="column.key === 'created_at'">
            {{ formatDate(record.created_at) }}
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
// eslint-disable @typescript-eslint/no-explicit-any
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { customerService, type Customer } from '@/services/customer.service'
import dayjs from 'dayjs'

const router = useRouter()
const loading = ref(false)
const customers = ref<Customer[]>([])
const searchQuery = ref('')
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
})

const columns = [
  { title: 'Name', key: 'name' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Orders', dataIndex: 'orders_count', key: 'orders_count' },
  { title: 'Total Spent', key: 'spent' },
  { title: 'Groups', key: 'groups' },
  { title: 'Joined', key: 'created_at' },
]

const fetchCustomers = async () => {
  loading.value = true
  try {
    const { current, pageSize } = pagination.value
    const params: any = {
      page: current,
      limit: pageSize,
    }
    if (searchQuery.value) params.search = searchQuery.value

    const data = await customerService.getCustomers(params)
    customers.value = data.data
    pagination.value.total = data.total
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    message.error(error.message)
  } finally {
    loading.value = false
  }
}

const handleTableChange = (pag: any) => {
  pagination.value = pag
  fetchCustomers()
}

const formatDate = (date: string) => {
  return dayjs(date).format('MMM D, YYYY')
}

onMounted(() => {
  fetchCustomers()
})
</script>
