<script setup lang="ts">
interface Props {
    current: number
    total: number
    pageSize?: number
    showSizeChanger?: boolean
}

interface Emits {
    (e: 'change', page: number, pageSize: number): void
}

const props = withDefaults(defineProps<Props>(), {
    pageSize: 10,
    showSizeChanger: true,
})

const emit = defineEmits<Emits>()

function handleChange(page: number, pageSize: number) {
    emit('change', page, pageSize)
}
</script>

<template>
    <a-pagination :current="current" :total="total" :page-size="pageSize" :show-size-changer="showSizeChanger"
        :show-total="(total: number) => `Total ${total} items`" @change="handleChange" />
</template>

<style scoped>
.ant-pagination {
    margin-top: 24px;
    text-align: right;
}
</style>
