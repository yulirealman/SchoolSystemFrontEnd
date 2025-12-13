<script setup>
import { ElConfigProvider } from 'element-plus'
import { activeLanguage } from '@/config/language'

</script>

<template>
  <ElConfigProvider :locale="activeLanguage">
    <router-view></router-view>
  </ElConfigProvider>
</template>
<style scoped>
</style>