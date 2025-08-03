import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["fabric", "@imgly/background-removal", "jwt-decode"],
  },
  server: {
    proxy: {
      "/api": {
        target: "https://kitaba.kaaf.me",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
      "/bg": {
        target: "https://3rabapp.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bg/, "/apps"),
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("fabric")) return "vendor-fabric";
            if (id.includes("@imgly")) return "vendor-imgly";
            return "vendor";
          }
        },
      },
    },
  },
});
