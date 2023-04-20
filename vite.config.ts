import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
export default defineConfig({
	base: './',
	plugins: [vue()],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	},

	build: {
		rollupOptions: {
			output: {
				entryFileNames: 'app-[name].js',
				assetFileNames: 'app-[name].css',
				chunkFileNames: "chunk-[name].js",
				manualChunks: undefined,
			}
		}
	}
})