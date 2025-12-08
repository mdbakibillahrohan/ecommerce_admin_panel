<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#1dd1a1',
        borderRadius: 0,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
      },
    }"
  >
    <RouterView />
  </a-config-provider>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
</style>
