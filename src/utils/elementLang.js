import { ref, computed } from 'vue'

import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import ja from 'element-plus/es/locale/lang/ja'

// ✅ 模块级变量（全局共享）
const elementLang = ref('cn')

const elementLocale = computed(() => {
  if (elementLang.value === 'cn') {
    return zhCn
  }

  if (elementLang.value === 'en') {
    return en
  }

  if (elementLang.value === 'jp') {
    return ja
  }

  return en

})

// 对外暴露
export function useElementLang() {
  return {
    elementLang,
    elementLocale
  }
}
