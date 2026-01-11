<script setup lang="ts">
interface Props {
    content: string
    maxLength?: number
}

const props = withDefaults(defineProps<Props>(), {
    maxLength: 200,
})

interface Emits {
    (e: 'update:content', value: string): void
}

const emit = defineEmits<Emits>()

function handleInput(e: Event) {
    const value = (e.target as HTMLTextAreaElement).value
    emit('update:content', value)
}
</script>

<template>
    <a-textarea :value="content" :rows="4" :maxlength="maxLength" show-count @input="handleInput"
        placeholder="Enter text..." />
</template>
