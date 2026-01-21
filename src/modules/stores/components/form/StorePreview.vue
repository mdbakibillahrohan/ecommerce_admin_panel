<script setup lang="ts">
import { ShopOutlined, AppstoreOutlined, GlobalOutlined } from '@ant-design/icons-vue'
import { configuration } from '@/modules/shared/config/configruation'
import type { CreateStoreDto } from '@/modules/stores/api/stores'
import type { MediaFile } from '@/modules/media/services/media.service'
import type { IStoreCategory } from '@/modules/shared/interfaces/store/store.interface'

const props = defineProps<{
    formState: CreateStoreDto
    logo: MediaFile | null | undefined
    storeCategories: IStoreCategory[]
}>()
</script>

<template>
    <div class="form-sidebar">
        <a-card :bordered="false" class="sidebar-card sticky-card">
            <div class="card-header">
                <ShopOutlined class="card-icon" />
                <h3 class="card-title">Store Preview</h3>
            </div>

            <div class="store-preview">
                <div class="preview-logo">
                    <img v-if="logo" :src="configuration.API_BASE_URL + logo?.file_path" alt="Store Logo" />
                    <div v-else class="preview-logo-placeholder">
                        <ShopOutlined />
                    </div>
                </div>

                <div class="preview-info">
                    <h3 class="preview-name">{{ formState.name || 'Store Name' }}</h3>
                    <p class="preview-tagline">{{ formState.tagline || 'Your store tagline' }}</p>
                    <div class="preview-url">
                        <GlobalOutlined />
                        <span>{{ formState.slug || 'your-store' }}.adaptixinnovate.com</span>
                    </div>
                </div>

                <div class="preview-details">
                    <div class="detail-item">
                        <span class="detail-label">Category</span>
                        <span class="detail-value">
                            {{
                                storeCategories.find((c) => c.id === formState.store_category_id)?.name ||
                            'Not selected'
                            }}
                        </span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Currency</span>
                        <span class="detail-value">{{ formState.currency }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Timezone</span>
                        <span class="detail-value">{{ formState.timezone }}</span>
                    </div>
                </div>
            </div>
        </a-card>

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
    </div>
</template>
