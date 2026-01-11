<script setup lang="ts">
interface Props {
    items: Array<{ id: number; label: string; checked: boolean }>
}

interface Emits {
    (e: 'update', items: Array<{ id: number; label: string; checked: boolean }>): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function handleToggle(index: number) {
    const updated = [...props.items]
    updated[index]!.checked = !updated[index]!.checked
    emit('update', updated)
}
</script>

<template>
    <div class="checklist">
        <div v-for="(item, index) in items" :key="item.id" class="checklist-item">
            <a-checkbox :checked="item.checked" @change="handleToggle(index)">
                {{ item.label }}
            </a-checkbox>
        </div>
    </div>
</template>

<style scoped>
.checklist {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.checklist-item {
    padding: 8px;
    border-radius: 6px;
    transition: background 0.2s;
}

.checklist-item:hover {
    background: var(--accent);
}
</style>
