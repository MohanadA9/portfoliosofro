import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  // Force Nitro on with the Vercel preset so `vite build` produces
  // a deployment Vercel can serve (.vercel/output).
  nitro: {
    preset: "vercel",
  },
});
