import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import manifest from "./manifest.config";

export default defineConfig({
  plugins: [react(), crx({ manifest })],
  build: {
    rollupOptions: {
      input: {
        // This ensures proper path handling for Chrome Extension
      },
    },
  },
  // Use relative paths for Chrome Extension compatibility
  base: "./",
});
