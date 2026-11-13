import path from "path";

import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig, lazyPlugins, loadEnv } from "vite-plus";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const targetUrl = env.VITE_CORS_URL;
  return {
    staged: {
      "*": "vp check --fix",
    },
    fmt: {
      semi: true,
      singleQuote: true,
      sortImports: {
        ignoreCase: true,
        order: "asc",
      },
    },
    lint: {
      plugins: ["react", "typescript", "oxc"],
      rules: {
        "react/rules-of-hooks": "error",
        "vite-plus/prefer-vite-plus-imports": "error",
      },
      options: {
        typeAware: true,
        typeCheck: true,
      },
      jsPlugins: [
        {
          name: "vite-plus",
          specifier: "vite-plus/oxlint-plugin",
        },
      ],
    },
    resolve: {
      alias: {
        "@": path.resolve("./src"),
      },
    },
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: targetUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    build: {
      outDir: path.resolve(import.meta.dirname, "../server/public"),
      emptyOutDir: true,
    },
    plugins: lazyPlugins(() => [
      devtools({
        enhancedLogs: { enabled: true },
        logging: true,
        removeDevtoolsOnBuild: true,
      }),
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
      }),
      react({ compiler: true }),
      tailwindcss(),
      // /*
      VitePWA({
        manifest: {
          name: "WonderCart",
          short_name: "wonder-cart",
          description: "MERN E-commerce App ",
          start_url: "/",
          scope: "/",
          display: "standalone",
          theme_color: "#000000",
          icons: [
            {
              src: "pwa-64x64.png",
              sizes: "64x64",
              type: "image/png",
            },
            {
              src: "pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "maskable-icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
      }), //as any,
      // */
    ]),
  };
});
