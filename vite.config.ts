import { defineConfig, mergeConfig } from "vite";

// Import the base, dev and prod configs
import baseConfig from "./vite.config.base.js";
import devConfig from "./vite.config.dev.js";
import prodConfig from "./vite.config.prod.js";

export default defineConfig(({ mode }) => {
  const env = mode || process.env.NODE_ENV;
  if (env === "development") {
    return mergeConfig(baseConfig, devConfig);
  } else if (env === "production") {
    return mergeConfig(baseConfig, prodConfig);
  }
  return baseConfig; // Fallback to base config if no mode is matched
});
