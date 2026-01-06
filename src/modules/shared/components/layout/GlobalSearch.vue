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

const searchResults = ref({
  products: [] as any[],
  orders: [] as any[],
  customers: [] as any[],
  pages: [] as any[],
})

const hasResults = computed(() => {
  return (
    searchResults.value.products.length > 0 ||
    searchResults.value.orders.length > 0 ||
    searchResults.value.customers.length > 0 ||
    searchResults.value.pages.length > 0
  )
})
</script>

<template>
  <a-popover v-model:open="searchVisible" placement="bottomLeft" trigger="click" :overlay-style="{ width: '480px' }">
    <template #content>
      <div class="search-results">
        <template v-if="hasResults">
          <!-- Products -->
          <div v-if="searchResults.products.length" class="result-section">
            <div class="section-title">Products</div>
            <div v-for="product in searchResults.products" :key="product.id" class="result-item">
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
            <div v-for="order in searchResults.orders" :key="order.id" class="result-item">
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
            <div v-for="customer in searchResults.customers" :key="customer.id" class="result-item">
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
            <div v-for="page in searchResults.pages" :key="page.id" class="result-item">
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

    <a-input v-model:value="searchQuery" placeholder="Search everything..." class="search-input" allow-clear
      @focus="searchVisible = true">
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
/* Replaced hardcoded colors with CSS variables for proper theme support */
.search-input {
  width: 320px;
  border-radius: 10px;
  height: 40px;
  background: var(--muted);
  border: 1px solid var(--border);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-input :deep(.ant-input) {
  background: transparent;
  color: var(--foreground);
}

.search-input :deep(.ant-input::placeholder) {
  color: var(--muted-foreground);
}

.search-input:hover,
.search-input:focus-within {
  background: var(--background);
  border-color: var(--primary);
  box-shadow: 0 0 0 3px oklch(from var(--primary) l c h / 0.1);
}

.search-prefix-icon {
  color: var(--muted-foreground);
}

.search-shortcut {
  display: flex;
  align-items: center;
}

.search-shortcut kbd {
  background: var(--muted);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 11px;
  color: var(--muted-foreground);
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
  color: var(--muted-foreground);
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
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.result-item:hover {
  background: var(--accent);
  transform: translateX(2px);
}

/* Updated icon colors to use teal theme with proper contrast */
.result-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.2s ease;
}

.result-item:hover .result-icon {
  transform: scale(1.1);
}

.result-icon.product {
  background: oklch(from var(--primary) l c h / 0.15);
  color: var(--primary);
}

.result-icon.order {
  background: oklch(0.85 0.15 150 / 1);
  color: oklch(0.5 0.2 150 / 1);
}

.result-icon.customer {
  background: oklch(0.9 0.1 60 / 1);
  color: oklch(0.55 0.15 60 / 1);
}

.result-icon.page {
  background: oklch(0.88 0.12 300 / 1);
  color: oklch(0.5 0.2 300 / 1);
}

.result-name {
  font-weight: 500;
  color: var(--foreground);
  font-size: 14px;
}

.result-meta {
  font-size: 12px;
  color: var(--muted-foreground);
}

.no-results,
.search-hint {
  padding: 32px 16px;
  text-align: center;
  color: var(--muted-foreground);
}

.no-results-icon,
.hint-icon {
  font-size: 32px;
  color: var(--border);
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
  color: var(--muted-foreground);
}

.hint-shortcuts kbd {
  background: var(--muted);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 11px;
  color: var(--muted-foreground);
  font-family: inherit;
}

/* Custom scrollbar for search results */
.search-results::-webkit-scrollbar {
  width: 6px;
}

.search-results::-webkit-scrollbar-track {
  background: transparent;
}

.search-results::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 3px;
}

.search-results::-webkit-scrollbar-thumb:hover {
  background: var(--muted-foreground);
}
</style>
