<script setup lang="ts">
interface Props {
    url: string
}

const props = defineProps<Props>()

interface Emits {
    (e: 'update:url', value: string): void
}

const emit = defineEmits<Emits>()

function handleInput(e: Event) {
    const value = (e.target as HTMLInputElement).value
    emit('update:url', value)
}
</script>

<template>
    <div class="url-input">
        <a-input :value="url" @input="handleInput" placeholder="https://example.com" size="large">
            <template #prefix>
                <link-outlined />
            </template>
        </a-input>
    </div>
</template>

<script setup lang="ts">
import { LinkOutlined } from '@ant-design/icons-vue'
</script>
