import { defineConfig } from "astro/config";

import vercel from "@astrojs/vercel/serverless";
import tailwind from "@astrojs/tailwind";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), svelte()],
redirects: {
    '/prospectus': 'https://drive.google.com/file/d/14HfsaimWtsQ7kZwUoKATH1Ufk6uCODre/view?usp=drivesdk'
  },
  output: "server",
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
});
