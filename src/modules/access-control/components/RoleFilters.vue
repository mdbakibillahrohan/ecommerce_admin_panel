<script setup lang="ts">
import { computed } from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue'

interface Props {
    searchText: string
}

interface Emits {
    (e: 'update:searchText', value: string): void
    (e: 'search'): void
    (e: 'clear'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localSearchText = computed({
    get: () => props.searchText,
    set: (value) => emit('update:searchText', value),
})

function handleSearch() {
    emit('search')
}

function handleClear() {
    emit('clear')
}
</script>

<template>
    <div class="role-filters">
        <a-input-search v-model:value="localSearchText" placeholder="Search roles..." size="large" allow-clear
            @search="handleSearch" @pressEnter="handleSearch">
            <template #prefix>
                <SearchOutlined />
            </template>
        </a-input-search>
    </div>
</template>

<style scoped>
.role-filters {
    width: 100%;
    margin-bottom: 16px;
}
</style>
