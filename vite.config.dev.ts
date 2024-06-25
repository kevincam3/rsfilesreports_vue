import { defineConfig } from "vite";
import VueDevTools from "vite-plugin-vue-devtools";

export default defineConfig({
  plugins: [VueDevTools()],
  // For development save the dist folder directly in the Joomla component
});
