import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tagger from "@dhiwise/component-tagger";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths(), react(), tagger()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    // ✅ importante para o Vercel reconhecer a pasta de saída
    outDir: "dist",
    sourcemap: true, // você já usa --sourcemap no script de build
    chunkSizeWarningLimit: 2000,
  },
  server: {
    port: 4028,
    host: "0.0.0.0",
    strictPort: true,
    // mantenha se precisar
    allowedHosts: [".amazonaws.com", ".builtwithrocket.new"],
  },
});