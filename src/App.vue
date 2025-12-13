<script setup>
import { ElConfigProvider } from 'element-plus'
import { useElementLang } from '@/utils/elementLang'

const { elementLocale } = useElementLang()
</script>

<template>
  <ElConfigProvider :locale="elementLocale">
    <router-view></router-view>
  </ElConfigProvider>
</template>
<style scoped>
</style>