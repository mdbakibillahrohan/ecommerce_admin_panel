<script setup lang="ts">
interface BreadcrumbItem {
    label: string
    path?: string
}

interface Props {
    items: BreadcrumbItem[]
}

const props = defineProps<Props>()
</script>

<template>
    <a-breadcrumb>
        <a-breadcrumb-item v-for="(item, index) in items" :key="index">
            <router-link v-if="item.path" :to="item.path">{{ item.label }}</router-link>
            <span v-else>{{ item.label }}</span>
        </a-breadcrumb-item>
    </a-breadcrumb>
</template>

<style scoped>
.ant-breadcrumb {
    margin-bottom: 16px;
}
</style>
