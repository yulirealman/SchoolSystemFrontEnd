import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// Element Plus 内置语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import ja from 'element-plus/es/locale/lang/ja'

/**
 * 当前语言码（全局唯一语言源）
 * - 控制：vue-i18n
 * - 控制：Element Plus
 * - UI 只读 / 只改它
 */
export const elementLang = ref('cn')

/**
 * Element Plus 使用的 locale
 * 根据 elementLang 自动切换
 */
export const language = computed(() => {
  if (elementLang.value === 'cn') return zhCn
  if (elementLang.value === 'en') return en
  if (elementLang.value === 'jp') return ja
  return en
})

/**
 * 防止重复初始化（多组件 import 时）
 */
let initialized = false

/**
 * 初始化语言系统
 * - 同步 vue-i18n 的 locale
 * - watch 只注册一次
 * - 可在任意组件中安全调用
 */
export function initLanguage() {
  if (initialized) return
  initialized = true

  const { locale } = useI18n()

  // 首次同步
  locale.value = elementLang.value

  // elementLang 是唯一源，i18n 被动跟随
  watch(elementLang, (val) => {
    locale.value = val
  })
}

/**
 * 统一语言切换入口
 * 所有切换行为都应通过这里
 */
export function switchLanguage(lang) {
  elementLang.value = lang
}
