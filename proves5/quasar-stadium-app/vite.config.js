import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    quasar({
      // Usamos el alias '@' para apuntar a src/
      sassVariables: '@/quasar-variables.sass'
    })
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
