<script setup lang="ts">
interface Props {
    options: Array<{ label: string; value: any }>
    value: any
}

interface Emits {
    (e: 'update:value', value: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function handleChange(value: any) {
    emit('update:value', value)
}
</script>

<template>
    <a-radio-group :value="value" @change="(e: any) => handleChange(e.target.value)">
        <a-radio v-for="option in options" :key="option.value" :value="option.value">
            {{ option.label }}
        </a-radio>
    </a-radio-group>
</template>
