<script setup lang="ts">
interface Props {
    items: Array<{ key: string; label: string; icon?: string }>
    activeKey: string
}

interface Emits {
    (e: 'change', key: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function handleChange(key: string) {
    emit('change', key)
}
</script>

<template>
    <a-tabs :active-key="activeKey" @change="handleChange">
        <a-tab-pane v-for="item in items" :key="item.key" :tab="item.label">
            <template v-if="item.icon" #tab>
                <component :is="`${item.icon}-outlined`" />
                {{ item.label }}
            </template>
            <slot :name="item.key"></slot>
        </a-tab-pane>
    </a-tabs>
</template>
