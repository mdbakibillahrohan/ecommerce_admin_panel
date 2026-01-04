<template>
  <div class="checkout-settings">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Checkout Settings</h1>
      <a-button type="primary" @click="saveSettings">
        <template #icon>
          <SaveOutlined />
        </template>
        Save Changes
      </a-button>
    </div>

    <!-- Checkout Flow -->
    <a-card :bordered="false" class="shadow-sm rounded-lg mb-6">
      <template #title>
        <div class="flex items-center gap-2">
          <ShoppingCartOutlined class="text-lg" />
          <span>Checkout Flow</span>
        </div>
      </template>

      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <div>
            <div class="font-medium">Guest Checkout</div>
            <div class="text-sm text-gray-500">Allow customers to checkout without creating an account</div>
          </div>
          <a-switch v-model:checked="settings.guestCheckout" />
        </div>

        <a-divider class="my-4" />

        <div class="flex justify-between items-center">
          <div>
            <div class="font-medium">Company Name Field</div>
            <div class="text-sm text-gray-500">Show company name field at checkout</div>
          </div>
          <a-select v-model:value="settings.companyNameField" style="width: 140px">
            <a-select-option value="hidden">Hidden</a-select-option>
            <a-select-option value="optional">Optional</a-select-option>
            <a-select-option value="required">Required</a-select-option>
          </a-select>
        </div>

        <a-divider class="my-4" />

        <div class="flex justify-between items-center">
          <div>
            <div class="font-medium">Phone Number Field</div>
            <div class="text-sm text-gray-500">Require phone number at checkout</div>
          </div>
          <a-select v-model:value="settings.phoneNumberField" style="width: 140px">
            <a-select-option value="hidden">Hidden</a-select-option>
            <a-select-option value="optional">Optional</a-select-option>
            <a-select-option value="required">Required</a-select-option>
          </a-select>
        </div>

        <a-divider class="my-4" />

        <div class="flex justify-between items-center">
          <div>
            <div class="font-medium">Address Autocomplete</div>
            <div class="text-sm text-gray-500">Help customers find their address faster</div>
          </div>
          <a-switch v-model:checked="settings.addressAutocomplete" />
        </div>
      </div>
    </a-card>

    <!-- Customer Information -->
    <a-card :bordered="false" class="shadow-sm rounded-lg mb-6">
      <template #title>
        <div class="flex items-center gap-2">
          <UserOutlined class="text-lg" />
          <span>Customer Information</span>
        </div>
      </template>

      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <div>
            <div class="font-medium">Email Marketing Opt-in</div>
            <div class="text-sm text-gray-500">Show checkbox for email marketing consent</div>
          </div>
          <a-switch v-model:checked="settings.emailMarketing" />
        </div>

        <a-divider class="my-4" />

        <div class="flex justify-between items-center">
          <div>
            <div class="font-medium">SMS Marketing Opt-in</div>
            <div class="text-sm text-gray-500">Show checkbox for SMS marketing consent</div>
          </div>
          <a-switch v-model:checked="settings.smsMarketing" />
        </div>

        <a-divider class="my-4" />

        <div>
          <div class="font-medium mb-2">Shipping Address</div>
          <a-radio-group v-model:value="settings.shippingAddress" class="flex flex-col gap-2">
            <a-radio value="required">Always require shipping address</a-radio>
            <a-radio value="optional">Shipping address is optional</a-radio>
            <a-radio value="same">Use billing address as shipping address by default</a-radio>
          </a-radio-group>
        </div>
      </div>
    </a-card>

    <!-- Order Notes & Terms -->
    <a-card :bordered="false" class="shadow-sm rounded-lg mb-6">
      <template #title>
        <div class="flex items-center gap-2">
          <FileTextOutlined class="text-lg" />
          <span>Order Notes & Terms</span>
        </div>
      </template>

      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <div>
            <div class="font-medium">Order Notes</div>
            <div class="text-sm text-gray-500">Allow customers to add notes to their order</div>
          </div>
          <a-switch v-model:checked="settings.orderNotes" />
        </div>

        <a-divider class="my-4" />

        <div class="flex justify-between items-center">
          <div>
            <div class="font-medium">Terms and Conditions</div>
            <div class="text-sm text-gray-500">Require customers to agree to terms before checkout</div>
          </div>
          <a-switch v-model:checked="settings.termsRequired" />
        </div>

        <div v-if="settings.termsRequired" class="mt-3">
          <a-input v-model:value="settings.termsUrl" placeholder="https://example.com/terms" addon-before="Terms URL" />
        </div>

        <a-divider class="my-4" />

        <div class="flex justify-between items-center">
          <div>
            <div class="font-medium">Privacy Policy Link</div>
            <div class="text-sm text-gray-500">Show privacy policy link at checkout</div>
          </div>
          <a-switch v-model:checked="settings.privacyPolicyLink" />
        </div>

        <div v-if="settings.privacyPolicyLink" class="mt-3">
          <a-input v-model:value="settings.privacyPolicyUrl" placeholder="https://example.com/privacy"
            addon-before="Privacy URL" />
        </div>
      </div>
    </a-card>

    <!-- Payment Options -->
    <a-card :bordered="false" class="shadow-sm rounded-lg mb-6">
      <template #title>
        <div class="flex items-center gap-2">
          <CreditCardOutlined class="text-lg" />
          <span>Payment Options</span>
        </div>
      </template>

      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <div>
            <div class="font-medium">Express Checkout Buttons</div>
            <div class="text-sm text-gray-500">Show Apple Pay, Google Pay buttons at checkout</div>
          </div>
          <a-switch v-model:checked="settings.expressCheckout" />
        </div>

        <a-divider class="my-4" />

        <div class="flex justify-between items-center">
          <div>
            <div class="font-medium">Save Payment Methods</div>
            <div class="text-sm text-gray-500">Allow customers to save cards for future purchases</div>
          </div>
          <a-switch v-model:checked="settings.savePaymentMethods" />
        </div>

        <a-divider class="my-4" />

        <div class="flex justify-between items-center">
          <div>
            <div class="font-medium">Show Discount Code Field</div>
            <div class="text-sm text-gray-500">Display coupon/discount code input at checkout</div>
          </div>
          <a-switch v-model:checked="settings.discountCodeField" />
        </div>

        <a-divider class="my-4" />

        <div class="flex justify-between items-center">
          <div>
            <div class="font-medium">Gift Card Support</div>
            <div class="text-sm text-gray-500">Allow customers to redeem gift cards</div>
          </div>
          <a-switch v-model:checked="settings.giftCardSupport" />
        </div>
      </div>
    </a-card>

    <!-- Post-Checkout -->
    <a-card :bordered="false" class="shadow-sm rounded-lg mb-6">
      <template #title>
        <div class="flex items-center gap-2">
          <CheckCircleOutlined class="text-lg" />
          <span>Post-Checkout</span>
        </div>
      </template>

      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <div>
            <div class="font-medium">Order Confirmation Page</div>
            <div class="text-sm text-gray-500">Show detailed order confirmation after checkout</div>
          </div>
          <a-switch v-model:checked="settings.orderConfirmationPage" />
        </div>

        <a-divider class="my-4" />

        <div class="flex justify-between items-center">
          <div>
            <div class="font-medium">Send Order Confirmation Email</div>
            <div class="text-sm text-gray-500">Automatically send confirmation email to customers</div>
          </div>
          <a-switch v-model:checked="settings.orderConfirmationEmail" />
        </div>

        <a-divider class="my-4" />

        <div class="flex justify-between items-center">
          <div>
            <div class="font-medium">Automatic Fulfillment</div>
            <div class="text-sm text-gray-500">Automatically fulfill orders for digital products</div>
          </div>
          <a-switch v-model:checked="settings.automaticFulfillment" />
        </div>

        <a-divider class="my-4" />

        <div>
          <div class="font-medium mb-2">Additional Content</div>
          <a-textarea v-model:value="settings.additionalContent" :rows="4"
            placeholder="Add additional content to show on the order confirmation page (e.g., thank you message, social media links, promotional content)" />
        </div>
      </div>
    </a-card>

    <!-- Checkout Appearance -->
    <a-card :bordered="false" class="shadow-sm rounded-lg">
      <template #title>
        <div class="flex items-center gap-2">
          <BgColorsOutlined class="text-lg" />
          <span>Checkout Appearance</span>
        </div>
      </template>

      <div class="space-y-4">
        <div>
          <div class="font-medium mb-2">Logo</div>
          <div class="flex items-center gap-4">
            <div
              class="w-32 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
              <span class="text-xs text-gray-400">No logo</span>
            </div>
            <a-button>
              <template #icon>
                <UploadOutlined />
              </template>
              Upload Logo
            </a-button>
          </div>
          <div class="text-xs text-gray-500 mt-2">Recommended size: 200x80px</div>
        </div>

        <a-divider class="my-4" />

        <div>
          <div class="font-medium mb-2">Brand Color</div>
          <div class="flex items-center gap-3">
            <input type="color" v-model="settings.brandColor"
              class="w-12 h-10 border border-gray-300 rounded cursor-pointer" />
            <a-input v-model:value="settings.brandColor" style="width: 120px" placeholder="#4F46E5" />
            <span class="text-sm text-gray-500">Used for buttons and accents</span>
          </div>
        </div>

        <a-divider class="my-4" />

        <div>
          <div class="font-medium mb-2">Background Style</div>
          <a-radio-group v-model:value="settings.backgroundStyle" class="flex flex-col gap-2">
            <a-radio value="white">White background</a-radio>
            <a-radio value="light">Light gray background</a-radio>
            <a-radio value="brand">Brand color gradient</a-radio>
          </a-radio-group>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import {
  ShoppingCartOutlined,
  UserOutlined,
  FileTextOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  BgColorsOutlined,
  SaveOutlined,
  UploadOutlined
} from '@ant-design/icons-vue'

