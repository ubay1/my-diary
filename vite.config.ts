import { defineConfig } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),
  VitePWA({
    registerType: "autoUpdate",
    devOptions: { enabled: true },
    manifest: {
      name: "My Diary",
      short_name: "My Diary",
      start_url: ".",
      display: "standalone",
      background_color: "#ffe8b2",
      icons: [
        {
          src: "/my-diary.jpg",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/my-diary.jpg",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
  }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // "@server": path.resolve(__dirname, "../server/dist/"),
    },
  },
  server: {
    watch: {
      ignored: [],
    },
  },
});
