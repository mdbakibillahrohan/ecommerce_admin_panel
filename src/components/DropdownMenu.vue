<script setup lang="ts">
interface Props {
    items: Array<{ key: string; label: string; icon?: string; disabled?: boolean }>
}

interface Emits {
    (e: 'select', key: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function handleClick(key: string) {
    emit('select', key)
}
</script>

<template>
    <a-menu>
        <a-menu-item v-for="item in items" :key="item.key" :disabled="item.disabled" @click="handleClick(item.key)">
            <component v-if="item.icon" :is="`${item.icon}-outlined`" />
            {{ item.label }}
        </a-menu-item>
    </a-menu>
</template>
