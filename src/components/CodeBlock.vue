<script setup lang="ts">
interface Props {
    code: string
    language?: string
    showLineNumbers?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    language: 'javascript',
    showLineNumbers: false,
})
</script>

<template>
    <div class="code-block">
        <pre><code>{{ code }}</code></pre>
    </div>
</template>

<style scoped>
.code-block {
    background: #1e1e1e;
    border-radius: 8px;
    padding: 16px;
    overflow-x: auto;
}

.code-block pre {
    margin: 0;
    color: #d4d4d4;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    line-height: 1.6;
}

.code-block code {
    color: #d4d4d4;
}
</style>
