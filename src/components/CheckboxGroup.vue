<script setup lang="ts">
interface Props {
    options: Array<{ label: string; value: any }>
    value: any[]
}

interface Emits {
    (e: 'update:value', value: any[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function handleChange(values: any[]) {
    emit('update:value', values)
}
</script>

<template>
    <a-checkbox-group :value="value" @change="handleChange">
        <a-checkbox v-for="option in options" :key="option.value" :value="option.value">
            {{ option.label }}
        </a-checkbox>
    </a-checkbox-group>
</template>
