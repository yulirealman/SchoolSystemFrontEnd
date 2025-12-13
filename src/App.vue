<script setup>
import { ElConfigProvider } from 'element-plus'
import { useElementLang } from '@/utils/language'

const { elementLocale } = useElementLang()
</script>

<template>
  <ElConfigProvider :locale="elementLocale">
    <router-view></router-view>
  </ElConfigProvider>
</template>
<style scoped>
</style>