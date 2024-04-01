import { defineConfig } from "astro/config";

import vercel from "@astrojs/vercel/serverless";
import tailwind from "@astrojs/tailwind";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), svelte()],
  redirects: {
    '/parents': 'https://docs.google.com/document/d/1NQDChsJd9dK4r1EWsVglzjHr0EnR3iW0DV3xMHSUAZ0/edit',
    '/teachers': 'https://docs.google.com/document/d/1NQDChsJd9dK4r1EWsVglzjHr0EnR3iW0DV3xMHSUAZ0/edit',
    '/travel': '',
    '/grants': 'https://join.apocalypse.hackclub.com/grants'
  },
  output: "server",
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
});
