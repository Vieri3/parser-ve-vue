import { fileURLToPath, URL } from 'node:url' 

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite' 

// https://vite.dev/config/
export default defineConfig({
  // в моем основном сайте есть как бы папка с таким вот названием сайта vieri.xapp.one/parser-ve-vue/index.html вот типа такой путь должен быть
  // ппосле смены xapp.one/vieri/parser-ve-vue/index.html вот типа такой путь должен быть
  //и меняем в env VITE_API_URL=https://xapp.one/vieri
  // и берем base из констант потому что так проще менять чтоб не лазить по всем папкам сайта
  base: '/vieri/parser-ve-vue/',
  plugins: [
    vue(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
