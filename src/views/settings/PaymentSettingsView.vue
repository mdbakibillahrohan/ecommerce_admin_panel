<template>
  <div class="payment-settings mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Payment Providers</h1>
      <a-space>
        <a-button @click="showAddProviderModal = true">
          <template #icon>
            <PlusOutlined />
          </template>
          Add Provider
        </a-button>
      </a-space>
    </div>

    <!-- Test Mode Banner -->
    <a-alert v-if="testMode" message="Test Mode Active"
      description="All transactions are using test credentials. Switch to live mode when ready for production."
      type="warning" show-icon closable class="mb-6" />

    <!-- Payment Providers Grid -->
    <div class="grid grid-cols-1 gap-4">
      <a-card v-for="provider in paymentProviders" :key="provider.id"
        class="shadow-sm hover:shadow-md transition-shadow" :class="{ 'border-blue-200 bg-blue-50': provider.enabled }">
        <div class="flex justify-between items-start">
          <div class="flex gap-4 flex-1">
            <!-- Provider Icon -->
            <div class="w-14 h-14 rounded-lg flex items-center justify-center text-2xl"
              :style="{ backgroundColor: provider.color + '20', color: provider.color }">
              <component :is="provider.icon" />
            </div>

            <!-- Provider Info -->
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="font-bold text-lg">{{ provider.name }}</h3>
                <a-tag v-if="provider.enabled" color="success">Active</a-tag>
                <a-tag v-else color="default">Inactive</a-tag>
                <a-tag v-if="provider.testMode" color="orange">Test Mode</a-tag>
              </div>
              <p class="text-gray-500 text-sm mb-2">{{ provider.description }}</p>

              <!-- Configuration Status -->
              <div v-if="provider.enabled" class="flex gap-4 text-xs text-gray-600 mt-3">
                <div class="flex items-center gap-1">
                  <CheckCircleOutlined class="text-green-500" />
                  <span>{{ provider.configuredFeatures }} features enabled</span>
                </div>
                <div v-if="provider.lastTransaction" class="flex items-center gap-1">
                  <ClockCircleOutlined />
                  <span>Last transaction: {{ provider.lastTransaction }}</span>
                </div>
              </div>

              <!-- Supported Payment Methods -->
              <div class="flex flex-wrap gap-2 mt-3">
                <a-tag v-for="method in provider.supportedMethods" :key="method" class="text-xs">
                  {{ method }}
                </a-tag>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col items-end gap-3">
            <a-switch v-model:checked="provider.enabled" checked-children="On" un-checked-children="Off"
              @change="toggleProvider(provider)" />
            <a-dropdown>
              <a-button type="text" size="small">
                <template #icon>
                  <MoreOutlined />
                </template>
              </a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="configureProvider(provider)">
                    <SettingOutlined /> Configure
                  </a-menu-item>
                  <a-menu-item @click="viewTransactions(provider)">
                    <BarChartOutlined /> View Transactions
                  </a-menu-item>
                  <a-menu-item @click="testProvider(provider)">
                    <ExperimentOutlined /> Test Connection
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item danger @click="deleteProvider(provider)">
                    <DeleteOutlined /> Remove
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </div>

        <!-- Configuration Details (when enabled) -->
        <div v-if="provider.enabled && provider.apiKeyConfigured" class="mt-4 pt-4 border-t">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div class="text-gray-500">API Status</div>
              <div class="font-medium flex items-center gap-1 mt-1">
                <CheckCircleOutlined class="text-green-500" />
                Connected
              </div>
            </div>
            <div>
              <div class="text-gray-500">Transaction Fee</div>
              <div class="font-medium mt-1">{{ provider.transactionFee }}</div>
            </div>
          </div>
          <a-button type="link" class="px-0 mt-2" @click="configureProvider(provider)">
            Manage Settings
          </a-button>
        </div>

        <!-- Setup Required (when not configured) -->
        <div v-if="provider.enabled && !provider.apiKeyConfigured" class="mt-4 pt-4 border-t">
          <a-alert message="Setup Required" description="Please configure API credentials to start accepting payments."
            type="info" show-icon>
            <template #action>
              <a-button size="small" type="primary" @click="configureProvider(provider)">
                Configure Now
              </a-button>
            </template>
          </a-alert>
        </div>
      </a-card>
    </div>

    <!-- Configure Provider Modal -->
    <a-modal v-model:open="showConfigModal" :title="`Configure ${selectedProvider?.name}`" width="600px"
      @ok="saveProviderConfig">
      <a-form layout="vertical" class="mt-4">
        <a-form-item label="Environment Mode">
          <a-radio-group v-model:value="configForm.testMode">
            <a-radio :value="true">Test Mode</a-radio>
            <a-radio :value="false">Live Mode</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="API Key" help="Your publishable or public API key">
          <a-input-password v-model:value="configForm.apiKey" placeholder="pk_test_..." />
        </a-form-item>

        <a-form-item label="Secret Key" help="Your secret API key (keep this secure)">
          <a-input-password v-model:value="configForm.secretKey" placeholder="sk_test_..." />
        </a-form-item>

        <a-form-item v-if="selectedProvider?.name === 'Stripe'" label="Webhook Secret">
          <a-input-password v-model:value="configForm.webhookSecret" placeholder="whsec_..." />
        </a-form-item>

        <a-form-item label="Supported Payment Methods">
          <a-checkbox-group v-model:value="configForm.paymentMethods">
            <div class="grid grid-cols-2 gap-2">
              <a-checkbox value="Credit Card">Credit Card</a-checkbox>
              <a-checkbox value="Debit Card">Debit Card</a-checkbox>
              <a-checkbox value="Apple Pay">Apple Pay</a-checkbox>
              <a-checkbox value="Google Pay">Google Pay</a-checkbox>
              <a-checkbox value="Bank Transfer">Bank Transfer</a-checkbox>
              <a-checkbox value="Digital Wallet">Digital Wallet</a-checkbox>
            </div>
          </a-checkbox-group>
        </a-form-item>

        <a-form-item label="Transaction Fee">
          <a-input v-model:value="configForm.transactionFee" placeholder="2.9% + $0.30" />
        </a-form-item>

        <a-form-item label="Auto-capture Payment">
          <a-switch v-model:checked="configForm.autoCapture" />
          <div class="text-xs text-gray-500 mt-1">
            Automatically capture payments or require manual capture
          </div>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- Add Provider Modal -->
    <a-modal v-model:open="showAddProviderModal" title="Add Payment Provider" width="500px" @ok="addNewProvider">
      <a-form layout="vertical" class="mt-4">
        <a-form-item label="Select Provider">
          <a-select v-model:value="newProviderType" placeholder="Choose a payment provider">
            <a-select-option value="custom">Custom Gateway</a-select-option>
            <a-select-option value="square">Square</a-select-option>
            <a-select-option value="adyen">Adyen</a-select-option>
            <a-select-option value="authorize">Authorize.net</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- Test Connection Modal -->
    <a-modal v-model:open="showTestModal" title="Test Payment Connection" :footer="null">
      <a-result v-if="testResult" :status="testResult.success ? 'success' : 'error'" :title="testResult.message">
        <template #extra>
          <a-button type="primary" @click="showTestModal = false">Close</a-button>
        </template>
      </a-result>
      <div v-else class="text-center py-8">
        <a-spin size="large" />
        <p class="mt-4 text-gray-500">Testing connection...</p>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
  PlusOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  MoreOutlined,
  SettingOutlined,
  BarChartOutlined,
  ExperimentOutlined,
  DeleteOutlined,
  CreditCardOutlined,
  DollarOutlined,
  BankOutlined,
  WalletOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

