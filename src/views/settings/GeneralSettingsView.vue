<template>
  <div class="general-settings">
    <div class="settings-header">
      <div>
        <h1 class="page-title">General Settings</h1>
        <p class="page-subtitle">Configure your store's basic information and preferences</p>
      </div>
      <div class="header-actions">
        <a-button class="reset-btn" @click="handleReset">
          <undo-outlined />
          Reset
        </a-button>
        <a-button type="primary" class="save-btn" @click="handleSave" :loading="saving">
          <save-outlined v-if="!saving" />
          Save Changes
        </a-button>
      </div>
    </div>

    <!-- Added tabs for better organization -->
    <a-tabs v-model:activeKey="activeTab" class="settings-tabs" type="card">
      <!-- Store Information Tab -->
      <a-tab-pane key="store" tab="Store Information">
        <template #tab>
          <span class="tab-label">
            <shop-outlined />
            Store Information
          </span>
        </template>

        <a-card :bordered="false" class="settings-card">
          <a-form :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }" layout="vertical">
            <div class="form-grid">
              <a-form-item label="Store Name" required class="form-item-enhanced">
                <a-input v-model:value="settings.storeName" placeholder="Enter your store name" size="large"
                  class="input-enhanced" />
              </a-form-item>

              <a-form-item label="Store Tagline" class="form-item-enhanced">
                <a-input v-model:value="settings.storeTagline" placeholder="A short description of your store"
                  size="large" class="input-enhanced" />
              </a-form-item>
            </div>

            <a-form-item label="Store Description" class="form-item-enhanced">
              <a-textarea v-model:value="settings.storeDescription" :rows="4"
                placeholder="Describe what your store sells..." class="input-enhanced" />
            </a-form-item>

            <div class="form-section-title">
              <search-outlined />
              SEO & Metadata
            </div>

            <a-form-item label="Meta Title" class="form-item-enhanced">
              <a-input v-model:value="settings.metaTitle" placeholder="SEO title for search engines" :max-length="60"
                size="large" class="input-enhanced" />
              <div class="field-hint">
                <span :class="{ 'text-warning': settings.metaTitle.length > 55 }">
                  {{ settings.metaTitle.length }}/60 characters
                </span>
              </div>
            </a-form-item>

            <a-form-item label="Meta Description" class="form-item-enhanced">
              <a-textarea v-model:value="settings.metaDescription" :rows="3"
                placeholder="SEO description for search engines" :max-length="160" class="input-enhanced" />
              <div class="field-hint">
                <span :class="{ 'text-warning': settings.metaDescription.length > 155 }">
                  {{ settings.metaDescription.length }}/160 characters
                </span>
              </div>
            </a-form-item>

            <div class="form-section-title">
              <phone-outlined />
              Contact Information
            </div>

            <div class="form-grid">
              <a-form-item label="Contact Email" required class="form-item-enhanced">
                <a-input v-model:value="settings.contactEmail" type="email" placeholder="store@example.com" size="large"
                  class="input-enhanced" />
              </a-form-item>

              <a-form-item label="Phone Number" class="form-item-enhanced">
                <a-input v-model:value="settings.phoneNumber" placeholder="+1 (555) 123-4567" size="large"
                  class="input-enhanced" />
              </a-form-item>
            </div>

            <a-form-item label="Website URL" class="form-item-enhanced">
              <a-input v-model:value="settings.websiteUrl" placeholder="https://yourstore.com" size="large"
                class="input-enhanced" />
            </a-form-item>

            <div class="form-section-title">
              <picture-outlined />
              Branding Assets
            </div>

            <div class="form-grid">
              <a-form-item label="Store Logo" class="form-item-enhanced">
                <a-upload :before-upload="() => false" list-type="picture-card" :max-count="1" class="upload-enhanced">
                  <div v-if="!settings.storeLogo" class="upload-content">
                    <plus-outlined class="upload-icon" />
                    <div class="upload-text">Upload Logo</div>
                  </div>
                </a-upload>
                <div class="field-hint">
                  Recommended: 200x200px, PNG or JPG
                </div>
              </a-form-item>

              <a-form-item label="Favicon" class="form-item-enhanced">
                <a-upload :before-upload="() => false" list-type="picture-card" :max-count="1" class="upload-enhanced">
                  <div class="upload-content">
                    <plus-outlined class="upload-icon" />
                    <div class="upload-text">Upload Favicon</div>
                  </div>
                </a-upload>
                <div class="field-hint">
                  Recommended: 32x32px, ICO or PNG
                </div>
              </a-form-item>
            </div>
          </a-form>
        </a-card>
      </a-tab-pane>

      <!-- Social & Marketing Tab -->
      <a-tab-pane key="social" tab="Social & Marketing">
        <template #tab>
          <span class="tab-label">
            <global-outlined />
            Social & Marketing
          </span>
        </template>

        <a-card :bordered="false" class="settings-card">
          <a-form :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }" layout="vertical">
            <div class="form-section-title">
              <share-alt-outlined />
              Social Media Profiles
            </div>

            <div class="form-grid">
              <a-form-item label="Facebook" class="form-item-enhanced">
                <a-input v-model:value="settings.socialMedia.facebook" placeholder="https://facebook.com/yourstore"
                  size="large" class="input-enhanced">
                  <template #prefix>
                    <facebook-outlined class="input-prefix-icon" />
                  </template>
                </a-input>
              </a-form-item>

              <a-form-item label="Instagram" class="form-item-enhanced">
                <a-input v-model:value="settings.socialMedia.instagram" placeholder="https://instagram.com/yourstore"
                  size="large" class="input-enhanced">
                  <template #prefix>
                    <instagram-outlined class="input-prefix-icon" />
                  </template>
                </a-input>
              </a-form-item>

              <a-form-item label="Twitter" class="form-item-enhanced">
                <a-input v-model:value="settings.socialMedia.twitter" placeholder="https://twitter.com/yourstore"
                  size="large" class="input-enhanced">
                  <template #prefix>
                    <twitter-outlined class="input-prefix-icon" />
                  </template>
                </a-input>
              </a-form-item>

              <a-form-item label="LinkedIn" class="form-item-enhanced">
                <a-input v-model:value="settings.socialMedia.linkedin"
                  placeholder="https://linkedin.com/company/yourstore" size="large" class="input-enhanced">
                  <template #prefix>
                    <linkedin-outlined class="input-prefix-icon" />
                  </template>
                </a-input>
              </a-form-item>

              <a-form-item label="YouTube" class="form-item-enhanced">
                <a-input v-model:value="settings.socialMedia.youtube" placeholder="https://youtube.com/yourstore"
                  size="large" class="input-enhanced">
                  <template #prefix>
                    <youtube-outlined class="input-prefix-icon" />
                  </template>
                </a-input>
              </a-form-item>
            </div>

            <div class="form-section-title">
              <bar-chart-outlined />
              Marketing & Analytics
            </div>

            <a-form-item label="Google Analytics ID" class="form-item-enhanced">
              <a-input v-model:value="settings.googleAnalyticsId" placeholder="UA-XXXXXXXXX-X or G-XXXXXXXXXX"
                size="large" class="input-enhanced" />
              <div class="field-hint">Track your store's performance with Google Analytics</div>
            </a-form-item>

            <a-form-item label="Facebook Pixel ID" class="form-item-enhanced">
              <a-input v-model:value="settings.facebookPixelId" placeholder="Enter your Facebook Pixel ID" size="large"
                class="input-enhanced" />
              <div class="field-hint">Track conversions and optimize Facebook ads</div>
            </a-form-item>

            <a-form-item label="Google Tag Manager ID" class="form-item-enhanced">
              <a-input v-model:value="settings.googleTagManagerId" placeholder="GTM-XXXXXXX" size="large"
                class="input-enhanced" />
              <div class="field-hint">Manage all marketing tags from one place</div>
            </a-form-item>
          </a-form>
        </a-card>
      </a-tab-pane>

      <!-- Address & Regional Tab -->
      <a-tab-pane key="regional" tab="Address & Regional">
        <template #tab>
          <span class="tab-label">
            <environment-outlined />
            Address & Regional
          </span>
        </template>

        <a-card :bordered="false" class="settings-card">
          <a-form :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }" layout="vertical">
            <div class="form-section-title">
              <home-outlined />
              Store Address
            </div>

            <a-form-item label="Address Line 1" class="form-item-enhanced">
              <a-input v-model:value="settings.address.line1" placeholder="Street address" size="large"
                class="input-enhanced" />
            </a-form-item>

            <a-form-item label="Address Line 2" class="form-item-enhanced">
              <a-input v-model:value="settings.address.line2" placeholder="Apartment, suite, etc. (optional)"
                size="large" class="input-enhanced" />
            </a-form-item>

            <div class="form-grid form-grid-3">
              <a-form-item label="City" class="form-item-enhanced">
                <a-input v-model:value="settings.address.city" placeholder="City" size="large" class="input-enhanced" />
              </a-form-item>

              <a-form-item label="State / Province" class="form-item-enhanced">
                <a-input v-model:value="settings.address.state" placeholder="State or Province" size="large"
                  class="input-enhanced" />
              </a-form-item>

              <a-form-item label="ZIP / Postal Code" class="form-item-enhanced">
                <a-input v-model:value="settings.address.zipCode" placeholder="ZIP or Postal Code" size="large"
                  class="input-enhanced" />
              </a-form-item>
            </div>

            <a-form-item label="Country" class="form-item-enhanced">
              <a-select v-model:value="settings.address.country" placeholder="Select country" show-search size="large"
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
              <dollar-outlined />
              Currency & Formatting
            </div>

            <div class="form-grid">
              <a-form-item label="Currency" required class="form-item-enhanced">
                <a-select v-model:value="settings.currency" placeholder="Select currency" size="large"
                  class="select-enhanced">
                  <a-select-option value="USD">
                    <span class="currency-option">💵 USD - US Dollar ($)</span>
                  </a-select-option>
                  <a-select-option value="EUR">
                    <span class="currency-option">💶 EUR - Euro (€)</span>
                  </a-select-option>
                  <a-select-option value="GBP">
                    <span class="currency-option">💷 GBP - British Pound (£)</span>
                  </a-select-option>
                  <a-select-option value="CAD">
                    <span class="currency-option">🇨🇦 CAD - Canadian Dollar ($)</span>
                  </a-select-option>
                  <a-select-option value="AUD">
                    <span class="currency-option">🇦🇺 AUD - Australian Dollar ($)</span>
                  </a-select-option>
                  <a-select-option value="JPY">
                    <span class="currency-option">💴 JPY - Japanese Yen (¥)</span>
                  </a-select-option>
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

            <div class="form-grid">
              <a-form-item label="Decimal Separator" class="form-item-enhanced">
                <a-radio-group v-model:value="settings.decimalSeparator" class="radio-group-enhanced">
                  <a-radio value=".">Dot (.)</a-radio>
                  <a-radio value=",">Comma (,)</a-radio>
                </a-radio-group>
                <div class="field-hint">Example: 1{{ settings.decimalSeparator }}99</div>
              </a-form-item>

              <a-form-item label="Thousand Separator" class="form-item-enhanced">
                <a-radio-group v-model:value="settings.thousandSeparator" class="radio-group-enhanced">
                  <a-radio value=",">Comma (,)</a-radio>
                  <a-radio value=".">Dot (.)</a-radio>
                  <a-radio value=" ">Space</a-radio>
                  <a-radio value="">None</a-radio>
                </a-radio-group>
                <div class="field-hint">Example: 1{{ settings.thousandSeparator }}000{{ settings.decimalSeparator }}00
                </div>
              </a-form-item>
            </div>

            <div class="form-section-title">
              <clock-circle-outlined />
              Time & Language
            </div>

            <a-form-item label="Time Zone" class="form-item-enhanced">
              <a-select v-model:value="settings.timeZone" placeholder="Select time zone" show-search size="large"
                class="select-enhanced">
                <a-select-option value="America/New_York">(GMT-5:00) Eastern Time - New York</a-select-option>
                <a-select-option value="America/Chicago">(GMT-6:00) Central Time - Chicago</a-select-option>
                <a-select-option value="America/Denver">(GMT-7:00) Mountain Time - Denver</a-select-option>
                <a-select-option value="America/Los_Angeles">(GMT-8:00) Pacific Time - Los Angeles</a-select-option>
                <a-select-option value="Europe/London">(GMT+0:00) London</a-select-option>
                <a-select-option value="Europe/Paris">(GMT+1:00) Paris</a-select-option>
                <a-select-option value="Asia/Tokyo">(GMT+9:00) Tokyo</a-select-option>
                <a-select-option value="Australia/Sydney">(GMT+10:00) Sydney</a-select-option>
              </a-select>
            </a-form-item>

            <div class="form-grid">
              <a-form-item label="Date Format" class="form-item-enhanced">
                <a-select v-model:value="settings.dateFormat" placeholder="Select date format" size="large"
                  class="select-enhanced">
                  <a-select-option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2024)</a-select-option>
                  <a-select-option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2024)</a-select-option>
                  <a-select-option value="YYYY-MM-DD">YYYY-MM-DD (2024-12-31)</a-select-option>
                  <a-select-option value="DD.MM.YYYY">DD.MM.YYYY (31.12.2024)</a-select-option>
                </a-select>
              </a-form-item>

              <a-form-item label="Time Format" class="form-item-enhanced">
                <a-radio-group v-model:value="settings.timeFormat" class="radio-group-enhanced">
                  <a-radio value="12">12-hour (2:30 PM)</a-radio>
                  <a-radio value="24">24-hour (14:30)</a-radio>
                </a-radio-group>
              </a-form-item>
            </div>

            <a-form-item label="Language" class="form-item-enhanced">
              <a-select v-model:value="settings.language" placeholder="Select language" size="large"
                class="select-enhanced">
                <a-select-option value="en">🇬🇧 English</a-select-option>
                <a-select-option value="es">🇪🇸 Español</a-select-option>
                <a-select-option value="fr">🇫🇷 Français</a-select-option>
                <a-select-option value="de">🇩🇪 Deutsch</a-select-option>
                <a-select-option value="ja">🇯🇵 日本語</a-select-option>
                <a-select-option value="zh">🇨🇳 中文</a-select-option>
              </a-select>
            </a-form-item>

            <div class="form-section-title">
              <column-height-outlined />
              Units of Measurement
            </div>

            <div class="form-grid">
              <a-form-item label="Weight Unit" class="form-item-enhanced">
                <a-radio-group v-model:value="settings.weightUnit" class="radio-group-enhanced">
                  <a-radio value="kg">Kilograms (kg)</a-radio>
                  <a-radio value="lb">Pounds (lb)</a-radio>
                  <a-radio value="oz">Ounces (oz)</a-radio>
                </a-radio-group>
              </a-form-item>

              <a-form-item label="Dimension Unit" class="form-item-enhanced">
                <a-radio-group v-model:value="settings.dimensionUnit" class="radio-group-enhanced">
                  <a-radio value="cm">Centimeters (cm)</a-radio>
                  <a-radio value="in">Inches (in)</a-radio>
                  <a-radio value="m">Meters (m)</a-radio>
                </a-radio-group>
              </a-form-item>
            </div>
          </a-form>
        </a-card>
      </a-tab-pane>

      <!-- Notifications & Security Tab -->
      <a-tab-pane key="security" tab="Notifications & Security">
        <template #tab>
          <span class="tab-label">
            <safety-outlined />
            Notifications & Security
          </span>
        </template>

        <a-card :bordered="false" class="settings-card">
          <a-form :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }" layout="vertical">
            <div class="form-section-title">
              <bell-outlined />
              Notification Preferences
            </div>

            <div class="notification-grid">
              <div class="notification-item">
                <div class="notification-info">
                  <div class="notification-title">
                    <inbox-outlined class="notification-icon" />
                    Order Notifications
                  </div>
                  <div class="notification-desc">Receive email notifications for new orders</div>
                </div>
                <a-switch v-model:checked="settings.notifications.newOrders" class="switch-enhanced" />
              </div>

              <div class="notification-item">
                <div class="notification-info">
                  <div class="notification-title">
                    <alert-outlined class="notification-icon" />
                    Low Stock Alerts
                  </div>
                  <div class="notification-desc">Get notified when products are running low</div>
                </div>
                <a-switch v-model:checked="settings.notifications.lowStock" class="switch-enhanced" />
              </div>

              <div class="notification-item">
                <div class="notification-info">
                  <div class="notification-title">
                    <star-outlined class="notification-icon" />
                    Customer Reviews
                  </div>
                  <div class="notification-desc">Notify when customers leave reviews</div>
                </div>
                <a-switch v-model:checked="settings.notifications.newReviews" class="switch-enhanced" />
              </div>

              <div class="notification-item">
                <div class="notification-info">
                  <div class="notification-title">
                    <rocket-outlined class="notification-icon" />
                    Marketing Updates
                  </div>
                  <div class="notification-desc">Receive marketing tips and platform updates</div>
                </div>
                <a-switch v-model:checked="settings.notifications.marketing" class="switch-enhanced" />
              </div>

              <div class="notification-item">
                <div class="notification-info">
                  <div class="notification-title">
                    <shield-outlined class="notification-icon" />
                    Security Alerts
                  </div>
                  <div class="notification-desc">Critical security notifications (recommended)</div>
                </div>
                <a-switch v-model:checked="settings.notifications.security" class="switch-enhanced" />
              </div>
            </div>

            <a-form-item label="Notification Email" class="form-item-enhanced">
              <a-input v-model:value="settings.notifications.email" type="email" placeholder="notifications@example.com"
                size="large" class="input-enhanced" />
              <div class="field-hint">Separate email for notifications (optional)</div>
            </a-form-item>

            <div class="form-section-title">
              <lock-outlined />
              Security Settings
            </div>

            <div class="security-grid">
              <div class="security-item">
                <div class="security-info">
                  <div class="security-title">
                    <safety-certificate-outlined class="security-icon" />
                    Force HTTPS
                  </div>
                  <div class="security-desc">Force HTTPS for all pages (recommended)</div>
                </div>
                <a-switch v-model:checked="settings.security.forceHttps" class="switch-enhanced" />
              </div>

              <div class="security-item">
                <div class="security-info">
                  <div class="security-title">
                    <key-outlined class="security-icon" />
                    Two-Factor Authentication
                  </div>
                  <div class="security-desc">Require 2FA for admin accounts</div>
                </div>
                <a-switch v-model:checked="settings.security.twoFactorAuth" class="switch-enhanced" />
              </div>
            </div>

            <a-form-item label="Session Timeout" class="form-item-enhanced">
              <a-select v-model:value="settings.security.sessionTimeout" placeholder="Select timeout duration"
                size="large" class="select-enhanced">
                <a-select-option :value="15">15 minutes</a-select-option>
                <a-select-option :value="30">30 minutes</a-select-option>
                <a-select-option :value="60">1 hour</a-select-option>
                <a-select-option :value="120">2 hours</a-select-option>
                <a-select-option :value="240">4 hours</a-select-option>
              </a-select>
              <div class="field-hint">Auto logout after inactivity</div>
            </a-form-item>

            <a-form-item label="IP Whitelist" class="form-item-enhanced">
              <a-textarea v-model:value="settings.security.ipWhitelist" :rows="3"
                placeholder="Enter IP addresses (one per line)&#10;192.168.1.1&#10;10.0.0.1" class="input-enhanced" />
              <div class="field-hint">Restrict admin access to specific IPs (optional)</div>
            </a-form-item>

            <a-form-item label="Failed Login Attempts" class="form-item-enhanced">
              <a-input-number v-model:value="settings.security.maxLoginAttempts" :min="3" :max="10" size="large"
                class="input-number-enhanced" />
              <div class="field-hint">Lock account after this many failed login attempts</div>
            </a-form-item>
          </a-form>
        </a-card>
      </a-tab-pane>

      <!-- Policies Tab -->
      <a-tab-pane key="policies" tab="Policies">
        <template #tab>
          <span class="tab-label">
            <file-text-outlined />
            Policies
          </span>
        </template>

        <a-card :bordered="false" class="settings-card">
          <a-form :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }" layout="vertical">
            <a-form-item label="Return Policy" class="form-item-enhanced">
              <a-textarea v-model:value="settings.policies.returnPolicy" :rows="5"
                placeholder="Describe your return policy..." class="input-enhanced" />
            </a-form-item>

            <a-form-item label="Refund Policy" class="form-item-enhanced">
              <a-textarea v-model:value="settings.policies.refundPolicy" :rows="5"
                placeholder="Describe your refund policy..." class="input-enhanced" />
            </a-form-item>

            <div class="form-section-title">
              <link-outlined />
              Policy Links
            </div>

            <a-form-item label="Privacy Policy URL" class="form-item-enhanced">
              <a-input v-model:value="settings.policies.privacyPolicyUrl" placeholder="https://yourstore.com/privacy"
                size="large" class="input-enhanced" />
            </a-form-item>

            <a-form-item label="Terms of Service URL" class="form-item-enhanced">
              <a-input v-model:value="settings.policies.termsOfServiceUrl" placeholder="https://yourstore.com/terms"
                size="large" class="input-enhanced" />
            </a-form-item>

            <a-form-item label="Shipping Policy URL" class="form-item-enhanced">
              <a-input v-model:value="settings.policies.shippingPolicyUrl" placeholder="https://yourstore.com/shipping"
                size="large" class="input-enhanced" />
            </a-form-item>

            <a-form-item label="Cookie Policy URL" class="form-item-enhanced">
              <a-input v-model:value="settings.policies.cookiePolicyUrl" placeholder="https://yourstore.com/cookies"
                size="large" class="input-enhanced" />
            </a-form-item>
          </a-form>
        </a-card>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import {
  ShopOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  BellOutlined,
  SafetyOutlined,
  PlusOutlined,
  PhoneOutlined,
  SearchOutlined,
  PictureOutlined,
  ShareAltOutlined,
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  YoutubeOutlined,
  BarChartOutlined,
  HomeOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  ColumnHeightOutlined,
  InboxOutlined,
  AlertOutlined,
  StarOutlined,
  RocketOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  KeyOutlined,
  LinkOutlined,
  SaveOutlined,
  UndoOutlined
} from '@ant-design/icons-vue'

