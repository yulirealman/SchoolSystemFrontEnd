import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from '@/App.vue'
import router from '@/router'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import {createI18n} from 'vue-i18n'


import enMsg from '@/locales/en.json'
import zhMsg from '@/locales/zh.json'
import jaMsg from '@/locales/ja.json'

const app = createApp(App)

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: enMsg,
    ja: jaMsg,
    zh: zhMsg
  }
})



app.use(i18n)

app.use(router)

app.use(ElementPlus)


for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')