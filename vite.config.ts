import react from '@vitejs/plugin-react'
import Icons from 'unplugin-icons/vite'
import {defineConfig} from 'vite'
import svg from 'vite-plugin-svgo'
import webfontDownload from 'vite-plugin-webfont-dl'
import tsconfigPaths from 'vite-tsconfig-paths'

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [tsconfigPaths(), webfontDownload(), Icons({compiler: 'jsx', jsx: 'react'}), svg(), react()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: 'ws',
          host,
          port: 1421
        }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**']
    }
  }
}))
