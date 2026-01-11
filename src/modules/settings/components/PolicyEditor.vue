<script setup lang="ts">
import { ref } from 'vue'

interface Props {
    content: string
    title: string
}

interface Emits {
    (e: 'save', content: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const editorContent = ref(props.content)

function handleSave() {
    emit('save', editorContent.value)
}
</script>

<template>
    <a-card :title="title" :bordered="false">
        <template #extra>
            <a-button type="primary" @click="handleSave">Save Changes</a-button>
        </template>

        <a-textarea v-model:value="editorContent" :rows="20" placeholder="Enter policy content..."
            style="font-family: monospace" />

        <div class="editor-hint">
            You can use Markdown formatting for better readability.
        </div>
    </a-card>
</template>

<style scoped>
.editor-hint {
    font-size: 13px;
    color: var(--muted-foreground);
    margin-top: 12px;
}
</style>
