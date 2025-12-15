<script lang="ts" setup>
import { ref, computed } from 'vue'
import {
  SearchOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  FileTextOutlined,
} from '@ant-design/icons-vue'

const searchQuery = ref('')
const searchVisible = ref(false)

// Mock search results
const searchResults = computed(() => {
  if (!searchQuery.value) return { products: [], orders: [], customers: [], pages: [] }
  const query = searchQuery.value.toLowerCase()
  return {
    products: [
      { id: 1, name: 'iPhone 15 Pro', sku: 'IPH-15-PRO' },
      { id: 2, name: 'Samsung Galaxy S24', sku: 'SAM-S24' },
      { id: 3, name: 'MacBook Air M3', sku: 'MAC-AIR-M3' },
    ].filter((p) => p.name.toLowerCase().includes(query) || p.sku.toLowerCase().includes(query)),
    orders: [
      { id: 'ORD-001', customer: 'John Doe', total: '$599.00' },
      { id: 'ORD-002', customer: 'Jane Smith', total: '$1,299.00' },
    ].filter((o) => o.id.toLowerCase().includes(query) || o.customer.toLowerCase().includes(query)),
    customers: [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ].filter((c) => c.name.toLowerCase().includes(query) || c.email.toLowerCase().includes(query)),
    pages: [
      { id: 1, title: 'About Us', slug: '/about' },
      { id: 2, title: 'Contact', slug: '/contact' },
    ].filter((p) => p.title.toLowerCase().includes(query)),
  }
})

const hasResults = computed(() => {
  const r = searchResults.value
  return r.products.length || r.orders.length || r.customers.length || r.pages.length
})
</script>

<template>
  <a-popover
    v-model:open="searchVisible"
    placement="bottomLeft"
    trigger="click"
    :overlay-style="{ width: '480px' }"
  >
    <template #content>
      <div class="search-results">
        <template v-if="hasResults">
          <!-- Products -->
          <div v-if="searchResults.products.length" class="result-section">
            <div class="section-title">Products</div>
            <div
              v-for="product in searchResults.products"
              :key="product.id"
              class="result-item"
            >
              <div class="result-icon product">
                <ShoppingOutlined />
              </div>
              <div class="result-info">
                <div class="result-name">{{ product.name }}</div>
                <div class="result-meta">SKU: {{ product.sku }}</div>
              </div>
            </div>
          </div>

          <!-- Orders -->
          <div v-if="searchResults.orders.length" class="result-section">
            <div class="section-title">Orders</div>
            <div
              v-for="order in searchResults.orders"
              :key="order.id"
              class="result-item"
            >
              <div class="result-icon order">
                <ShoppingCartOutlined />
              </div>
              <div class="result-info">
                <div class="result-name">{{ order.id }}</div>
                <div class="result-meta">{{ order.customer }} · {{ order.total }}</div>
              </div>
            </div>
          </div>

          <!-- Customers -->
          <div v-if="searchResults.customers.length" class="result-section">
            <div class="section-title">Customers</div>
            <div
              v-for="customer in searchResults.customers"
              :key="customer.id"
              class="result-item"
            >
              <div class="result-icon customer">
                <UserOutlined />
              </div>
              <div class="result-info">
                <div class="result-name">{{ customer.name }}</div>
                <div class="result-meta">{{ customer.email }}</div>
              </div>
            </div>
          </div>

          <!-- Pages -->
          <div v-if="searchResults.pages.length" class="result-section">
            <div class="section-title">Pages</div>
            <div
              v-for="page in searchResults.pages"
              :key="page.id"
              class="result-item"
            >
              <div class="result-icon page">
                <FileTextOutlined />
              </div>
              <div class="result-info">
                <div class="result-name">{{ page.title }}</div>
                <div class="result-meta">{{ page.slug }}</div>
              </div>
            </div>
          </div>
        </template>

        <div v-else-if="searchQuery" class="no-results">
          <SearchOutlined class="no-results-icon" />
          <div>No results found for "{{ searchQuery }}"</div>
        </div>

        <div v-else class="search-hint">
          <SearchOutlined class="hint-icon" />
          <div>Search for products, orders, customers...</div>
          <div class="hint-shortcuts">
            <span>Press</span>
            <kbd>Ctrl</kbd>
            <span>+</span>
            <kbd>K</kbd>
            <span>to search</span>
          </div>
        </div>
      </div>
    </template>

    <a-input
      v-model:value="searchQuery"
      placeholder="Search everything..."
      class="search-input"
      allow-clear
      @focus="searchVisible = true"
    >
      <template #prefix>
        <SearchOutlined class="search-prefix-icon" />
      </template>
      <template #suffix>
        <div class="search-shortcut">
          <kbd>Ctrl K</kbd>
        </div>
      </template>
    </a-input>
  </a-popover>
</template>

<style scoped>
.search-input {
  width: 320px;
  border-radius: 10px;
  height: 40px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.search-input:hover,
.search-input:focus-within {
  background: #ffffff;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.search-prefix-icon {
  color: #9ca3af;
}

.search-shortcut {
  display: flex;
  align-items: center;
}

.search-shortcut kbd {
  background: #e5e7eb;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 11px;
  color: #6b7280;
  font-family: inherit;
}

.search-results {
  max-height: 400px;
  overflow-y: auto;
  padding: 8px 0;
}

.result-section {
  margin-bottom: 16px;
}

.result-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0 12px;
  margin-bottom: 8px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.result-item:hover {
  background: #f3f4f6;
}

.result-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.result-icon.product {
  background: #dbeafe;
  color: #2563eb;
}

.result-icon.order {
  background: #dcfce7;
  color: #16a34a;
}

.result-icon.customer {
  background: #fef3c7;
  color: #d97706;
}

.result-icon.page {
  background: #f3e8ff;
  color: #9333ea;
}

.result-name {
  font-weight: 500;
  color: #1f2937;
  font-size: 14px;
}

.result-meta {
  font-size: 12px;
  color: #6b7280;
}

.no-results,
.search-hint {
  padding: 32px 16px;
  text-align: center;
  color: #6b7280;
}

.no-results-icon,
.hint-icon {
  font-size: 32px;
  color: #d1d5db;
  margin-bottom: 12px;
  display: block;
}

.hint-shortcuts {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 12px;
  color: #9ca3af;
}

.hint-shortcuts kbd {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 11px;
  color: #6b7280;
  font-family: inherit;
}
</style>
