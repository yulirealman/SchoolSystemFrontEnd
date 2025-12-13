<script setup>
import { ElConfigProvider } from 'element-plus'
import { language } from '@/config/language'

</script>

<template>
  <ElConfigProvider :locale="language">
    <router-view></router-view>
  </ElConfigProvider>
</template>
<style scoped>
</style>