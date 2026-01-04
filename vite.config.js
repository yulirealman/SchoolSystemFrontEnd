import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // ⚡ 這行很關鍵，保證打包後路徑正確
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'vue-i18n': 'vue-i18n/dist/vue-i18n.esm-bundler.js',  // 包含完整编译器
    }
  },
  server:{
    proxy:{
      '/api':{
        target:'http://localhost:8080',
        changeOrigin:true,
        secure:false,
        rewrite:(path)=>path.replace(/^\/api/,'')
      }
    }
  }
})
