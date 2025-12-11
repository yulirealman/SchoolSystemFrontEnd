import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import {createI18n} from 'vue-i18n'
import cn from './locales/cn.json'
import en from './locales/en.json'
import jp from './locales/jp.json'
const app = createApp(App)

const i18n = createI18n({
  locale: 'cn',
  messages: {
    cn,
    en,
    jp
  }
})

app.use(i18n)

app.use(router)
app.use(ElementPlus,{
    locale: zhCn,
})


for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')