interface CheckoutSettings {
  // Checkout Flow
  guestCheckout: boolean
  companyNameField: 'hidden' | 'optional' | 'required'
  phoneNumberField: 'hidden' | 'optional' | 'required'
  addressAutocomplete: boolean

  // Customer Information
  emailMarketing: boolean
  smsMarketing: boolean
  shippingAddress: 'required' | 'optional' | 'same'

  // Order Notes & Terms
  orderNotes: boolean
  termsRequired: boolean
  termsUrl: string
  privacyPolicyLink: boolean
  privacyPolicyUrl: string

  // Payment Options
  expressCheckout: boolean
  savePaymentMethods: boolean
  discountCodeField: boolean
  giftCardSupport: boolean

  // Post-Checkout
  orderConfirmationPage: boolean
  orderConfirmationEmail: boolean
  automaticFulfillment: boolean
  additionalContent: string

  // Appearance
  brandColor: string
  backgroundStyle: 'white' | 'light' | 'brand'
}

const settings = ref<CheckoutSettings>({
  // Checkout Flow - Demo data showing a typical e-commerce setup
  guestCheckout: true,
  companyNameField: 'optional',
  phoneNumberField: 'required',
  addressAutocomplete: true,

  // Customer Information
  emailMarketing: true,
  smsMarketing: false,
  shippingAddress: 'required',

  // Order Notes & Terms
  orderNotes: true,
  termsRequired: true,
  termsUrl: 'https://example.com/terms-and-conditions',
  privacyPolicyLink: true,
  privacyPolicyUrl: 'https://example.com/privacy-policy',

  // Payment Options
  expressCheckout: true,
  savePaymentMethods: true,
  discountCodeField: true,
  giftCardSupport: true,

  // Post-Checkout
  orderConfirmationPage: true,
  orderConfirmationEmail: true,
  automaticFulfillment: false,
  additionalContent: 'Thank you for your purchase! Follow us on social media for exclusive deals and updates.',

  // Appearance
  brandColor: '#4F46E5',
  backgroundStyle: 'white'
})

const saveSettings = () => {
  // Simulate saving settings
  message.success('Checkout settings saved successfully!')
}
</script>

<style scoped>
.checkout-settings :deep(.ant-card-head) {
  border-bottom: 1px solid #e5e7eb;
}

.checkout-settings :deep(.ant-card-head-title) {
  padding: 16px 0;
  font-weight: 600;
}

.checkout-settings :deep(.ant-card-body) {
  padding: 24px;
}

.space-y-4>*+* {
  margin-top: 1rem;
}

.checkout-settings :deep(.ant-switch-checked) {
  background-color: #4F46E5;
}

.checkout-settings :deep(.ant-radio-wrapper) {
  margin-left: 0 !important;
}
</style>