interface PaymentProvider {
  id: string
  name: string
  description: string
  icon: any
  color: string
  enabled: boolean
  testMode: boolean
  apiKeyConfigured: boolean
  supportedMethods: string[]
  configuredFeatures: number
  lastTransaction?: string
  transactionFee: string
}

const testMode = ref(true)
const showConfigModal = ref(false)
const showAddProviderModal = ref(false)
const showTestModal = ref(false)
const selectedProvider = ref<PaymentProvider | null>(null)
const newProviderType = ref('')
const testResult = ref<{ success: boolean; message: string } | null>(null)

const configForm = ref({
  testMode: true,
  apiKey: '',
  secretKey: '',
  webhookSecret: '',
  paymentMethods: ['Credit Card', 'Debit Card'],
  transactionFee: '2.9% + $0.30',
  autoCapture: true
})

const paymentProviders = ref<PaymentProvider[]>([
  {
    id: '1',
    name: 'Stripe',
    description: 'Accept credit cards, Apple Pay, Google Pay, and 100+ payment methods worldwide.',
    icon: CreditCardOutlined,
    color: '#635BFF',
    enabled: true,
    testMode: true,
    apiKeyConfigured: true,
    supportedMethods: ['Credit Card', 'Debit Card', 'Apple Pay', 'Google Pay', 'SEPA'],
    configuredFeatures: 8,
    lastTransaction: '2 hours ago',
    transactionFee: '2.9% + $0.30'
  },
  {
    id: '2',
    name: 'PayPal',
    description: 'Accept PayPal, Venmo, and credit card payments with PayPal Commerce Platform.',
    icon: DollarOutlined,
    color: '#0070BA',
    enabled: true,
    testMode: false,
    apiKeyConfigured: true,
    supportedMethods: ['PayPal', 'Venmo', 'Credit Card', 'Debit Card'],
    configuredFeatures: 5,
    lastTransaction: '1 day ago',
    transactionFee: '3.49% + $0.49'
  },
  {
    id: '3',
    name: 'Cash on Delivery',
    description: 'Accept cash payments upon delivery. Perfect for local deliveries.',
    icon: WalletOutlined,
    color: '#10B981',
    enabled: true,
    testMode: false,
    apiKeyConfigured: true,
    supportedMethods: ['Cash'],
    configuredFeatures: 2,
    lastTransaction: '3 hours ago',
    transactionFee: 'Free'
  },
  {
    id: '4',
    name: 'Bank Transfer',
    description: 'Accept direct bank transfers and ACH payments from customers.',
    icon: BankOutlined,
    color: '#8B5CF6',
    enabled: false,
    testMode: true,
    apiKeyConfigured: false,
    supportedMethods: ['Bank Transfer', 'ACH', 'Wire Transfer'],
    configuredFeatures: 0,
    transactionFee: '1.5% (max $5)'
  },
  {
    id: '5',
    name: 'Cryptocurrency',
    description: 'Accept Bitcoin, Ethereum, and other cryptocurrencies.',
    icon: DollarOutlined,
    color: '#F59E0B',
    enabled: false,
    testMode: true,
    apiKeyConfigured: false,
    supportedMethods: ['Bitcoin', 'Ethereum', 'USDC', 'USDT'],
    configuredFeatures: 0,
    transactionFee: '1.0%'
  }
])

