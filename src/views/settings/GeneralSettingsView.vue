<template>
    <div class="general-settings max-w-4xl">
        <h1 class="text-2xl font-bold mb-6">General Settings</h1>

        <a-card :bordered="false" class="shadow-sm rounded-lg" :loading="loading">
            <a-form layout="vertical" :model="formState" @finish="onFinish">

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Store Details -->
                    <div class="space-y-4">
                        <h3 class="text-lg font-medium border-b pb-2">Store Details</h3>

                        <a-form-item label="Store Name" name="store_name" :rules="[{ required: true }]">
                            <a-input v-model:value="formState.store_name" />
                        </a-form-item>

                        <a-form-item label="Contact Email" name="contact_email"
                            :rules="[{ required: true, type: 'email' }]">
                            <a-input v-model:value="formState.contact_email" />
                        </a-form-item>
                    </div>

                    <!-- Regional Settings -->
                    <div class="space-y-4">
                        <h3 class="text-lg font-medium border-b pb-2">Regional Settings</h3>

                        <a-form-item label="Currency" name="currency">
                            <a-select v-model:value="formState.currency">
                                <a-select-option value="USD">USD ($)</a-select-option>
                                <a-select-option value="EUR">EUR (€)</a-select-option>
                                <a-select-option value="GBP">GBP (£)</a-select-option>
                                <a-select-option value="INR">INR (₹)</a-select-option>
                            </a-select>
                        </a-form-item>

                        <a-form-item label="Timezone" name="timezone">
                            <a-select v-model:value="formState.timezone" show-search>
                                <a-select-option value="UTC">UTC</a-select-option>
                                <a-select-option value="America/New_York">New York</a-select-option>
                                <a-select-option value="Europe/London">London</a-select-option>
                                <a-select-option value="Asia/Kolkata">Kolkata</a-select-option>
                            </a-select>
                        </a-form-item>
                    </div>
                </div>

                <a-form-item class="mt-8 flex justify-end">
                    <a-button type="primary" html-type="submit" :loading="saving" size="large">Save Changes</a-button>
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { settingsService } from '@/services/settings.service'

const loading = ref(false)
const saving = ref(false)

const formState = reactive({
    store_name: '',
    contact_email: '',
    currency: 'USD',
    timezone: 'UTC'
})

const fetchSettings = async () => {
    loading.value = true
    try {
        const data = await settingsService.getGeneralSettings()
        Object.assign(formState, data)
    } catch (error) {
        // message.error('Failed to load settings')
        // Mock data for now if API not ready
        formState.store_name = 'My Awesome Store'
        formState.contact_email = 'admin@store.com'
    } finally {
        loading.value = false
    }
}

const onFinish = async (values: any) => {
    saving.value = true
    try {
        await settingsService.updateGeneralSettings(values)
        message.success('Settings saved')
    } catch (error: any) {
        message.error('Failed to save settings')
    } finally {
        saving.value = false
    }
}

onMounted(() => {
    fetchSettings()
})
</script>
