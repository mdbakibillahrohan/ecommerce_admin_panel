<script setup lang="ts">
import { MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons-vue'
import type { CreateStoreDto } from '@/modules/stores/api/stores'

const props = defineProps<{
    formState: CreateStoreDto
}>()

const emit = defineEmits<{
    (e: 'update:formState', value: CreateStoreDto): void
}>()
</script>

<template>
    <a-card :bordered="false" class="form-section">
        <div class="section-header">
            <div class="section-icon-wrapper">
                <MailOutlined class="section-icon" />
            </div>
            <div>
                <h2 class="section-title">Contact Information</h2>
                <p class="section-description">How customers can reach you</p>
            </div>
        </div>

        <a-row :gutter="[16, 0]">
            <a-col :xs="24" :lg="8">
                <a-form-item label="Email Address" name="email">
                    <a-input v-model:value="props.formState.email" size="large" type="email"
                        placeholder="contact@yourstore.com">
                        <template #prefix>
                            <MailOutlined />
                        </template>
                    </a-input>
                </a-form-item>
            </a-col>

            <a-col :xs="24" :lg="8">
                <a-form-item label="Phone Number" name="phone">
                    <a-input v-model:value="props.formState.phone" size="large" placeholder="+880 1234-567890">
                        <template #prefix>
                            <PhoneOutlined />
                        </template>
                    </a-input>
                </a-form-item>
            </a-col>

            <a-col :xs="24" :lg="8">
                <a-form-item label="Business Address" name="address">
                    <a-input v-model:value="props.formState.address" size="large" placeholder="Your business address">
                        <template #prefix>
                            <EnvironmentOutlined />
                        </template>
                    </a-input>
                </a-form-item>
            </a-col>
        </a-row>
    </a-card>
</template>
