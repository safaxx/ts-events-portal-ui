import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const srcDirectory = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": srcDirectory,
      },
    },
    server: {
      port: Number(env.PORT) || 5173,
    },
    test: {
      environment: "jsdom",
      setupFiles: ["./src/setupTests.js"],
    },
  };
});