const toggleProvider = (provider: PaymentProvider) => {
  if (provider.enabled && !provider.apiKeyConfigured) {
    message.info('Please configure API credentials first')
    configureProvider(provider)
  } else {
    message.success(`${provider.name} ${provider.enabled ? 'enabled' : 'disabled'}`)
  }
}

const configureProvider = (provider: PaymentProvider) => {
  selectedProvider.value = provider
  configForm.value = {
    testMode: provider.testMode,
    apiKey: '',
    secretKey: '',
    webhookSecret: '',
    paymentMethods: provider.supportedMethods.slice(0, 2),
    transactionFee: provider.transactionFee,
    autoCapture: true
  }
  showConfigModal.value = true
}

const saveProviderConfig = () => {
  const provider = paymentProviders.value.find(p => p.id === selectedProvider.value?.id)
  if (provider) {
    provider.apiKeyConfigured = true
    provider.testMode = configForm.value.testMode
    provider.supportedMethods = configForm.value.paymentMethods
    provider.transactionFee = configForm.value.transactionFee
    message.success('Configuration saved successfully')
  }
  showConfigModal.value = false
}

const viewTransactions = (provider: PaymentProvider) => {
  message.info(`Viewing transactions for ${provider.name}`)
}

const testProvider = (provider: PaymentProvider) => {
  showTestModal.value = true
  testResult.value = null

  setTimeout(() => {
    testResult.value = {
      success: provider.apiKeyConfigured,
      message: provider.apiKeyConfigured
        ? `Connection to ${provider.name} successful!`
        : 'Please configure API credentials first'
    }
  }, 1500)
}

const deleteProvider = (provider: PaymentProvider) => {
  paymentProviders.value = paymentProviders.value.filter(p => p.id !== provider.id)
  message.success(`${provider.name} removed successfully`)
}

const addNewProvider = () => {
  if (!newProviderType.value) {
    message.error('Please select a provider')
    return
  }
  message.success('Provider added successfully')
  showAddProviderModal.value = false
  newProviderType.value = ''
}
</script>

<style scoped>
.payment-settings {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
</style>
