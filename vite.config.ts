import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default ({ mode }) => {
  // Load .env file based on current mode (development, production...)
  const env = loadEnv(mode, process.cwd());

  return defineConfig({
    root: path.resolve(__dirname, "client"),
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client/src"),
      },
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: path.resolve(__dirname, "dist"),
      emptyOutDir: true,
    },
  });
};