const activeTab = ref('store')
const saving = ref(false)

const settings = reactive({
  storeName: 'My Awesome Store',
  storeTagline: 'Quality products at great prices',
  storeDescription: 'We offer a wide selection of premium products for all your needs.',
  metaTitle: 'My Awesome Store - Quality Products',
  metaDescription: 'Discover amazing products at unbeatable prices. Shop now for the best deals on quality items.',
  contactEmail: 'contact@mystore.com',
  phoneNumber: '+1 (555) 123-4567',
  websiteUrl: 'https://mystore.com',
  storeLogo: '',
  socialMedia: {
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    youtube: ''
  },
  googleAnalyticsId: '',
  facebookPixelId: '',
  googleTagManagerId: '',
  address: {
    line1: '123 Main Street',
    line2: 'Suite 100',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'US'
  },
  currency: 'USD',
  currencyFormat: 'symbol',
  decimalSeparator: '.',
  thousandSeparator: ',',
  timeZone: 'America/New_York',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12',
  language: 'en',
  weightUnit: 'lb',
  dimensionUnit: 'in',
  notifications: {
    newOrders: true,
    lowStock: true,
    newReviews: true,
    marketing: false,
    security: true,
    email: ''
  },
  security: {
    forceHttps: true,
    twoFactorAuth: false,
    sessionTimeout: 60,
    ipWhitelist: '',
    maxLoginAttempts: 5
  },
  policies: {
    returnPolicy: '',
    refundPolicy: '',
    privacyPolicyUrl: '',
    termsOfServiceUrl: '',
    shippingPolicyUrl: '',
    cookiePolicyUrl: ''
  },
  advanced: { // These fields from the original `settings` ref were not present in the updates.
    orderIdPrefix: 'ORD',
    orderIdStart: 1001,
    lowStockThreshold: 10,
    criticalStockThreshold: 3,
    inventoryTracking: true,
    allowBackorders: false,
    autoArchiveOrders: true,
    archiveAfterDays: 90,
    enableReviews: true,
    moderateReviews: false,
    enableWishlist: true,
    enableComparison: true,
    maintenanceMode: false,
    maintenanceMessage: 'We\'re currently performing scheduled maintenance. We\'ll be back soon!',
    apiRateLimit: 100,
    enableCaching: true,
    cacheDuration: 1800
  },
  privacy: { // These fields from the original `settings` ref were not present in the updates.
    gdprCompliance: true,
    cookieConsent: true,
    dataRetentionPeriod: '2years',
    anonymousAnalytics: true,
    allowDataExport: true,
    allowAccountDeletion: true
  }
})

