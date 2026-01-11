import '@/modules/shared/assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'ant-design-vue/dist/reset.css'

import App from './App.vue'
import router from './router'
import MainMedia from './modules/media/components/MainMedia.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('MainMedia', MainMedia)

app.mount('#app')
