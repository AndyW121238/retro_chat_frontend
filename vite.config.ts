import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import IconsResolver from "unplugin-icons/resolver";
import Icons from "unplugin-icons/vite";
import Components from "unplugin-vue-components/vite";
import VueRouter from "unplugin-vue-router/vite";
import vueDevTools from "vite-plugin-vue-devtools";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    VueRouter({}),
    vue(),
    vueDevTools(),
    Components({
      dts: true,
      resolvers: [IconsResolver()],
    }),
    Icons({
      autoInstall: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    host: "0.0.0.0", // 允许外部访问
    port: 3000, // 指定端口
    proxy: {
      "/api": {
        target: "http://100.93.40.84:9999",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/retrochat"),
      },
      "/ws": {
        target: "ws://100.93.40.84:9999", // 后端 WebSocket 服务地址
        ws: true, // 关键：启用 WebSocket 代理
        changeOrigin: true, // 解决跨域（必要时开启）
        rewrite: (path) => path.replace(/^\/ws/, "/retrochat"),
      },
    },
  },
});
