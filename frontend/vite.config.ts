import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

const scssDir = resolve('./src/scss').replace(/\\/g, '/')

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svgr(), react()],
    resolve: {
        alias: {
            $fonts: resolve('./src/vendor/fonts'),
            $assets: resolve('./src/assets'),
        },
    },
    build: {
        assetsInlineLimit: 0,
    },
    css: {
        preprocessorOptions: {
            scss: {
                // Подставляем абсолютные пути, чтобы Sass всегда мог найти файлы
                additionalData: `
                    @use "${scssDir}/variables" as *;
                    @use "${scssDir}/mixins";
                `,
            },
        },
    },
})
