<script setup lang="ts">
import { computed } from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue'

interface Props {
    searchText: string
    selectedCategory?: string
    selectedStatus?: string
}

interface Emits {
    (e: 'update:searchText', value: string): void
    (e: 'update:selectedCategory', value: string | undefined): void
    (e: 'update:selectedStatus', value: string | undefined): void
    (e: 'search'): void
    (e: 'clear'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localSearchText = computed({
    get: () => props.searchText,
    set: (value) => emit('update:searchText', value),
})

const localSelectedCategory = computed({
    get: () => props.selectedCategory,
    set: (value) => emit('update:selectedCategory', value),
})

const localSelectedStatus = computed({
    get: () => props.selectedStatus,
    set: (value) => emit('update:selectedStatus', value),
})

function handleSearch() {
    emit('search')
}

function handleClear() {
    emit('clear')
}
</script>

<template>
    <div class="blog-filters">
        <div class="filter-row">
            <div class="filter-input">
                <a-input-search v-model:value="localSearchText" placeholder="Search blog posts..." size="large"
                    allow-clear @search="handleSearch" @pressEnter="handleSearch">
                    <template #prefix>
                        <SearchOutlined />
                    </template>
                </a-input-search>
            </div>

            <div class="filter-select">
                <a-select v-model:value="localSelectedCategory" placeholder="All Categories" size="large" allow-clear
                    @change="handleSearch">
                    <a-select-option value="NEWS">News</a-select-option>
                    <a-select-option value="TUTORIAL">Tutorial</a-select-option>
                    <a-select-option value="UPDATE">Update</a-select-option>
                </a-select>
            </div>

            <div class="filter-select">
                <a-select v-model:value="localSelectedStatus" placeholder="All Status" size="large" allow-clear
                    @change="handleSearch">
                    <a-select-option value="PUBLISHED">Published</a-select-option>
                    <a-select-option value="DRAFT">Draft</a-select-option>
                </a-select>
            </div>

            <a-button size="large" @click="handleClear">Clear</a-button>
        </div>
    </div>
</template>

<style scoped>
.blog-filters {
    width: 100%;
}

.filter-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr auto;
    gap: 12px;
    align-items: center;
}

.filter-input {
    width: 100%;
}

.filter-select {
    width: 100%;
}

@media (max-width: 768px) {
    .filter-row {
        grid-template-columns: 1fr;
    }
}
</style>
