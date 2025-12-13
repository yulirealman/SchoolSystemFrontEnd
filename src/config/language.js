import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// Element Plus 内置语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import ja from 'element-plus/es/locale/lang/ja'

/**
 * 支持的语言列表
 * 统一语言码来源，防止乱传
 */
const SUPPORTED_LANGUAGES = ['cn', 'en', 'jp']

/**
 * 当前语言码（全局唯一语言源）
 * - vue-i18n 依赖它
 * - Element Plus 依赖它
 * - UI 只读 / 只修改它
 */
export const language = ref('cn')

/**
 * Element Plus 当前生效的 locale
 * 根据 language 自动切换
 */
export const activeLanguage = computed(() => {
  switch (language.value) {
    case 'cn':
      return zhCn
    case 'en':
      return en
    case 'jp':
      return ja
    default:
      return en
  }
})

/**
 * 防止多次初始化（多个组件调用 initLanguage）
 */
let initialized = false

/**
 * 初始化语言系统
 * - 同步 vue-i18n 的 locale
 * - watch 只注册一次
 * - 可在任意组件安全调用
 */
export function initLanguage() {
  if (initialized) return
  initialized = true

  const { locale } = useI18n()

  // 首次同步
  locale.value = language.value

  // language 是唯一源，vue-i18n 被动跟随
  watch(language, (val) => {
    locale.value = val
  })
}

/**
 * 统一语言切换入口
 * 所有语言修改必须走这里
 */
export function switchLanguage(lang) {
  if (!SUPPORTED_LANGUAGES.includes(lang)) return
  language.value = lang
}
