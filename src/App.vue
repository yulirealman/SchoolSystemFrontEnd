<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import ja from 'element-plus/es/locale/lang/ja'

// 1️⃣ 取得 Vue-i18n locale
const { locale: i18nLocale } = useI18n()

// 2️⃣ 建立 Element Plus 的響應式 locale
const elementLocale = ref(en)

// 3️⃣ 語言映射表
const elementLocales = { zh: zhCn, en: en, ja: ja }

// 4️⃣ 監聽 i18n 語言變化，動態更新 Element Plus
watch(i18nLocale, (newLang) => {
    console.log('i18nLocale: ', newLang)
  elementLocale.value = elementLocales[newLang] || en 
})
</script>



<template>
  <el-config-provider :locale=elementLocale>
    <router-view></router-view>
  </el-config-provider>
</template>
<style scoped></style>