<script setup lang="ts">
interface Props {
    value: boolean
    checkedText?: string
    uncheckedText?: string
}

const props = withDefaults(defineProps<Props>(), {
    checkedText: 'Enabled',
    uncheckedText: 'Disabled',
})

interface Emits {
    (e: 'update:value', value: boolean): void
}

const emit = defineEmits<Emits>()

function handleChange(checked: boolean) {
    emit('update:value', checked)
}
</script>

<template>
    <a-switch :checked="value" :checked-children="checkedText" :un-checked-children="uncheckedText"
        @change="handleChange" />
</template>
