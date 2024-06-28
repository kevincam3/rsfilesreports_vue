import { defineConfig } from "vite";

export default defineConfig({
  // Production-specific configuration
  build: {
    minify: true,
    outDir: "../lanl/media/com_rsfilesreports",
    rollupOptions:{
      output: {
        entryFileNames: "js/script.js",
        assetFileNames: "css/style.css",
      },
    }
  },
});
