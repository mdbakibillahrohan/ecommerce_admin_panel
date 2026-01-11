<script setup lang="ts">
import { ref } from 'vue'

interface Tag {
    id: number
    name: string
}

interface Props {
    tags: Tag[]
    selectedTags: number[]
}

interface Emits {
    (e: 'update:selectedTags', tags: number[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localTags = ref([...props.selectedTags])

function handleChange(tags: number[]) {
    localTags.value = tags
    emit('update:selectedTags', tags)
}
</script>

<template>
    <a-select v-model:value="localTags" mode="multiple" placeholder="Select tags" size="large" style="width: 100%"
        @change="handleChange">
        <a-select-option v-for="tag in tags" :key="tag.id" :value="tag.id">
            {{ tag.name }}
        </a-select-option>
    </a-select>
</template>
