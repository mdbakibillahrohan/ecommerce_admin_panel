<script setup lang="ts">
interface Slider {
    id: number
    title: string
    slides_count: number
    is_active: boolean
}

interface Props {
    sliders: Slider[]
    loading?: boolean
}

interface Emits {
    (e: 'edit', slider: Slider): void
    (e: 'delete', slider: Slider): void
    (e: 'toggle', slider: Slider): void
    (e: 'manageSlides', slider: Slider): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const columns = [
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        width: 300,
    },
    {
        title: 'Slides',
        dataIndex: 'slides_count',
        key: 'slides_count',
        width: 100,
        align: 'center' as const,
    },
    {
        title: 'Status',
        dataIndex: 'is_active',
        key: 'is_active',
        width: 120,
    },
    {
        title: 'Actions',
        key: 'actions',
        width: 250,
        fixed: 'right' as const,
    },
]

function handleEdit(slider: Slider) {
    emit('edit', slider)
}

function handleDelete(slider: Slider) {
    emit('delete', slider)
}

function handleToggle(slider: Slider) {
    emit('toggle', slider)
}

function handleManageSlides(slider: Slider) {
    emit('manageSlides', slider)
}
</script>

<template>
    <a-table :dataSource="sliders" :columns="columns" :loading="loading" :pagination="false">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'is_active'">
                <a-tag :color="record.is_active ? 'green' : 'default'">
                    {{ record.is_active ? 'Active' : 'Inactive' }}
                </a-tag>
            </template>

            <template v-else-if="column.key === 'actions'">
                <a-space>
                    <a-button size="small" @click="handleManageSlides(record)">Slides</a-button>
                    <a-button size="small" @click="handleEdit(record)">Edit</a-button>
                    <a-button size="small" @click="handleToggle(record)">
                        {{ record.is_active ? 'Deactivate' : 'Activate' }}
                    </a-button>
                    <a-button size="small" danger @click="handleDelete(record)">Delete</a-button>
                </a-space>
            </template>
        </template>
    </a-table>
</template>