const handleSave = async () => {
  saving.value = true
  setTimeout(() => {
    saving.value = false
    message.success('Settings saved successfully!')
  }, 1500)
}

const handleReset = () => {
  message.info('Settings reset to default values')
}
</script>

<style scoped>
/* Updated all colors to use CSS variables for theme support */
.general-settings {
  max-width: 1400px;
  margin: 0 auto;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 2px solid var(--border);
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  color: var(--foreground);
  background: linear-gradient(135deg, oklch(0.65 0.25 195) 0%, oklch(0.55 0.25 195) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-size: 16px;
  color: var(--muted-foreground);
  margin: 8px 0 0 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.reset-btn,
.save-btn {
  height: 44px;
  padding: 0 28px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.reset-btn {
  border: 2px solid var(--border);
  background: var(--background);
  color: var(--foreground);
}

.reset-btn:hover {
  border-color: oklch(0.65 0.25 195);
  color: oklch(0.65 0.25 195);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(13, 148, 136, 0.15);
}

.save-btn {
  background: linear-gradient(135deg, oklch(0.65 0.25 195) 0%, oklch(0.55 0.25 195) 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.3);
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(13, 148, 136, 0.4);
}

/* Added tab styling with theme variables */
.settings-tabs {
  background: transparent;
}

.settings-tabs :deep(.ant-tabs-nav) {
  background: var(--card);
  border-radius: 12px 12px 0 0;
  padding: 12px 12px 0 12px;
  border: 1px solid var(--border);
  border-bottom: none;
}

.settings-tabs :deep(.ant-tabs-tab) {
  padding: 12px 24px;
  font-weight: 600;
  border-radius: 8px 8px 0 0;
  border: none;
  background: transparent;
  color: var(--muted-foreground);
  transition: all 0.3s ease;
}

.settings-tabs :deep(.ant-tabs-tab:hover) {
  color: oklch(0.65 0.25 195);
  background: var(--accent);
}

.settings-tabs :deep(.ant-tabs-tab-active) {
  background: var(--background);
  color: oklch(0.65 0.25 195);
  border: 1px solid var(--border);
  border-bottom-color: var(--background);
}

.settings-tabs :deep(.ant-tabs-ink-bar) {
  display: none;
}

.settings-tabs :deep(.ant-tabs-content-holder) {
  border: 1px solid var(--border);
  border-top: none;
  border-radius: 0 0 12px 12px;
  background: var(--card);
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
}

.tab-label .anticon {
  font-size: 18px;
}

/* Enhanced card styling with theme colors */
.settings-card {
  background: var(--card);
  border-radius: 12px;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.settings-card :deep(.ant-card-body) {
  padding: 32px;
}

/* Added section titles with icons */
.form-section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 700;
  color: var(--foreground);
  margin: 32px 0 24px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--border);
}

.form-section-title:first-child {
  margin-top: 0;
}

.form-section-title .anticon {
  font-size: 22px;
  color: oklch(0.65 0.25 195);
}

/* Enhanced form grid layouts */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.form-grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 768px) {

  .form-grid,
  .form-grid-3 {
    grid-template-columns: 1fr;
  }
}

/* Enhanced form item styling */
.form-item-enhanced {
  margin-bottom: 24px;
}

.form-item-enhanced :deep(.ant-form-item-label) {
  padding-bottom: 8px;
}

.form-item-enhanced :deep(.ant-form-item-label > label) {
  font-size: 15px;
  font-weight: 600;
  color: var(--foreground);
  height: auto;
}

.form-item-enhanced :deep(.ant-form-item-label > label::after) {
  display: none;
}

.form-item-enhanced :deep(.ant-form-item-required::before) {
  color: oklch(0.65 0.25 0) !important;
}

/* Enhanced input styling with theme support */
.input-enhanced,
.select-enhanced {
  border-radius: 10px;
  border: 2px solid var(--border);
  background: var(--background);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.input-enhanced:hover,
.select-enhanced:hover {
  border-color: oklch(0.65 0.25 195);
}

.input-enhanced:focus,
.select-enhanced:focus,
.input-enhanced:focus-within,
.select-enhanced:focus-within {
  border-color: oklch(0.65 0.25 195);
  box-shadow: 0 0 0 4px rgba(13, 148, 136, 0.1);
}

.input-prefix-icon {
  color: oklch(0.65 0.25 195);
  font-size: 18px;
}

/* Enhanced textarea styling */
.input-enhanced:deep(textarea) {
  border: none;
  background: transparent;
}

/* Field hints with theme colors */
.field-hint {
  margin-top: 8px;
  font-size: 13px;
  color: var(--muted-foreground);
  display: flex;
  align-items: center;
  gap: 6px;
}

.text-warning {
  color: oklch(0.7 0.2 60);
  font-weight: 600;
}

/* Currency option styling */
.currency-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Enhanced radio group styling */
.radio-group-enhanced {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.radio-group-enhanced :deep(.ant-radio-wrapper) {
  color: var(--foreground);
  font-weight: 500;
}

.radio-group-enhanced :deep(.ant-radio-checked .ant-radio-inner) {
  border-color: oklch(0.65 0.25 195);
  background-color: oklch(0.65 0.25 195);
}

.radio-group-enhanced :deep(.ant-radio:hover .ant-radio-inner) {
  border-color: oklch(0.65 0.25 195);
}

/* Enhanced upload styling */
.upload-enhanced :deep(.ant-upload-select) {
  border: 2px dashed var(--border) !important;
  border-radius: 10px;
  background: var(--background);
  transition: all 0.3s ease;
}

.upload-enhanced :deep(.ant-upload-select:hover) {
  border-color: oklch(0.65 0.25 195) !important;
}

.upload-content {
  padding: 12px;
}

.upload-icon {
  font-size: 32px;
  color: oklch(0.65 0.25 195);
  margin-bottom: 8px;
}

.upload-text {
  font-size: 14px;
  font-weight: 600;
  color: var(--foreground);
}

/* Notification grid styling */
.notification-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.notification-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: var(--accent);
  border: 1px solid var(--border);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.notification-item:hover {
  border-color: oklch(0.65 0.25 195);
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.1);
}

.notification-info {
  flex: 1;
}

.notification-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 6px;
}

.notification-icon {
  font-size: 20px;
  color: oklch(0.65 0.25 195);
}

.notification-desc {
  font-size: 14px;
  color: var(--muted-foreground);
  padding-left: 32px;
}

/* Security grid styling */
.security-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: var(--accent);
  border: 1px solid var(--border);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.security-item:hover {
  border-color: oklch(0.65 0.25 195);
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.1);
}

.security-info {
  flex: 1;
}

.security-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 6px;
}

.security-icon {
  font-size: 20px;
  color: oklch(0.65 0.25 195);
}

.security-desc {
  font-size: 14px;
  color: var(--muted-foreground);
  padding-left: 32px;
}

/* Enhanced switch styling */
.switch-enhanced :deep(.ant-switch-checked) {
  background: oklch(0.65 0.25 195);
}

.switch-enhanced :deep(.ant-switch:hover) {
  background: oklch(0.6 0.2 195);
}

/* Enhanced input number styling */
.input-number-enhanced {
  border-radius: 10px;
  border: 2px solid var(--border);
  width: 180px;
}

.input-number-enhanced:hover {
  border-color: oklch(0.65 0.25 195);
}

.input-number-enhanced:focus,
.input-number-enhanced:focus-within {
  border-color: oklch(0.65 0.25 195);
  box-shadow: 0 0 0 4px rgba(13, 148, 136, 0.1);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .general-settings {
    padding: 16px;
  }

  .settings-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .page-title {
    font-size: 24px;
  }

  .notification-item,
  .security-item {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .notification-desc,
  .security-desc {
    padding-left: 0;
  }
}
</style>
