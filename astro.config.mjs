import { defineConfig } from "astro/config";

import vercel from "@astrojs/vercel/serverless";
import tailwind from "@astrojs/tailwind";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), svelte()],
  redirects: {
    "/parents":
      "https://docs.google.com/document/d/1NQDChsJd9dK4r1EWsVglzjHr0EnR3iW0DV3xMHSUAZ0/edit",
    "/teachers":
      "https://docs.google.com/document/d/1NQDChsJd9dK4r1EWsVglzjHr0EnR3iW0DV3xMHSUAZ0/edit",
    "/travel":
      "https://docs.google.com/document/d/1oEQobHOqMcHUU5N7X5egDNo6Tfvqsx3bx5h--UBDpAs/edit",
    "/international":
      "https://docs.google.com/document/d/1LuZmVCTGeFPdXYAwqTYx2IHN2d7h4wjuAdhiWNuYJVI/edit?usp=sharing",
    "/id":
      "https://docs.google.com/document/d/1ro77tpRs1vpQK39YGgAP4IumkNhx3-6pc41BmvI0UzA/edit?usp=sharing",
    "/packing":
      "https://docs.google.com/document/d/1rGKr5Yn1uCT3fAUEEpQW2Hf3RzR6xymValoaBLmobHM/edit?usp=sharing",
    "/grants": "https://join.apocalypse.hackclub.com/grants",
    "/showers":
      "https://calendar.google.com/calendar/u/0/appointments/AcZssZ3ofoLo-abUmRCvR6_4hVMXJ3IcXXdJhcUlG94=",
    "/": "event",
  },
  output: "server",
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
});
