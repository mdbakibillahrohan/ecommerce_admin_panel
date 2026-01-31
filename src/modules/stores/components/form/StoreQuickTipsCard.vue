<script lang="ts" setup>
import { AppstoreOutlined } from '@ant-design/icons-vue';
</script>

<template>
  <a-card :bordered="false" class="sidebar-card">
    <div class="card-header">
      <AppstoreOutlined class="card-icon" />
      <h3 class="card-title">Quick Tips</h3>
    </div>

    <div class="tips-list">
      <div class="tip-item">
        <div class="tip-icon">💡</div>
        <div class="tip-content">
          <strong>Choose a memorable name</strong>
          <span>Pick a name that's easy to remember and spell</span>
        </div>
      </div>
      <div class="tip-item">
        <div class="tip-icon">🎨</div>
        <div class="tip-content">
          <strong>Upload quality images</strong>
          <span>Use high-resolution logos for better branding</span>
        </div>
      </div>
      <div class="tip-item">
        <div class="tip-icon">📝</div>
        <div class="tip-content">
          <strong>Write a compelling tagline</strong>
          <span>Describe what makes your store unique</span>
        </div>
      </div>
    </div>
  </a-card>
</template>

<style scoped>
.sidebar-card {
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--card);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

.card-icon {
  font-size: 18px;
  color: oklch(0.65 0.25 192);
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tip-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: var(--muted);
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tip-item:hover {
  background: oklch(0.65 0.25 192 / 0.08);
  transform: translateX(4px);
}

.tip-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.tip-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tip-content strong {
  font-size: 13px;
  font-weight: 600;
  color: var(--foreground);
}

.tip-content span {
  font-size: 12px;
  color: var(--muted-foreground);
  line-height: 1.4;
}
</style>
