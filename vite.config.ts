import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  ssr: {
    noExternal: ["three"],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use '$lib/assets/styles/mixins' as *;
        `,
      },
    },
  },
});
