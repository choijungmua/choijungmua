import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  base: "/choijungmua/",
  define: {
    __BUILD_SHA__: JSON.stringify(
      process.env.VITE_BUILD_SHA ??
        (command === "build"
          ? (() => {
              throw new Error("VITE_BUILD_SHA is required for production builds.");
            })()
          : "development"),
    ),
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
    target: "es2022",
    assetsDir: "assets",
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
}));
