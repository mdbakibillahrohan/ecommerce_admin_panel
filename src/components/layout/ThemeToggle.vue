<script lang="ts" setup>
import { useThemeStore } from '@/stores/theme'
import { FireOutlined, HeartOutlined } from '@ant-design/icons-vue'

const themeStore = useThemeStore()
</script>

<template>
  <a-tooltip :title="themeStore.isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
    <button
      class="theme-toggle-btn"
      :class="{ 'is-dark': themeStore.isDark }"
      @click="themeStore.toggleTheme()"
    >
      <div class="toggle-track">
        <div class="toggle-icons">
          <FireOutlined class="sun-icon" />
          <HeartOutlined class="moon-icon" />
        </div>
        <div class="toggle-thumb"></div>
      </div>
    </button>
  </a-tooltip>
</template>

<style scoped>
.theme-toggle-btn {
  position: relative;
  width: 56px;
  height: 28px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  border-radius: 14px;
  transition: all 0.3s ease;
}

.toggle-track {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: 14px;
  padding: 3px;
  transition: all 0.3s ease;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.is-dark .toggle-track {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
}

.toggle-icons {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  font-size: 12px;
}

.sun-icon {
  color: #ffffff;
  opacity: 1;
  transition: opacity 0.3s ease;
}

.is-dark .sun-icon {
  opacity: 0.4;
}

.moon-icon {
  color: #ffffff;
  opacity: 0.4;
  transition: opacity 0.3s ease;
}

.is-dark .moon-icon {
  opacity: 1;
}

.toggle-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 22px;
  height: 22px;
  background: #ffffff;
  border-radius: 50%;
  transition: transform 0.3s cubic-bezier(0.68, -0.15, 0.27, 1.15);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.is-dark .toggle-thumb {
  transform: translateX(28px);
}

.theme-toggle-btn:hover .toggle-thumb {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.theme-toggle-btn:focus {
  outline: none;
}

.theme-toggle-btn:focus-visible {
  outline: 2px solid #6366f1;
  outline-offset: 2px;
}
</style>
