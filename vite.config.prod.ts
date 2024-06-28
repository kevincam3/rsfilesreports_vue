import { defineConfig } from "vite";

export default defineConfig({
  // Production-specific configuration
  build: {
    minify: true,
    rollupOptions:{
      output: {
        entryFileNames: "js/script.js",
        assetFileNames: "css/style.css",
      },
    }
  },
});



