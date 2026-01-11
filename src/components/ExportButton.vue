<script setup lang="ts">
interface Props {
    data: any[]
    filename?: string
    format?: 'csv' | 'json' | 'excel'
}

interface Emits {
    (e: 'export', format: string): void
}

const props = withDefaults(defineProps<Props>(), {
    filename: 'export',
    format: 'csv',
})

const emit = defineEmits<Emits>()

function handleExport(format: string) {
    emit('export', format)
}
</script>

<template>
    <a-dropdown>
        <a-button>
            <template #icon>
                <download-outlined />
            </template>
            Export
        </a-button>
        <template #overlay>
            <a-menu>
                <a-menu-item @click="handleExport('csv')">
                    <file-text-outlined />
                    Export as CSV
                </a-menu-item>
                <a-menu-item @click="handleExport('json')">
                    <code-outlined />
                    Export as JSON
                </a-menu-item>
                <a-menu-item @click="handleExport('excel')">
                    <file-excel-outlined />
                    Export as Excel
                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
</template>

<script setup lang="ts">
import {
  DownloadOutlined,
  FileTextOutlined,
  CodeOutlined,
  FileExcelOutlined,
} from '@ant-design/icons-vue'
</script>
