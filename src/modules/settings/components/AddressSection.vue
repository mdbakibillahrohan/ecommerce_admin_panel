<script setup lang="ts">
import { computed } from 'vue'
import { HomeOutlined, DollarOutlined, ClockCircleOutlined, GlobalOutlined } from '@ant-design/icons-vue'

interface Props {
    modelValue: {
        line1: string
        line2: string
        city: string
        state: string
        zipCode: string
        country: string
        currency: string
        currencyFormat: string
        decimalSeparator: string
        thousandSeparator: string
        timeZone: string
        language: string
        dateFormat: string
        timeFormat: string
        weightUnit: string
        dimensionUnit: string
    }
}

const props = defineProps<Props>()
const emit = defineEmits<{
    (e: 'update:modelValue', value: Props['modelValue']): void
}>()

const settings = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
})
</script>

<template>
    <a-card :bordered="false" class="settings-card">
        <a-form :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }" layout="vertical">
            <div class="form-section-title">
                <HomeOutlined />
                Store Address
            </div>

            <a-form-item label="Address Line 1" class="form-item-enhanced">
                <a-input v-model:value="settings.line1" placeholder="Street address" size="large"
                    class="input-enhanced" />
            </a-form-item>

            <a-form-item label="Address Line 2" class="form-item-enhanced">
                <a-input v-model:value="settings.line2" placeholder="Apartment, suite, etc. (optional)" size="large"
                    class="input-enhanced" />
            </a-form-item>

            <div class="form-grid form-grid-3">
                <a-form-item label="City" class="form-item-enhanced">
                    <a-input v-model:value="settings.city" placeholder="City" size="large" class="input-enhanced" />
                </a-form-item>

                <a-form-item label="State / Province" class="form-item-enhanced">
                    <a-input v-model:value="settings.state" placeholder="State or Province" size="large"
                        class="input-enhanced" />
                </a-form-item>

                <a-form-item label="ZIP / Postal Code" class="form-item-enhanced">
                    <a-input v-model:value="settings.zipCode" placeholder="ZIP or Postal Code" size="large"
                        class="input-enhanced" />
                </a-form-item>
            </div>

            <a-form-item label="Country" class="form-item-enhanced">
                <a-select v-model:value="settings.country" placeholder="Select country" show-search size="large"
                    class="select-enhanced">
                    <a-select-option value="US">United States</a-select-option>
                    <a-select-option value="CA">Canada</a-select-option>
                    <a-select-option value="GB">United Kingdom</a-select-option>
                    <a-select-option value="AU">Australia</a-select-option>
                    <a-select-option value="DE">Germany</a-select-option>
                    <a-select-option value="FR">France</a-select-option>
                    <a-select-option value="JP">Japan</a-select-option>
                    <a-select-option value="CN">China</a-select-option>
                </a-select>
            </a-form-item>

            <div class="form-section-title">
                <DollarOutlined />
                Currency & Formatting
            </div>

            <div class="form-grid">
                <a-form-item label="Currency" required class="form-item-enhanced">
                    <a-select v-model:value="settings.currency" placeholder="Select currency" size="large"
                        class="select-enhanced">
                        <a-select-option value="USD">💵 USD - US Dollar ($)</a-select-option>
                        <a-select-option value="EUR">💶 EUR - Euro (€)</a-select-option>
                        <a-select-option value="GBP">💷 GBP - British Pound (£)</a-select-option>
                        <a-select-option value="CAD">🇨🇦 CAD - Canadian Dollar ($)</a-select-option>
                        <a-select-option value="AUD">🇦🇺 AUD - Australian Dollar ($)</a-select-option>
                        <a-select-option value="JPY">💴 JPY - Japanese Yen (¥)</a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="Currency Format" class="form-item-enhanced">
                    <a-select v-model:value="settings.currencyFormat" placeholder="Select format" size="large"
                        class="select-enhanced">
                        <a-select-option value="symbol">$100.00</a-select-option>
                        <a-select-option value="code">USD 100.00</a-select-option>
                        <a-select-option value="both">$100.00 USD</a-select-option>
                    </a-select>
                </a-form-item>
            </div>

            <div class="form-section-title">
                <ClockCircleOutlined />
                Time & Language
            </div>

            <a-form-item label="Time Zone" class="form-item-enhanced">
                <a-select v-model:value="settings.timeZone" placeholder="Select time zone" show-search size="large"
                    class="select-enhanced">
                    <a-select-option value="America/New_York">(GMT-5:00) Eastern Time - New York</a-select-option>
                    <a-select-option value="America/Chicago">(GMT-6:00) Central Time - Chicago</a-select-option>
                    <a-select-option value="America/Los_Angeles">(GMT-8:00) Pacific Time - Los Angeles</a-select-option>
                    <a-select-option value="Europe/London">(GMT+0:00) London</a-select-option>
                    <a-select-option value="Asia/Tokyo">(GMT+9:00) Tokyo</a-select-option>
                </a-select>
            </a-form-item>

            <a-form-item label="Language" class="form-item-enhanced">
                <a-select v-model:value="settings.language" placeholder="Select language" size="large"
                    class="select-enhanced">
                    <a-select-option value="en">English</a-select-option>
                    <a-select-option value="es">Spanish</a-select-option>
                    <a-select-option value="fr">French</a-select-option>
                    <a-select-option value="de">German</a-select-option>
                    <a-select-option value="ja">Japanese</a-select-option>
                </a-select>
            </a-form-item>

            <div class="form-section-title">
                <GlobalOutlined />
                Units of Measurement
            </div>

            <div class="form-grid">
                <a-form-item label="Weight Unit" class="form-item-enhanced">
                    <a-select v-model:value="settings.weightUnit" size="large" class="select-enhanced">
                        <a-select-option value="kg">Kilograms (kg)</a-select-option>
                        <a-select-option value="lb">Pounds (lb)</a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="Dimension Unit" class="form-item-enhanced">
                    <a-select v-model:value="settings.dimensionUnit" size="large" class="select-enhanced">
                        <a-select-option value="cm">Centimeters (cm)</a-select-option>
                        <a-select-option value="in">Inches (in)</a-select-option>
                    </a-select>
                </a-form-item>
            </div>
        </a-form>
    </a-card>
</template>

<style scoped>
.form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
}

.form-grid-3 {
    grid-template-columns: repeat(3, 1fr);
}

.form-section-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 16px;
    font-weight: 600;
    color: var(--foreground);
    margin: 24px 0 16px;
    padding-bottom: 12px;
    border-bottom: 2px solid var(--border);
}

@media (max-width: 768px) {

    .form-grid,
    .form-grid-3 {
        grid-template-columns: 1fr;
    }
}
</style>
