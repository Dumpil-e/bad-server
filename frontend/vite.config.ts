import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths' // Возвращаем импорт

const scssDir = resolve('./src/scss').replace(/\\/g, '/')

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        svgr(),
        react(),
        tsconfigPaths(),
    ],
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
                additionalData: `
                    @use "${scssDir}/variables" as *;
                    @use "${scssDir}/mixins";
                `,
            },
        },
    },
})
