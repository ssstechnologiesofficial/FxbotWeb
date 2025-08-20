import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Only use Replit-specific plugins in development
const isProduction = process.env.NODE_ENV === 'production';

let plugins = [react()];

if (!isProduction) {
  try {
    const runtimeErrorOverlay = require("@replit/vite-plugin-runtime-error-modal");
    plugins.push(runtimeErrorOverlay.default());
  } catch {
    // Ignore if plugin not available in production
  }
}

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "client", "src"),
      "@shared": path.resolve(process.cwd(), "shared"),
      "@assets": path.resolve(process.cwd(), "attached_assets"),
    },
  },
  root: path.resolve(process.cwd(), "client"),
  build: {
    outDir: path.resolve(process.cwd(), "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  assetsInclude: ["**/*.PNG", "**/*.jpg", "**/*.jpeg", "**/*.gif", "**/*.svg"]
});