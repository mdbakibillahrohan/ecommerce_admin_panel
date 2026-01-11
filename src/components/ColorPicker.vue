<script setup lang="ts">
interface Props {
    color: string
}

const props = defineProps<Props>()

interface Emits {
    (e: 'update:color', value: string): void
}

const emit = defineEmits<Emits>()

function handleChange(value: string) {
    emit('update:color', value)
}
</script>

<template>
    <div class="color-picker">
        <input type="color" :value="color" @input="(e: any) => handleChange((e.target as HTMLInputElement).value)"
            class="color-input" />
        <a-input :value="color" @input="(e: any) => handleChange((e.target as HTMLInputElement).value)"
            placeholder="#000000" size="large" />
    </div>
</template>

<style scoped>
.color-picker {
    display: flex;
    gap: 12px;
    align-items: center;
}

.color-input {
    width: 50px;
    height: 40px;
    border: 1px solid var(--border);
    border-radius: 6px;
    cursor: pointer;
}
</style>
